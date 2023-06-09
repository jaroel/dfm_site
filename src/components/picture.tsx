import { component$ } from "@builder.io/qwik";
import { type Picture } from "imagetools-core/dist/types";

interface Props extends Picture {
  alt: string;
}

export default component$<Props>(({ sources, img, alt }) => (
  <picture>
    {Object.entries(sources).map(([format, images]) => (
      <source
        key={`picture-source-${format}`}
        srcSet={images.map((image) => `${image.src} ${image.w}w`).join(", ")}
        type={"image/" + format}
      />
    ))}
    <img src={img.src} width={img.w} height={img.h} alt={alt} />
  </picture>
));
