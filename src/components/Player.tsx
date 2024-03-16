import {
	Fragment,
	Slot,
	component$,
	createContextId,
	useContextProvider,
	useStore,
} from "@builder.io/qwik";

export const PLAYER_CTX = createContextId<{
	src: string;
	state: "error" | "playing" | "loading" | "stopped";
}>("player_ctx");

export default component$(() => {
	const player_ctx = useStore({ src: "", state: "stopped" });
	useContextProvider(PLAYER_CTX, player_ctx);

	return (
		<Fragment>
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio
				preload="none"
				autoplay={!!player_ctx.src}
				src={player_ctx.src || undefined}
				onPlaying$={() => {
					player_ctx.state = "playing";
				}}
				onError$={() => {
					player_ctx.state = "error";
				}}
				onLoadStart$={() => {
					player_ctx.state = "loading";
				}}
			/>
			<Slot />
		</Fragment>
	);
});
