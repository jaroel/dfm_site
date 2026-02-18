use dioxus::prelude::*;

use crate::components::{controls::Controls, player::{Player, PlayerSrc}};

const LOGO: Asset = asset!(
    "/assets/logodinxperfm.png",
    ImageAssetOptions::new()
        .with_size(ImageSize::Manual {
            width: 384,
            height: 329,
        })
        .with_preload(true)
);
const PROGRAMERING: Asset = asset!(
    "/assets/programmering.jpg",
    ImageAssetOptions::new()
        .with_size(ImageSize::Manual {
            width: 1084,
            height: 640
        })
        .with_preload(true)
);

#[component]
pub fn Home() -> Element {
    rsx! {
        Player {}
        div { class: "flex justify-evenly mt-10 mb-10",
            div { class: "max-w-sm",
                img {
                    alt: "Dinxper FM - Het swingende geluid van Dinxperlo!",
                    src: LOGO,
                    fetchpriority: "high",
                }
                p { class: "mt-4 text-center", "Het swingende geluid van Dinxperlo!" }
            }
        }
        nav { class: "flex justify-evenly bg-gray-100",
            ul { class: "flex flex-wrap my-1 list-none",
                li {
                    Controls {
                        title: "Luister naar Dinxper FM - Het swingende geluid van Dinxperlo!",
                        label: "Luister live!",
                        stream_src: "https://stream.dinxperfm.nl/1".into(),
                    }
                }
                li {
                    a {
                        href: "/uzg/",
                        title: "Uitzending gemist? Luister ze terug!",
                        class: "inline-block py-3 px-4 text-blue-700 no-underline",
                        "\n                Uitzending gemist?\n              "
                    }
                }
            }
        }
        div { class: "flex justify-center mt-10",
            img {
                alt: "Programmering van Dinxperlo FM",
                src: PROGRAMERING,
                fetchpriority: "high",
            }
        }
        div { class: "text-center",
            a {
                target: "blank",
                href: PROGRAMERING,
                title: "Bekijk het programma in een nieuw scherm",
                class: "text-blue-400",
                "\n            In nieuwe pagina openen\n          "
            }
        }
        Sponsors {}

    }
}

const IMAGE_250_100: ImageSize = ImageSize::Manual {
    width: 250,
    height: 100,
};
const IMAGE_250_120: ImageSize = ImageSize::Manual {
    width: 250,
    height: 120,
};
const LOGO_MARKT: Asset = asset!(
    "/assets/sponsors/makt.jpg",
    ImageAssetOptions::new().with_size(IMAGE_250_100)
);
const LOGO_13: Asset = asset!(
    "/assets/sponsors/logo13.jpg",
    ImageAssetOptions::new().with_size(IMAGE_250_120)
);
const LOGO_15: Asset = asset!(
    "/assets/sponsors/logo15.jpg",
    ImageAssetOptions::new().with_size(IMAGE_250_120)
);
const LOGO_16: Asset = asset!(
    "/assets/sponsors/logo16.jpg",
    ImageAssetOptions::new().with_size(IMAGE_250_120)
);
const LOGO_DEDRIESPRONG: Asset = asset!(
    "/assets/sponsors/dedriesprong.jpg",
    ImageAssetOptions::new().with_size(ImageSize::Manual {
        width: 250,
        height: 65
    })
);
const LOGO_TIBATEK: Asset = asset!(
    "/assets/sponsors/tibatek_logo_web.png",
    ImageAssetOptions::new().with_size(ImageSize::Manual {
        width: 250,
        height: 55
    })
);
const LOGO_BLAUWE_MEER: Asset = asset!(
    "/assets/sponsors/logo-blauwe-meer.png",
    ImageAssetOptions::new().with_size(ImageSize::Manual {
        width: 250,
        height: 160
    })
);
const LOGO_RICO: Asset = asset!(
    "/assets/sponsors/etenbijrico.jpg",
    ImageAssetOptions::new().with_size(IMAGE_250_120)
);
const LOGO_HARMTAKKE: Asset = asset!(
    "/assets/sponsors/logo-harmtakke.jpg",
    ImageAssetOptions::new().with_size(ImageSize::Manual {
        width: 250,
        height: 88
    })
);
const LOGO_MASHOPS: Asset = asset!(
    "/assets/sponsors/mashops.jpg",
    ImageAssetOptions::new().with_size(IMAGE_250_120)
);
const LOGO_OLDDUTCH: Asset = asset!(
    "/assets/sponsors/olddutch.jpg",
    ImageAssetOptions::new().with_size(IMAGE_250_120)
);
const LOGO_LOGO23: Asset = asset!(
    "/assets/sponsors/logo23.jpg",
    ImageAssetOptions::new().with_size(IMAGE_250_120)
);

#[component]
fn Sponsors() -> Element {
    rsx! {
        div { class: "mt-10 text-center",
            h2 { class: "mb-8 text-2xl",
                "\n            Dinxper FM wordt mede mogelijk gemaakt door\n          "
            }
            div {
                "data-testid": "sponsors",
                class: "flex flex-row flex-wrap justify-evenly",
                div { class: "p-1 mb-2",
                    a {
                        target: "blank",
                        href: "https://www.facebook.com/markt.dinxperlo/",
                        img {
                            alt: "Logo van de markt van Dinxperlo",
                            src: LOGO_MARKT,
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a {
                        target: "blank",
                        href: "http://www.naaiateliermoniqueharmsen.nl/",
                        img {
                            src: LOGO_13,
                            alt: "Logo van Naai Atelier Monique Harmsen",
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a { href: "https://podesta.nl/", target: "blank",
                        img {
                            alt: "Logo van Podesta",
                            src: LOGO_15,
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a {
                        target: "blank",
                        href: "https://www.facebook.com/Adviesbureau-Roenhorst-Dinxperlo-234893600009274/",
                        img {
                            alt: "Logo van Adviesbureau Roenhorst",
                            src: LOGO_16,
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a { href: "http://www.vvnf.nl/home", target: "blank",
                        img {
                            alt: "Logo van VVNF",
                            src: LOGO_LOGO23,
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a {
                        href: "https://www.olddutchdinxperlo.nl/",
                        target: "blank",
                        img {
                            src: LOGO_OLDDUTCH,
                            alt: "Logo van Old Dutch",
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a {
                        href: "https://www.ma-shops.nl/?ref=dinxperfm",
                        target: "blank",
                        img {
                            src: LOGO_MASHOPS,
                            alt: "Logo van MA-Shops",
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a { href: "https://harmtakke.nl", target: "blank",
                        img {
                            src: LOGO_HARMTAKKE,
                            alt: "Logo van Harm Takke",
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a { href: "https://etenbijrico.nl", target: "blank",
                        img {
                            src: LOGO_RICO,
                            alt: "Logo van Eten bij Rico",
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a { target: "blank", href: "https://hetblauwemeer.nl",
                        img {
                            src: LOGO_BLAUWE_MEER,
                            alt: "Logo van Het Blauwe Meer",
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a { href: "https://tibatek.de", target: "blank",
                        img {
                            src: LOGO_TIBATEK,
                            width: 250,
                            alt: "Logo van Tibatek",
                            class: "bg-white p-1",
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a {
                        target: "blank",
                        href: "https://www.facebook.com/CafetariadeDriesprongDinxperlo/?locale=nl_NL",
                        img {
                            alt: "Logo van Cafetaria de Driesprong",
                            src: LOGO_DEDRIESPRONG,
                            width: 250,
                        }
                    }
                }
            }
        }
    }
}
