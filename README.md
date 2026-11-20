# Dinxper FM site

Solid 2 app in start mode (`@solidjs/vite-plugin`), streaming SSR, prerendered
home page, Bun server.

Bun only. Do not use npm or pnpm. For the agent-facing map, see `AGENTS.md`.

## Developing

```bash
bun install
bun run dev
```

## Layout

| Path | Purpose |
|---|---|
| `src/App.tsx` | Root layout, metadata, font preload, background and nav |
| `src/router.ts` | Router wired to the generated file routes |
| `src/routes/` | File-based pages and the audio-stream API |
| `src/components/` | Shared Player element and playback Controls |
| `src/ftp.ts` | Raw FTP listing and download (server-only) |
| `src/uzg.ts` | Server function: cached recording listing |
| `src/recordings.ts` | Recording filename parsing, formatting, grouping (client-safe) |
| `src/groupby.ts` | `Map.groupBy` helper with a fallback for older browsers |
| `src/middleware.ts` | Wires the filesystem-routing API handler |
| `src/assets/` | Images, sponsor logos, favicon |
| `prerender.ts` | Renders `/` to `dist/client/index.html` after the build |
| `server.bun.ts` | Bun production server for `dist/` |
| `Dockerfile` | Bundles the server; runtime needs no `node_modules` |
| `build.sh`, `push.sh`, `deploy.sh` | Build, load, and restart the container |

Tests live next to the code as `*.test.ts` / `*.test.tsx`.

| URL | File | Notes |
|---|---|---|
| `/` | `src/routes/(home).tsx` | Prerendered to static HTML |
| `/uzg/` | `src/routes/uzg/(uzg).tsx` | Recording listing, streamed SSR |
| `/uzg/:file_name` | `src/routes/uzg/[file_name].ts` | Audio stream, supports range requests |
| `/*404` | `src/routes/[...404].tsx` | Not found |

`file-routes.d.ts` is generated; do not edit it. Data flow, build/runtime
contract, image pipeline, testing, and gotchas are in `AGENTS.md`.

## Building

```bash
bun run build   # vite build + prerender -> dist/client + dist/server
bun run start   # bun server.bun.ts (uses the built dist/)
bun run preview # vite preview of the build
```

`bun run build` writes `dist/client/index.html` for `/`; the server serves that
file directly and sends every other request to the SSR handler.

## Formatting

```bash
bun run format       # oxfmt
bun run format:check # fail if files need formatting
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
