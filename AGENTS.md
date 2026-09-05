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
- Cross-task handoffs are documented in that repository's `COLLABORATION.md`.
- Deployment target: `/opt/website-handler` on `ubuntu@100.105.56.99` over Tailscale.
- Deploy only committed code through `deploy/deploy-vm.sh`; verify health and all public hosts.

## Remote phone-to-production workflow

When this repository is opened on the Oracle VM from Codex, assume a user request for a
website fix authorizes the complete reversible delivery workflow unless the prompt says
`preview only` or `do not deploy`:

1. Fetch `origin`, create a `codex/<short-description>` branch from `origin/main`, and keep
   every change in a commit. Never edit the production checkout in `/opt/website-handler`.
2. Run `./mvnw test`, then start the temporary wedding preview with
   `./deploy/preview-on-vm.sh HEAD`. Report `https://test.wedding.poojanthumar.in`.
3. Check the preview health endpoint. For UI work, inspect the rendered page before release.
4. Merge the branch into `main`, push `main`, and run `./deploy/release-on-vm.sh <commit>`.
5. Verify production health and the affected public host, then stop the preview with
   `./deploy/stop-preview-on-vm.sh`.

The preview uses a separate PostgreSQL database copied from production and expires after
24 hours. Read `./deploy/status-on-vm.sh` before every deployment. Production and preview
history lives in `/home/ubuntu/website-deployments/history.tsv`. Use
`./deploy/rollback-on-vm.sh` to restore the preceding successful production commit.
