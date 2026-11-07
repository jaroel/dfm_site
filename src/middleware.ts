import type { StartMiddleware } from "@solidjs/vite-plugin";
import { createAPIHandler } from "filesystem-routing/api";
import routes from "virtual:file-routes";

const api = createAPIHandler(routes);

const handleAPI: StartMiddleware = (event, next) => api(event.request, next);

export default [handleAPI];
