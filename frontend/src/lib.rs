#[wasm_bindgen::prelude::wasm_bindgen]
pub fn hydrate() {
    use app::*;
    // ponytail: logging + panic hook only in dev builds; drops log/fmt code from release wasm
    #[cfg(debug_assertions)]
    {
        _ = console_log::init_with_level(log::Level::Debug);
        console_error_panic_hook::set_once();
    }

    leptos::mount::hydrate_lazy(App);
    // leptos::mount::hydrate_islands();
}
