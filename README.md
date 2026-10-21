# Authenticator

Service d'authentification prêt à l'emploi : comptes, login, refresh, reset de mot de passe par mail,
rôles par portail et API d'administration. Vous clonez ce dépôt, vous lancez `docker compose up -d` puis `cargo run`, vous
adaptez le nom et les préfixes à votre produit. C'est tout.

## Ce que c'est

La brique d'authentification ToolBox est faite de deux librairies :

| Librairie | Rôle |
|---|---|
| [`TB-Api-Auth`](https://github.com/QVL-ToolBox/TB-Api-Auth) (crate Rust `auth`) | Tout le service : routes, jetons, MongoDB, mails. Elle s'utilise par un seul appel, `auth::run`. |
| [`TB-Portal-Authenticator`](https://github.com/QVL-ToolBox/TB-Portal-Authenticator) (paquet npm [`@canop/auth-portals`](https://www.npmjs.com/package/@canop/auth-portals)) | Écrans d'authentification et d'administration côté navigateur. |

Ce dépôt est l'**assemblage** de ces deux librairies. Il ne contient presque pas de code : un `main.rs`
de quelques lignes, un `config.toml`, un `docker-compose.yml` et vos secrets. Le comportement complet
(endpoints, codes HTTP, règles de mot de passe, schéma Mongo) est décrit dans le README de `TB-Api-Auth`.
Toutes les dépendances sont publiques (GitHub et npmjs) : aucun compte ni identifiant n'est nécessaire.

```
api/                 service Rust (main.rs + config.toml + Dockerfile de déploiement)
portal-auth/         portail d'authentification (login, inscription, reset, compte), port 5173
portal-admin/        portail d'administration (comptes, rôles, portails), port 5174
docker-compose.yml   MongoDB + Mailpit (mails de test) pour le dev local
.env.example         secrets à copier vers .env
```

## Prérequis

- **Rust** stable (1.85 ou plus, edition 2024). Sous Windows, définir `AWS_LC_SYS_PREBUILT_NASM=1`.
- **Docker** pour MongoDB et Mailpit. Une MongoDB déjà installée sur `localhost:27017` convient aussi :
  lancer alors seulement `docker compose up -d mailpit`.

## Démarrer en 5 minutes

1. Copier les secrets : `cp .env.example .env`
2. Dans `.env`, renseigner `JWT_SECRET` avec la sortie de `openssl rand -hex 32`, et choisir un
   `ADMIN_PASSWORD` (12 caractères minimum, une majuscule, une minuscule, un chiffre, un caractère spécial,
   absent des listes de mots de passe compromis). Un mot de passe trop faible bloque le démarrage.
3. Lancer l'infrastructure : `docker compose up -d`
4. Lancer le service, depuis `api/` : `cargo run` (le `.env` à la racine est lu automatiquement).
5. Vérifier : `curl http://127.0.0.1:8090/health` doit répondre `200` avec `"mongodb":"ok"`.
   Les mails envoyés (reset de mot de passe) sont visibles sur http://localhost:8025.

Au premier démarrage, le compte `ADMIN_EMAIL` / `ADMIN_PASSWORD` est créé avec le rôle `admin`. Aux
démarrages suivants, il n'est pas recréé : changer `ADMIN_PASSWORD` dans `.env` ne change pas le mot de
passe d'un compte existant.

```sh
curl -i -X POST http://127.0.0.1:8090/login   -H "Content-Type: application/json"   -d '{"email":"admin@example.com","password":"<ADMIN_PASSWORD>"}'
curl -i -X POST http://127.0.0.1:8090/password/forgot   -H "Content-Type: application/json"   -d '{"email":"admin@example.com"}'
```

Le mail part en SMTP sans TLS vers Mailpit sur `127.0.0.1:1025` : la librairie n'accepte `tls = "none"`
que vers une adresse loopback, pour qu'un mot de passe ne circule jamais en clair sur un réseau.

## Adapter à mon produit

Tout se règle dans `api/config.toml`, commenté clé par clé. Chaque clé est surchargeable par une variable
`<env_prefix>__SECTION__CLE` (par exemple `APP__SERVER__LOG_LEVEL=DEBUG`).

| Clé | À changer pour |
|---|---|
| `project.name` | Le nom de votre service (renvoyé par `/ping` et `/health`) |
| `project.env_prefix` | Le préfixe de vos variables d'environnement. En le changeant, renommer aussi `APP__…` dans `.env` et `docker-compose.yml`. |
| `token.cookie_prefix` | Le préfixe des cookies (`<prefix>_token`, `<prefix>_refresh`, `<prefix>_device`). Si une gateway lit le cookie, son nom doit valoir `<prefix>_token`. |
| `token.issuer`, `token.audience` | Les claims `iss` et `aud` de vos jetons. Les backends qui vérifient les jetons doivent attendre ces valeurs. |
| `[[portals]]` | Un bloc par portail servi. `admin` est obligatoire et jamais `open`. Chaque `audience` est unique. Une gateway demande l'accès à un portail par l'en-tête `X-Portal: portail_<name>` sur `GET /validate`. |
| `password_reset.product_name` | Le nom affiché dans le sujet du mail de réinitialisation |
| `password_reset.url` | La page de votre portail d'auth qui reçoit `?token=…` |
| `[mail]` | Votre serveur SMTP. Le mot de passe SMTP ne va jamais dans le fichier : `APP__MAIL__PASSWORD`. Sans `[mail]` ni `[password_reset]`, le reset répond 202 sans envoyer de mail. |

### Passage en production

- `APP__ENVIRONMENT=prod` : les cookies sont toujours `Secure`, quel que soit `token.cookie_secure`.
- `tls = "none"` est refusé en prod : passer `[mail]` en `tls` ou `starttls` vers votre vrai SMTP, avec
  `user` dans le fichier et `APP__MAIL__PASSWORD` dans l'environnement.
- `token.cookie_domain` (par exemple `.mon-produit.com`) pour partager la session entre sous-domaines.
- `JWT_SECRET` et `ADMIN_PASSWORD` propres à la prod, `password_reset.url` en HTTPS.
- Une seule instance de l'api par produit (la garde « dernier admin » est en mémoire).
- Le `docker-compose.yml` est un environnement de dev ; `api/Dockerfile` construit l'image de déploiement
  (`docker build -t authenticator-api api/`, sans identifiant : toutes les dépendances sont publiques).

## Mettre à jour la brique

Changer le tag de `auth` dans `api/Cargo.toml`, puis depuis `api/` :

```sh
cargo update -p auth
cargo build
```

Lire le CHANGELOG de `TB-Api-Auth` entre les deux versions (clés de configuration ajoutées ou renommées),
puis committer `Cargo.toml` et `Cargo.lock` ensemble.

## Portails

Deux portails React minces sur `@canop/auth-portals` : tout le portail tient dans `src/config.ts`,
`src/main.tsx` ne fait que le monter.

| Dossier | Rôle | Dev | Appels API |
|---|---|---|---|
| `portal-auth/` | Login, inscription, mot de passe oublié, reset (`/reset-password`, la page visée par `password_reset.url`), compte, CGU | http://localhost:5173 | `/api/auth` |
| `portal-admin/` | Tableau de bord, comptes, rôles, portails (rôle `admin` requis) | http://localhost:5174 | `/api/auth` (session), `/api/admin` |

Pour chacun, depuis son dossier, l'api tournant sur le port 8090 :

```sh
cp .env.example .env
npm install
npm run dev
```

En dev, le serveur Vite proxifie `/api/auth` et `/api/admin` vers `http://127.0.0.1:8090` en retirant ce
préfixe : l'api expose ses routes à la racine (`/login`, `/me`, `/users`…). Les cookies `app_*` sont posés
sur `localhost` et partagés par les deux portails. Un admin non connecté sur le portail admin est renvoyé
vers `portal-auth`, puis ramené après connexion.

### Personnaliser

Dans `src/config.ts` de chaque portail :

| Clé | Effet |
|---|---|
| `appName` | Nom affiché dans l'en-tête, l'onglet et les CGU |
| `branding.logo` (`portal-auth`) | Logo de l'en-tête, n'importe quel `ReactNode` |
| `branding.theme` | Mode clair/sombre (`defaultMode`), clé de stockage, saison. Les couleurs sont celles du thème de `@canop/ui`. |
| `branding.layout` (`portal-auth`), `adminLayout` (`portal-admin`) | Cadre des pages, à remplacer par un composant `{ children }` |
| `messages` | Tout texte fr/en, dont les libellés des portails `auth.admin.portal.<name>` |
| `redirect.cookieName` | Cookie de retour après connexion, identique dans les deux portails |

Variables Vite (`.env`) : `VITE_TRUSTED_REDIRECT_ORIGINS` (`portal-auth`, origines acceptées après
connexion, séparées par des virgules) et `VITE_AUTH_PORTAL_URL` (`portal-admin`, origine du portail d'auth).

### Production

`npm run build` puis `npm start` : `server.js` sert `dist/` et proxifie `/api/*` vers `GATEWAY_URL`
(défaut `http://localhost:8080`) sur `PORT`, avec les en-têtes de sécurité. La gateway doit router
`/api/auth/*` et `/api/admin/*` vers l'api en retirant le préfixe, et filtrer `/api/admin` par `GET /validate`
avec `X-Portal: portail_admin`. Le déploiement embarque `node_modules` (`npm ci --omit=dev`).
