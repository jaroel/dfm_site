import { createSignal, onCleanup } from "solid-js";

export const [source, setSource] = createSignal("");
export const [state, setState] = createSignal<
	"error" | "playing" | "loading" | "stopped"
>("stopped");

export default function Player() {
	onCleanup(() => setSource(""));
	return (
		// biome-ignore lint/a11y/useMediaCaption: <explanation>
		<audio
			preload="none"
			autoplay={!!source()}
			src={source() || undefined}
			onPlaying={() => setState("playing")}
			onAbort={() => setState("stopped")}
			onError={() => setState("error")}
			onLoadStart={() => setState("loading")}
		/>
	);
}
