use crate::Route;
use dioxus::{core::IntoAttributeValue, prelude::*};
const BACKGROUND_IMAGE: Asset = asset!("/assets/dfm_studio-blurred.jpg");

#[component]
pub fn Layout() -> Element {
    rsx! {

        div {
            class: "h-screen bg-fixed bg-gray-60 bg-center bg-cover text-slate-50",
            background_image: format!("url({BACKGROUND_IMAGE})"),
            div { class: "overflow-auto h-full bg-black/75",
                div { class: "mx-auto max-w-6xl",
                    Outlet::<Route> {}
                    Nav {}
                }
            
            }
        }
    }
}

#[component]
fn Nav() -> Element {
    rsx! {
        nav { class: "flex justify-center p-2 text-black bg-gray-100",
            ul { class: "flex flex-wrap gap-y-2 gap-x-8",
                li {
                    Link {
                        to: Route::Home {},
                        title: "DinxperFM home page".into_value(),
                        "Home page"
                    }
                }
                li {
                    a {
                        href: "https://www.facebook.com/DinxperFM",
                        title: "DinxperFM Facebook pagina",
                        class: "flex flex-row items-center",
                        svg {
                            height: "16",
                            "viewBox": "0 0 16 16",
                            width: "16",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "currentColor",
                            class: "mr-1 bi bi-facebook",
                            path { d: "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" }
                        }
                        "Facebook pagina"
                    }
                }
                li {
                    a {
                        href: "mailto:info@dinxperfm.nl",
                        title: "Stuur een email naar info@dinxperfm.nl",
                        class: "flex flex-row items-center",
                        svg {
                            fill: "currentColor",
                            "viewBox": "0 0 16 16",
                            xmlns: "http://www.w3.org/2000/svg",
                            height: "16",
                            width: "16",
                            class: "mr-1 bi bi-envelope-fill",
                            path { d: "M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" }
                        }
                        "info@dinxperfm.nl"
                    }
                }
                li { "Bezoekadres: Europastraat 8, 7091 XC, Dinxperlo" }
            }
        }
    }
}
