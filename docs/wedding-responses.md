# Wedding responses

Flyway migration `V3__wedding_responses.sql` creates private RSVP storage and a separate moderated Guestbook. The combined page at `/rsvp` accepts one attendance confirmation and party size for all five events. Guests can submit a separate blessing for consideration for the public wall. Blessings start pending and only selected messages appear. Hiding a blessing or returning it to pending removes it from the public wall. The legacy RSVP endpoint still honours the original opt-in for older callers.

Admin routes (admin host and authentication required):

- `/wedding/rsvps` lists private RSVPs with a confirmed headcount. Older confirmed responses without a party size count as one.
- `/wedding/blessings` shows pending, published and hidden messages, with CSRF-protected moderation actions.
- The older `/explorer/rsvps` and `/explorer/blessings` links still resolve.

Public POST routes `/rsvp/confirm`, `/guestbook`, and the legacy `/rsvp` enforce the wedding host, validation, CSRF, a honeypot and ten submissions per client address per ten minutes. Addresses are held in a bounded in-memory limiter, not stored with responses. Client identity uses the server remote address; forwarded address handling relies on the trusted reverse proxy configuration. VM test hosts block submissions and blessing moderation. There are no public RSVP listing or contact detail endpoints.

Run `./mvnw test` for H2 migration, integration and rendering coverage. The persistence/moderation tests also run against a disposable PostgreSQL database by overriding `spring.datasource.url`, `spring.datasource.driver-class-name`, `spring.datasource.username` and `spring.datasource.password` when running `WeddingResponsesTest`. Use a separate database; never run test fixtures or preview migrations against production.

On a separately authorized release, the normal deployment script applies V3 using Flyway before startup. The migration is additive; it changes no existing tables. Database writes should be verified with test fixtures in the isolated database before release. A code rollback does not remove the added tables or submitted responses. Back up production through the infrastructure runbook before releasing schema changes.

The local review instance uses an isolated PostgreSQL database and test admin credentials. It does not read or write production data. Responses in that instance are review data only.
