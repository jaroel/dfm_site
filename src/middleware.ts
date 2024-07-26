import { createMiddleware } from "@solidjs/start/middleware";
import { sendProxy, setResponseHeader, setResponseStatus } from "vinxi/http";

const stream_route_prefix = "/++stream++";
const stream_url = "http://dinxperfm.freeddns.org:8082";

export default createMiddleware({
  onRequest: [
    (event) => {
      const request = event.nativeEvent;
      if (request.path.startsWith(stream_route_prefix)) {
        const playback = request.headers.get("X-Playback-Session-Id");
        if (playback) {
          setResponseHeader("X-Playback-Session-Id", playback);
        }
        const range = request.headers.get("Range");
        if (range) {
          setResponseHeader("content-range", range);
          setResponseStatus(206);
        }
        const target_url =
          stream_url + request.path.replace(stream_route_prefix, "");
        return sendProxy(request, target_url);
      }
    },
  ],
});
