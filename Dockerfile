FROM oven/bun:1 AS builder
WORKDIR /app/
COPY . /app/
RUN bun install --frozen-lockfile
RUN bun run lint
ENV NODE_ENV=production
RUN bun run build

FROM oven/bun:1
WORKDIR /app/
COPY --from=builder /app/.output /app/
ENV NODE_ENV=production
CMD ["/app/server/index.mjs"]
