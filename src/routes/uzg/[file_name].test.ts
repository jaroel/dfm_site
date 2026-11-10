import { beforeEach, expect, test, vi } from "vitest";
import { GET } from "./[file_name].ts";

const { mockListFilesCached, mockDownload } = vi.hoisted(() => ({
  mockListFilesCached: vi.fn(),
  mockDownload: vi.fn(),
}));

vi.mock("~/ftp.ts", () => ({
  listFilesCached: mockListFilesCached,
  download: mockDownload,
}));

const FILENAME = "15-01-2024-11-00.mp3";
const SIZE = 2048;

function fakeStream() {
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    cancel() {
      cancelled = true;
    },
  });
  return { stream, cancelled: () => cancelled };
}

async function request(file_name: string, range?: string) {
  const headers = range ? { range } : undefined;
  const result = await GET({
    params: { file_name },
    request: new Request(`http://localhost/uzg/${file_name}`, { headers }),
  });
  if (!(result instanceof Response)) throw new Error("expected a Response");
  return result;
}

const get = (range?: string) => request(FILENAME, range);

beforeEach(() => {
  mockListFilesCached
    .mockReset()
    .mockResolvedValue([{ name: FILENAME, size: SIZE }]);
  mockDownload.mockReset().mockImplementation(async () => ({
    size: SIZE,
    ...fakeStream(),
  }));
});

test("streams from the requested offset for an open-ended range", async () => {
  const response = await get("bytes=500-");

  expect(response.status).toBe(206);
  expect(response.headers.get("cache-control")).toBe(
    "public, max-age=31536000, immutable",
  );
  expect(response.headers.get("content-range")).toBe(`bytes 500-${SIZE - 1}/${SIZE}`);
  expect(response.headers.get("content-length")).toBe(String(SIZE - 500));
  expect(mockDownload).toHaveBeenCalledWith(FILENAME, 500);
  await response.body?.cancel();
});

test("returns 416 from the cached size without opening the recording", async () => {
  const response = await get(`bytes=${SIZE}-`);

  expect(response.status).toBe(416);
  expect(response.headers.get("content-range")).toBe(`bytes */${SIZE}`);
  expect(mockDownload).not.toHaveBeenCalled();
});

test("falls back to a full 200 for a bounded range", async () => {
  const response = await get("bytes=100-200");

  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe(
    "public, max-age=31536000, immutable",
  );
  expect(mockDownload).toHaveBeenCalledWith(FILENAME, 0);
  await response.body?.cancel();
});

test("answers Safari's probe without downloading the file", async () => {
  const response = await get("bytes=0-1");

  expect(response.status).toBe(206);
  expect(await response.text()).toBe("ID");
});

test("returns 404 for a name that is not in the listing", async () => {
  mockListFilesCached.mockResolvedValue([]);

  const response = await get();

  expect(response.status).toBe(404);
  expect(mockDownload).not.toHaveBeenCalled();
});

test("rejects a malformed name before touching the listing", async () => {
  const response = await request("../../etc/passwd");

  expect(response.status).toBe(404);
  expect(mockListFilesCached).not.toHaveBeenCalled();
});

test("re-checks the range against the size the download reports", async () => {
  // Cached listing says 2048, so 1500 passes the pre-check; the download says
  // 1024, which the range no longer satisfies.
  mockDownload.mockResolvedValue({ size: 1024, ...fakeStream() });

  const response = await get("bytes=1500-");

  expect(response.status).toBe(416);
  expect(response.headers.get("content-range")).toBe("bytes */1024");
});

test("returns 404 when the file vanished before the download", async () => {
  mockDownload.mockResolvedValue(undefined);

  const response = await get();

  expect(response.status).toBe(404);
});
