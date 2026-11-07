# Dinxper FM site

Solid 2 app in start mode (`@solidjs/vite-plugin`), streaming SSR, bun server.

## Developing

```bash
bun install
cp .env.example .env   # fill in FTP_* credentials
bun run dev
```

## Building

```bash
bun run build   # dist/client + dist/server
bun run start   # bun server.bun.ts
bun run preview # vite preview
```

## Environment

FTP credentials are hardcoded in `src/ftp.ts` (the container gets no env).
Only `PORT` is read from the environment:

| Variable | Purpose |
|---|---|
| `PORT` | HTTP port for `server.bun.ts` (default 3000) |

## Checks

```bash
bun run test
bun run lint
bun run typecheck
```
