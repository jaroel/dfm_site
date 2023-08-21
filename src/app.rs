use crate::error_template::{AppError, ErrorTemplate};
use chrono::{Datelike, NaiveDateTime, Timelike};
use leptos::{html::Audio, *};
use leptos_image::{provide_image_context, Image};
use leptos_meta::*;
use leptos_router::*;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[component]
pub fn App(cx: Scope) -> impl IntoView {
  provide_image_context(cx);
  provide_meta_context(cx);
  view! { cx,
    <Stylesheet id="leptos" href="/pkg/dfm_site.css"/>
    <Title text="Dinxper FM - het swingende geluid van Dinxperlo"/>
    <Body class="text-slate-50 h-screen bg-gray-600 bg-center bg-cover bg-fixed font-[Cabin]"/>
    <Router fallback=|cx| {
        let mut outside_errors = Errors::default();
        outside_errors.insert_with_default_key(AppError::NotFound);
        view! { cx, <ErrorTemplate outside_errors/> }.into_view(cx)
    }>
      <div class="h-100 overflow-auto bg-black/75">
        <div class="max-w-7xl mx-auto">
          <Routes>
            <Route path="" view=HomePage/>
            <Route path="/uzg" view=UitzendingGemist/>
          </Routes>
          <nav class="text-black bg-gray-100 p-2 flex justify-center">
            <ul class="flex flex-wrap">
              <li class="ml-1 mr-2">
                <a href="/" title="DinxperFM home page">
                  "Home page"
                </a>
              </li>
              <li class="ml-1 mr-2">
                <a href="https://www.facebook.com/DinxperFM" title="DinxperFM Facbook pagina">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-facebook inline"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path>
                  </svg>
                  "Facebook pagina"
                </a>
              </li>
              <li class="ml-1 mr-2">
                <a href="mailto:info@dinxperfm.nl" title="Stuur een email naar info@dinxperfm.nl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-envelope-fill inline"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"></path>
                  </svg>
                  "info@dinxperfm.nl"
                </a>
              </li>
              <li class="ml-1 mr-2">"Bezoekadres: Europastraat 8, 7091 XC, Dinxperlo"</li>
            </ul>
          </nav>
        </div>
      </div>
    </Router>
  }
}

#[component]
fn Sponsor(cx: Scope, href: String, title: String, children: Children) -> impl IntoView {
  view! { cx,
    <div class="p-1 mb-2">
      <a href=href title=title target="_blank">
        {children(cx)}
      </a>
    </div>
  }
}

#[derive(Clone, PartialEq)]
enum PlayerState {
  // The state of the audio element.
  Stopped,
  Loading(String),
  Playing(String),
  Error(String),
}

#[derive(PartialEq)]
enum ControlsState {
  // The state of the specific controls component
  Stopped,
  Loading,
  Playing,
  Error,
}

#[component]
fn Controls(
  cx: Scope,
  title: String,
  label: String,
  src: String,
  set_player_src: WriteSignal<Option<String>>,
  player_state: ReadSignal<PlayerState>,
) -> impl IntoView {
  let (local_src, _) = create_signal(cx, src);
  let controls_state = move || {
    let controls_src = local_src();
    match player_state.get() {
      PlayerState::Stopped => ControlsState::Stopped,
      PlayerState::Loading(url) => {
        if url == controls_src {
          ControlsState::Loading
        } else {
          ControlsState::Stopped
        }
      }
      PlayerState::Playing(url) => {
        if url == controls_src {
          ControlsState::Playing
        } else {
          ControlsState::Stopped
        }
      }
      PlayerState::Error(url) => {
        if url == controls_src {
          ControlsState::Error
        } else {
          ControlsState::Stopped
        }
      }
    }
  };

  view! { cx,
    <button
      title=title
      on:click=move |_| {
          match controls_state() {
              ControlsState::Playing | ControlsState::Error => set_player_src(None),
              ControlsState::Stopped | ControlsState::Loading => set_player_src(Some(local_src.get())),
          };
      }

      class=move || {
          let specifics = match controls_state() {
              ControlsState::Error => "bg-red-100 text-red-800 border-red-800",
              ControlsState::Playing => "bg-blue-100 text-blue-800 border-blue-800",
              ControlsState::Stopped | ControlsState::Loading => {
                  "border-gray-800 bg-gray-800 text-white hover:bg-gray-100 hover:text-gray-800 hover:border-gray-800"
              }
          };
          format!("mr-4 rounded-full border my-1 py-2 px-4 flex items-center {}", specifics)
      }
    >

      <span class="mr-2">{label}</span>
      {move || match controls_state() {
          ControlsState::Stopped => {
              view! { cx,
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-play inline"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"></path>
                </svg>
              }
          }
          ControlsState::Error | ControlsState::Playing => {

              view! { cx,
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-stop-circle inline"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                  <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z"></path>
                </svg>
              }
          }
          ControlsState::Loading => {

              view! { cx,
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-hourglass-split inline"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"></path>
                </svg>
              }
          }
      }}

    </button>
  }
}

#[component]
fn HomePage(cx: Scope) -> impl IntoView {
  let (player_src, set_player_src) = create_signal::<Option<String>>(cx, None);
  let (player_state, set_player_state) = create_signal(cx, PlayerState::Stopped);
  let audio_ref = create_node_ref::<Audio>(cx);

  create_effect(cx, move |_| {
    if player_src.get().is_none() {
      let _ = audio_ref.get().is_some_and(|audio| audio.pause().is_ok());
      set_player_state(PlayerState::Stopped)
    };
  });

  view! { cx,
    <audio
      autoplay
      _ref=audio_ref
      src=player_src
      on:loadstart=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          set_player_state.set(PlayerState::Loading(node.src()))
      }

      on:play=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          set_player_state.set(PlayerState::Playing(node.src()))
      }

      on:error=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          assert!(node.src().is_empty() == false, "Empty audio.src.");
          set_player_state.set(PlayerState::Error(node.src()))
      }

      on:ended=move |_| { set_player_state.set(PlayerState::Stopped) }
      on:pause=move |_| { set_player_state.set(PlayerState::Stopped) }
    ></audio>
    <div class="flex justify-evenly mt-10 mb-10">
      <div class="max-w-sm">
        <div style="width: 384; height: 329">
          <Image
            src="/logodinxperfm.png"
            alt="De markt van Dinxperlo"
            width=384
            height=329
            quality=100
            lazy=false
            priority=true
            class="w-[384] h-auto"
          />
        </div>
        <p class="text-center mt-4">"Het swingende geluid van Dinxperlo!"</p>
      </div>
    </div>
    <nav class="flex justify-evenly bg-gray-100">
      <ul class="flex flex-wrap list-none my-1">
        <li>
          <Controls
            title="Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!".into()
            label="Luister live!".into()
            src="https://stream.dinxperfm.nl/1".into()
            set_player_src=set_player_src
            player_state=player_state
          />
        </li>
        <li>
          <A class="inline-block mt-3 px-4 no-underline text-blue-700" href="/uzg">
            "Uitzending gemist?"
          </A>
        </li>
      </ul>
    </nav>
    <div class="mt-10 flex justify-center">
      <div style="width: 1085; height: 656">
        <Image
          src="/programmering/WeekprogrammaDFM-20230304.jpg"
          alt="Programmering vanaf 4 maart 2023 van Dinxperlo FM "
          width=1085
          height=656
          quality=100
          lazy=false
          priority=true
        />
      </div>
    </div>
    <div class="text-center">
      <a target="blank" class="text-blue-400" href="/programmering/WeekprogrammaDFM-20230304.jpg">
        "In nieuwe pagina openen"
      </a>
    </div>
    <div class="mt-10 text-center">
      <h2 class="text-2xl">"Dinxper FM wordt mede mogelijk gemaakt door"</h2>
      <div class="flex flex-row flex-wrap justify-evenly">
        <Sponsor title="De markt van Dinxperlo".into() href="https://www.facebook.com/markt.dinxperlo/".into()>
          <Image src="/sponsors/makt.jpg" alt="De markt van Dinxperlo" width=250 height=250 quality=100 blur=true/>
        </Sponsor>
        <Sponsor title="Naaiatelier Monique Harmsen".into() href="http://www.naaiateliermoniqueharmsen.nl/".into()>
          <Image
            src="/sponsors/logo13.jpg"
            alt="Naaiatelier Monique Harmsen"
            width=250
            height=250
            quality=100
            blur=true
          />

        </Sponsor>
        <Sponsor title="Podesta event supplies".into() href="https://podesta.nl/".into()>
          <Image src="/sponsors/logo15.jpg" alt="Podesta event supplies" width=250 height=250 quality=100 blur=true/>

        </Sponsor>
        <Sponsor
          title="Adviesbureau Roenhorst Dinxperlo".into()
          href="https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/".into()
        >
          <Image
            src="/sponsors/logo16.jpg"
            alt="Adviesbureau Roenhorst Dinxperlo"
            width=250
            height=250
            quality=100
            blur=true
          />
        </Sponsor>
        <Sponsor
          title="Landwinkel Smits Groenten & Fruit | Smits Groentekwekerij B.V. | Smits Groenten en Fruit".into()
          href="http://www.groentekwekerij-smits.nl/".into()
        >
          <Image
            src="/sponsors/logo18.jpg"
            alt="Landwinkel Smits Groenten & Fruit | Smits Groentekwekerij B.V. | Smits Groenten en Fruit"
            width=250
            height=250
            quality=100
          />
        </Sponsor>
        <Sponsor
          title="Te Grotenhuis - Afvalstraat - Zand & grind verkoop - Dinxperlo".into()
          href="http://www.tegrotenhuisdinxperlo.nl/".into()
        >
          <Image
            src="/sponsors/logo19.jpg"
            alt="Te Grotenhuis - Afvalstraat - Zand & grind verkoop - Dinxperlo"
            width=250
            height=250
            quality=100
          />
        </Sponsor>
        <Sponsor title="Tiggelovend-Kok B.V.".into() href="https://www.tiggelovend-kok.nl/".into()>
          <Image src="/sponsors/logo22.jpg" alt="Tiggelovend-Kok B.V." width=250 height=250 quality=100 blur=true/>
        </Sponsor>
        <Sponsor
          title="VVNF: Vereniging Viering Nationale Feest- en Gedenkdagen Dinxperlo".into()
          href="http://www.vvnf.nl/".into()
        >
          <Image
            src="/sponsors/logo23.jpg"
            alt="VVNF: Vereniging Viering Nationale Feest- en Gedenkdagen Dinxperlo"
            width=250
            height=250
            quality=100
          />
        </Sponsor>
        <Sponsor
          title="Jumbo Dinxperlo Leussink".into()
          href="https://www.jumbo.com/content/jumbo-dinxperlo-heelweg/".into()
        >
          <Image src="/sponsors/jumbo.jpg" alt="Jumbo Dinxperlo Leussink" width=250 height=250 quality=100 blur=true/>
        </Sponsor>
        <Sponsor title="Old Dutch Dinxperlo".into() href="https://www.olddutchdinxperlo.nl/".into()>
          <Image src="/sponsors/olddutch.jpg" alt="Old Dutch Dinxperlo" width=250 height=250 quality=100 blur=true/>
        </Sponsor>
        <Sponsor title="MA-Shops".into() href="https://www.ma-shops.nl/?ref=dinxperfm".into()>
          <Image src="/sponsors/mashops.jpg" alt="MA-Shops" width=250 height=250 quality=100 blur=true/>
        </Sponsor>
        <Sponsor
          title="Expert Dinxperlo".into()
          href="https://www.expert.nl/winkels/dinxperlo?gclid=EAIaIQobChMI1Jutxdrh4AIVzLztCh02DgFoEAAYASAAEgJwevD_BwE"
              .into()
        >
          <Image src="/sponsors/expert.jpg" alt="Expert Dinxperlo" width=250 height=250 quality=100 blur=true/>
        </Sponsor>
        <Sponsor title="Alswin".into() href="https://www.dinxperlo.nl".into()>
          <Image src="/sponsors/alswingr.jpg" alt="Alswin" width=250 height=250 quality=100 blur=true/>
        </Sponsor>
      </div>
    </div>
  }
}

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
fn UzgListing(cx: Scope, items: Vec<Recording>) -> impl IntoView {
  let (player_src, set_player_src) = create_signal::<Option<String>>(cx, None);
  let (player_state, set_player_state) = create_signal(cx, PlayerState::Stopped);
  let audio_ref = create_node_ref::<Audio>(cx);

  create_effect(cx, move |_| {
    if player_src.get().is_none() {
      let _ = audio_ref.get().is_some_and(|audio| audio.pause().is_ok());
      set_player_state(PlayerState::Stopped)
    };
  });

  view! { cx,
    <audio
      autoplay
      _ref=audio_ref
      src=player_src
      on:loadstart=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          set_player_state.set(PlayerState::Loading(node.src()))
      }

      on:play=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          set_player_state.set(PlayerState::Playing(node.src()))
      }

      on:error=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          assert!(node.src().is_empty() == false, "Empty audio.src.");
          set_player_state.set(PlayerState::Error(node.src()))
      }

      on:ended=move |_| { set_player_state.set(PlayerState::Stopped) }
      on:pause=move |_| { set_player_state.set(PlayerState::Stopped) }
    ></audio>

    {items
        .group_by(|a, b| a.year == b.year)
        .map(|by_year| {
            view! { cx,
              <h2 class="text-gray-800 text-xl">{by_year[0].year}</h2>
              <div class="mt-0.5 ml-4 mb-6">
                {by_year
                    .group_by(|a, b| a.month == b.month)
                    .map(|by_month| {
                        view! { cx,
                          <h3 class="text-gray-800 text-lg">{by_month[0].month_long_c()}</h3>

                          <ol class="mt-0.5 ml-4 mb-6">
                            {by_month
                                .group_by(|a, b| a.day == b.day)
                                .map(|by_day| {

                                    view! { cx,
                                      <li>
                                        <div class="flex flex-start items-center pt-3">
                                          <div class="bg-gray-400 w-2 h-2 rounded-full -ml-1 mr-3"></div>
                                          <p class="text-gray-800 text-l">{by_day[0].listing_title()}</p>
                                        </div>
                                        <div class="mt-0.5 ml-4 flex flex-wrap gap-2">
                                          {by_day
                                              .iter()
                                              .map(|recording| {

                                                  view! { cx,
                                                    <Controls
                                                      title=recording.title()
                                                      label=recording.label()
                                                      src=recording.src.clone()
                                                      set_player_src=set_player_src
                                                      player_state=player_state
                                                    />
                                                  }
                                              })
                                              .collect_view(cx)}
                                        </div>
                                      </li>
                                    }
                                })
                                .collect_view(cx)}
                          </ol>
                        }
                    })
                    .collect_view(cx)}
              </div>
            }
        })
        .collect_view(cx)}
  }
}

#[component]
fn UitzendingGemist(cx: Scope) -> impl IntoView {
  let entries = create_resource(cx, || (), |_| async move { fetch_uzg_entries().await });

  view! { cx,
    <div class="flex justify-evenly">
      <div class="flex flex-auto items-center">
        <div class="mx-12 my-8">
          <A href="/">
            <Image
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
          view! { cx, <p>"..."</p> }
      }>
        {move || match entries.read(cx) {
            None => {
                view! { cx, <p>"Op dit moment zijn er geen historische uitzendingen te beluisteren."</p> }.into_view(cx)
            }
            Some(Ok(items)) => {
                if items.is_empty() {

                    view! { cx, <p>"Op dit moment zijn er geen historische uitzendingen te beluisteren."</p> }
                        .into_view(cx)
                } else {

                    view! { cx, <UzgListing items=items/> }
                        .into_view(cx)
                }
            }
            Some(Err(error)) => {

                view! { cx,
                  <p>"Op dit moment zijn er geen historische uitzendingen te beluisteren."</p>
                  <p>{format!("{}", error)}</p>
                }
                    .into_view(cx)
            }
        }}

      </Suspense>
    </div>
  }
}
