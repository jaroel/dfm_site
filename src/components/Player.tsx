import { createSignal, onCleanup } from "solid-js";

export const [source, setSource] = createSignal("");
export const [state, setState] = createSignal<
  "error" | "playing" | "loading" | "stopped"
>("stopped");

export default function Player() {
  onCleanup(() => {
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setSource("");
  });
  let audio: HTMLAudioElement | undefined;

  return (
    // biome-ignore lint/a11y/useMediaCaption: not relevant
    <audio
      ref={audio}
      autoplay={!!source()}
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
