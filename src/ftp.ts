import { SpanStatusCode, trace } from "@opentelemetry/api";
import { makeCache } from "@solid-primitives/resource";
import type { IListingElement } from "ftp-ts";
import { FTP } from "ftp-ts";

const tracer = trace.getTracer("ftp");

export type FilenameDotMp3 = `${string}.mp3`;

function isDotMp3(name: string): name is FilenameDotMp3 {
  return name.endsWith(".mp3");
}

export async function getConnection() {
  return await tracer.startActiveSpan("ftp.connect", async (span) => {
    try {
      span.setAttribute("ftp.host", "dinxperfm.freeddns.org");
      span.setAttribute("ftp.port", 21);
      const result = await FTP.connect({
        host: "dinxperfm.freeddns.org",
        user: "UZG",
        password: "4862KpZ2",
      });
      span.setAttribute("ftp.connected", true);
      return result;
    } catch (e) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
      throw e;
    } finally {
      span.end();
    }
  });
}

export async function getFtpListing(): Promise<number[]> {
  return await tracer.startActiveSpan("ftp.listing", async (span) => {
    const old_TZ = process.env.TZ;
    try {
      span.setAttribute("ftp.operation", "list");
      process.env.TZ = "Europe/Amsterdam";
      const threshold = Date.now() - 3600000;
      const connection = await getConnection();
      const listing = (await connection.list())
        .filter((value): value is IListingElement => typeof value !== "string")
        .sort((a, b) => b.date - a.date);
      span.setAttribute("ftp.file_count", listing.length);
      connection.end();
      const result = listing
        .filter((item) => isDotMp3(item.name))
        .map((item) => {
          const [day, month, year, hour] = item.name.split(/[-.]/);
          return new Date(`${year}-${month}-${day}T${hour}:00`).getTime();
        })
        .filter((timestamp) => timestamp <= threshold);
      span.setAttribute("ftp.mp3_count", result.length);
      return result;
    } catch (e) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
      return [];
    } finally {
      process.env.TZ = old_TZ;
      span.end();
    }
  });
}

type FTPListing = Awaited<ReturnType<typeof getFtpListing>>;

export const [getFtpListingCached] = makeCache<FTPListing, void, unknown>(
  getFtpListing,
  {
    expires: () => {
      // Cache up to 2 minutes after next hour. Audio processing needs some time
      const now = Date.now();
      const end = new Date(now);
      end.setMinutes(2, 0, 0);
      if (now > end.getTime()) {
        end.setHours(end.getHours() + 1);
      }
      return end.getTime() - now;
    },
  },
);

export async function getFtpStream(filename: string) {
  return await tracer.startActiveSpan("ftp.get_stream", async (span) => {
    try {
      span.setAttribute("ftp.filename", filename);
      span.setAttribute("ftp.operation", "get");

      if (!isDotMp3(filename)) {
        span.setAttribute("ftp.valid_filename", false);
        return;
      }
      span.setAttribute("ftp.valid_filename", true);

      const [day, month, year, hour] = filename.split(/[-.]/);
      const key = new Date(`${year}-${month}-${day}T${hour}:00`).getTime();
      span.setAttribute("ftp.timestamp", key);

      const listing = await getFtpListingCached();
      span.setAttribute("ftp.listing_count", listing.length);

      if (!listing.includes(key)) {
        span.setAttribute("ftp.file_in_listing", false);
        return;
      }
      span.setAttribute("ftp.file_in_listing", true);

      const connection = await getConnection();
      const metadata = await connection.fileInfo(filename);
      if (!metadata) {
        span.setAttribute("ftp.metadata_found", false);
        return;
      }
      span.setAttribute("ftp.metadata_found", true);
      span.setAttribute("ftp.file_size", metadata.size);

      const stream = await connection.get(filename);
      span.setAttribute("ftp.stream_created", true);
      stream.addListener("close", () => {
        connection.destroy();
      });
      return { metadata, stream };
    } catch (e) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
      return;
    } finally {
      span.end();
    }
  });
}
