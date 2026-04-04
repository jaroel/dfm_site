import "./tracing.ts";
import { createHandler, StartServer } from "@solidjs/start/server";
import { setupGlobalErrorHandlers } from "./error-handler.ts";

setupGlobalErrorHandlers();

import favicon from "~/assets/favicon.ico";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href={favicon} />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
