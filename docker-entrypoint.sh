#!/bin/sh
set -eu

: "${API_BASE_URL:=/api/v1/pangpuriye}"
: "${API_UPSTREAM_URL:=https://www.pangpuriye.info/api/v1/pangpuriye}"
: "${API_AUTH_HEADER:=api-key}"
: "${API_AUTH_VALUE:=}"

envsubst '${API_BASE_URL}' \
  < /usr/share/nginx/html/runtime-env.template.js \
  > /usr/share/nginx/html/runtime-env.js

envsubst '${API_UPSTREAM_URL} ${API_AUTH_HEADER} ${API_AUTH_VALUE}' \
  < /usr/share/nginx/html/nginx.conf.template \
  > /tmp/nginx.conf

exec nginx -c /tmp/nginx.conf -g 'daemon off;'
