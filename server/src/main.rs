use std::str::FromStr;

use app::{shell, App};
use axum::{body::Body, extract::Path, http::StatusCode, response::IntoResponse, routing::get, Router};
use leptos::prelude::*;
use leptos_axum::{generate_route_list, LeptosRoutes};
use leptos::logging::log;
use suppaftp::{types::FileType, tokio::AsyncFtpStream};
use tokio_util::{bytes, };
use tokio_util::compat::TokioAsyncReadCompatExt;
// use tokio::io::AsyncReadExt;
use futures_util::io::AsyncReadExt;

pub enum AppError {
    FtpError(suppaftp::FtpError)
}

impl From<suppaftp::FtpError> for AppError {
    fn from(value: suppaftp::FtpError) -> Self {
        AppError::FtpError(value)
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        (StatusCode::INTERNAL_SERVER_ERROR, String::from_str("Woopsie!")).into_response()
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
        .leptos_routes(&leptos_options, routes, {
            let leptos_options = leptos_options.clone();
            move || shell(leptos_options.clone())
        })
        .fallback(leptos_axum::file_and_error_handler(shell))
        .with_state(leptos_options);

    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    log!("listening on http://{}", &addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}


async fn stream_ftp_file(
    Path(filename): Path<String>,
) -> Result<Body, AppError> {
    let mut ftp_stream = AsyncFtpStream::connect("dinxperfm.freeddns.org:21").await?;
    ftp_stream.login("UZG", "4862KpZ2").await?;
    ftp_stream.transfer_type(FileType::Binary).await?;
    let data_stream = ftp_stream.retr_as_stream(filename).await?;

    let stream = async_stream::stream! {
        let mut ftp_stream = ftp_stream;
        let mut data_stream_compat = data_stream.compat();
        let mut buf = [0u8; 8192]; // 8KB buffer
        loop {
            match data_stream_compat.read(&mut buf).await {
                Ok(0) => break, // EOF
                Ok(n) => yield Ok::<_, std::io::Error>(bytes::Bytes::copy_from_slice(&buf[..n])),
                Err(e) => {
                    eprintln!("Stream error: {}", e);
                    break;
                }
            }
        }
        let _ = ftp_stream.quit().await;
    };

    Ok(Body::from_stream(stream))
}
