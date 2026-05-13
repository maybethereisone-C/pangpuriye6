# ── build stage: nothing to compile, just prune dev-only files ────────────
FROM alpine:3.20 AS pruner

WORKDIR /site

COPY index.html   ./
COPY css/         ./css/
COPY html/        ./html/
COPY js/          ./js/
COPY logo/        ./logo/

# Remove any leftover dev artefacts if they slip in
RUN find . -name "*.DS_Store" -delete \
 && find . -name "*.map"     -delete


# ── runtime stage ─────────────────────────────────────────────────────────
FROM nginx:alpine3.20-slim

# Copy pruned site files
COPY --from=pruner /site /usr/share/nginx/html

# Replace default nginx config with our tuned one
COPY nginx.conf /etc/nginx/nginx.conf

# nginx:alpine-slim already runs as root to bind :80 then drops privileges.
# Expose HTTP only — TLS termination belongs in the reverse proxy / LB layer.
EXPOSE 80

# Validate config at build time
RUN nginx -t

CMD ["nginx", "-g", "daemon off;"]
