import { type Picture as TPicture } from "imagetools-core/dist/types";
export type { TPicture };

export default function Picture(props: {
  logo: TPicture;
  alt: string;
  class?: string;
  style?: string;
}) {
  return (
    <picture class={`inline-block ${props.class}`} style={props.style}>
      {Object.entries(props.logo.sources).map(([format, images]) => (
        <source srcset={images} type={"image/" + format} />
      ))}
      <img
        src={props.logo.img.src}
        alt={props.alt}
        width={props.logo.img.w}
        height={props.logo.img.h}
      />
    </picture>
  );
}
