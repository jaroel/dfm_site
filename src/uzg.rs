use dioxus::prelude::*;

use crate::dioxus_fullstack::body::Body;
use crate::dioxus_fullstack::extract::Path;
use crate::dioxus_fullstack::response::{Response,IntoResponse};

use suppaftp::{types::FileType, tokio::AsyncFtpStream};
use tokio_util::bytes;
use tokio_util::compat::TokioAsyncReadCompatExt;
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
    fn into_response(self) -> Response {
        (StatusCode::INTERNAL_SERVER_ERROR, String::from("Woopsie!")).into_response()
    }
}

pub async fn stream_ftp_file(
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
