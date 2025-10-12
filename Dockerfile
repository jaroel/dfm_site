# FROM node:22 AS builder
FROM oven/bun:1 AS builder
WORKDIR /app/
COPY . /app/
ENV NODE_ENV=production
RUN bun install
RUN bun run test --run
RUN bun run build

FROM oven/bun:1
WORKDIR /app/
COPY --from=builder /app/.output /app/
CMD ["/app/server/index.mjs"]
