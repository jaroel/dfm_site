import { PassThrough, Readable } from "node:stream";
import { Client, FTPError } from "basic-ftp";

// ponytail: credentials hardcoded on purpose, the container gets no env.
const FTP_HOST = "dinxperfm.freeddns.org";
const FTP_USER = "UZG";
const FTP_PASSWORD = "4862KpZ2";

type FTPCache = { expiration_date: Date; names: string[] };

let cache: FTPCache | null = null;

export function resetFTPCache() {
  cache = null;
}

/** Cache window ends at the next :02 past the hour. */
function getExpirationDate() {
  const now = Date.now();
  const end = new Date(now);
  end.setMinutes(2, 0, 0);
  if (now > end.getTime()) {
    end.setHours(end.getHours() + 1);
  }
  return end;
}

async function getConnection() {
  const client = new Client(10_000);
  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
    });
    return client;
  } catch (error) {
    client.close();
    throw error;
  }
}

/** Raw entry names in the FTP root, or `null` when the host is unreachable. */
async function listNames(): Promise<string[] | null> {
  let connection: Awaited<ReturnType<typeof getConnection>> | undefined;

  try {
    connection = await getConnection();
    const listing = await connection.list();
    return listing.map((item) => item.name);
  } catch (error) {
    // Missing credentials or an unreachable host must not take the server
    // down: an unhandled rejection from the SSR preload would exit Bun.
    console.error("FTP listing failed:", error);
    return null;
  } finally {
    connection?.close();
  }
}

export async function listNamesCached(): Promise<string[]> {
  const now = new Date();
  if (cache && cache.expiration_date > now) {
    return cache.names;
  }
  const names = await listNames();
  if (!names) {
    // Don't cache a failed fetch: a transient FTP error must not blank the
    // listing until the next cache window. Serve stale data when we have it.
    return cache?.names ?? [];
  }
  cache = { expiration_date: getExpirationDate(), names };
  return names;
}

/**
 * Open `name` for reading, from `startAt` bytes when given. `undefined` when
 * the file vanished between the cached listing and this request (FTP 550).
 */
export async function download(name: string, startAt = 0) {
  const connection = await getConnection();
  try {
    let size: number;
    try {
      size = await connection.size(name);
    } catch (error) {
      // The caller's allow-list is a cached listing, but the file can
      // disappear since. Anything else is a real failure.
      if (error instanceof FTPError && error.code === 550) {
        connection.close();
        return undefined;
      }
      throw error;
    }

    const stream = new PassThrough();
    stream.once("error", () => {
      // Consumed by the caller through the response body; without a listener
      // node treats it as an unhandled 'error' and exits.
    });
    // A client that stops playback cancels the response body, which destroys
    // this stream. Close the control and data sockets; basic-ftp does not
    // abort reliably when only the destination is destroyed.
    stream.once("close", () => connection.close());
    const transfer =
      startAt > 0
        ? connection.downloadTo(stream, name, startAt)
        : connection.downloadTo(stream, name);
    void transfer
      .catch((error: Error) => stream.destroy(error))
      .finally(() => connection.close());

    return {
      size,
      // Node's ReadableStream is structurally distinct from the DOM one that
      // BodyInit expects, though the runtime object is the same.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      stream: Readable.toWeb(stream) as unknown as ReadableStream<Uint8Array>,
    };
  } catch (error) {
    connection.close();
    throw error;
  }
}
