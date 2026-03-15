pub mod controls;
pub mod home;
pub mod player;
pub mod uzg;

use crate::home::HomePage;
use crate::uzg::UitzendingGemist;
use leptos::prelude::*;
use leptos_meta::{provide_meta_context, HashedStylesheet, Title};
use leptos_meta::{Meta, MetaTags};
use leptos_router::Lazy;
use leptos_router::{
    components::{Route, Router, Routes},
    StaticSegment,
};

pub fn shell(options: LeptosOptions) -> impl IntoView {
    view! {
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <HashedStylesheet id="leptos" options=options.clone() />
                <AutoReload options=options.clone() />
                <HydrationScripts options />
                <MetaTags />
            </head>
            <body>
                <App />
            </body>
        </html>
    }
}

#[component]
pub fn App() -> impl IntoView {
    // Provides context that manages stylesheets, titles, meta tags, etc.
    provide_meta_context();

    view! {
        // sets the document title
        <Title text="Dinxper FM - Het swingende geluid van Dinxperlo" />
        <Meta name="description" content="Dinxper FM - Het swingende geluid van Dinxperlo" />
        <Meta property="og:title" content="Dinxper FM - Het swingende geluid van Dinxperlo" />
        <Meta property="og:description" content="Dinxper FM - Het swingende geluid van Dinxperlo" />

        <div
            class="h-screen bg-fixed bg-gray-600 bg-center bg-cover text-slate-50 font-[Cabin]"
            style:background-image="url(/assets/dfm_studio-blurred.jpg)"
        >
            <div class="overflow-auto h-full bg-black/75">
                <div class="mx-auto max-w-6xl">
                    <Router>
                        <Routes fallback=|| "Page not found.".into_view()>
                            <Route path=StaticSegment("") view=HomePage />
                            <Route
                                path=StaticSegment("/uzg")
                                view={Lazy::<UitzendingGemist>::new()}
                                ssr=leptos_router::SsrMode::InOrder
                            />
                        </Routes>
                        <Nav />
                    </Router>
                </div>
            </div>
        </div>
    }
}

#[component]
fn Nav() -> impl IntoView {
    view! {
        <nav class="flex justify-center p-2 text-black bg-gray-100">
            <ul class="flex flex-wrap gap-y-2 gap-x-8">
                <li>
                    <a href="/" title="DinxperFM home page">
                        Home page
                    </a>
                </li>
                <li>
                    <a
                        href="https://www.facebook.com/DinxperFM"
                        title="DinxperFM Facebook pagina"
                        class="flex flex-row items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="mr-1 bi bi-facebook"
                            viewBox="0 0 16 16"
                        >
                            <title>DinxperFM Facebook pagina</title>
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                        </svg>
                        Facebook pagina
                    </a>
                </li>
                <li>
                    <a
                        href="mailto:info@dinxperfm.nl"
                        title="Stuur een email naar info@dinxperfm.nl"
                        class="flex flex-row items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="mr-1 bi bi-envelope-fill"
                            viewBox="0 0 16 16"
                        >
                            <title>Stuur een email naar info@dinxperfm.nl</title>
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                        </svg>
                        info@dinxperfm.nl
                    </a>
                </li>
                <li>Bezoekadres: Europastraat 8, 7091 XC, Dinxperlo</li>
            </ul>
        </nav>
    }
}
