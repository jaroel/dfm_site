import { isServer } from "@solidjs/web";
import { createEffect, createSignal, onSettled } from "solid-js";

export const [source, setSource] = createSignal("");
export const [state, setState] = createSignal<
  "error" | "playing" | "loading" | "stopped"
>("stopped");

export default function Player() {
  let audio: HTMLAudioElement | undefined;

  // Component lifecycle teardown, so onSettled with a returned cleanup rather
  // than onCleanup (which is for reactive cleanups inside computations).
  onSettled(() => {
    return () => {
      if (isServer) return;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      setSource("");
    };
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
    <audio
      ref={(el) => (audio = el)}
      src={source()}
      onPlaying={() => setState("playing")}
      onPause={() => setState("stopped")}
      onError={({ currentTarget }) =>
        setState(currentTarget.currentSrc ? "error" : "stopped")
      }
      onLoadStart={() => setState("loading")}
    />
  );
}
