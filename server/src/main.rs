use app::*;
use axum::{routing::get, Router};
use fileserv::file_and_error_handler;
use leptos::*;
use leptos_axum::{generate_route_list, LeptosRoutes};
use leptos_image_optimizer::cache_app_images;

pub mod fileserv;

#[tokio::main]
async fn main() {
    simple_logger::init_with_level(log::Level::Info)
        .expect("couldn't initialize logging");

    // Setting get_configuration(None) means we'll be using cargo-leptos's env values
    // For deployment these variables are:
    // <https://github.com/leptos-rs/start-axum#executing-a-server-on-a-remote-machine-without-the-toolchain>
    // Alternately a file can be specified such as Some("Cargo.toml")
    // The file would need to be included with the executable when moved to deployment
    let conf = get_configuration(None).await.unwrap();
    let leptos_options = conf.leptos_options;
    let addr = leptos_options.site_addr;
    let root = &leptos_options.site_root;
    let routes = generate_route_list(App);

    cache_app_images(root.clone(), || view! { <App/> }, 2, || (), || ())
        .await
        .expect("Failed to pre-render images");

    // build our application with a route
    let app = Router::new()
        .leptos_routes(&leptos_options, routes, App)
        .route(
            "/cache/image",
            get(leptos_image_optimizer::image_cache_handler),
        )
        .fallback(file_and_error_handler)
        .with_state(leptos_options);

    println!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
