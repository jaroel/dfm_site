FROM node:20-buster-slim as builder
WORKDIR /app
COPY .eslintignore /app/
COPY .eslintrc.cjs /app/
COPY .prettierignore /app/
COPY adapters /app/adapters
COPY package.json /app/
COPY pnpm-lock.yaml /app/
COPY postcss.config.js /app/
COPY public /app/public
COPY src /app/src
COPY tailwind.config.js /app/
COPY tsconfig.json /app/
COPY vite.config.ts /app/
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run qwik build

FROM gcr.io/distroless/nodejs20-debian11 as runner
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/server /app/server
COPY --from=builder /app/node_modules /app/node_modules
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["/app/server/entry.express.js"]
