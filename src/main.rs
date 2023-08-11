#[cfg(feature = "ssr")]
#[tokio::main]
async fn main() {
  use axum::routing::{get, post};
  use axum::Router;
  use axum_server;
  use axum_server::tls_rustls::RustlsConfig;
  use dfm_site::app::*;
  use dfm_site::fileserv::file_and_error_handler;
  use leptos::*;
  use leptos_axum::{generate_route_list, LeptosRoutes};
  use leptos_image::cache_app_images;
  use std::path::PathBuf;
  use tower_http::services::ServeDir;

  simple_logger::init_with_level(log::Level::Error).expect("couldn't initialize logging");

  // Setting get_configuration(None) means we'll be using cargo-leptos's env values
  // For deployment these variables are:
  // <https://github.com/leptos-rs/start-axum#executing-a-server-on-a-remote-machine-without-the-toolchain>
  // Alternately a file can be specified such as Some("Cargo.toml")
  // The file would need to be included with the executable when moved to deployment
  let conf = get_configuration(None).await.unwrap();
  let leptos_options = conf.leptos_options;
  let addr = leptos_options.site_addr;
  let root = leptos_options.site_root.clone();
  cache_app_images(root, |cx: Scope| view! { cx, <App/> }, 2, || (), || ())
    .await
    .expect("Failed to cache images");

  let routes = generate_route_list(|cx| view! { cx, <App/> }).await;

  // build our application with a route
  let app = Router::new()
    .nest_service("/uzg_data", ServeDir::new("./uzg_data"))
    .route("/api/*fn_name", post(leptos_axum::handle_server_fns))
    .leptos_routes(&leptos_options, routes, |cx| view! { cx, <App/> })
    .route("/cache/image", get(leptos_image::image_cache_handler))
    .fallback(file_and_error_handler)
    .with_state(leptos_options);

  // configure certificate and private key used by https
  let cert_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("certs");
  let cert_file = cert_dir.join("cert.pem");
  let key_file = cert_dir.join("key.pem");
  eprintln!("cert_file = {:#?}", cert_file);
  eprintln!("key_file = {:#?}", key_file);
  let config = RustlsConfig::from_pem_file(cert_file, key_file)
    .await
    .expect("Couldn't load certs.");

  // run our app with hyper
  // `axum::Server` is a re-export of `hyper::Server`
  log!("listening on https://{}", &addr);

  axum_server::bind_rustls(addr, config)
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
