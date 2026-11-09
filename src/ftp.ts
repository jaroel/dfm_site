import { PassThrough, Readable } from "node:stream";
import { Client, FTPError } from "basic-ftp";

// dd-mm-yyyy-hh-mm.mp3 — strict, so a crafted segment can never reach
// downloadTo() as an FTP path. Keep it non-global: it is used with exec(),
// and a /g flag would make lastIndex stateful across calls.
const FILENAME_PATTERN =
  /^(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})-(?<hour>\d{2})-(?<minute>\d{2})\.mp3$/;

const zoneFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Amsterdam",
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

// ponytail: credentials hardcoded on purpose, the container gets no env.
const FTP_HOST = "dinxperfm.freeddns.org";
const FTP_USER = "UZG";
const FTP_PASSWORD = "4862KpZ2";

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
  const client = new Client(10_000);
  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
    });
    return client;
  } catch (error) {
    client.close();
    throw error;
  }
}

/** Invariant: `name` always matches dd-mm-yyyy-hh-mm.mp3 (enforced when parsed). */
export type FTPRecording = { key: number; name: string };

export async function getFtpListing(): Promise<FTPRecording[]> {
  // Cutoff datetime exists because the current hour's recording is not written fully yet.
  const threshold = Date.now() - 3600000;
  let connection: Awaited<ReturnType<typeof getConnection>> | undefined;

  try {
    connection = await getConnection();
    const listing = await connection.list();
    return listing
      .flatMap((item) => {
        const { groups } = FILENAME_PATTERN.exec(item.name) ?? {};
        if (!groups) return [];
        const { day, month, year, hour, minute } = groups;
        return [
          {
            key: amsterdamTimestamp(day, month, year, hour, minute),
            name: item.name,
          },
        ];
      })
      .filter((recording) => recording.key <= threshold)
      .sort((a, b) => b.key - a.key);
  } catch (error) {
    // Missing credentials or an unreachable host must not take the server
    // down: an unhandled rejection from the SSR preload would exit Bun.
    console.error("FTP listing failed:", error);
    return [];
  } finally {
    connection?.close();
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
  // Cheap reject before touching FTP; the listing below is the real allow-list.
  if (!FILENAME_PATTERN.test(filename)) {
    return undefined;
  }
  const listing = await getFtpListingCached();
  // Exact filename match: the listing is the allow-list, so a crafted name
  // never reaches connection.get().
  if (!listing.some((recording) => recording.name === filename)) {
    return undefined;
  }
  const connection = await getConnection();
  try {
    let size: number;
    try {
      size = await connection.size(filename);
    } catch (error) {
      // The listing is the allow-list, but the file can disappear between the
      // cached listing and this request. Anything else is a real failure.
      if (error instanceof FTPError && error.code === 550) {
        connection.close();
        return undefined;
      }
      throw error;
    }

    const stream = new PassThrough();
    stream.once("error", () => {
      // Consumed by the caller through the response body; without a listener
      // node treats it as an unhandled 'error' and exits.
    });
    // A client that stops playback cancels the response body, which destroys
    // this stream. Close the control and data sockets; basic-ftp does not
    // abort reliably when only the destination is destroyed.
    stream.once("close", () => connection.close());
    void connection
      .downloadTo(stream, filename)
      .catch((error: Error) => stream.destroy(error))
      .finally(() => connection.close());

    return {
      size,
      stream: Readable.toWeb(stream),
    };
  } catch (error) {
    connection.close();
    throw error;
  }
}
