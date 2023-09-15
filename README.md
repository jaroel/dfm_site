See https://www-dinxperfm-nl.intersumus.nl/

<picture>
    <source srcset="https://raw.githubusercontent.com/leptos-rs/leptos/main/docs/logos/Leptos_logo_Solid_White.svg" media="(prefers-color-scheme: dark)">
    <img src="https://raw.githubusercontent.com/leptos-rs/leptos/main/docs/logos/Leptos_logo_RGB.svg" alt="Leptos Logo">
</picture>

# Leptos Axum Starter Template

This is a template for use with the [Leptos](https://github.com/leptos-rs/leptos) web framework and the [cargo-leptos](https://github.com/akesson/cargo-leptos) tool using [Axum](https://github.com/tokio-rs/axum).

## Creating your template repo

If you don't have `cargo-leptos` installed you can install it with

```bash
cargo install cargo-leptos
```

Then run

```bash
cargo leptos new --git leptos-rs/start-axum
```

to generate a new project template.

```bash
cd {projectname}
```

to go to your newly created project.
Feel free to explore the project structure, but the best place to start with your application code is in `src/app.rs`.
Addtionally, Cargo.toml may need updating as new versions of the dependencies are released, especially if things are not working after a `cargo update`.

## Running your project

```bash
cargo leptos watch
```

With tracebacks:

```bash
RUST_BACKTRACE=full RUSTFLAGS="-Z macro-backtrace" cargo leptos watch
```

## Installing Additional Tools

By default, `cargo-leptos` uses `nightly` Rust, `cargo-generate`, and `sass`. If you run into any trouble, you may need to install one or more of these tools.

1. `rustup toolchain install nightly --allow-downgrade` - make sure you have Rust nightly
2. `rustup target add wasm32-unknown-unknown` - add the ability to compile Rust to WebAssembly
3. `cargo install cargo-generate` - install `cargo-generate` binary (should be installed automatically in future)
4. `npm install -g sass` - install `dart-sass` (should be optional in future

## Compiling for Release

```bash
cargo leptos build --release
```

Will generate your server binary in target/server/release and your site package in target/site

## Testing Your Project

```bash
cargo leptos end-to-end
```

```bash
cargo leptos end-to-end --release
```

Cargo-leptos uses Playwright as the end-to-end test tool.
Tests are located in end2end/tests directory.

## Executing a Server on a Remote Machine Without the Toolchain

After running a `cargo leptos build --release` the minimum files needed are:

1. The server binary located in `target/server/release`
2. The `site` directory and all files within located in `target/site`

Copy these files to your remote server. The directory structure should be:

```text
dfm_site
site/
```

Set the following environment variables (updating for your project as needed):

```text
LEPTOS_OUTPUT_NAME="dfm_site"
LEPTOS_SITE_ROOT="site"
LEPTOS_SITE_PKG_DIR="pkg"
LEPTOS_SITE_ADDR="127.0.0.1:3000"
LEPTOS_RELOAD_PORT="3001"
```

Finally, run the server binary.

## Development

During development, in two terminals:

```bash
./tailwindcss -i ./style/dfm.in.css -o ./style/dfm.out.css --watch
cargo leptos watch
```

## Build binaries:

```bash
brew tap messense/macos-cross-toolchains
```

# Build aarch64-unknown-linux-gnu:

```bash
brew install aarch64-unknown-linux-gnu
rustup target add aarch64-unknown-linux-gnu
CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=aarch64-unknown-linux-gnu-gcc CARGO_BUILD_TARGET=aarch64-unknown-linux-gnu LEPTOS_BIN_TARGET_TRIPLE=aarch64-unknown-linux-gnu cargo leptos build  --release
```

# Build x86_64-unknown-linux-musl

```bash
brew install x86_64-unknown-linux-musl
rustup target add x86_64-unknown-linux-musl
RUSTFLAGS="-C target-feature=-crt-static" CARGO_TARGET_X86_64_UNKNOWN_LINUX_MUSL_LINKER=x86_64-linux-musl-gcc TARGET=x86_64-unknown-linux-musl LEPTOS_BIN_TARGET_TRIPLE=x86_64-unknown-linux-musl cargo leptos build  --release
```

# Build i686-unknown-linux-musl

```bash
brew install i686-unknown-linux-musl
rustup target add i686-unknown-linux-musl
CARGO_TARGET_I686_UNKNOWN_LINUX_MUSL_LINKER=i686-linux-musl-gcc TARGET=i686-unknown-linux-musl LEPTOS_BIN_TARGET_TRIPLE=i686-unknown-linux-musl cargo leptos build  --release
```

# Artifacts:

```bash
❯ file target/server/i686-unknown-linux-musl/release/dfm_site
target/server/i686-unknown-linux-musl/release/dfm_site: ELF 32-bit LSB pie executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 3.2.101, with debug_info, not stripped

> ls -l target/server/i686-unknown-linux-musl/release/dfm_site
-rwxr-xr-x@ 1 roel  staff  21400224 Aug 20 17:51 target/server/i686-unknown-linux-musl/release/dfm_site*

❯ ls -l target/site/pkg/
total 1256
-rw-r--r--@ 1 roel  staff    7437 Aug 20 17:50 dfm_site.css
-rw-r--r--@ 1 roel  staff   45396 Aug 20 17:50 dfm_site.js
-rw-r--r--@ 1 roel  staff  584777 Aug 20 17:50 dfm_site.wasm
```

# Deploy:

1. On server:

```bash
systemctl stop --user leptos-dfmsite
```

2. Locally:

```bash
scp -C -r target/site jaroel.nl:/home/leptos/
scp -C target/server/i686-unknown-linux-musl/release/dfm_site jaroel.nl:/home/leptos/
```

3. On server:

```bash
sudo chown -R leptos:leptos /home/leptos
systemctl start --user leptos-dfmsite
```

# Run:

```bash
su leptos
PUBLIC_URL="http://dfmsite6.jaroel.nl" LEPTOS_SITE_ADDR="[2a03:b0c0:0:1010::1b:7001]:3000" HTTP_ADDR="[2a03:b0c0:0:1010::1b:7001]:3002" LEPTOS_SITE_ROOT=./site ./dfm_site
```

## Certbot

On server:

```bash
mkdir -p /home/leptos/.well-known/acme-challenge
```

## FTP Mount

The UZG listing data...
Setup:

```bash
sudo apt-get install curlftpfs
```

Add to ~leptos/.netrc

```text
machine ftp.example.com login your-user-name password your-password
```

```bash
sudo curlftpfs -o ro,intr,enable_epsv,auto_unmount,kernel_cache,noatime,allow_other,connect_timeout=3 ftp://dinxperfm.freeddns.org/ /home/leptos/uzg_data
```

```bash
sudo ufw route allow proto tcp from any to 2a03:b0c0:0:1010::1b:7001 port 80 to 2a03:b0c0:0:1010::1b:7001 port 3002
sudo ufw route allow proto tcp from any to 2a03:b0c0:0:1010::1b:7001 port 443 to 2a03:b0c0:0:1010::1b:7001 port 3000
```

add to /etc/ufw/before6.rules

```ufw
*nat
:PREROUTING ACCEPT [0:0]
-A PREROUTING -p tcp -d 2a03:b0c0:0:1010::1b:7001 --dport 80 -j REDIRECT --to-port 3002
-A PREROUTING -p tcp -d 2a03:b0c0:0:1010::1b:7001 --dport 443 -j REDIRECT --to-port 3000
COMMIT
```

In hoster controlpanel close firewall. Using ufw deny 3000 will kill the app.

## Running

/etc/systemd/user/leptos-dfmsite.service

```systemd
[Unit]
Description=Leptos DFMSite Service
After=network.target

[Service]
Type=simple
User=leptos
WorkingDirectory=/home/leptos
Environment="PUBLIC_URL=http://dfmsite6.jaroel.nl"
Environment="LEPTOS_SITE_ADDR=[2a03:b0c0:0:1010::1b:7001]:3000"
Environment="HTTP_ADDR=[2a03:b0c0:0:1010::1b:7001]:3002"
Environment="LEPTOS_SITE_ROOT=./site"
ExecStart=/home/leptos/dfm_site

[Install]
WantedBy=default.target
```

# Using Docker:

```bash
docker run -p 3000 -e LEPTOS_SITE_ADDR=0.0.0.0:3000 --name=dfmsite --rm -d --entrypoint=/app/dfm_site dfmsite
```
