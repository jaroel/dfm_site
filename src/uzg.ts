import { download, listNamesCached } from "~/ftp.ts";
import { isRecordingName, parseRecordingKey } from "~/recordings.ts";

/** Valid recordings, newest first. The current hour is not fully written yet. */
async function listRecordings() {
  const threshold = Date.now() - 3_600_000;
  const names = await listNamesCached();
  return names
    .flatMap((name) => {
      const key = parseRecordingKey(name);
      return key === undefined || key > threshold ? [] : [{ key, name }];
    })
    .sort((a, b) => b.key - a.key);
}

export async function fetchUzgListing() {
  "use server";
  return (await listRecordings()).map((recording) => recording.key);
}

// `"use server"` is load-bearing for the bundle, not just RPC: it makes the
// client see a server reference, so the `~/ftp.ts` import (basic-ftp,
// node:stream) never reaches the browser. Removing it adds ~60 kB to the
// client chunk.
export async function openRecording(filename: string, startAt = 0) {
  "use server";
  // Cheap reject before touching FTP; the listing below is the real allow-list.
  if (!isRecordingName(filename)) {
    return undefined;
  }
  if (!Number.isSafeInteger(startAt) || startAt < 0) {
    return undefined;
  }
  // Exact filename match: the listing is the allow-list, so a crafted name
  // never reaches downloadTo().
  const allowed = (await listRecordings()).some(
    (recording) => recording.name === filename,
  );
  if (!allowed) {
    return undefined;
  }
  return download(filename, startAt);
}
