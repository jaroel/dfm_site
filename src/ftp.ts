import type { IListingElement } from "ftp-ts";
import { FTP } from "ftp-ts";

export type FilenameDotMp3 = `${string}.mp3`;

// dd-mm-yyyy-hh-mm.mp3 — strict, so a crafted segment can never reach
// connection.get() as an FTP path.
const FILENAME_PATTERN = /^\d{2}-\d{2}-\d{4}-\d{2}-\d{2}\.mp3$/;

function isDotMp3(name: string): name is FilenameDotMp3 {
  return FILENAME_PATTERN.test(name);
}

const AMSTERDAM = "Europe/Amsterdam";
const zoneFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: AMSTERDAM,
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
 * Timestamp of a wall-clock hour in Europe/Amsterdam. Two passes: the first
 * guess uses the offset at the UTC instant, which is off by the DST hour for
 * hours on the other side of a transition.
 */
function amsterdamTimestamp(
  day: string,
  month: string,
  year: string,
  hour: string,
) {
  const wall = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
  );
  return wall - zoneOffsetMs(wall - zoneOffsetMs(wall));
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

let FTP_CACHE: { expiration_date: Date; items: FTPListing } | null = null;

export function resetFTPCache() {
  FTP_CACHE = null;
}

export function getExpirationDate() {
  const now = Date.now();
  const end = new Date(now);
  end.setMinutes(2, 0, 0);
  if (now > end.getTime()) {
    end.setHours(end.getHours() + 1);
  }
  return end;
}

export async function getConnection() {
  return await FTP.connect({
    host: requiredEnv("FTP_HOST"),
    user: requiredEnv("FTP_USER"),
    password: requiredEnv("FTP_PASSWORD"),
  });
}

export type FTPRecording = { key: number; name: FilenameDotMp3 };

export async function getFtpListing(): Promise<FTPRecording[]> {
  // Cutoff datetime exists because the current hour's recording is not written fully yet.
  const threshold = Date.now() - 3600000;
  const connection = await getConnection();

  try {
    const listing = (await connection.list())
      .filter((value): value is IListingElement => typeof value !== "string")
      .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
    return listing
      .filter((item) => isDotMp3(item.name))
      .map((item) => {
        const [day, month, year, hour] = item.name.split(/[-.]/);
        return {
          key: amsterdamTimestamp(day, month, year, hour),
          name: item.name as FilenameDotMp3,
        };
      })
      .filter((recording) => recording.key <= threshold);
  } catch {
    return [];
  } finally {
    connection.end();
  }
}

type FTPListing = Awaited<ReturnType<typeof getFtpListing>>;

export async function getFtpListingCached() {
  const now = new Date();
  if (FTP_CACHE && FTP_CACHE.expiration_date > now) {
    return FTP_CACHE.items;
  }
  const items = await getFtpListing();
  FTP_CACHE = {
    expiration_date: getExpirationDate(),
    items,
  };
  return items;
}

export async function getFtpStream(filename: string) {
  if (!isDotMp3(filename)) {
    return;
  }
  const listing = await getFtpListingCached();
  // Exact filename match: the listing is the allow-list, so a crafted name
  // never reaches connection.get().
  if (!listing.some((recording) => recording.name === filename)) {
    return;
  }
  const connection = await getConnection();
  try {
    const metadata = await connection.fileInfo(filename);
    if (!metadata) {
      connection.end();
      return;
    }
    const stream = await connection.get(filename);
    // The connection lives until the response body is consumed.
    stream.addListener("close", () => {
      connection.destroy();
    });
    return { metadata, stream };
  } catch (error) {
    connection.destroy();
    throw error;
  }
}
