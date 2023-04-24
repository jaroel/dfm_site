FROM node:20 as builder
WORKDIR /app
COPY . /app
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod && pnpm run build

FROM node:20 as runner
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD node /app/dist/server/entry.mjs
