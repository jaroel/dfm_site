import type { APIHandler } from "filesystem-routing/api";
import { openRecording } from "~/uzg.ts";

/**
 * Parse a single `bytes=start-` / `bytes=start-end` range. Multi-range and
 * other units are ignored (the request then falls back to a full response).
 */
function parseRange(value: string | null) {
  const match = /^bytes=(\d+)-(\d*)$/.exec(value?.trim() ?? "");
  if (!match) return undefined;
  const start = Number(match[1]);
  const end = match[2] === "" ? undefined : Number(match[2]);
  if (!Number.isSafeInteger(start)) return undefined;
  if (end !== undefined && (!Number.isSafeInteger(end) || end < start)) {
    return undefined;
  }
  return { start, end };
}

export const GET: APIHandler = async ({ params, request }) => {
  const filename = (params?.file_name ?? "").trim();
  const range = parseRange(request.headers.get("range"));
  // Only open-ended ranges stream from the offset. A bounded range (other
  // than Safari's probe, below) falls back to a full 200: serving it from the
  // start would over-serve a 206.
  const startAt = range?.end === undefined ? (range?.start ?? 0) : 0;
  const recording = await openRecording(filename, startAt);

  if (recording) {
    const { size, stream } = recording;

    if (range) {
      if (range.start >= size) {
        void stream.cancel().catch(() => {});
        return new Response(null, {
          status: 416,
          headers: {
            "content-range": `bytes */${size}`,
            "accept-ranges": "bytes",
          },
        });
      }

      if (range.start === 0 && range.end === 1) {
        // Safari probes with a 2-byte range; don't leave the data transfer
        // running for a response that ignores it.
        void stream.cancel().catch(() => {});
        return new Response("ID", {
          status: 206,
          headers: {
            "content-type": "audio/mpeg",
            "content-range": `bytes 0-1/${size}`,
            "content-length": "2",
          },
        });
      }

      if (range.end === undefined) {
        return new Response(stream, {
          status: 206,
          headers: {
            "content-type": "audio/mpeg",
            "accept-ranges": "bytes",
            "content-range": `bytes ${range.start}-${size - 1}/${size}`,
            "content-length": String(size - range.start),
          },
        });
      }
    }

    return new Response(stream, {
      headers: {
        "content-type": "audio/mpeg",
        "accept-ranges": "bytes",
        "content-length": String(size),
      },
    });
  }

  return new Response(null, {
    status: 404,
    statusText: "Not found",
  });
};
