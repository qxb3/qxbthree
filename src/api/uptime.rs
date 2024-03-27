use std::process::Command;
use axum::{http::header, response::IntoResponse};

pub async fn handler() -> impl IntoResponse {
    let up = Command::new("uptime")
        .arg("-p")
        .output()
        .expect("Failed.");

    (
        [(header::CONTENT_TYPE, "text/plain")],
        up.stdout.as_slice().iter().filter(|&&c| c != b'\n').cloned().collect::<Vec<u8>>()
    )
}
