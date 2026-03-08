import type { Picture as TPicture } from "imagetools-core";
import type { JSX } from "solid-js";
import { For } from "solid-js";
export type { TPicture };

type Image = JSX.ImgHTMLAttributes<HTMLImageElement>;

export default function Picture(
  props: { logo: TPicture } & Pick<Image, "alt"> &
    Partial<
      Pick<Image, "class" | "style" | "fetchpriority" | "decoding" | "loading">
    >,
) {
  return (
    <picture class={`inline-block ${props.class ?? ""}`} style={props.style}>
      <For each={Object.entries(props.logo.sources)}>
        {([format, images]) => (
          <source srcset={images} type={`image/${format}`} />
        )}
      </For>
      <img
        src={props.logo.img.src}
        alt={props.alt}
        width={props.logo.img.w}
        height={props.logo.img.h}
        fetchpriority={props.fetchpriority}
        decoding={props.decoding}
        loading={props.loading}
      />
    </picture>
  );
}
