use chrono::{Datelike, NaiveDateTime, Timelike};
use leptos::prelude::*;
// use leptos_image_optimizer::Image;
use leptos_meta::Title;
use leptos_router::{LazyRoute, components::A, lazy_route};
use serde::{Deserialize, Serialize};
use crate::{controls::Controls, player::{Player, PlayerState}};

impl From<&String> for Recording {
  fn from(file_name: &String) -> Self {
    // Examples: '10-07-2023-22-00.mp3', '19-06-2023-21-00.mp3'
    let datetime = NaiveDateTime::parse_from_str(file_name, "%d-%m-%Y-%H-%M.mp3").expect(file_name);
    let date = datetime.date();
    let public_url = std::env::var("PUBLIC_URL").unwrap_or("http://localhost:3000".to_string());

    Recording {
      day: date.day(),
      month: date.month(),
      year: date.year(),
      weekday: date.weekday().number_from_monday(),
      hour: datetime.time().hour(),
      src: format!("{}/uzg_data/{}", public_url, file_name),
      key: datetime.and_utc().timestamp(),
    }
  }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Recording {
    day: u32,
    month: u32,
    year: i32,
    weekday: u32,
    hour: u32,
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

#[server]
#[lazy]
pub async fn fetch_uzg_entries() -> Result<Vec<Recording>, ServerFnError> {
  use suppaftp::tokio::AsyncFtpStream;
  use chrono::{TimeZone, Utc};
  use chrono_tz::Europe::Amsterdam;
  let mut ftp_stream = AsyncFtpStream::connect("dinxperfm.freeddns.org:21").await?;
  ftp_stream.login("UZG", "4862KpZ2").await?;
  let items = ftp_stream.nlst(None).await?;
  let _ = ftp_stream.quit().await;

  let dt = Amsterdam.from_utc_datetime(&Utc::now().naive_utc());
  let now_key = dt.with_minute(0).unwrap().timestamp() + 3600;

  let mut names = items
    .iter()
    // .filter(|filename| filename.ends_with("04-08-2023-11-00.mp3"))
    .filter(|filename| filename.ends_with(".mp3"))
    .map(Recording::from)
    .filter(|recording| recording.key <= now_key)
    .collect::<Vec<Recording>>();
  names.sort_by_key(|k| k.key);
  names.reverse();
  Ok(names)
}


pub struct UitzendingGemist {
    data: Resource<Result<Vec<Recording>, ServerFnError>>
}

#[lazy_route]
impl LazyRoute for UitzendingGemist {
    fn data() -> Self {
        Self {
            data: Resource::new(|| (), |_| async move { fetch_uzg_entries().await })
        }
    }

    fn view(this: Self) -> AnyView {
        
        view! {
            <UitzendingGemistView entries={this.data} />
        }.into_any()

    }
}

#[component]
pub(crate) fn UitzendingGemistView(entries: Resource<Result<Vec<Recording>, ServerFnError>>) -> AnyView {
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
    }.into_any()
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
                                                                    }
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
