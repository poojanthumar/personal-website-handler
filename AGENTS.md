# Personal website handler

This repository owns the portfolio, wedding pages, admin UI, and their Spring Boot backend.
It is a Java 21 application using Thymeleaf, Spring Security, JPA, Flyway, and PostgreSQL.

- Keep one deployable application unless a measured scaling or isolation need justifies a split.
- Route by the configured `Host` header: `www`, `wedding`, and `admin` are separate surfaces.
- Guard every public mutation by the expected host and add abuse controls where applicable.
- Put reusable UI in templates/static assets and persistent schema changes in Flyway migrations.
- Use H2 for fast tests and PostgreSQL for production; run `./mvnw test` before delivery.
- Production activates `postgres,prod`, binds to localhost:8080, and runs behind Caddy.
- Never commit `.env`, credentials, generated databases, Maven output, or private content.
- Infrastructure and VM runbooks live in `/Users/poojanthumar/Documents/Code/personal-ai-infra`.
- Deployment target: `/opt/website-handler` on `ubuntu@100.105.56.99` over Tailscale.
- Deploy only committed code through `deploy/deploy-vm.sh`; verify health and all public hosts.
