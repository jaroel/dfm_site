#![feature(slice_group_by)]
use cfg_if::cfg_if;
pub mod app;
mod components;
pub mod error_template;
pub mod fileserv;
mod routes;

cfg_if! { if #[cfg(feature = "hydrate")] {
    use leptos::*;
    use wasm_bindgen::prelude::wasm_bindgen;

    #[wasm_bindgen]
    pub fn hydrate() {
        // initializes logging using the `log` crate
        _ = console_log::init_with_level(log::Level::Debug);
        console_error_panic_hook::set_once();

        leptos::leptos_dom::HydrationCtx::stop_hydrating();
    }
}}
