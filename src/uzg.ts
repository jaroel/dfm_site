import { type FilenameDotMp3, getFtpListingCached } from "./ftp.ts";

export async function fetchUzgListing() {
  "use server";
  return await getFtpListingCached();
}

export function toRecordings(listing: FilenameDotMp3[]) {
  const now = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Amsterdam",
  });
  const threshold_timestamp = Date.parse(now) - 3600000;
  return listing
    .map((file_name) => {
      const [day, month, year, hour] = file_name.split(/[-.]/);
      const minute = "00";
      const datetime = new Date(`${year}-${month}-${day}T${hour}:${minute}`);

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
        src: `/uzg/${file_name}`,
        key: datetime.getTime(),
      };
    })
    .filter((el) => el.key <= threshold_timestamp)
    .sort((a, b) => (a.key >= b.key ? -1 : 1));
}

// https://steveholgado.com/typescript-types-from-arrays/#getting-a-type-from-our-array
export type Recording = ReturnType<typeof toRecordings>[number];
