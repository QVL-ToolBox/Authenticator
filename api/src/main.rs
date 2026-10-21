#[tokio::main]
async fn main() {
    let version = env!("CARGO_PKG_VERSION");
    if auth::run("config.toml", version).await.is_err() {
        std::process::exit(1)
    }
}
