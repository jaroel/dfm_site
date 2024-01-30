FROM node:20-bookworm as builder
WORKDIR /app/
COPY . /app/
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:20-bookworm as dependencies
WORKDIR /app/
COPY . /app/
ENV NODE_ENV production
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM node:20-bookworm-slim
USER node
ENV NODE_ENV production
WORKDIR /app/
COPY --from=dependencies /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/server /app/server
EXPOSE 3000
CMD ["node", "/app/server/entry.express"]
