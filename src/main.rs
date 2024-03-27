mod routes;
mod api;

use axum::{routing::get, Router};
use tokio::net::TcpListener;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use handlebars::Handlebars;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .init();

    let mut templates = Handlebars::new();
    templates.register_template_file("home", "templates/home.html").unwrap();

    let router = Router::new()
        .nest_service("/static", ServeDir::new("static"))
        .nest(
            "/api",
            Router::new()
                .route("/uptime", get(api::uptime::handler))
                .route("/pinned", get(api::pinned::handler))
        )
        .route("/", get(routes::home::handler))
        .with_state(templates);

    let listener = TcpListener::bind("127.0.0.1:3000").await.unwrap();
    tracing::debug!("Listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, router).await.unwrap();
}
