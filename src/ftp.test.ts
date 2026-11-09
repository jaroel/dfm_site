import type { Writable } from "node:stream";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getFtpListingCached, getFtpStream, resetFTPCache } from "./ftp.ts";

const { mockList, mockSize, mockDownloadTo, mockClose, MockFTPError } =
  vi.hoisted(() => {
    class FTPError extends Error {
      code: number;
      constructor(response: { code: number; message: string }) {
        super(response.message);
        this.code = response.code;
      }
    }
    return {
      mockList: vi.fn().mockResolvedValue([
        { name: "15-01-2024-10-00.mp3", size: 1024 },
        { name: "15-01-2024-11-00.mp3", size: 2048 },
      ]),
      mockSize: vi.fn().mockResolvedValue(2048),
      mockDownloadTo: vi.fn().mockResolvedValue(undefined),
      mockClose: vi.fn(),
      MockFTPError: FTPError,
    };
  });

vi.mock("basic-ftp", () => ({
  FTPError: MockFTPError,
  Client: class {
    access = vi.fn().mockResolvedValue({ code: 220, message: "Ready" });
    list = mockList;
    size = mockSize;
    downloadTo = mockDownloadTo;
    close = mockClose;
  },
}));

describe("getFtpListingCached", () => {
  beforeEach(() => {
    resetFTPCache();
    mockList.mockClear();
  });

  test("cache miss - FTP_CACHE is null, calls FTP", async () => {
    const result = await getFtpListingCached();

    expect(result.length).toBe(2);
    expect(mockList).toHaveBeenCalledTimes(1);
  });

  test("cache hit - returns cached items without calling FTP again", async () => {
    await getFtpListingCached();
    await getFtpListingCached();

    expect(mockList).toHaveBeenCalledTimes(1);
  });

  test("after resetFTPCache, cache misses and fetches again", async () => {
    await getFtpListingCached();
    resetFTPCache();
    await getFtpListingCached();

    expect(mockList).toHaveBeenCalledTimes(2);
  });

  test("skips non-mp3/malformed names and future recordings, newest first", async () => {
    mockList.mockResolvedValueOnce([
      { name: "readme.txt" },
      { name: "1-01-2024-10-00.mp3" },
      { name: "15-01-2024-10-00.mp3" },
      { name: "16-01-2024-10-00.mp3" },
      { name: "01-01-2030-00-00.mp3" },
    ]);

    const result = await getFtpListingCached();

    expect(result.map((recording) => recording.name)).toEqual([
      "16-01-2024-10-00.mp3",
      "15-01-2024-10-00.mp3",
    ]);
  });

  test("does not cache a failed listing", async () => {
    mockList.mockRejectedValueOnce(new Error("ftp down"));

    await expect(getFtpListingCached()).resolves.toEqual([]);
    await getFtpListingCached();

    expect(mockList).toHaveBeenCalledTimes(2);
  });
});

describe("getFtpStream", () => {
  beforeEach(() => {
    resetFTPCache();
    mockSize.mockClear();
    mockDownloadTo.mockClear();
    mockClose.mockClear();
  });

  test("exposes the download as a web stream with its size", async () => {
    mockDownloadTo.mockImplementationOnce(async (destination: Writable) => {
      destination.write(new TextEncoder().encode("abc"));
      destination.end();
    });

    const result = await getFtpStream("15-01-2024-11-00.mp3");
    if (!result) throw new Error("expected a stream");
    expect(result.size).toBe(2048);

    const reader = result.stream.getReader();
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      text += new TextDecoder().decode(value);
    }

    expect(text).toBe("abc");
    expect(mockDownloadTo).toHaveBeenCalledWith(
      expect.anything(),
      "15-01-2024-11-00.mp3",
    );
  });

  test("starts the download at the requested offset", async () => {
    mockDownloadTo.mockImplementationOnce(async (destination: Writable) => {
      destination.end();
    });

    const result = await getFtpStream("15-01-2024-11-00.mp3", 100);
    if (!result) throw new Error("expected a stream");
    await result.stream.cancel();

    expect(mockDownloadTo).toHaveBeenCalledWith(
      expect.anything(),
      "15-01-2024-11-00.mp3",
      100,
    );
  });

  test("returns undefined when the file disappeared from the listing", async () => {
    mockSize.mockRejectedValueOnce(
      new MockFTPError({ code: 550, message: "550 File unavailable" }),
    );

    await expect(getFtpStream("15-01-2024-11-00.mp3")).resolves.toBeUndefined();
    expect(mockClose).toHaveBeenCalled();
  });
});
