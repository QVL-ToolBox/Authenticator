# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [0.2.0] - 2026-10-20

### Modifié

- Dépendances publiques : `auth` v0.8.1 depuis https://github.com/QVL-ToolBox/TB-Api-Auth (Missive v2.0.2 depuis GitHub), `@canop/auth-portals` et `@canop/ui` depuis npmjs. Plus aucun identifiant requis : `api/.cargo/config.toml` et les `.npmrc` des portails sont supprimés, le `Dockerfile` n'utilise plus de secret.
- Licence MIT. Chaque release est reflétée sur https://github.com/QVL-ToolBox/Authenticator (pipeline `azure-pipelines.yml` : tag `vX.Y.Z` et miroir, version lue dans ce CHANGELOG).

## [0.1.0] - 2026-10-19

### Ajouté

- Service `api/` sur la brique `auth` v0.7.0 : `main.rs` réduit à `auth::run`, `config.toml` neutre (projet `my-product`, préfixe `APP`, portails `admin` et `home`).
- `docker-compose.yml` de dev : api, MongoDB 7 et Mailpit (mails sur http://localhost:8025, api sur http://localhost:8080).
- Dockerfile multi-stage ; le PAT Azure DevOps passe par un secret BuildKit, jamais dans l'image.
- `.env.example` et guide « démarrer en 5 minutes ».
