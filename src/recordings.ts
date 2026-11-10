import { groupBy } from "~/groupby.ts";

const TIME_ZONE = "Europe/Amsterdam";

// dd-mm-yyyy-hh-mm.mp3 — the only naming the FTP host uses. Strict, so a
// crafted path segment can never reach downloadTo(). Keep it non-global: it
// is used with exec(), and a /g flag would make lastIndex stateful across
// calls.
const FILENAME_PATTERN =
  /^(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})-(?<hour>\d{2})-(?<minute>\d{2})\.mp3$/;

const zoneFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Offset of Europe/Amsterdam at `timestamp`, in ms. */
function zoneOffsetMs(timestamp: number) {
  const parts = zoneFormatter.formatToParts(timestamp);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    value("hour") % 24,
    value("minute"),
    value("second"),
  );
  return asUtc - timestamp;
}

/**
 * Timestamp of a wall-clock time in Europe/Amsterdam. Two passes: the first
 * guess uses the offset at the UTC instant, which is off by the DST hour for
 * times on the other side of a transition.
 */
function amsterdamTimestamp(
  day: string,
  month: string,
  year: string,
  hour: string,
  minute: string,
) {
  const wall = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
  return wall - zoneOffsetMs(wall - zoneOffsetMs(wall));
}

export function isRecordingName(name: string) {
  return FILENAME_PATTERN.test(name);
}

/** Recording key (epoch ms) from a filename, `undefined` when malformed. */
export function parseRecordingKey(name: string) {
  const { groups } = FILENAME_PATTERN.exec(name) ?? {};
  if (!groups) return undefined;
  const { day, month, year, hour, minute } = groups;
  return amsterdamTimestamp(day, month, year, hour, minute);
}

const formatter = new Intl.DateTimeFormat("nl-NL", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function partsOf(key: number) {
  const result: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {};
  for (const { type, value } of formatter.formatToParts(key)) {
    result[type] = value;
  }
  return result;
}

/** `dd-mm-yyyy-hh-mm.mp3`, the inverse of `parseRecordingKey`. */
function recordingName(key: number) {
  const parts = partsOf(key);
  return `${parts.day}-${parts.month}-${parts.year}-${parts.hour}-${parts.minute}.mp3`;
}

const MONTHS: Record<number, string> = {
  1: "Januari",
  2: "Februari",
  3: "Maart",
  4: "April",
  5: "Mei",
  6: "Juni",
  7: "Juli",
  8: "Augustus",
  9: "September",
  10: "Oktober",
  11: "November",
  12: "December",
};

export type UzgListing = number[];

export function toRecordings(keys: UzgListing) {
  return keys.map((key) => {
    const result = partsOf(key);
    const month = Number(result.month);
    return {
      key,
      day: Number(result.day),
      month,
      year: Number(result.year),
      weekdayLabel: toTitleCase(result.weekday ?? ""),
      monthLabel: MONTHS[month].toLowerCase(),
      monthLong: MONTHS[month],
      time: `${result.hour}:${result.minute}`,
      src: `/uzg/${recordingName(key)}`,
    };
  });
}

// https://steveholgado.com/typescript-types-from-arrays/#getting-a-type-from-our-array
export type Recording = ReturnType<typeof toRecordings>[number];

export type RecordingDay = {
  day: number;
  label: string;
  recordings: Recording[];
};

export type RecordingMonth = {
  month: number;
  label: string;
  days: RecordingDay[];
};

export type RecordingYear = {
  year: number;
  months: RecordingMonth[];
};

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Year → month → day, preserving the order `toRecordings` returned. */
export function groupRecordings(recordings: Recording[]): RecordingYear[] {
  return groupBy(recordings, (recording) => recording.year).map((year) => ({
    year: year.key,
    months: groupBy(year.members, (recording) => recording.month).map(
      (month) => ({
        month: month.key,
        label: month.head.monthLong,
        days: groupBy(month.members, (recording) => recording.day).map(
          (day) => ({
            day: day.key,
            label: `${day.head.weekdayLabel} ${day.head.day} ${day.head.monthLabel}`,
            recordings: day.members,
          }),
        ),
      }),
    ),
  }));
}
