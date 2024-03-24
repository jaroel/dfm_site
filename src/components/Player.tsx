import { createSignal, onCleanup } from "solid-js";

export const [source, setSource] = createSignal("");
export const [state, setState] = createSignal<
  "error" | "playing" | "loading" | "stopped"
>("stopped");

export default function Player() {
  let audio: HTMLAudioElement | undefined;
  onCleanup(() => {
    audio?.pause();
    setSource("");
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
