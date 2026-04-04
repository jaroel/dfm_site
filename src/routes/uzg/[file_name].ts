import { SpanStatusCode, trace } from "@opentelemetry/api";
import type { APIEvent } from "@solidjs/start/server";
import { getFtpStream } from "~/ftp.ts";

const tracer = trace.getTracer("api");

export async function GET({ params, request }: APIEvent) {
  return await tracer.startActiveSpan("GET /uzg/[file_name]", async (span) => {
    try {
      const filename = params.file_name.trim();
      span.setAttribute("http.url", request.url);
      span.setAttribute("http.method", "GET");
      span.setAttribute("file.name", filename);

      const rangeHeader = request.headers.get("range");
      span.setAttribute("http.range", rangeHeader || "none");

      const ftp_data = await getFtpStream(filename);

      if (ftp_data) {
        span.setAttribute("http.status_code", rangeHeader ? 206 : 200);
        span.setAttribute("file.size", ftp_data.metadata.size);
        span.setAttribute("file.found", true);

        if (rangeHeader === "bytes=0-1") {
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

      span.setAttribute("http.status_code", 404);
      span.setAttribute("file.found", false);
      return new Response(null, {
        status: 404,
        statusText: "Not found",
      });
    } catch (e) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
      throw e;
    } finally {
      span.end();
    }
  });
}
