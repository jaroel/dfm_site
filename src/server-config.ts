import { createFlightDataCollector } from "@solidjs/router/server";
import { configureServerFunctionsServer } from "@solidjs/web/server-functions/server";

import { Router } from "./router";

// Pre-dispatch server-function configuration (pinned into the handler graph
// via `serverFunctions.configure` in vite.config.ts). Registering the router
// as the single-flight collector turns mutations into one round trip.
configureServerFunctionsServer({
  collectFlightData: createFlightDataCollector(Router),
});
