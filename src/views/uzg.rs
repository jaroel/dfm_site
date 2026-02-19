use dioxus::prelude::*;

#[cfg(feature = "server")]
use suppaftp::tokio::AsyncFtpStream;
#[cfg(feature = "server")]
use chrono::{Timelike, TimeZone, Utc};
#[cfg(feature = "server")]
use chrono_tz::Europe::Amsterdam;

use crate::components::player::Player;
use crate::components::recording::Recording;
use crate::components::controls::Controls;

const LOGO: Asset = asset!(
    "/assets/logodinxperfm.png",
    ImageAssetOptions::new()
        .with_size(ImageSize::Manual {
            width: 128,
            height: 128,
        })
        .with_preload(true)
);

#[server]
pub async fn fetch_uzg_entries() -> Result<Vec<Recording>, ServerFnError> {
    let mut ftp_stream = AsyncFtpStream::connect("dinxperfm.freeddns.org:21").await.or_http_error(StatusCode::INTERNAL_SERVER_ERROR, "Woopsie!")?;
    ftp_stream.login("UZG", "4862KpZ2").await.or_http_error(StatusCode::INTERNAL_SERVER_ERROR, "Woopsie!")?;
    let items = ftp_stream.nlst(None).await.or_http_error(StatusCode::INTERNAL_SERVER_ERROR, "Woopsie!")?;
    let _ = ftp_stream.quit().await;
    let dt = Amsterdam.from_utc_datetime(&Utc::now().naive_utc());
    let now_key = dt.with_minute(0).unwrap().timestamp() + 3600;
    let mut names = items
        .iter()
        .filter(|filename| filename.ends_with(".mp3"))
        .map(Recording::from)
        .filter(|recording| recording.key <= now_key)
        .collect::<Vec<Recording>>();
    names.sort_by_key(|k| k.key);
    names.reverse();
    Ok(names)
}

#[component]
fn UzgListing(items: Vec<Recording>) -> Element {
    rsx! {
        Player {}
        {
            items
                .chunk_by(|a, b| a.year == b.year)
                .map(|by_year| {
                    rsx! {
                        h2 { class: "text-xl text-gray-800", "{by_year[0].year}" }
                        div { class: "mt-0.5 mb-6 ml-4",
                            {
                                by_year
                                    .chunk_by(|a, b| a.month == b.month)
                                    .map(|by_month| {
                                        rsx! {
                                            h3 { class: "text-lg text-gray-800", {by_month[0].month_long_c()} }
                                            ol { class: "mt-0.5 mb-6 ml-4",
                                                {
                                                    by_month
                                                        .chunk_by(|a, b| a.day == b.day)
                                                        .map(|by_day| {
                                                            rsx! {
                                                                li {
                                                                    div { class: "flex items-center pt-3 flex-start",
                                                                        div { class: "mr-3 -ml-1 w-2 h-2 bg-gray-400 rounded-full" }
                                                                        p { class: "text-gray-800 text-l", {by_day[0].listing_title()} }
                                                                    }
                                                                    div { class: "flex flex-wrap gap-4 mt-0.5 ml-4",
                                                                        {
                                                                            by_day
                                                                                .iter()
                                                                                .map(|recording| {
                                                                                    rsx! {
                                                                                        div { class: "flex-row text-center",
                                                                                            Controls {
                                                                                                title: recording.title(),
                                                                                                label: recording.label(),
                                                                                                stream_src: recording.into(),
                                                                                            }
                                                                                            a { class: "text-sm text-gray-800 underline", href: "{recording.src}", "download" }
                                                                                        }
                                                                                    }
                                                                                })
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        })
                                                }
                                            }
                                        }
                                    })
                            }
                        }
                    }
                })
        }
    }
}


#[component]
pub fn UitzendingGemist() -> Element {
    let entries = use_resource(move || async move { fetch_uzg_entries().await });

    rsx! {
        div { class: "flex justify-evenly",
            div { class: "flex flex-auto items-center",
                div { class: "my-8 mx-12",
                    a { href: "/",
                        img {
                            src: LOGO,
                            alt: "DinxperFM logo",
                            class: "mx-auto",
                        }
                    }
                    p { class: "mt-4 text-center", "Het swingende geluid van Dinxperlo!" }
                }
                h1 { class: "text-4xl font-bold text-gray-100 sm:text-5xl lg:text-6xl",
                    "Uitzending gemist"
                }
            }
        }
        div { class: "p-9 text-black bg-gray-100",
            div { class: "px-6 max-w-7xl text-center",
                p { class: "mx-auto mt-5 max-w-5xl text-xl text-gray-500",
                    "Dit zijn opnames van uitzendingen op de Dinxper FM stream. Gebruik
                    de speler om de uitzending terug te luisteren of klik de link om de
                    uitzending op te slaan."
                }
            }
            hr { class: "my-8" }
            if let Some(response) = &*entries.read() {
                match response {
                    Ok(recordings) => rsx! {
                        UzgListing { items: recordings.to_vec() }
                    },
                    Err(err) => rsx! { "Failed to fetch response: {err}" },
                }
            } else {
                "Loading..."
            }
        }
    }
}
