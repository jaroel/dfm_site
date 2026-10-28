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

Server-only, read at runtime by `src/ftp.ts`:

| Variable | Purpose |
|---|---|
| `FTP_HOST` | recordings FTP host |
| `FTP_USER` | FTP user |
| `FTP_PASSWORD` | FTP password |
| `PORT` | HTTP port for `server.bun.ts` (default 3000) |

Bun loads `.env` automatically; Docker needs them passed with `-e`.

## Checks

```bash
bun run test
bun run lint
bun run typecheck
```
