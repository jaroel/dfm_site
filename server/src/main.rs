use app::{shell, App};
use axum::{
    body::{Body, Bytes},
    extract::Path,
    http::{
        header::{ACCEPT_RANGES, CACHE_CONTROL, CONTENT_LENGTH, CONTENT_RANGE, CONTENT_TYPE, RANGE},
        HeaderMap, HeaderValue, StatusCode,
    },
    middleware,
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use leptos::prelude::*;
use leptos_axum::{generate_route_list, LeptosRoutes};
use suppaftp::{types::FileType, tokio::AsyncFtpStream};
use tokio::io::AsyncReadExt;
use tower_http::compression::{predicate::NotForContentType, CompressionLayer};
use tower_http::compression::predicate::Predicate as _;

pub enum AppError {
    FtpError(suppaftp::FtpError),
    BadRequest(&'static str),
}

impl From<suppaftp::FtpError> for AppError {
    fn from(value: suppaftp::FtpError) -> Self {
        AppError::FtpError(value)
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        match self {
            AppError::FtpError(err) => {
                eprintln!("ftp error: {err}");
                (StatusCode::INTERNAL_SERVER_ERROR, "Woopsie!").into_response()
            }
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg).into_response(),
        }
    }
}

#[tokio::main]
async fn main() {
    let conf = get_configuration(None).unwrap();
    let addr = conf.leptos_options.site_addr;
    let leptos_options = conf.leptos_options;
    let routes = generate_route_list(App);

    let app = Router::new()
        .route("/uzg_data/{filename}", get(stream_ftp_file))
        .route("/assets/img/{filename}", get(serve_image))
        .leptos_routes(&leptos_options, routes, {
            let leptos_options = leptos_options.clone();
            move || shell(leptos_options.clone())
        })
        .fallback(leptos_axum::file_and_error_handler(shell))
        // ponytail: wasm is precompressed on disk and audio must stay
        // byte-exact for range requests, so only compress the rest
        .layer(CompressionLayer::new().compress_when(
            NotForContentType::new("audio/")
                .and(NotForContentType::new("video/"))
                .and(NotForContentType::new("application/wasm"))
                .and(NotForContentType::IMAGES),
        ))
        .layer(middleware::from_fn(set_cache_control))
        .with_state(leptos_options);

    println!("listening on http://{addr}");
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

/// `pkg` names are content-hashed by cargo-leptos, so they can be cached forever.
/// Everything else under `/assets` gets a day.
async fn set_cache_control(
    req: axum::extract::Request,
    next: middleware::Next,
) -> Response {
    let path = req.uri().path().to_string();
    let cache = if path.starts_with("/pkg/") || path.starts_with("/assets/img/") {
        Some(HeaderValue::from_static("public, max-age=31536000, immutable"))
    } else if path.starts_with("/assets/") || path == "/favicon.ico" {
        Some(HeaderValue::from_static("public, max-age=86400"))
    } else {
        None
    };
    let mut res = next.run(req).await;
    if let Some(cache) = cache {
        res.headers_mut().insert(CACHE_CONTROL, cache);
    }
    res
}

async fn shutdown_signal() {
    let ctrl_c = async { tokio::signal::ctrl_c().await.ok() };
    #[cfg(unix)]
    let terminate = async {
        if let Ok(mut sig) =
            tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
        {
            sig.recv().await;
        }
    };
    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();
    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}

/// Serves the build-time generated image variants, embedded in this binary.
async fn serve_image(Path(filename): Path<String>) -> Response {
    match app::images::FILES.iter().find(|(name, _)| *name == filename) {
        Some((_, bytes)) => (
            [(CONTENT_TYPE, HeaderValue::from_static("image/webp"))],
            *bytes,
        )
            .into_response(),
        None => StatusCode::NOT_FOUND.into_response(),
    }
}

/// Rejects anything that is not a plain `.mp3` name, so the route cannot be
/// used to list or fetch other files from the ftp directory.
fn valid_filename(name: &str) -> bool {
    !name.starts_with('.')
        && !name.contains(['/', '\\', '\0'])
        && name.to_lowercase().ends_with(".mp3")
}

/// Parses a single `bytes=start-end` range. Returns `(start, end)` inclusive.
fn parse_range(headers: &HeaderMap, total: u64) -> Option<(u64, u64)> {
    let value = headers.get(RANGE)?.to_str().ok()?;
    let spec = value.strip_prefix("bytes=")?;
    let (start, end) = spec.split_once('-')?;
    let (start, end) = match (start.trim(), end.trim()) {
        ("", end) => {
            let len: u64 = end.parse().ok()?;
            (total.checked_sub(len)?, total - 1)
        }
        (start, "") => (start.parse().ok()?, total - 1),
        (start, end) => (start.parse().ok()?, end.parse().ok()?),
    };
    if start > end || end >= total {
        return None;
    }
    Some((start, end))
}

async fn stream_ftp_file(
    Path(filename): Path<String>,
    headers: HeaderMap,
) -> Result<Response, AppError> {
    if !valid_filename(&filename) {
        return Err(AppError::BadRequest("only .mp3 recordings are served here"));
    }

    let mut ftp_stream = AsyncFtpStream::connect("dinxperfm.freeddns.org:21").await?;
    ftp_stream.login("UZG", "4862KpZ2").await?;
    ftp_stream.transfer_type(FileType::Binary).await?;

    // ponytail: SIZE may be unsupported; fall back to an unseekable full stream
    let total = ftp_stream.size(&filename).await.ok().map(|s| s as u64);
    let range = total.and_then(|total| parse_range(&headers, total));
    if let Some((start, _)) = range {
        ftp_stream.resume_transfer(start as usize).await?;
    }
    let data_stream = ftp_stream.retr_as_stream(filename).await?;

    let mut remaining = range.map(|(start, end)| end - start + 1);

    let stream = async_stream::stream! {
        let mut ftp_stream = ftp_stream;
        let mut data_stream = data_stream;
        let mut buf = [0u8; 8192];
        loop {
            if matches!(remaining, Some(0)) {
                break;
            }
            match data_stream.read(&mut buf).await {
                Ok(0) => break,
                Ok(n) => {
                    let n = match remaining {
                        Some(left) => n.min(left as usize),
                        None => n,
                    };
                    if let Some(left) = remaining.as_mut() {
                        *left -= n as u64;
                    }
                    yield Ok::<_, std::io::Error>(Bytes::copy_from_slice(&buf[..n]));
                }
                Err(e) => {
                    eprintln!("stream error: {e}");
                    break;
                }
            }
        }
        // Reads the 226 reply. Must run before any other control-connection command.
        if let Err(e) = data_stream.finish().await {
            eprintln!("transfer finalize error: {e}");
        }
        let _ = ftp_stream.quit().await;
    };

    let mut builder = Response::builder()
        .header(CONTENT_TYPE, "audio/mpeg")
        .header(ACCEPT_RANGES, "bytes");

    if let (Some(total), Some((start, end))) = (total, range) {
        builder = builder
            .status(StatusCode::PARTIAL_CONTENT)
            .header(CONTENT_RANGE, format!("bytes {start}-{end}/{total}"))
            .header(CONTENT_LENGTH, (end - start + 1).to_string());
    }

    builder
        .body(Body::from_stream(stream))
        .map_err(|_| AppError::BadRequest("could not build response"))
}
