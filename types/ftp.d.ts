/**
 * Client-side contract for the server-only `src/ftp.ts`.
 *
 * `tsconfig.client.json` maps `~/ftp.ts` here so browser code (routes, server
 * functions) never pulls the FTP implementation or Node types into the client
 * program. The server program (`tsconfig.json`) checks the real module.
 */

export declare function listFilesCached(): Promise<
  Array<{ name: string; size: number }>
>;

export declare function download(
  name: string,
  startAt?: number,
): Promise<{ size: number; stream: ReadableStream<Uint8Array> } | undefined>;
