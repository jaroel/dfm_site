import { getFtpListingCached } from "./ftp.ts";

export async function fetchUzgListing() {
  "use server";
  return await getFtpListingCached();
}

export function toRecordings(timestamps: number[]) {
  return timestamps.map((key) => {
    const formatter = new Intl.DateTimeFormat("nl-NL", {
      timeZone: "Europe/Amsterdam",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
      hour: "2-digit",
    });
    const parts = formatter.formatToParts(key);
    const result: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {};
    for (const { type, value } of parts) {
      if (type !== "literal") {
        result[type] = value;
      }
    }

    return {
      day: Number(result.day),
      month: Number(result.month),
      year: Number(result.year),
      weekday: result.weekday,
      hour: Number(result.hour),
      src: `/uzg/${result.day}-${result.month}-${result.year}-${result.hour}-00.mp3`,
      key,
    };
  });
}

// https://steveholgado.com/typescript-types-from-arrays/#getting-a-type-from-our-array
export type Recording = ReturnType<typeof toRecordings>[number];
