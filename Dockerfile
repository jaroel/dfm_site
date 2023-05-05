FROM node:20-buster-slim as builder
WORKDIR /app
COPY . /app
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod && pnpm run build

FROM gcr.io/distroless/nodejs20-debian11 as runner
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["/app/dist/server/entry.mjs"]
