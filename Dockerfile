# builder
FROM rustlang/rust:nightly-bookworm-slim as builder
RUN apt update && apt-get install -y curl libgtk-3-dev libssl-dev librsvg2-dev
RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
RUN rustup target add wasm32-unknown-unknown
RUN mkdir -p /app
WORKDIR /app
RUN cargo binstall cargo-leptos -y
COPY . .
RUN cargo leptos build --release -vv

# runner
FROM rustlang/rust:nightly-bookworm-slim as runner
RUN apt update && apt install -y libgtk-3-bin libssl3 librsvg2-bin
COPY --from=builder /app/target/release/server /app/
COPY --from=builder /app/target/site /app/site
COPY --from=builder /app/Cargo.toml /app/
WORKDIR /app
ENV RUST_LOG="info"
ENV APP_ENVIRONMENT="production"
ENV LEPTOS_SITE_ADDR="0.0.0.0:8080"
ENV LEPTOS_SITE_ROOT="site"
EXPOSE 8080
CMD ["/app/server"]
