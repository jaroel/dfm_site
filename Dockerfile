FROM node:22 AS builder
WORKDIR /app/
COPY . /app/
ENV NODE_ENV=production
RUN npm install -g pnpm && pnpm install
RUN pnpm run build

FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /app/
COPY --from=builder /app/.output /app/
ENV NODE_ENV=production
ENV NITRO_CLUSTER_WORKERS=2
CMD ["/app/server/index.mjs"]
