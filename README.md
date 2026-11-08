# Dinxper FM site

Solid 2 app in start mode (`@solidjs/vite-plugin`), streaming SSR, bun server.

Bun only. Do not use npm or pnpm. For the agent-facing map, see `AGENTS.md`.

## Developing

```bash
bun install
bun run dev
```

## Layout

| Path | Purpose |
|---|---|
| `src/routes/` | File-based pages and the audio-stream API |
| `src/components/` | Player and playback controls |
| `src/ftp.ts` | FTP listing and stream access (server-only) |
| `src/uzg.ts` | Server function and recording formatting |
| `src/middleware.ts` | Wires the filesystem-routing API handler |
| `server.bun.ts` | Bun production server for `dist/` |
| `Dockerfile` | Bundles the server; runtime needs no `node_modules` |

| URL | File |
|---|---|
| `/` | `src/routes/(home).tsx` |
| `/uzg/` | `src/routes/uzg/(uzg).tsx` |
| `/uzg/:file_name` | `src/routes/uzg/[file_name].ts` |
| `/*404` | `src/routes/[...404].tsx` |

`file-routes.d.ts` is generated; do not edit it. Data flow, build/runtime
contract, image pipeline, and gotchas are in `AGENTS.md`.

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
