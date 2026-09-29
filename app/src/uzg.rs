use crate::server_fn::codec::Postcard;
use crate::{
    controls::Controls,
    player::{Player, PlayerState},
};
use leptos::prelude::*;
use leptos_meta::Title;
use leptos_router::{components::A, lazy_route, LazyRoute};
use serde::{Deserialize, Serialize};

#[cfg(feature = "ssr")]
fn parse_recording(file_name: &str) -> jiff::civil::DateTime {
    let stem = file_name.trim_end_matches(".mp3");
    let parts: Vec<&str> = stem.split('-').collect();
    let day: i8 = parts[0].parse().unwrap();
    let month: i8 = parts[1].parse().unwrap();
    let year: i16 = parts[2].parse().unwrap();
    let hour: i8 = parts[3].parse().unwrap();
    jiff::civil::date(year, month, day).at(hour, 0, 0, 0)
}

#[cfg(feature = "ssr")]
impl From<&String> for Recording {
    fn from(file_name: &String) -> Self {
        let dt = parse_recording(file_name);
        let weekday = dt.weekday().to_monday_one_offset();
        let public_url = std::env::var("PUBLIC_URL").unwrap_or("http://localhost:3000".to_string());

        let key = dt
            .to_zoned(jiff::tz::TimeZone::UTC)
            .unwrap()
            .timestamp()
            .as_second();

        Recording {
            day: dt.day() as u8,
            month: dt.month() as u8,
            year: dt.year() as i32,
            weekday: weekday as u8,
            hour: dt.hour() as u8,
            src: format!("{}/uzg_data/{}", public_url, file_name),
            key,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Recording {
    day: u8,
    month: u8,
    year: i32,
    weekday: u8,
    hour: u8,
    src: String,
    key: i64,
}

impl Recording {
    fn label(&self) -> String {
        format!("{}:00", self.hour)
    }
    fn title(&self) -> String {
        format!(
            "Uitzending Dinxper FM van {} {} {} {} om {} uur",
            self.weekday_long_c().to_lowercase(),
            self.day,
            self.month_long_c().to_lowercase(),
            self.year,
            self.hour
        )
    }

    fn weekday_long_c(&self) -> String {
        match self.weekday {
            1 => "Maandag",
            2 => "Dinsdag",
            3 => "Woensdag",
            4 => "Donderdag",
            5 => "Vrijdag",
            6 => "Zaterdag",
            7 => "Zondag",
            _ => "",
        }
        .to_string()
    }

    fn month_long_c(&self) -> String {
        match self.month {
            1 => "Januari",
            2 => "Februari",
            3 => "Maart",
            4 => "April",
            5 => "Mei",
            6 => "Juni",
            7 => "Juli",
            8 => "Augustus",
            9 => "September",
            10 => "Oktober",
            11 => "November",
            12 => "December",
            _ => "",
        }
        .to_string()
    }

    fn listing_title(&self) -> String {
        format!(
            "{} {} {}",
            self.weekday_long_c(),
            self.day,
            self.month_long_c().to_lowercase()
        )
    }
}

#[cfg(feature = "ssr")]
static CACHE: std::sync::LazyLock<std::sync::RwLock<Option<(std::time::Instant, Vec<Recording>)>>> =
    std::sync::LazyLock::new(|| std::sync::RwLock::new(None));

#[cfg(feature = "ssr")]
use jiff::{tz::TimeZone, ToSpan, Unit, ZonedRound};

#[server(input = Postcard, output = Postcard)]
#[lazy]
pub async fn fetch_uzg_entries() -> Result<Vec<Recording>, ServerFnError> {
    const CACHE_TTL_SECS: u64 = 3600;

    let cached = {
        let cache_read = CACHE.read().unwrap();
        cache_read.clone()
    };

    if let Some((instant, data)) = cached {
        if instant.elapsed().as_secs() < CACHE_TTL_SECS {
            return Ok(data);
        }
    }

    let mut ftp_stream =
        suppaftp::tokio::AsyncFtpStream::connect("dinxperfm.freeddns.org:21").await?;
    ftp_stream.login("UZG", "4862KpZ2").await?;
    let items = ftp_stream.nlst(None).await?;
    let _ = ftp_stream.quit().await;

    #[cfg(feature = "ssr")]
    let now_key = {
        let tz = TimeZone::get("Europe/Amsterdam").unwrap();
        let zdt = jiff::Timestamp::now().to_zoned(tz);
        let hour = zdt.round(ZonedRound::new().smallest(Unit::Hour)).unwrap();
        hour.checked_add(1.hours()).unwrap().timestamp().as_second()
    };

    #[cfg(not(feature = "ssr"))]
    let now_key = i64::MAX;

    let mut names: Vec<Recording> = items
        .iter()
        .filter(|filename| filename.ends_with(".mp3"))
        .map(Recording::from)
        .filter(|recording| recording.key <= now_key)
        .collect();
    names.sort_by_key(|k| k.key);
    names.reverse();

    {
        let mut cache_write = CACHE.write().unwrap();
        *cache_write = Some((std::time::Instant::now(), names.clone()));
    }

    Ok(names)
}

pub struct UitzendingGemist {
    data: Resource<Result<Vec<Recording>, ServerFnError>>,
}

#[lazy_route]
impl LazyRoute for UitzendingGemist {
    fn data() -> Self {
        Self {
            data: Resource::new(|| (), |_| async move { fetch_uzg_entries().await }),
        }
    }

    fn view(this: Self) -> AnyView {
        view! {
            <UitzendingGemistView entries={this.data} />
        }
        .into_any()
    }
}

#[component]
pub(crate) fn UitzendingGemistView(
    entries: Resource<Result<Vec<Recording>, ServerFnError>>,
) -> AnyView {
    // let entries = Resource::new(|| (), |_| async move { fetch_uzg_entries().await });
    view! {
        <Title text="Dinxper FM - het gemiste geluid van Dinxperlo" />
        <div class="flex justify-evenly">
            <div class="flex flex-auto items-center">
                <div class="my-8 mx-12">
                    <A href="/">
                        <img
                            src="/assets/logodinxperfm.png"
                            alt="DinxperFM logo"
                            width=128
                            height=128
                            // quality=100
                            // lazy=false
                            // priority=true
                            class="mx-auto"
                        />
                    </A>
                    <p class="mt-4 text-center">"Het swingende geluid van Dinxperlo!"</p>
                </div>
                <h1 class="text-4xl font-bold text-gray-100 sm:text-5xl lg:text-6xl">
                    "Uitzending gemist"
                </h1>
            </div>
        </div>
        <div class="p-9 text-black bg-gray-100">
            <div class="px-6 max-w-7xl text-center">
                <p class="mx-auto mt-5 max-w-5xl text-xl text-gray-500">
                    "Dit zijn opnames van uitzendingen op de Dinxper FM stream. Gebruik
                    de speler om de uitzending terug te luisteren of klik de link om de
                    uitzending op te slaan."
                </p>
            </div>
            <hr class="my-8" />
            <Transition>
                {move || match entries.get() {
                    None => view! { "" }.into_any(),
                    Some(Err(err)) => {
                        view! { <p>{format!("Fout bij ophalen opnamen: {}", err)}</p> }.into_any()
                    }
                    Some(Ok(items)) => {
                        if items.is_empty() {
                            view! { <p>"Er zijn geen opnamen beschikbaar."</p> }.into_any()
                        } else {
                            view! { <UzgListing items=items /> }.into_any()
                        }
                    }
                }}
            </Transition>
        </div>
    }
    .into_any()
}

#[component]
fn UzgListing(items: Vec<Recording>) -> AnyView {
    let src = RwSignal::new("".into());
    let player_state = RwSignal::new(PlayerState::Stopped);
    view! {
        <Player audio_src=src player_state=player_state />
        {items
            .chunk_by(|a, b| a.year == b.year)
            .map(|by_year| {
                view! {
                    <h2 class="text-xl text-gray-800">{by_year[0].year}</h2>
                    <div class="mt-0.5 mb-6 ml-4">
                        {by_year
                            .chunk_by(|a, b| a.month == b.month)
                            .map(|by_month| {
                                view! {
                                    <h3 class="text-lg text-gray-800">
                                        {by_month[0].month_long_c()}
                                    </h3>
                                    <ol class="mt-0.5 mb-6 ml-4">
                                        {by_month
                                            .chunk_by(|a, b| a.day == b.day)
                                            .map(|by_day| {
                                                view! {
                                                    <li>
                                                        <div class="flex items-center pt-3 flex-start">
                                                            <div class="mr-3 -ml-1 w-2 h-2 bg-gray-400 rounded-full"></div>
                                                            <p class="text-gray-800 text-l">
                                                                {by_day[0].listing_title()}
                                                            </p>
                                                        </div>
                                                        <div class="flex flex-wrap gap-4 mt-0.5 ml-4">
                                                            {by_day
                                                                .iter()
                                                                .map(|recording| {
                                                                    view! {
                                                                        <div class="flex-row text-center">
                                                                            <Controls
                                                                                title=recording.title()
                                                                                label=recording.label()
                                                                                stream_src=recording.src.clone()
                                                                                audio_src=src
                                                                                player_state=player_state
                                                                            />
                                                                            <a
                                                                                class="text-sm text-gray-800 underline"
                                                                                href=recording.src.clone()
                                                                            >
                                                                                download
                                                                            </a>
                                                                        </div>
                                                                    }.into_any()
                                                                })
                                                                .collect_view()}
                                                        </div>
                                                    </li>
                                                }
                                            })
                                            .collect_view()}
                                    </ol>
                                }
                            })
                            .collect_view()}
                    </div>
                }
            })
            .collect_view()}
    }.into_any()
}
