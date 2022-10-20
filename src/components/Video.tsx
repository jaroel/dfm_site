import { Show } from "solid-js";
import { appState } from "../stores.js";

export default function Button() {
  return (
    <Show when={appState.video}>
      <div class="max-w-sm">
        <iframe
          src="https://video3.inetcast.nl/live-stream-video-widget/dinxperfm"
          allowfullscreen={true}
          height="100%"
          width="540"
        ></iframe>
      </div>
    </Show>
  );
}
