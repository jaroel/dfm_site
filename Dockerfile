FROM oven/bun:1 AS deps
WORKDIR /app/
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --omit=peer --omit=optional

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
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/server.bun.ts /app/server.bun.ts
COPY --from=builder /app/dist /app/dist
COPY --from=deps /app/node_modules /app/node_modules
ENV NODE_ENV=production
USER nonroot:nonroot
ENTRYPOINT ["/usr/local/bin/bun"]
CMD ["run", "/app/server.bun.ts"]
