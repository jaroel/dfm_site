import type { APIEvent } from "@solidjs/start/server";
import { FilenameDotMp3, getFtpStream } from "~/ftp.ts";

export async function GET({ params, request }: APIEvent) {
  const filename = params.file_name.trim();
  const ftp_data = await getFtpStream(filename);

  if (ftp_data) {
    if (request.headers.get("range") === "bytes=0-1") {
      return new Response("ID", {
        status: 206,
        headers: {
          "content-type": "audio/mpeg",
          "content-range": `bytes 0-1/${ftp_data.metadata.size}`,
          "content-length": "2",
        },
      });
    }

    return new Response(ftp_data.stream, {
      headers: {
        "content-type": "audio/mpeg",
        "accept-ranges": "bytes",
        "content-length": ftp_data.metadata.size,
      },
    });
  }

  return new Response(null, {
    status: 404,
    statusText: "Not found",
  });
}
