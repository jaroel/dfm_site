import { createSignal } from "solid-js";

export const [source, setSource] = createSignal("");
export const [state, setState] = createSignal<
	"error" | "playing" | "loading" | "stopped"
>("stopped");

export default function Player() {
	return (
		// biome-ignore lint/a11y/useMediaCaption: <explanation>
		<audio
			autoplay={!!source()}
			src={source()}
			onPlaying={() => setState("playing")}
			onAbort={() => setState("stopped")}
			onError={() => setState("error")}
			onLoadStart={() => setState("loading")}
		/>
	);
}
