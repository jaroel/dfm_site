import { listFilesCached } from "~/ftp.ts";
import { servableRecordingKey } from "~/recordings.ts";

type Files = Awaited<ReturnType<typeof listFilesCached>>;

/** One-entry memo of the parsed listing, keyed by the FTP cache's array. */
let listingMemo: { files: Files; keys: number[] } | null = null;

export async function fetchUzgListing() {
  "use server";
  const files = await listFilesCached();
  // The FTP cache hands back the same array until it expires, so the listing
  // is only parsed once per cache window.
  if (listingMemo?.files !== files) {
    const now = Date.now();
    listingMemo = {
      files,
      keys: files
        .flatMap(({ name }) => {
          const key = servableRecordingKey(name, now);
          return key === undefined ? [] : [key];
        })
        .sort((a, b) => b - a),
    };
  }
  return listingMemo.keys;
}
