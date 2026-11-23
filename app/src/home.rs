use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_router::components::A;

use crate::{
    controls::Controls,
    player::{Player, PlayerState},
    uzg::fetch_uzg_entries,
};

struct Sponsor {
    href: &'static str,
    alt: &'static str,
    image: &'static str,
    class: &'static str,
}

/// Same list and order as the SolidJS site.
const SPONSORS: [Sponsor; 7] = [
    Sponsor {
        href: "https://www.facebook.com/markt.dinxperlo/",
        alt: "Logo van de markt van Dinxperlo",
        image: "/assets/sponsors/makt.jpg",
        class: "",
    },
    Sponsor {
        href: "https://podesta.nl/",
        alt: "Logo van Podesta",
        image: "/assets/sponsors/logo15.jpg",
        class: "",
    },
    Sponsor {
        href: "https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/",
        alt: "Logo van Adviesbureau Roenhorst",
        image: "/assets/sponsors/logo16.jpg",
        class: "",
    },
    Sponsor {
        href: "http://www.vvnf.nl/home",
        alt: "Logo van VVNF",
        image: "/assets/sponsors/logo23.jpg",
        class: "",
    },
    Sponsor {
        href: "https://harmtakke.nl",
        alt: "Logo van Harm Takke",
        image: "/assets/sponsors/logo-harmtakke.jpg",
        class: "",
    },
    Sponsor {
        href: "https://tibatek.de",
        alt: "Logo van Tibatek",
        image: "/assets/sponsors/tibatek_logo_web.png",
        class: "bg-white p-2",
    },
    Sponsor {
        href: "https://www.facebook.com/CafetariadeDriesprongDinxperlo/?locale=nl_NL",
        alt: "Logo van Cafetaria de Driesprong",
        image: "/assets/sponsors/dedriesprong.jpg",
        class: "",
    },
];

/// Renders the home page of your application.
#[component]
pub fn HomePage() -> impl IntoView {
    let src = RwSignal::new("".into());
    let player_state = RwSignal::new(PlayerState::Stopped);
    // ponytail: hover warms the server-side recording cache; click then hits cache
    let mut warmed = false;

    view! {
        <Player audio_src=src player_state=player_state />
        <div class="flex justify-evenly mt-10 mb-10">
            <div class="max-w-xs md:max-w-sm">
                <img
                    src="/assets/logodinxperfm.png"
                    alt="Dinxper FM - Het swingende geluid van Dinxperlo!"
                    width=384
                    class="mx-auto"
                />
                <p class="mt-4 text-center">Het swingende geluid van Dinxperlo!</p>
            </div>
        </div>
        <nav class="flex justify-evenly bg-gray-100">
            <ul class="flex flex-wrap my-1 list-none">
                <li>

                    <Controls
                        title="Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!".into()
                        label="Luister live!".into()
                        stream_src="https://stream.dinxperfm.nl/1".into()
                        audio_src=src
                        player_state=player_state
                    />
                </li>
                <li>
                    <A
                    href="/uzg"
                    {..}
                    class="inline-block py-3 px-4 text-blue-700 no-underline"
                    title="Uitzending gemist? Luister ze terug!"
                    on:mouseenter=move |_| {
                        if !warmed {
                            warmed = true;
                            spawn_local(async {
                                _ = fetch_uzg_entries().await;
                            });
                        }
                    }
                    >
                        "Uitzending gemist?"
                    </A>
                </li>
            </ul>
        </nav>
        <div class="flex justify-center mt-10">
            <img
                src="/assets/programmering.jpg"
                alt="Programmering van Dinxperlo FM"
                width=1084
                class="max-w-full h-auto"
            />
        </div>
        <div class="text-center">
            <a
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-400"
                href="/assets/programmering.jpg"
                title="Bekijk het programma in een nieuw scherm"
            >
                "In nieuwe pagina openen"
            </a>
        </div>
        <div class="mt-10 text-center">
            <h2 class="mb-8 text-2xl">"Dinxper FM wordt mede mogelijk gemaakt door"</h2>
            <div
                class="flex flex-row flex-wrap justify-evenly"
                data-testid="sponsors"
            >
                {SPONSORS
                    .iter()
                    .map(|sponsor| {
                        view! {
                            <div class="mb-2 p-1">
                                <a
                                    href=sponsor.href
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src=sponsor.image
                                        alt=sponsor.alt
                                        loading="lazy"
                                        width=250
                                        class=sponsor.class
                                    />
                                </a>
                            </div>
                        }
                    })
                    .collect_view()}
            </div>
        </div>
    }
    .into_any()
}
