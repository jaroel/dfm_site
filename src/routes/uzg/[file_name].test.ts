import { beforeEach, expect, test, vi } from "vitest";
import { GET } from "./[file_name].ts";

const { mockOpenRecording } = vi.hoisted(() => ({ mockOpenRecording: vi.fn() }));

vi.mock("~/uzg.ts", () => ({ openRecording: mockOpenRecording }));

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

async function get(range?: string) {
  const headers = range ? { range } : undefined;
  const result = await GET({
    params: { file_name: FILENAME },
    request: new Request(`http://localhost/uzg/${FILENAME}`, { headers }),
  });
  if (!(result instanceof Response)) throw new Error("expected a Response");
  return result;
}

beforeEach(() => {
  mockOpenRecording.mockReset();
  mockOpenRecording.mockImplementation(async () => ({
    size: SIZE,
    ...fakeStream(),
  }));
});

test("streams from the requested offset for an open-ended range", async () => {
  const response = await get("bytes=500-");

  expect(response.status).toBe(206);
  expect(response.headers.get("content-range")).toBe(`bytes 500-${SIZE - 1}/${SIZE}`);
  expect(response.headers.get("content-length")).toBe(String(SIZE - 500));
  expect(mockOpenRecording).toHaveBeenCalledWith(FILENAME, 500);
  await response.body?.cancel();
});

test("returns 416 when the range starts past the end", async () => {
  const response = await get(`bytes=${SIZE}-`);

  expect(response.status).toBe(416);
  expect(response.headers.get("content-range")).toBe(`bytes */${SIZE}`);
});

test("falls back to a full 200 for a bounded range", async () => {
  const response = await get("bytes=100-200");

  expect(response.status).toBe(200);
  expect(mockOpenRecording).toHaveBeenCalledWith(FILENAME, 0);
  await response.body?.cancel();
});

test("answers Safari's probe without downloading the file", async () => {
  const response = await get("bytes=0-1");

  expect(response.status).toBe(206);
  expect(await response.text()).toBe("ID");
});
