import { beforeEach, describe, expect, test, vi } from "vitest";

const { mockListNamesCached, mockDownload } = vi.hoisted(() => ({
  mockListNamesCached: vi.fn(),
  mockDownload: vi.fn(),
}));

vi.mock("~/ftp.ts", () => ({
  listNamesCached: mockListNamesCached,
  download: mockDownload,
}));

import { fetchUzgListing, openRecording } from "./uzg.ts";
import { groupRecordings, toRecordings } from "./recordings.ts";

/** Epoch ms for an Amsterdam wall-clock time in winter (UTC+1). */
const at = (hour: number, minute = 0) =>
  new Date(Date.UTC(2024, 0, 15, hour - 1, minute)).getTime();

beforeEach(() => {
  mockListNamesCached.mockReset();
  mockDownload.mockReset();
});

describe("fetchUzgListing", () => {
  test("drops malformed names and the not-yet-complete current hour, newest first", async () => {
    mockListNamesCached.mockResolvedValue([
      "readme.txt",
      "1-01-2024-10-00.mp3",
      "15-01-2024-10-00.mp3",
      "16-01-2024-10-00.mp3",
      "01-01-2030-00-00.mp3",
    ]);

    const listing = await fetchUzgListing();

    expect(toRecordings(listing).map((recording) => recording.src)).toEqual([
      "/uzg/16-01-2024-10-00.mp3",
      "/uzg/15-01-2024-10-00.mp3",
    ]);
  });
});

describe("openRecording", () => {
  beforeEach(() => {
    mockListNamesCached.mockResolvedValue([
      "15-01-2024-10-00.mp3",
      "15-01-2024-11-00.mp3",
    ]);
  });

  test("rejects a name that is not a recording filename", async () => {
    await expect(openRecording("../etc/passwd")).resolves.toBeUndefined();
    expect(mockDownload).not.toHaveBeenCalled();
  });

  test("rejects a negative or non-integer offset", async () => {
    await expect(openRecording("15-01-2024-10-00.mp3", -1)).resolves.toBeUndefined();
    await expect(openRecording("15-01-2024-10-00.mp3", 1.5)).resolves.toBeUndefined();
    expect(mockDownload).not.toHaveBeenCalled();
  });

  test("rejects a well-formed name that is not in the listing", async () => {
    await expect(
      openRecording("15-01-2024-12-00.mp3"),
    ).resolves.toBeUndefined();
    expect(mockDownload).not.toHaveBeenCalled();
  });

  test("delegates an allow-listed name to the transport", async () => {
    const opened = { size: 2048 };
    mockDownload.mockResolvedValue(opened);

    await expect(openRecording("15-01-2024-10-00.mp3", 500)).resolves.toBe(
      opened,
    );
    expect(mockDownload).toHaveBeenCalledWith("15-01-2024-10-00.mp3", 500);
  });
});

describe("toRecordings", () => {
  test("derives the filename and the Dutch display fields", () => {
    const [recording] = toRecordings([at(10)]);

    expect(recording).toMatchObject({
      src: "/uzg/15-01-2024-10-00.mp3",
      day: 15,
      month: 1,
      year: 2024,
      weekdayLabel: "Maandag",
      monthLabel: "januari",
      monthLong: "Januari",
      time: "10:00",
    });
  });

  test("groups into a year → month → day tree, newest first", () => {
    const tree = groupRecordings(toRecordings([at(10), at(11)]));

    expect(tree).toHaveLength(1);
    expect(tree[0].year).toBe(2024);
    expect(tree[0].months[0].label).toBe("Januari");
    expect(tree[0].months[0].days).toHaveLength(1);
    expect(tree[0].months[0].days[0].label).toBe("Maandag 15 januari");
    expect(tree[0].months[0].days[0].recordings.map((r) => r.time)).toEqual([
      "11:00",
      "10:00",
    ]);
  });
});
