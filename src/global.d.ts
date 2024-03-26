/// <reference types="@solidjs/start/env" />
declare module "*as=img" {
  export const src: string;
  export const w: number;
  export const h: number;
}

declare module "*as=picture" {
  import { type Picture } from "imagetools-core/dist/types";
  const out: Picture;
  export default out;
}
