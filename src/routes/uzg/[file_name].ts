import { type APIEvent } from "@solidjs/start/server";
import { FTP } from "ftp-ts";

export async function GET({ params }: APIEvent) {
  const filename = params.file_name.trim();
  if (filename) {
    const connection = await FTP.connect({
      host: "dinxperfm.freeddns.org",
      user: "UZG",
      password: "4862KpZ2",
    });

    const listing = (await connection.list()).map((el) =>
      typeof el === "string" ? el : el.name
    );
    if (listing.includes(filename)) {
      const stream = await connection.get(filename);
      stream.addListener("close", () => {
        connection.destroy();
      });

      if (stream) {
        return new Response(stream, {
          headers: { "content-type": "audio/mpeg" },
        });
      }
    }
  }

  return new Response(null, {
    status: 404,
    statusText: "Not found",
  });
}
