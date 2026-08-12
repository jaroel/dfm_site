FROM oven/bun:1 AS builder
WORKDIR /app/
COPY . /app/
RUN bun install --frozen-lockfile
RUN bun run lint
ENV NODE_ENV=production
RUN bun run build

FROM gcr.io/distroless/cc-debian13
WORKDIR /app/
COPY --from=builder /usr/local/bin/bun /usr/local/bin/bun
COPY --from=builder /app/.output /app/
ENV NODE_ENV=production
USER nonroot:nonroot
ENTRYPOINT ["/usr/local/bin/bun"]
CMD ["run", "/app/server/index.mjs"]
