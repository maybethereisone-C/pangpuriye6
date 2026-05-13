# Pangpuriye Static Frontend

Vanilla HTML/CSS/JS refactor lives here until Tew says `Go`.

## Runtime API

Do not hardcode API keys, member data, gallery data, or category data in runtime JS. The browser fetches live API data at page load:

- `GET /member?limit=30`
- `GET /media/category`
- `GET /media/gallery?limit=100`

Supported env:

```sh
NEXT_PUBLIC_API_BASE_URL=https://your-host/api/v1/pangpuriye
API_AUTH_HEADER=api-key
API_AUTH_VALUE=
```

Docker generates `runtime-env.js` from those env vars at container start. Static content JSON remains only for non-member/non-gallery copy that the API does not expose.

The API key stays server-side. In Docker, nginx proxies same-origin `/api/v1/pangpuriye/*` to `API_UPSTREAM_URL` and injects `API_AUTH_HEADER/API_AUTH_VALUE` from env.
