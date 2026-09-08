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
- Infrastructure and VM runbooks live in `/Users/poojanthumar/Documents/Code/personal-ai-infra`
  on the Mac and `/home/ubuntu/workspaces/personal-ai-infra` on the Oracle VM.
- Cross-task handoffs are documented in that repository's `COLLABORATION.md`.
- Deployment target: `/opt/website-handler` on `ubuntu@100.105.56.99` over Tailscale.
- Deploy only committed code through `deploy/deploy-vm.sh`; verify health and all public hosts.

## AI-assisted UI preview workflow

Website changes default to UI preview only. Do not merge into main, push main, or deploy
production unless the user explicitly asks to release. The user reviews through AI-provided
links and a short explanation, rather than managing preview commits manually.

1. Read `./deploy/status-on-vm.sh`, fetch origin, and create a `codex/<short-description>`
   branch from origin/main. Keep changes committed. Never edit `/opt/website-handler`.
2. Run `./mvnw test`. Preview the latest committed work on the current branch using
   `./deploy/preview-on-vm.sh <site> HEAD`; do not supply an older or arbitrary commit.
3. Check preview health and inspect the rendered UI. Report the exact preview page URL,
   the short commit hash, and a concise list of visible changes so the user knows what
   to review. For a revision, refresh the same preview with the newest committed work.
4. Leave the preview available for review (it expires after 24 hours). Production remains
   unchanged until the user explicitly requests release.
5. On an explicit release request, merge and push main, deploy the approved commit through
   the deployment scripts, verify production health and all public hosts, then stop preview.

Only one preview runs at a time, on localhost:9080. Wildcard DNS resolves test-<site>
hostnames, but Caddy serves only the exact host activated by the preview script.
Use test-www, test-wedding, or test-admin for the corresponding application surface.
Preview is for checking UI changes; do not perform production mutations during review.

The requested preview behavior is production-like rendering using the same live production
PostgreSQL database, with only one preview at a time. Preview is for UI review: use a
read-only database role, disable Flyway/schema changes and background writes in preview,
and prevent mutation actions from changing production data. Never run preview migrations
against production. Changes requiring schema migrations need a separate testing workflow.

Implementation gap: `preview-on-vm.sh` currently recreates a separate preview database.
It does not yet implement the requested shared production database or read-only controls.
Before enabling shared-data preview, implement and verify these controls; do not merely
replace DATABASE_URL while retaining production write credentials.

Production and preview history lives in `/home/ubuntu/website-deployments/history.tsv`.
The status script's saved preview URL/commit is historical when the service is inactive.
Use `./deploy/rollback-on-vm.sh` when the user requests a production rollback.
