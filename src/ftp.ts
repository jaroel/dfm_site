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

async function getFtpListing(): Promise<number[]> {
  const now = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Amsterdam",
  });
  const threshold = Date.parse(now) - 3600000;

  try {
    const connection = await getConnection();
    const listing = await connection.list();
    connection.end();

    return listing
      .filter((value): value is IListingElement => typeof value !== "string")
      .filter((item) => isDotMp3(item.name))
      .map((item) => {
        const [day, month, year, hour] = item.name.split(/[-.]/);
        return new Date(`${year}-${month}-${day}T${hour}:00`).getTime();
      })
      .filter((key) => key <= threshold)
      .sort((a, b) => b - a);
  } catch {
    return [];
  }
}

type FTPListing = Awaited<ReturnType<typeof getFtpListing>>;

export const [getFtpListingCached] = makeCache<FTPListing, void, unknown>(
  getFtpListing,
  {
    expires: () => {
      // Cache up to 2 minutes after next hour. Audio processing needs some time
      const now = new Date();
      const end = new Date(now);
      end.setMinutes(2, 0, 0);
      if (now.getTime() > end.getTime()) {
        end.setHours(end.getHours() + 1);
      }
      return end.getTime() - now.getTime();
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
