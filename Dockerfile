FROM node:24 AS builder
WORKDIR /app/
COPY . /app/
ENV NODE_ENV=production
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM gcr.io/distroless/nodejs24-debian12
WORKDIR /app/
COPY --from=builder /app/.output /app/
ENV NODE_ENV=production
ENV NITRO_CLUSTER_WORKERS=2
CMD ["/app/server/index.mjs"]
