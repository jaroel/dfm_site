FROM oven/bun:1-alpine AS builder
WORKDIR /app/
COPY . /app/
ENV NODE_ENV=production
RUN bun install --frozen-lockfile
RUN bun run build

FROM oven/bun:1-alpine
WORKDIR /app/
COPY --from=builder /app/.output /app/
ENV NODE_ENV=production
CMD ["/app/server/index.mjs"]
