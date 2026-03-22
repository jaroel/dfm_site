import { getFtpListingCached } from "./ftp.ts";

export async function fetchUzgListing() {
  "use server";
  return await getFtpListingCached();
}

function formatDate(key: number): string {
  const d = new Date(key);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}-${pad(d.getHours())}-00.mp3`;
}

export function toRecordings(timestamps: number[]) {
  return timestamps.map((key) => {
    const datetime = new Date(key);
    return {
      day: datetime.getDate(),
      month: datetime.getMonth() as
        | 0
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11,
      year: datetime.getFullYear(),
      weekday: datetime.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      hour: datetime.getHours(),
      src: `/uzg/${formatDate(key)}`,
      key,
    };
  });
}

// https://steveholgado.com/typescript-types-from-arrays/#getting-a-type-from-our-array
export type Recording = ReturnType<typeof toRecordings>[number];
