/**
 * Client-side contract for the server-only `src/ftp.ts`.
 *
 * `tsconfig.client.json` maps `~/ftp.ts` here so browser code (routes, server
 * functions) never pulls the FTP implementation or Node types into the client
 * program. The server program (`tsconfig.json`) checks the real module.
 */

export type FTPRecording = { key: number; name: string };

export declare function getFtpListingCached(): Promise<FTPRecording[]>;

export declare function getFtpStream(
  filename: string,
  startAt?: number,
): Promise<{ size: number; stream: ReadableStream<Uint8Array> } | undefined>;
