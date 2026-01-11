import type { IListingElement } from "ftp-ts";
import { FTP } from "ftp-ts";

export async function getConnection() {
  return await FTP.connect({
    host: "dinxperfm.freeddns.org",
    user: "UZG",
    password: "4862KpZ2",
  });
}

export async function getFtpListing() {
  try {
    const connection = await getConnection();
    const listing = await connection.list();
    connection.end();
    return listing.filter(
      (value): value is IListingElement => typeof value !== "string",
    );
  } catch {
    return [];
  }
}

export async function getFtpStream(filename: string) {
  const listing = (await getFtpListing()).map((item) => item.name);
  if (listing.includes(filename)) {
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
}
