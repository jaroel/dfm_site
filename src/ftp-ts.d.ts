import type { Readable } from "node:stream";

declare module "ftp-ts" {
  interface FTP {
    /**
     * ftp-ts declares NodeJS.ReadableStream, but the runtime value is the node
     * read stream backing the PASV data socket (or the inflate stream when
     * compression is enabled). Both support destroy() and Readable.toWeb().
     */
    get(path: string, useCompression?: boolean): Promise<Readable>;
  }
}
