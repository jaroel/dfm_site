//! Responsive image markup. The variants and their hashed URLs come from
//! `build.rs`; see `assets/` for the sources.

use leptos::prelude::*;

include!(concat!(env!("OUT_DIR"), "/images.rs"));

/// `<img>` with `srcset`/`sizes`, plus width/height so layout does not shift.
pub fn responsive_img(
    image: &'static Image,
    alt: &'static str,
    width: u32,
    class: &'static str,
    loading: &'static str,
) -> impl IntoView {
    let height = (image.height as f64 * width as f64 / image.width as f64).round() as u32;
    view! {
        <img
            src=image.src
            srcset=image.srcset
            sizes=format!("(max-width: {width}px) 100vw, {width}px")
            width=width
            height=height
            alt=alt
            class=class
            loading=loading
        />
    }
}

/// Same, but eager/high priority — for above-the-fold images.
pub fn hero_img(image: &'static Image, alt: &'static str, width: u32, class: &'static str) -> impl IntoView {
    let height = (image.height as f64 * width as f64 / image.width as f64).round() as u32;
    view! {
        <img
            src=image.src
            srcset=image.srcset
            sizes=format!("(max-width: {width}px) 100vw, {width}px")
            width=width
            height=height
            alt=alt
            class=class
            fetchpriority="high"
        />
    }
}
