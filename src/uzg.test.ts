import { beforeEach, describe, expect, test, vi } from "vitest";

const { mockListFilesCached } = vi.hoisted(() => ({
  mockListFilesCached: vi.fn(),
}));

vi.mock("~/ftp.ts", () => ({
  listFilesCached: mockListFilesCached,
}));

import { fetchUzgListing } from "./uzg.ts";
import {
  groupRecordings,
  servableRecordingKey,
  toRecordings,
} from "./recordings.ts";

/** Epoch ms for an Amsterdam wall-clock time in winter (UTC+1). */
const at = (hour: number, minute = 0) =>
  new Date(Date.UTC(2024, 0, 15, hour - 1, minute)).getTime();

beforeEach(() => {
  mockListFilesCached.mockReset();
});

describe("fetchUzgListing", () => {
  test("drops malformed names and the not-yet-complete current hour, newest first", async () => {
    mockListFilesCached.mockResolvedValue(
      [
        "readme.txt",
        "1-01-2024-10-00.mp3",
        "15-01-2024-10-00.mp3",
        "16-01-2024-10-00.mp3",
        "01-01-2030-00-00.mp3",
      ].map((name) => ({ name, size: 1024 })),
    );

    const listing = await fetchUzgListing();

    expect(toRecordings(listing).map((recording) => recording.src)).toEqual([
      "/uzg/16-01-2024-10-00.mp3",
      "/uzg/15-01-2024-10-00.mp3",
    ]);
  });

  test("derives the listing once per cached file array", async () => {
    mockListFilesCached.mockResolvedValue([
      { name: "15-01-2024-10-00.mp3", size: 1024 },
    ]);
    const formatToParts = vi.spyOn(
      Intl.DateTimeFormat.prototype,
      "formatToParts",
    );

    await fetchUzgListing();
    const parses = formatToParts.mock.calls.length;
    expect(parses).toBeGreaterThan(0);
    await fetchUzgListing();

    expect(formatToParts.mock.calls.length).toBe(parses);
    formatToParts.mockRestore();
  });
});

describe("servableRecordingKey", () => {
  test("accepts completed hours and rejects the current one", () => {
    const now = at(12);

    expect(servableRecordingKey("15-01-2024-10-00.mp3", now)).toBe(at(10));
    expect(servableRecordingKey("15-01-2024-11-00.mp3", now)).toBe(at(11));
    expect(
      servableRecordingKey("15-01-2024-12-00.mp3", now),
    ).toBeUndefined();
  });

  test("rejects malformed names and future recordings", () => {
    const now = at(12);

    expect(servableRecordingKey("../etc/passwd", now)).toBeUndefined();
    expect(servableRecordingKey("1-01-2024-10-00.mp3", now)).toBeUndefined();
    expect(servableRecordingKey("15-01-2024-13-00.mp3", now)).toBeUndefined();
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
