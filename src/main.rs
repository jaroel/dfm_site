#[cfg(feature = "ssr")]
#[tokio::main]
async fn main() {
    use axum::{
        routing::{get, post},
        Router,
    };
    use dfm_site::{app::*, fileserv::file_and_error_handler};
    use leptos::{logging::log, *};
    use leptos_axum::{generate_route_list, LeptosRoutes};
    use leptos_image_optimizer::cache_app_images;
    use std::net::SocketAddr;
    // use std::path::PathBuf;
    // use tower_http::compression::CompressionLayer;

    // use tower_http::trace::TraceLayer;

    // console_subscriber::init();

    // Setting get_configuration(None) means we'll be using cargo-leptos's env values
    // For deployment these variables are:
    // <https://github.com/leptos-rs/start-axum#executing-a-server-on-a-remote-machine-without-the-toolchain>
    // Alternately a file can be specified such as Some("Cargo.toml")
    // The file would need to be included with the executable when moved to deployment
    let conf = get_configuration(None).await.unwrap();
    let leptos_options = conf.leptos_options;
    let root = leptos_options.site_root.clone();
    cache_app_images(root, || view! { <App/> }, 2, || (), || ())
        .await
        .expect("Failed to cache images");

    let routes = generate_route_list(|| view! { <App/> });

    // build our application with a route
    let app = Router::new()
        .route("/api/*fn_name", post(leptos_axum::handle_server_fns))
        .leptos_routes(&leptos_options, routes, || view! { <App/> })
        .route("/cache/image", get(leptos_image_optimizer::image_cache_handler))
        .fallback(file_and_error_handler)
        // .layer(CompressionLayer::new())
        // .layer(TraceLayer::new_for_http())
        .with_state(leptos_options);

    let http_addr =
        std::env::var("HTTP_ADDR").unwrap_or("127.0.0.1:3002".to_string());
    let http_addr = http_addr.parse::<SocketAddr>().expect("HTTP_ADDR");
    log!("listening on http://{}", &http_addr);
    axum::Server::bind(&http_addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

#[cfg(not(feature = "ssr"))]
pub fn main() {
    // no client-side main function
    // unless we want this to work with e.g., Trunk for a purely client-side app
    // see lib.rs for hydration function instead
}
