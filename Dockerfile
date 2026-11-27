# Build on the native build platform ($BUILDPLATFORM), ship for the target
# platform ($TARGETPLATFORM). Vite 8's import-analysis wasm needs WASM SIMD,
# which Bun's JSC runtime does not enable under emulated linux/amd64 (OrbStack
# "VirtualApple"), so `vite build` fails there. The build output (JS/CSS/HTML)
# is architecture independent, so only the Bun binary has to match the target.
FROM --platform=$BUILDPLATFORM oven/bun:1 AS builder
WORKDIR /app/
COPY . /app/
RUN bun install --frozen-lockfile
ENV NODE_ENV=production
RUN bun run build
# lint + typecheck after build: server.bun.ts imports dist/server/server.js
RUN bun run lint
RUN bun run typecheck
# Bundle the Bun server so the runtime image needs no node_modules.
RUN bun build server.bun.ts --target=bun --outfile=/app/server.bundle.js

# Target-architecture Bun for the runtime image (FROM defaults to the target
# platform, unlike the builder above).
FROM oven/bun:1 AS bun-runtime

FROM gcr.io/distroless/cc-debian13
WORKDIR /app/
COPY --from=bun-runtime /usr/local/bin/bun /usr/local/bin/bun
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/server.bundle.js /app/
COPY --from=builder /app/dist /app/dist
ENV NODE_ENV=production
USER nonroot:nonroot
ENTRYPOINT ["/usr/local/bin/bun"]
CMD ["run", "/app/server.bundle.js"]
