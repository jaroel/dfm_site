import type { IListingElement } from "ftp-ts";
import { FTP } from "ftp-ts";

export const getConnection = async (): Promise<FTP> => {
  return await FTP.connect({
    host: "86.81.98.192",
    user: "UZG",
    password: "4862KpZ2",
  });
};

export async function getFtpListing(): Promise<IListingElement[]> {
  const connection = await getConnection();
  const listing = await connection.list();
  connection.end();
  return listing.filter(
    (value): value is IListingElement => typeof value !== "string"
  );
}

export interface Recording {
  title: string;
  filename: string;
  url: string;
  date: Date;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  monthIndex: number;
  monthDisplayUpperCase: string;
  monthDisplayLowerCase: string;
  weekday: number;
  weekdayDisplayUpperCase: string;
  weekdayDisplayLowerCase: string;
  weekNumber: number;
}

function getWeekNumber(d: Date): number {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() ?? 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  return Math.ceil(
    ((d.getFullYear() - yearStart.getFullYear()) / 86_400_000 + 1) / 7
  );
}

const monthNamesUpperCase = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
];
const monthNamesLowerCase = monthNamesUpperCase.map((month) =>
  month.toLowerCase()
);
const weekdayDisplayUpperCase = [
  "Zondag",
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
];
const weekdayDisplayLowerCase = weekdayDisplayUpperCase.map((day) =>
  day.toLowerCase()
);
const nameToDate = /(\d\d)-(\d\d)-(\d\d\d\d)-(\d\d)-(\d\d).mp3/;

export const getRecordings = async (): Promise<Recording[]> => {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' })).getTime();
  const listing = await getFtpListing();
  return listing
    .map((value) => {
      const parsedName = nameToDate
        .exec(value.name)
        ?.slice(1, 6)
        .map((value) => Number.parseInt(value, 10));

      if (parsedName == null) {
        return null;
      }

      return {
        filename: value.name,
        day: parsedName[0],
        month: parsedName[1],
        monthIndex: parsedName[1] - 1,
        year: parsedName[2],
        hour: parsedName[3],
        minute: parsedName[4],
      };
    })
    .filter(Boolean)
    .map((value) => {
      const date = new Date(
        value.year,
        value.monthIndex,
        value.day,
        value.hour,
        value.minute
      );
      const weekday = date.getDay();
      const recording = {
        ...value,
        title: "",
        date,
        monthDisplayUpperCase: monthNamesUpperCase[value.monthIndex] ?? "",
        monthDisplayLowerCase: monthNamesLowerCase[value.monthIndex] ?? "",
        weekday,
        weekdayDisplayUpperCase: weekdayDisplayUpperCase[weekday] ?? "",
        weekdayDisplayLowerCase: weekdayDisplayLowerCase[weekday] ?? "",
        url: `/uzg/${value.filename}`,
        weekNumber: getWeekNumber(date),
      };
      recording.title = `Uitzending Dinxper FM van ${recording.weekdayDisplayLowerCase} ${recording.day} ${recording.monthDisplayLowerCase} ${recording.year} om ${recording.hour} uur`;
      return recording;
    })
    .sort((a, b) => ((a.date ?? 0) >= (b.date ?? 0) ? -1 : 1))
    .filter((recording) => now - recording.date.getTime() > 3660000); // 1h + 1m
};
