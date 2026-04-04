import { SpanStatusCode, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("error-handler");

export function setupGlobalErrorHandlers() {
  process.on("uncaughtException", (error) => {
    const span = tracer.startSpan("uncaughtException");
    span.setAttribute("error.message", error.message);
    span.setAttribute("error.stack", error.stack || "");
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    span.end();
    console.error("Uncaught Exception:", error);
  });

  process.on("unhandledRejection", (reason) => {
    const span = tracer.startSpan("unhandledRejection");
    span.setAttribute("error.reason", String(reason));
    span.setStatus({ code: SpanStatusCode.ERROR, message: String(reason) });
    span.end();
    console.error("Unhandled Rejection:", reason);
  });
}
