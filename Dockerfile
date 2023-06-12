FROM node:20-buster-slim as builder
WORKDIR /app
COPY .eslintignore .eslintrc.cjs .prettierignore package.json pnpm-lock.yaml postcss.config.cjs tailwind.config.js tsconfig.json vite.config.ts globals.d.ts /app/
COPY adapters /app/adapters
COPY public /app/public
COPY src /app/src
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
