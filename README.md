# personal-website-handler

One Spring Boot process serves three sites from the HTTP `Host` header:

| Host | Site |
|------|------|
| `www.poojanthumar.in` (also `localhost`, `127.0.0.1`, `www.localhost`) | Personal portfolio |
| `wedding.poojanthumar.in` (also `wedding.localhost`) | Wedding — homepage and Roka |
| `admin.poojanthumar.in` (also `admin.localhost`) | Admin portal (login required) |

Later ceremonies (engagement, date reveal, digital invites) are out of scope for this version.

## Requirements

- Java 21
- Maven Wrapper (`./mvnw`) — no system Maven install required
- Local development uses **H2**. PostgreSQL is optional (`postgres` profile). The Oracle VM database is **not** required.

## Development

```bash
./mvnw spring-boot:run
```

File-backed H2 (survives restarts):

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The server listens on `http://127.0.0.1:8080`. Routing is by `Host` header, not by extra ports.

### Test the three sites with curl

```bash
curl -sS -D- -o /tmp/www.html -H 'Host: www.poojanthumar.in' http://127.0.0.1:8080/
curl -sS -D- -o /tmp/wedding.html -H 'Host: wedding.poojanthumar.in' http://127.0.0.1:8080/
curl -sS -D- -o /tmp/roka.html -H 'Host: wedding.poojanthumar.in' http://127.0.0.1:8080/roka
curl -sS -D- -o /tmp/admin.html -H 'Host: admin.poojanthumar.in' http://127.0.0.1:8080/
```

Admin without a session should **302** to `/login`.

Optional `/etc/hosts` aliases (`www.localhost`, `wedding.localhost`, `admin.localhost`) are configured in `application-dev.properties` if you prefer a browser over curl.

### Contact API

Submit (public JSON; used by the portfolio form as well as `/contact`):

```bash
curl -X POST http://127.0.0.1:8080/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","message":"Hello from the website handler"}'
```

List (admin only; 401 without credentials):

```bash
curl -u "$ADMIN_USER:$ADMIN_PASSWORD" http://127.0.0.1:8080/api/contact
```

HTML contact form posts to `/contact` on the www host (CSRF token required).
Both contact entry points are restricted to the www host, silently discard a hidden
honeypot field, and allow five accepted submissions per client IP every ten minutes.
Configure this with `app.contact.max-requests` and `app.contact.rate-limit-window`.

### Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `ADMIN_USER` | `admin` | Admin login name |
| `ADMIN_PASSWORD` | `change-me` | Admin password (override in any real environment) |
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/website` | Used with `postgres` profile |
| `DATABASE_USER` | `website` | Postgres user |
| `DATABASE_PASSWORD` | empty | Postgres password |

Never commit a real admin password. Generate one and export `ADMIN_PASSWORD` before running in a shared environment.

### PostgreSQL

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

Schema is applied by Flyway (`src/main/resources/db/migration`). Hibernate `ddl-auto` is `validate`.

### Tests

```bash
./mvnw test
```

Tests use in-memory H2 (`test` profile).

### Health

```bash
curl http://127.0.0.1:8080/actuator/health
```

## Production deployment

Caddy proxies the public hosts to the application on `127.0.0.1:8080`. See
`deploy/Caddyfile.example` for the routing shape.

Production uses the `postgres,prod` profiles. The `prod` profile honors Caddy's
forwarded HTTPS headers, marks session cookies secure, and suppresses detailed public
health information. After committing and pushing `main`, deploy that commit with:

```bash
./deploy/deploy-vm.sh
```

The script runs tests, deploys only a commit on `origin/main`, rolls the VM back if
the service health check fails, and verifies all three HTTPS hosts.
