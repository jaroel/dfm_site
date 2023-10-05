use chrono::{Datelike, NaiveDateTime, Timelike};
use leptos::*;
// use leptos_image::Image;
use leptos_router::*;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

use crate::{
  controls::Controls,
  player::{Player, PlayerState},
};

impl From<PathBuf> for Recording {
  fn from(path: PathBuf) -> Self {
    let file_name = path.file_name().unwrap().to_str().unwrap();
    Recording::from(file_name)
  }
}

impl From<&str> for Recording {
  fn from(file_name: &str) -> Self {
    // Examples: '10-07-2023-22-00.mp3', '19-06-2023-21-00.mp3'
    let datetime = NaiveDateTime::parse_from_str(file_name, "%d-%m-%Y-%H-%M.mp3").expect(file_name);
    let date = datetime.date();
    let public_url = std::env::var("PUBLIC_URL").unwrap_or("https://dfmsite.test:3000".to_string());

    Recording {
      day: date.day(),
      month: date.month(),
      year: date.year(),
      weekday: date.weekday().number_from_monday(),
      hour: datetime.time().hour(),
      src: format!("{}/uzg_data/{}", public_url, file_name),
      key: datetime.timestamp(),
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

#[server(FetchUZGEntries, "/api")]
pub async fn fetch_uzg_entries() -> Result<Vec<Recording>, ServerFnError> {
  let paths = std::fs::read_dir("./uzg_data")?;
  let mut names = paths
    .filter_map(|res| res.ok())
    .map(|entry| entry.path())
    .filter(|path| path.extension().is_some_and(|ext| ext == "mp3"))
    // .filter(|path| path.file_name().is_some_and(|name| name == "04-08-2023-11-00.mp3"))
    .map(Recording::from)
    .collect::<Vec<Recording>>();
  names.sort_by_key(|k| k.key);
  names.reverse();
  // print!("{:#?}", names);
  Ok(names)
}

#[component]
fn UzgListing(items: Vec<Recording>) -> impl IntoView {
  let (player_src, set_player_src) = create_signal::<Option<String>>(None);
  let (player_state, set_player_state) = create_signal(PlayerState::Stopped);

  view! {
    <Player player_src set_player_state/>
    {items
        .group_by(|a, b| a.year == b.year)
        .map(|by_year| {
            view! {
              <h2 class="text-gray-800 text-xl">{by_year[0].year}</h2>
              <div class="mt-0.5 ml-4 mb-6">
                {by_year
                    .group_by(|a, b| a.month == b.month)
                    .map(|by_month| {
                        view! {
                          <h3 class="text-gray-800 text-lg">{by_month[0].month_long_c()}</h3>

                          <ol class="mt-0.5 ml-4 mb-6">
                            {by_month
                                .group_by(|a, b| a.day == b.day)
                                .map(|by_day| {
                                    view! {
                                      <li>
                                        <div class="flex flex-start items-center pt-3">
                                          <div class="bg-gray-400 w-2 h-2 rounded-full -ml-1 mr-3"></div>
                                          <p class="text-gray-800 text-l">{by_day[0].listing_title()}</p>
                                        </div>
                                        <div class="mt-0.5 ml-4 flex flex-wrap gap-2">
                                          {by_day
                                              .iter()
                                              .map(|recording| {
                                                  view! {
                                                    <Controls
                                                      title=recording.title()
                                                      label=recording.label()
                                                      src=recording.src.clone()
                                                      set_player_src=set_player_src
                                                      player_state=player_state
                                                    />
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
  }
}

#[component]
pub(crate) fn UitzendingGemist() -> impl IntoView {
  let entries = create_resource(|| (), |_| async move { fetch_uzg_entries().await });

  view! {
    <div class="flex justify-evenly">
      <div class="flex flex-auto items-center">
        <div class="mx-12 my-8">
          <A href="/">
            <img
              src="/logodinxperfm.png"
              alt="DinxperFM logo"
              width=128
              height=128
              quality=100
              lazy=false
              priority=true
              class="mx-auto"
            />
          </A>
          <p class="text-center mt-4">"Het swingende geluid van Dinxperlo!"</p>
        </div>
        <h1 class="text-4xl font-bold text-gray-100 sm:text-5xl lg:text-6xl">"Uitzending gemist"</h1>
      </div>
    </div>
    <div class="bg-gray-100 text-black p-9">
      <div class="max-w-7xl px-6 text-center">
        <p class="mx-auto mt-5 max-w-5xl text-xl text-gray-500">
          "Dit zijn opnames van uitzendingen op de Dinxper FM stream. Gebruik
          de speler om de uitzending terug te luisteren of klik de link om de
          uitzending op te slaan."
        </p>
      </div>
      <hr class="my-8"/>
      <Suspense fallback=move || {
          view! { <p>"..."</p> }
      }>
        {move || match entries.get() {
            None => view! { <p>"Op dit moment zijn er geen historische uitzendingen te beluisteren."</p> }.into_view(),
            Some(Ok(items)) => {
                if items.is_empty() {
                    view! { <p>"Op dit moment zijn er geen historische uitzendingen te beluisteren."</p> }.into_view()
                } else {
                    view! { <UzgListing items=items/> }.into_view()
                }
            }
            Some(Err(error)) => {
                view! {
                  <p>"Op dit moment zijn er geen historische uitzendingen te beluisteren."</p>
                  <p>{format!("{}", error)}</p>
                }
                    .into_view()
            }
        }}

      </Suspense>
    </div>
  }
}
