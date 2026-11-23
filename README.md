# Dinxper FM site

Server-rendered [Leptos](https://leptos.rs) 0.9 site for Dinxper FM, using
[cargo-leptos](https://github.com/leptos-rs/cargo-leptos) and [Axum](https://github.com/tokio-rs/axum).
Server functions talk to the station's FTP server to list and stream old broadcasts.

## Requirements

- Rust nightly (`rust-toolchain.toml` pins it) with the `wasm32-unknown-unknown` target:
  ```bash
  rustup toolchain install nightly --allow-downgrade
  rustup target add wasm32-unknown-unknown
  ```
- `cargo-leptos` 0.3.x: `cargo install cargo-leptos --locked`
- Tailwind and JS minification are handled by cargo-leptos; no Node toolchain is needed for
  building the site. `bun` is only used for the Playwright tests.

## Development

```bash
cargo leptos watch
```

## Building for production

```bash
cargo build-split
```

`build-split` is a cargo alias for:

```bash
cargo leptos build --release --split --precompress
```

Use it rather than a plain `cargo leptos build --release`: `--split` is not sticky, and without
it the base wasm still imports placeholder split symbols and fails at runtime.

What the build produces:

| Output | Contents |
| --- | --- |
| `target/release/server` | the server binary (release, with hash-files support) |
| `target/release/hash.txt` | filename → hash map the binary reads at runtime |
| `target/site/` | `pkg/` (wasm, js, css, lazy chunks) and `favicon.ico` |
| `target/site/**/*.br` / `*.gz` | precompressed siblings written by `--precompress` |

The wasm is split at `#[lazy]` boundaries, so the home page never downloads the `/uzg` view
(`~484 kB` base, `~162 kB` brotli over the wire). Static assets are served precompressed by
`leptos_axum`; SSR HTML and server-function payloads are compressed at runtime by
`CompressionLayer`.

`app/build.rs` runs as part of this build too: it resizes and hashes the image variants and embeds
them in the server binary (see [Images](#images)), so a single build produces everything needed.

## Deploying

There is no toolchain on the target machine — ship three things, keeping the binary and
`hash.txt` side by side:

```bash
mkdir -p /srv/dfm
cp target/release/server      /srv/dfm/
cp target/release/hash.txt    /srv/dfm/
cp -R target/site             /srv/dfm/site
```

Directory layout:

```text
/srv/dfm/
├── server
├── hash.txt
└── site/
    ├── favicon.ico(+.br/.gz)
    └── pkg/
```

Images need no files on disk: the resized variants are embedded in the server binary and served
from `/assets/img/{hashed-name}.webp`.

Environment variables (`get_configuration` reads these at startup; anything unset falls back to
the values baked in from `Cargo.toml`):

| Variable | Value | Why |
| --- | --- | --- |
| `LEPTOS_SITE_ROOT` | `site` | build default points at `target/site` |
| `LEPTOS_SITE_PKG_DIR` | `pkg` | |
| `LEPTOS_SITE_ADDR` | `0.0.0.0:3000` (or `127.0.0.1:3000` behind a proxy) | |
| `LEPTOS_HASH_FILES` | `true` | **required**; without it the HTML points at unhashed `pkg` names and every asset 404s |
| `LEPTOS_HASH_FILE_NAME` | `hash.txt` | only needed if you rename the file |

Example systemd unit:

```ini
[Unit]
Description=Dinxper FM site
After=network.target

[Service]
WorkingDirectory=/srv/dfm
Environment=LEPTOS_SITE_ROOT=site
Environment=LEPTOS_SITE_PKG_DIR=pkg
Environment=LEPTOS_SITE_ADDR=127.0.0.1:3000
Environment=LEPTOS_HASH_FILES=true
ExecStart=/srv/dfm/server
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

The server shuts down gracefully on `SIGINT`/`SIGTERM`.

### Verifying a deploy

```bash
# page renders
curl -sI http://127.0.0.1:3000/ | head -1

# every asset the HTML references actually exists (hashed names, not bare ones)
curl -s http://127.0.0.1:3000/ \
  | grep -o '/pkg/[^"]*' | sort -u \
  | while read -r u; do printf '%s ' "$u"; curl -s -o /dev/null -w '%{http_code}\n' "http://127.0.0.1:3000$u"; done
```

If those URLs come back without the hash suffix, `LEPTOS_HASH_FILES` is not set (or `hash.txt`
is missing from the binary's directory). `cargo leptos serve` sets it for you; a bare binary
launch does not. If they 404 with a hash suffix, `site/` and `hash.txt` are from different
builds — redeploy both.

Behind nginx/Caddy, pass `Accept-Encoding` through untouched so the precompressed `.br`/`.gz`
files are used, and do not add a second compression layer for `application/wasm`.

Hashed `pkg` and `assets/img` responses are sent with
`Cache-Control: public, max-age=31536000, immutable`; `/assets/*` (non-generated) and
`favicon.ico` get one day. Dynamic responses (HTML, server functions) carry no `Cache-Control`.

## Images

Sources live in `assets/`. `app/build.rs` resizes each one to the widths that are actually
rendered, content-hashes the filename, encodes WebP and writes it to `assets/generated/`
(gitignored), then emits a manifest the app `include!`s as `crate::images` plus an
`include_bytes!` table of every variant. The bytes are compiled into the server binary and served
by a `/assets/img/{file}` route with an immutable cache header, so:

- nothing image-related has to be deployed besides the binary;
- build order relative to cargo-leptos' asset copying cannot break the deploy;
- the binary is ~420 kB larger; the generated directory can be deleted at any time.

Changing a source image rehashes its filename (so caches bust) and regenerates only the variants
that are missing. A fresh clone needs nothing beyond `cargo build-split`.

To add an image, drop the source in `assets/` and add a `Source` entry with its widths in
`app/build.rs`, then reference `crate::images::YOUR_CONST` through `images::responsive_img(...)`
or `hero_img(...)`.

## Testing

End-to-end tests use Playwright from `end2end/`:

```bash
cd end2end && bun install
cd .. && cargo leptos end-to-end      # or: cargo leptos end-to-end --release
```

`npx playwright show-report` inside `end2end/` opens the HTML report.

## Licensing

Released under the Unlicense; see `LICENSE`.
