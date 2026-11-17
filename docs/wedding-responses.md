# Wedding responses

Flyway migration `V3__wedding_responses.sql` creates private RSVP storage and a separate moderated Guestbook. An RSVP always covers all events. A blessing is copied to the moderation queue only when the guest explicitly opts in. Guestbook submissions start pending; only approved messages render publicly. Rejecting or returning a message to pending removes it from the public wall.

Admin routes (admin host and authentication required):

- `/explorer/rsvps`: paginated private attendance, party size, contact information and messages.
- `/explorer/blessings`: pending, approved and rejected queues; CSRF protected moderation actions.

Public POST routes `/rsvp` and `/guestbook` enforce the wedding host, validation, CSRF, a honeypot and ten submissions per client address per ten minutes. Addresses are held in a bounded in-memory limiter, not stored with responses. Client identity uses the server remote address; forwarded address handling relies on the trusted reverse proxy configuration. VM test host submissions are disabled. There are no public RSVP listing or contact detail endpoints.

Run `./mvnw test` for H2 migration, integration and rendering coverage. The persistence/moderation tests also run against a disposable PostgreSQL database by overriding `spring.datasource.url`, `spring.datasource.driver-class-name`, `spring.datasource.username` and `spring.datasource.password` when running `WeddingResponsesTest`. Use a separate database; never run test fixtures or preview migrations against production.

On a separately authorized release, the normal deployment script applies V3 using Flyway before startup. The migration is additive; it changes no existing tables. Database writes should be verified with test fixtures in the isolated database before release. A code rollback does not remove the added tables or submitted responses. Back up production through the infrastructure runbook before releasing schema changes.

The local review instance uses an isolated PostgreSQL database and test admin credentials. It does not read or write production data. Responses in that instance are review data only.
