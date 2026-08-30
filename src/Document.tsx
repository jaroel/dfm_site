import { HydrationScript } from "@solidjs/web";
import type { ParentProps } from "solid-js";
import favicon from "~/assets/favicon.ico";

// The document shell — the new index.html: picked up by the src/Document.*
// convention, it wraps the app in the plugin's generated entries and must
// render the full <html>. Head tags go here. It is compiled only into the
// prerendered static shell and ships zero client-side JS.
export default function Document(props: ParentProps) {
  return (
    <html lang="nl">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon} />
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
