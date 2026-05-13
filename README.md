# Pangpuriye — Super AI Engineer S6 L2

Digital yearbook for **Pangpuriye**, cohort of Super AI Engineer Season 6, Level 2 (AIAT).

Built with vanilla HTML, CSS, and JavaScript. Served via nginx in Docker.

## Stack

- HTML / CSS / Vanilla JS (ES modules)
- nginx 1.27 (static server + API proxy)
- Docker

## Development

```sh
# Python static server (no-cache, port 4174)
python3 server.py

# CORS proxy to live API (port 4175)
node proxy.js
```

## Docker

```sh
docker build -t pangpuriye6 .

docker run -p 3000:3000 \
  -e API_UPSTREAM_URL=https://www.pangpuriye.info/api/v1/pangpuriye \
  -e API_AUTH_HEADER=api-key \
  -e API_AUTH_VALUE=<secret> \
  pangpuriye6
```

The container generates `runtime-env.js` at startup from env vars. nginx proxies `/api/v1/pangpuriye/*` to the upstream API with auth headers injected server-side.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `API_BASE_URL` | `/api/v1/pangpuriye` | Browser-facing API base (proxied by nginx) |
| `API_UPSTREAM_URL` | `https://www.pangpuriye.info/api/v1/pangpuriye` | Real upstream API |
| `API_AUTH_HEADER` | `api-key` | Auth header name |
| `API_AUTH_VALUE` | _(empty)_ | Auth header value — keep secret, never commit |

## License

MIT — see `LICENSE`. Font licenses in `LICENSE.fonts.md`.
