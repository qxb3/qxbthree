use axum::{extract::State, response::{Html, IntoResponse}};
use handlebars::Handlebars;
use serde_json::json;

pub async fn handler<'a>(State(templates): State<Handlebars<'a>>) -> impl IntoResponse {
    let template = templates
        .render("home", &json!({}))
        .unwrap();

    Html(template)
}
