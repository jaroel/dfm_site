import { type APIEvent } from "solid-start/api";
import { FTP } from "ftp-ts";

export const getFileStream = async (filename: string) => {
  filename = filename.trim();
  if (!filename) {
    return;
  }

  const connection = await FTP.connect({
    host: "dinxperfm.freeddns.org",
    user: "UZG",
    password: "4862KpZ2",
  });

  const listing = (await connection.list()).map((el) =>
    typeof el === "string" ? el : el.name
  );
  if (!listing.includes(filename)) {
    return;
  }

  const stream = await connection.get(filename);
  stream.addListener("close", () => {
    connection.destroy();
  });
  return stream;
};

export async function GET({ params }: APIEvent) {
  const stream = await getFileStream(params.file_name);
  if (stream) {
    return new Response(stream, { headers: { "content-type": "audio/mpeg" } });
  }

  return new Response(null, {
    status: 404,
    statusText: "Not found",
  });
}
