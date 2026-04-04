# SolidStart

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

## Developing

Once you've created a project and installed dependencies with `bun install``, start a development server:

```bash
bun run dev
```

## Building

```bash
bun run build
```


## Run with OTEL

```bash
bun run --require ./src/tracing.ts .output/server/index.mjs
```
