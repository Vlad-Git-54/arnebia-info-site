# REG.RU VPS deployment

This directory contains the preview deployment for a plain VPS with Docker.

```bash
cd /opt/arnebia-info-site/deploy/reg-ru
docker compose up -d --build
```

The default Caddyfile serves the site over HTTP on port 80 by IP address.
When a real domain is connected, replace `:80` in `Caddyfile` with the domain
name, then run:

```bash
docker compose up -d
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
```
