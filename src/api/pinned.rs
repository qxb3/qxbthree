use axum::{body::Body, response::{IntoResponse, Response}};
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use tl::{NodeHandle, VDom};

#[derive(Debug, Serialize, Deserialize)]
struct PinnedRepository {
    name: String,
    description: String,
    link: String,
    stars: u32,
    forks: u32
}

impl PinnedRepository {
    pub fn new(name: String, description: String, link: String, stars: u32, forks: u32) -> Self {
        Self {
            name,
            description,
            link,
            stars,
            forks
        }
    }
}

pub async fn handler() -> impl IntoResponse {
    let client = Client::new();

    let url = "https://github.com/qxb3";
    match client.get(url).send().await {
        Ok(res) => {
            let main_html = &res.text().await.unwrap();
            let main_dom = tl::parse(main_html.as_str(), tl::ParserOptions::default()).unwrap();
            let main_parser = main_dom.parser();

            let mut pinned_repositories: Vec<PinnedRepository> = Vec::new();

            for pinned_html in main_dom
                .get_elements_by_class_name("pinned-item-list-item-content")
                .collect::<Vec<NodeHandle>>()
                .iter()
                .map(|&e| e.get(main_parser).unwrap().inner_html(main_parser).into_owned()) {
                    let pinned_dom = tl::parse(pinned_html.as_str(), tl::ParserOptions::default()).unwrap();
                    let pinned_parser = pinned_dom.parser();

                    let name_dom = get_dom("repo", &pinned_dom);
                    let description_dom = get_dom("pinned-item-desc", &pinned_dom);
                    let meta_dom = get_dom("pinned-item-meta", &pinned_dom);

                    let name = name_dom.first().unwrap().get(pinned_parser).unwrap().inner_text(pinned_parser).trim().to_string();
                    let description = description_dom.first().unwrap().get(pinned_parser).unwrap().inner_text(pinned_parser).trim().to_string();
                    let link = format!("{}/{}", url, name);
                    let stars = meta_dom.first().unwrap().get(pinned_parser).unwrap().inner_text(pinned_parser).trim().parse::<u32>().unwrap();
                    let forks = meta_dom.last().unwrap().get(pinned_parser).unwrap().inner_text(pinned_parser).trim().parse::<u32>().unwrap();

                    pinned_repositories.push(PinnedRepository::new(name, description, link, stars, forks));
                }

            return Response::builder()
                .status(200)
                .header("Content-Type", "application/json")
                .body(Body::from(serde_json::to_string(&pinned_repositories).unwrap()))
                .unwrap()
        },
        Err(err) => return Response::builder()
            .status(500)
            .header("Content-Type", "application/json")
            .body(Body::from(format!(r#"{{ "status": 500, "message": "{}", "err": "{}" }}"#, StatusCode::INTERNAL_SERVER_ERROR, err.to_string())))
            .unwrap()
    }
}

fn get_dom(class_name: &str, dom: &VDom) -> Vec<NodeHandle> {
    dom
        .get_elements_by_class_name(class_name)
        .collect::<Vec<NodeHandle>>()
}
