import { makeCache } from "@solid-primitives/resource";
import type { IListingElement } from "ftp-ts";
import { FTP } from "ftp-ts";

export type FilenameDotMp3 = `${string}.mp3`;

function isDotMp3(name: string): name is FilenameDotMp3 {
  return name.endsWith(".mp3");
}

export async function getConnection() {
  return await FTP.connect({
    host: "dinxperfm.freeddns.org",
    user: "UZG",
    password: "4862KpZ2",
  });
}

export async function getFtpListing(): Promise<number[]> {
  // Cutoff datetime exists because the current hour's recording is not written fully yet.
  const old_TZ = process.env.TZ;
  process.env.TZ = "Europe/Amsterdam";
  const threshold = Date.now() - 3600000;

  try {
    const connection = await getConnection();
    const listing = (await connection.list())
      .filter((value): value is IListingElement => typeof value !== "string")
      .sort((a, b) => b.date - a.date);
    connection.end();
    return listing
      .filter((item) => isDotMp3(item.name))
      .map((item) => {
        const [day, month, year, hour] = item.name.split(/[-.]/);
        return new Date(`${year}-${month}-${day}T${hour}:00`).getTime();
      })
      .filter((timestamp) => timestamp <= threshold);
  } catch {
    return [];
  } finally {
    process.env.TZ = old_TZ;
  }
}

type FTPListing = Awaited<ReturnType<typeof getFtpListing>>;

export const [getFtpListingCached] = makeCache<FTPListing, void, unknown>(
  getFtpListing,
  {
    expires: () => {
      // Cache up to 2 minutes after next hour. Audio processing needs some time
      const now = Date.now();
      const end = new Date(now);
      end.setMinutes(2, 0, 0);
      if (now > end.getTime()) {
        end.setHours(end.getHours() + 1);
      }
      return end.getTime() - now;
    },
  },
);

export async function getFtpStream(filename: string) {
  if (!isDotMp3(filename)) {
    return;
  }
  const [day, month, year, hour] = filename.split(/[-.]/);
  const key = new Date(`${year}-${month}-${day}T${hour}:00`).getTime();

  const listing = await getFtpListingCached();
  if (!listing.includes(key)) {
    return;
  }
  const connection = await getConnection();
  const metadata = await connection.fileInfo(filename);
  if (!metadata) {
    return;
  }
  const stream = await connection.get(filename);
  stream.addListener("close", () => {
    connection.destroy();
  });
  return { metadata, stream };
}
