// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

// biome-ignore lint/style/noNonNullAssertion: will be there
mount(() => <StartClient />, document.getElementById("app")!);
