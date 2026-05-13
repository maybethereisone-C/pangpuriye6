# syntax=docker/dockerfile:1

# Static frontend image for the vanilla refactor.
# The protected API is synced before build by `node new/scripts/sync-api-data.mjs`.
FROM nginx:1.27-alpine

USER root

RUN apk add --no-cache gettext

COPY . /usr/share/nginx/html

RUN chmod +x /usr/share/nginx/html/docker-entrypoint.sh \
 && chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run /var/log/nginx

USER nginx

EXPOSE 3000

CMD ["/usr/share/nginx/html/docker-entrypoint.sh"]
