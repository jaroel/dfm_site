use dioxus::prelude::*;

use crate::{
    components::{controls::Controls, player::Player},
    Route,
};

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
                    Link {
                        to: Route::UitzendingGemist {},
                        title: "Uitzending gemist? Luister ze terug!",
                        class: "inline-block py-3 px-4 text-blue-700 no-underline",
                        "Uitzending gemist?"
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
                "In nieuwe pagina openen"
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

#[component]
fn Sponsors() -> Element {
    rsx! {
        div { class: "mt-10 text-center",
            h2 { class: "mb-8 text-2xl", "Dinxper FM wordt mede mogelijk gemaakt door" }
            div {
                "data-testid": "sponsors",
                class: "flex flex-row flex-wrap justify-evenly",
                div { class: "p-1 mb-2",
                    a {
                        target: "blank",
                        href: "https://www.facebook.com/markt.dinxperlo/",
                        img {
                            alt: "Logo van de markt van Dinxperlo",
                            src: asset!(
                                "/assets/sponsors/makt.jpg",
                                ImageAssetOptions::new().with_size(IMAGE_250_100)
                            ),
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a { href: "https://podesta.nl/", target: "blank",
                        img {
                            alt: "Logo van Podesta",
                            src: asset!(
                                "/assets/sponsors/logo15.jpg",
                                ImageAssetOptions::new().with_size(IMAGE_250_120)
                            ),
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
                            src: asset!(
                                "/assets/sponsors/logo16.jpg",
                                ImageAssetOptions::new().with_size(IMAGE_250_120)
                            ),
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a { href: "http://www.vvnf.nl/home", target: "blank",
                        img {
                            alt: "Logo van VVNF",
                            src: asset!(
                                "/assets/sponsors/logo23.jpg",
                                ImageAssetOptions::new().with_size(IMAGE_250_120)
                            ),
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a { href: "https://harmtakke.nl", target: "blank",
                        img {
                            src: asset!(
                                "/assets/sponsors/logo-harmtakke.jpg",
                                ImageAssetOptions::new().with_size(ImageSize::Manual {
                                    width: 250,
                                    height: 88
                                })
                            ),
                            alt: "Logo van Harm Takke",
                            width: 250,
                        }
                    }
                }
                div { class: "p-1 mb-2",
                    a { href: "https://tibatek.de", target: "blank",
                        img {
                            src: asset!(
                                "/assets/sponsors/tibatek_logo_web.png",
                                ImageAssetOptions::new().with_size(ImageSize::Manual {
                                    width: 250,
                                    height: 55
                                })
                            ),
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
                            src: asset!(
                                "/assets/sponsors/dedriesprong.jpg",
                                ImageAssetOptions::new().with_size(ImageSize::Manual {
                                    width: 250,
                                    height: 65
                                })
                            ),
                            width: 250,
                        }
                    }
                }
            }
        }
    }
}
