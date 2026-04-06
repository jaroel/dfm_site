import { beforeEach, describe, expect, test, vi } from "vitest";
import { getFtpListingCached, resetFTPCache } from "./ftp.ts";

const { mockList } = vi.hoisted(() => ({
  mockList: vi.fn().mockResolvedValue([
    { name: "15-01-2024-10-00.mp3", date: new Date("2024-01-15T10:00:00") },
    { name: "15-01-2024-11-00.mp3", date: new Date("2024-01-15T11:00:00") },
  ]),
}));

vi.mock("ftp-ts", () => ({
  FTP: {
    connect: vi.fn().mockResolvedValue({
      list: mockList,
      end: vi.fn(),
    }),
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
});
