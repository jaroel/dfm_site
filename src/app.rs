use crate::error_template::{AppError, ErrorTemplate};
use leptos::{html::Audio, *};
use leptos_meta::*;
use leptos_router::*;

#[derive(Clone)]
enum PlayerState {
    Stopped,
    Loading,
    Playing,
    Error,
}

#[component]
pub fn App(cx: Scope) -> impl IntoView {
    provide_meta_context(cx);
    view! {
        cx,
        <Stylesheet id="leptos" href="/pkg/dfm_site.css"/>
        <Title text="Dinxper FM - het swingende geluid van Dinxperlo"/>
        <Body class="text-slate-50 h-screen bg-gray-600 bg-center bg-cover bg-fixed font-[Cabin]" />

        <Router fallback=|cx| {
            let mut outside_errors = Errors::default();
            outside_errors.insert_with_default_key(AppError::NotFound);
            view! { cx,
                <ErrorTemplate outside_errors/>
            }
            .into_view(cx)
        }>
        <div class="h-100 overflow-auto bg-black/75">
            <div class="max-w-7xl mx-auto">
                <Routes>
                    <Route path="" view=|cx| view! { cx, <HomePage /> } />
                    <Route path="/uzg" view=|cx| view! { cx, <UitzendingGemist /> } />
                </Routes>

                <nav class="text-black bg-gray-100 p-2 flex justify-center">
                    <ul class="flex flex-wrap">
                    <li class="ml-1 mr-2">
                        <a href="/" title="DinxperFM home page">
                          "Home page"
                        </a>
                    </li>
                    <li class="ml-1 mr-2">
                        <a
                        href="https://www.facebook.com/DinxperFM"
                        title="DinxperFM Facbook pagina">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-facebook inline"
                              viewBox="0 0 16 16">
                              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                          </svg>
                          "Facebook pagina"
                        </a>
                    </li>
                    <li class="ml-1 mr-2">
                        <a
                        href="mailto:info@dinxperfm.nl"
                        title="Stuur een email naar info@dinxperfm.nl">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-envelope-fill inline"
                              viewBox="0 0 16 16">
                              <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                          </svg>
                          "info@dinxperfm.nl"
                        </a>
                    </li>
                    <li class="ml-1 mr-2">
                        "Bezoekadres: Europastraat 8, 7091 XC, Dinxperlo"
                    </li>
                    </ul>
                </nav>
            </div>
        </div>
        </Router>
    }
}

#[component]
fn Sponsor(cx: Scope, href: String, title: String, logo: String) -> impl IntoView {
    view! {
      cx,
      <div class="p-1 mb-2">
        <a
          href=href
          title=title
          target="_blank">
          <img width="250" src=logo />
        </a>
      </div>
    }
}

#[component]
fn Controls(
    cx: Scope,
    title: String,
    label: String,
    src: String,
    player_src: ReadSignal<String>,
    set_player_src: WriteSignal<String>,
    player_state: ReadSignal<PlayerState>,
    set_player_state: WriteSignal<PlayerState>,
    current_stream_src: ReadSignal<String>,
) -> impl IntoView {
    let (local_src, _set_local_src) = create_signal(cx, src); // work around moveing src.

    let classes_red = "mr-4 rounded-full border my-1 py-2 px-4 flex items-center bg-red-100 text-red-800 border-red-800";
    let classes_blue = "mr-4 rounded-full border my-1 py-2 px-4 flex items-center bg-blue-100 text-blue-800 border-blue-800";
    let classes_gray = "mr-4 rounded-full border my-1 py-2 px-4 flex items-center border-gray-800 bg-gray-800 text-white hover:bg-gray-100 hover:text-gray-800 hover:border-gray-800";
    let classes = move || {
        if player_src.get() != local_src.get() {
            return classes_gray;
        }
        return match player_state.get() {
            PlayerState::Error => classes_red,
            PlayerState::Playing => classes_blue,
            PlayerState::Loading => classes_gray,
            PlayerState::Stopped => classes_gray,
        };
    };

    let on_click = move |_| {
        if current_stream_src.get() == local_src.get() {
            set_player_src.set("".to_string());
            set_player_state.set(PlayerState::Stopped)
        } else {
            set_player_src.set(local_src.get());
            set_player_state.set(PlayerState::Loading)
        }
    };

    view! {cx,
      <button title=title on:click=on_click class=classes>
        <span class="mr-2">{label}</span>
        {move || match player_state() {
          PlayerState::Stopped | PlayerState::Error => {
            view! {cx,
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-play inline"
              viewBox="0 0 16 16"
            >
              <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
            </svg>
            }
          },
          PlayerState::Playing => {
            view! {cx,
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-stop-circle inline"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z" />
              </svg>
            }
          },
          PlayerState::Loading => {
            view! {cx,
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-hourglass-split inline"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z" />
              </svg>}
          }
        }}
      </button>
    }
}

#[component]
fn HomePage(cx: Scope) -> impl IntoView {
    let (player_src, set_player_src) = create_signal(cx, "".to_string());
    let (current_stream_src, set_current_stream_src) = create_signal(cx, "".to_string());
    let (player_state, set_player_state) = create_signal(cx, PlayerState::Stopped);

    let audio_ref = create_node_ref::<Audio>(cx);

    view! { cx,
      <audio autoplay _ref=audio_ref src=player_src
        on:load=move |_| {
          set_player_state.set(PlayerState::Loading)
        }
        on:play=move |_| {
          let node = audio_ref.get().expect("audio element missing on page.");
          set_current_stream_src.set(node.src());
          set_player_state.set(PlayerState::Playing)
        }
        on:error=move |_| {
          set_current_stream_src.set("".into());
          if !player_src.get().is_empty() {
            set_player_state.set(PlayerState::Error)
          }
        }
        on:ended=move |_| {
          set_current_stream_src.set("".into());
          set_player_state.set(PlayerState::Stopped)
        }
        on:pause=move |_| {
          set_current_stream_src.set("".into());
          set_player_state.set(PlayerState::Stopped)
        }
        />
      <div class="flex justify-evenly mt-10 mb-10">
        <div class="max-w-sm">
          <img src="/logodinxperfm.png" width="384" height="329" />
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
              player_src=player_src
              set_player_src=set_player_src
              player_state=player_state
              set_player_state=set_player_state
              current_stream_src=current_stream_src
            />
          </li>
          <li>
            <A
              class="inline-block mt-3 px-4 no-underline text-blue-700"
              href="/uzg"
            >"Uitzending gemist?"</A>
          </li>
        </ul>
      </nav>

      <div class="mt-10 flex justify-center">
        <img src="/programmering.jpg" />
      </div>
      <div class="text-center">
        <a target="blank" class="text-blue-400" href="programmering.jpg">"In nieuwe pagina openen"</a>
      </div>

      <div class="mt-10 text-center">
        <h2 class="text-2xl">"Dinxper FM wordt mede mogelijk gemaakt door"</h2>
        <div class="flex flex-row flex-wrap justify-evenly">
          <Sponsor title="Expert Dinxperlo".into() href="https://www.expert.nl/winkels/dinxperlo?gclid=EAIaIQobChMI1Jutxdrh4AIVzLztCh02DgFoEAAYASAAEgJwevD_BwE".into() logo="/sponsors/Expert.jpg".into() />
          <Sponsor title="De markt van Dinxperlo".into() href="https://www.facebook.com/markt.dinxperlo/".into() logo="/sponsors/makt.jpg".into()/>
          <Sponsor title="Naaiatelier Monique Harmsen".into() href="http://www.naaiateliermoniqueharmsen.nl/".into() logo="/sponsors/logo13.jpg".into() />
          <Sponsor title="Podesta event supplies".into() href="https://podesta.nl/".into() logo="/sponsors/logo15.jpg".into() />
          <Sponsor title="Adviesbureau Roenhorst Dinxperlo".into() href="https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/".into() logo="/sponsors/logo16.jpg".into() />
          <Sponsor title="Landwinkel Smits Groenten & Fruit | Smits Groentekwekerij B.V. | Smits Groenten en Fruit".into() href="http://www.groentekwekerij-smits.nl/".into() logo="/sponsors/logo18.jpg".into() />
          <Sponsor title="Te Grotenhuis - Afvalstraat - Zand & grind verkoop - Dinxperlo".into() href="http://www.tegrotenhuisdinxperlo.nl/".into() logo="/sponsors/logo19.jpg".into() />
          <Sponsor title="Tiggelovend-Kok B.V.".into() href="https://www.tiggelovend-kok.nl/".into() logo="/sponsors/logo22.jpg".into() />
          <Sponsor title="VVNF: Vereniging Viering Nationale Feest- en Gedenkdagen Dinxperlo".into() href="http://www.vvnf.nl/".into() logo="/sponsors/logo23.jpg".into() />
          <Sponsor title="Jumbo Dinxperlo Leussink".into() href="https://www.jumbo.com/content/jumbo-dinxperlo-heelweg/".into() logo="/sponsors/jumbo.jpg".into() />
          <Sponsor title="Old Dutch Dinxperlo".into() href="https://www.olddutchdinxperlo.nl/".into() logo="/sponsors/oldDutch.jpg".into() />
          <Sponsor title="MA-Shops".into() href="https://www.ma-shops.nl/?ref=dinxperfm".into() logo="/sponsors/mashops.jpg".into() />
          <Sponsor title="Expert Dinxperlo".into() href="https://www.expert.nl/winkels/dinxperlo?gclid=EAIaIQobChMI1Jutxdrh4AIVzLztCh02DgFoEAAYASAAEgJwevD_BwE".into() logo="/sponsors/expert.jpg".into() />
          <Sponsor title="Alswin".into() href="https://www.dinxperlo.nl".into() logo="/sponsors/AlswinGr.jpg".into() />
        </div>
      </div>
    }
}

#[server(FetchFTPEntries, "/api")]
pub async fn fetch_ftp_entries() -> Result<(), ServerFnError> {
    use async_ftp::FtpStream;

    let mut ftp_stream = FtpStream::connect("dinxperfm.freeddns.org:21").await?;
    let _ = ftp_stream.login("UZG", "4862KpZ2").await?;

    // Get the current directory that the client will be reading from and writing to.
    println!("Current directory: {}", ftp_stream.pwd().await?);

    // Terminate the connection to the server.
    let _ = ftp_stream.quit();

    Ok(())
}

#[component]
fn UitzendingGemist(cx: Scope) -> impl IntoView {
    let once = create_resource(cx, || (), |_| async move { fetch_ftp_entries().await });

    view! {cx,
      <div class="flex justify-evenly">
      <div class="flex flex-auto items-center">
        <div class="mx-12 my-8">
          <A href="/">
            <img
              src="/logodinxperfm.png"
              alt="DinxperFM logo"
              loading="eager"
              decoding="auto"
              width="128"
              height="128"
              class="mx-auto"
            />
          </A>
          <p class="text-center mt-4">"Het swingende geluid van Dinxperlo!"</p>
        </div>

        <h1 class="text-4xl font-bold text-gray-100 sm:text-5xl lg:text-6xl">
          "Uitzending gemist"
        </h1>
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
      <hr class="my-8" />
      <Suspense fallback=move || view! { cx, <p>"Loading (Suspense Fallback)..."</p> }>
      {move || match once.read(cx) {
          None => view! { cx, <p>"Loading..."</p> }.into_view(cx),
          Some(_data) => view! { cx, <p>"Got some data"</p> }.into_view(cx)
      }}
      </Suspense>
    </div>
    }
}
