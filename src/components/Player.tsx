import { component$, useContext } from "@builder.io/qwik";
import { PLAYER_CTX } from "~/routes/layout";

export default component$(() => {
  const player_ctx = useContext(PLAYER_CTX);

  return (
    <audio
      autoplay={!!player_ctx.src}
      src={player_ctx.src || undefined}
      onPlaying$={() => (player_ctx.state = "playing")}
      onError$={() => (player_ctx.state = "error")}
      onLoadStart$={() => (player_ctx.state = "loading")}
    ></audio>
  );
});
