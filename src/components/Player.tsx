import { isServer } from "@solidjs/web";
import { createEffect, createSignal, onCleanup } from "solid-js";

export const [source, setSource] = createSignal("");
export const [state, setState] = createSignal<
  "error" | "playing" | "loading" | "stopped"
>("stopped");

export default function Player() {
  let audio: HTMLAudioElement | undefined;

  onCleanup(() => {
    if (isServer) return;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setSource("");
  });

  // Playback is driven imperatively: toggling the `autoplay` attribute after
  // the element loaded does not start playback in every browser.
  createEffect(
    () => source(),
    (src) => {
      if (isServer || !audio) return;
      if (src) {
        audio.play().catch(() => setState("error"));
      } else {
        audio.pause();
      }
    },
  );

  return (
    // biome-ignore lint/a11y/useMediaCaption: not relevant
    <audio
      ref={(el) => (audio = el)}
      src={source()}
      onPlaying={() => setState("playing")}
      onPause={() => setState("stopped")}
      onError={({ currentTarget }) => {
        currentTarget.currentSrc ? setState("error") : setState("stopped");
      }}
      onLoadStart={() => setState("loading")}
    />
  );
}
