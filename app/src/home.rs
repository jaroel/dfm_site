use leptos::prelude::*;
use leptos::task::spawn_local;
use leptos_router::components::A;

use crate::{
    controls::Controls,
    images::{hero_img, responsive_img, Image, LOGO, PROGRAMMERING},
    player::{Player, PlayerState},
    uzg::fetch_uzg_entries,
};

struct Sponsor {
    href: &'static str,
    alt: &'static str,
    image: &'static Image,
    class: &'static str,
}

/// Same list and order as the SolidJS site.
const SPONSORS: [Sponsor; 7] = [
    Sponsor {
        href: "https://www.facebook.com/markt.dinxperlo/",
        alt: "Logo van de markt van Dinxperlo",
        image: &crate::images::SPONSOR_MAKT,
        class: "",
    },
    Sponsor {
        href: "https://podesta.nl/",
        alt: "Logo van Podesta",
        image: &crate::images::SPONSOR_LOGO15,
        class: "",
    },
    Sponsor {
        href: "https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/",
        alt: "Logo van Adviesbureau Roenhorst",
        image: &crate::images::SPONSOR_LOGO16,
        class: "",
    },
    Sponsor {
        href: "http://www.vvnf.nl/home",
        alt: "Logo van VVNF",
        image: &crate::images::SPONSOR_LOGO23,
        class: "",
    },
    Sponsor {
        href: "https://harmtakke.nl",
        alt: "Logo van Harm Takke",
        image: &crate::images::SPONSOR_LOGO_HARMTAKKE,
        class: "",
    },
    Sponsor {
        href: "https://tibatek.de",
        alt: "Logo van Tibatek",
        image: &crate::images::SPONSOR_TIBATEK_LOGO_WEB,
        class: "bg-white p-2",
    },
    Sponsor {
        href: "https://www.facebook.com/CafetariadeDriesprongDinxperlo/?locale=nl_NL",
        alt: "Logo van Cafetaria de Driesprong",
        image: &crate::images::SPONSOR_DEDRIESPRONG,
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
                {hero_img(
                    &LOGO,
                    "Dinxper FM - Het swingende geluid van Dinxperlo!",
                    384,
                    "mx-auto",
                )}
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
            {hero_img(
                &PROGRAMMERING,
                "Programmering van Dinxperlo FM",
                1084,
                "max-w-full h-auto",
            )}
        </div>
        <div class="text-center">
            <a
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-400"
                href=PROGRAMMERING.src
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
                                    {responsive_img(
                                        sponsor.image,
                                        sponsor.alt,
                                        250,
                                        sponsor.class,
                                        "lazy",
                                    )}
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
