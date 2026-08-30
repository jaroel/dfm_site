import { createAPIHandler } from "filesystem-routing/api";
import routes from "virtual:file-routes";

// The server middleware chain (wired via `start.middleware` in
// vite.config.ts): fetch-style functions fronting every request the server
// dispatches — page renders, server function calls, and API routes alike.
// createAPIHandler serves the GET/POST/... exports of route modules
// (see src/routes/uzg/[file_name].ts) and passes everything else down.
export default [createAPIHandler(routes)];
