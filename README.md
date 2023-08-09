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


## Generate binaries for Linux:
i686 on Digital Ocean

Setup:

```bash
brew tap messense/macos-cross-toolchains
#brew install x86_64-unknown-linux-gnu
#rustup target add x86_64-unknown-linux-gnu

brew install i686-unknown-linux-gnu
rustup target add i686-unknown-linux-gnu
```

Build:
```bash
#RUSTC_WRAPPER= LEPTOS_BIN_TARGET_TRIPLE=x86_64-unknown-linux-gnu CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER=x86_64-linux-gnu-gcc cargo leptos build --release
#❯ file target/server/x86_64-unknown-linux-gnu/release/dfm_site
#target/server/x86_64-unknown-linux-gnu/release/dfm_site: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.16, with debug_info, not stripped


RUSTC_WRAPPER= LEPTOS_BIN_TARGET_TRIPLE=i686-unknown-linux-gnu CARGO_TARGET_I686_UNKNOWN_LINUX_GNU_LINKER=i686-unknown-linux-gnu-gcc cargo leptos build --release
```

Artifects:
```bash
❯ file target/server/i686-unknown-linux-gnu/release/dfm_site
target/server/i686-unknown-linux-gnu/release/dfm_site: ELF 32-bit LSB pie executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 3.2.101, with debug_info, not stripped

❯ ls -l target/server/i686-unknown-linux-gnu/release/dfm_site
-rwxr-xr-x@ 1 roel  staff  20297768 Aug  9 00:39 target/server/i686-unknown-linux-gnu/release/dfm_site*

❯ ls -l target/site/pkg/
total 1256
-rw-r--r--@ 1 roel  staff    7437 Aug  9 00:39 dfm_site.css
-rw-r--r--@ 1 roel  staff   45396 Aug  9 00:39 dfm_site.js
-rw-r--r--@ 1 roel  staff  583728 Aug  9 00:39 dfm_site.wasm
```

Deploy:
```bash
scp -C -r target/site jaroel.nl:/home/leptos/
scp -C target/server/i686-unknown-linux-gnu/release/dfm_site jaroel.nl:/home/leptos/
```

Run:
```bash
su leptos
PUBLIC_URL="https://dfmsite6.jaroel.nl" LEPTOS_SITE_ADDR="[2a03:b0c0:0:1010::1b:7001]:3000" LEPTOS_SITE_ROOT=./site ./dfm_site
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

Mount:
```bash
su leptos
curlftpfs -o uid=$(id -u leptos) ftp://ftp.example.com /home/leptos/uzg_data

```

Unmount:
```bash
fusermount -u /home/leptos/uzg_data

```


Sysop:
```ufw
*nat
:PREROUTING ACCEPT [0:0]
-A PREROUTING -p tcp -d 2a03:b0c0:0:1010::1b:7001 --dport 80 -j REDIRECT --to-port 3000
-A PREROUTING -p tcp -d 2a03:b0c0:0:1010::1b:7001 --dport 443 -j REDIRECT --to-port 3000
COMMIT
```
