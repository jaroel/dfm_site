/// <reference types="@solidjs/start/env" />
// biome-ignore lint/correctness/noUnresolvedImports: false positive
declare module "*as=img" {
  export const src: string;
  export const w: number;
  export const h: number;
}

// biome-ignore lint/correctness/noUnresolvedImports: false positive
declare module "*as=picture" {
  import type { Picture } from "imagetools-core";
  const out: Picture;
  export default out;
}
