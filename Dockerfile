FROM oven/bun:1 AS builder
WORKDIR /app/
COPY . /app/
RUN bun install --frozen-lockfile
RUN bun run lint
ENV NODE_ENV=production
RUN bun run build
# typecheck after build: server.bun.ts imports dist/server/server.js
RUN bun run typecheck
# Bundle the Bun server so the runtime image needs no node_modules.
RUN bun build server.bun.ts --target=bun --outfile=/app/server.bundle.js

FROM gcr.io/distroless/cc-debian13
WORKDIR /app/
COPY --from=builder /usr/local/bin/bun /usr/local/bin/bun
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/server.bundle.js /app/
COPY --from=builder /app/dist /app/dist
ENV NODE_ENV=production
USER nonroot:nonroot
ENTRYPOINT ["/usr/local/bin/bun"]
CMD ["run", "/app/server.bundle.js"]
