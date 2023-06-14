FROM node:lts-slim as builder
WORKDIR /app
COPY . /app/
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run qwik build

FROM node:lts-slim as runner
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/server /app/server
COPY --from=builder /app/node_modules /app/node_modules
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["/app/server/entry.express.js"]
