# syntax=docker/dockerfile:1

FROM rust:1-bookworm AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/app/target \
    cargo build --release --locked \
    && cp target/release/authenticator-api /usr/local/bin/authenticator-api

FROM debian:bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --system --uid 10001 authenticator
WORKDIR /app
COPY --from=build /usr/local/bin/authenticator-api /usr/local/bin/authenticator-api
COPY config.toml ./config.toml
USER authenticator
EXPOSE 8090
CMD ["authenticator-api"]
