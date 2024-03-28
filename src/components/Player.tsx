import { createEffect, createSignal, onCleanup } from "solid-js";

export const [source, setSource] = createSignal("");
export const [state, setState] = createSignal<
  "error" | "playing" | "loading" | "stopped"
>("stopped");

export default function Player() {
  onCleanup(() => setSource(""));
  let audio: HTMLAudioElement | undefined;

  createEffect(() => {
    if (audio && !source()) {
      audio.pause();
    }
  });

  return (
    // biome-ignore lint/a11y/useMediaCaption: <explanation>
    <audio
      ref={audio}
      preload="none"
      autoplay={!!source()}
      src={source() || undefined}
      onPlaying={() => setState("playing")}
      onPause={() => setState("stopped")}
      onError={({ currentTarget }) => {
        currentTarget.currentSrc ? setState("error") : setState("stopped");
      }}
      onLoadStart={() => setState("loading")}
    />
  );
}
