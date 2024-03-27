use axum::{body::Body, response::{IntoResponse, Response}};
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Repository {
    #[serde(rename = "repo")]
    name: String,
    link: String,
    description: String,
    stars: u32,
    forks: u32
}

pub async fn handler() -> impl IntoResponse {
    let client = Client::new();
    let result = client.post("https://gh-pinned-repos-tsj7ta5xfhep.deno.dev/?username=qxb3").send().await;
    match result {
        Ok(res) => {
            let repositories = res.json::<Vec<Repository>>().await;

            return Response::builder()
                .status(200)
                .header("Content-Type", "application/json")
                .body(Body::from(serde_json::to_string(&repositories.ok()).unwrap()))
                .unwrap()
        },
        Err(err) => return Response::builder()
            .status(500)
            .header("Content-Type", "application/json")
            .body(Body::from(format!(r#"{{ "status": 500, "message": "{}", "err": "{}" }}"#, StatusCode::INTERNAL_SERVER_ERROR, err.to_string())))
            .unwrap()
    }
}
