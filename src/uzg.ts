import { getFtpListingCached } from "./ftp.ts";

export type UzgListing = number[];

export async function fetchUzgListing(): Promise<UzgListing> {
  "use server";
  const listing = await getFtpListingCached();
  return listing.map((recording) => recording.key);
}

const formatter = new Intl.DateTimeFormat("nl-NL", {
  timeZone: "Europe/Amsterdam",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
});

function partsOf(key: number) {
  const result: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {};
  for (const { type, value } of formatter.formatToParts(key)) {
    result[type] = value;
  }
  return result;
}

/** `dd-mm-yyyy-hh-mm.mp3`, the only naming the FTP host uses. */
function nameOf(key: number) {
  const parts = partsOf(key);
  return `${parts.day}-${parts.month}-${parts.year}-${parts.hour}-${parts.minute}.mp3`;
}

export function toRecordings(keys: UzgListing) {
  return keys.map((key) => {
    const result = partsOf(key);
    return {
      day: Number(result.day),
      month: Number(result.month),
      year: Number(result.year),
      weekday: result.weekday ?? "",
      hour: Number(result.hour),
      minute: Number(result.minute),
      src: `/uzg/${nameOf(key)}`,
      key,
    };
  });
}

// https://steveholgado.com/typescript-types-from-arrays/#getting-a-type-from-our-array
export type Recording = ReturnType<typeof toRecordings>[number];
