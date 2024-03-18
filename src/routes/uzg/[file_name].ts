import type { APIEvent } from "@solidjs/start/server";
import { getFtpStream } from "~/ftp";

export async function GET({ params }: APIEvent) {
  const filename = params.file_name.trim();
  const stream = await getFtpStream(filename);
  if (stream) {
    return new Response(stream, {
      headers: { "content-type": "audio/mpeg", "cache-control": "immutable" },
    });
  }

  return new Response(null, {
    status: 404,
    statusText: "Not found",
  });
}
