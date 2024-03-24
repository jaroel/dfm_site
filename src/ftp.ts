"use server";
import type { IListingElement } from "ftp-ts";
import { FTP } from "ftp-ts";

export const getConnection = async () => {
  return await FTP.connect({
    host: "dinxperfm.freeddns.org",
    user: "UZG",
    password: "4862KpZ2",
  });
};

export async function getFtpListing() {
  const connection = await getConnection();
  const listing = await connection.list();
  connection.end();
  return listing.filter(
    (value): value is IListingElement => typeof value !== "string",
  );
}

export async function getFtpStream(filename: string) {
  const listing = (await getFtpListing()).map((item) => item.name);
  if (listing.includes(filename)) {
    const connection = await getConnection();
    const stream = await connection.get(filename);
    stream.addListener("close", () => {
      connection.destroy();
    });
    return stream;
  }
}
