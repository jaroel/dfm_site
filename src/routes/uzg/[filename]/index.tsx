import type { RequestHandler } from "@builder.io/qwik-city";
import { pipeline } from "node:stream";
import { getConnection } from "~/uzg";

export const onGet: RequestHandler = async (requestEvent) => {
  const connection = await getConnection();
  const fileinfo = await connection.fileInfo(requestEvent.params.filename);
  requestEvent.status(fileinfo ? 200 : 404);
  if (!fileinfo) {
    return;
  }
  const stream = await connection.get(requestEvent.params.filename);
  stream.addListener("close", () => {
    connection.end();
  });

  requestEvent.headers.set("Content-Type", "audio/mpeg");
  requestEvent.headers.set("Content-Length", `${fileinfo.size}`);

  const destination = requestEvent.getWritableStream();
  pipeline(stream, destination as any, () => {
    connection.end();
  });
};
