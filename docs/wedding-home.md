# Wedding home page

Scope: the wedding host's home page only. Static Thymeleaf copy; no wedding-content query, migrations, RSVP submission, or new event routes. Portfolio, admin, and the existing Roka route remain unchanged. The current Roka route is intentionally not linked because the new Roka design is a future chapter.

## Review locally

Run `./mvnw spring-boot:run -Dspring-boot.run.arguments='--server.port=8091 --server.address=127.0.0.1'` and open http://wedding.localhost:8091/ . The default profile uses in-memory H2. Do not activate production profiles for local review.

## Content and future pages

The supplied invitation confirms 2026 and all event times. Wedding: December 13 at 8 AM. The separate muhurat is deliberately omitted at the user's request. Engagement, Haldi, and Sangeet: December 12 at 9 AM, 4 PM, and 9 PM respectively; all IST. No date was supplied for Roka.

Each native `details` postcard has a stable `event-*` ID and a future-page message. When a dedicated event page is implemented, replace that message with the corresponding real link. Do not link to unfinished routes. RSVP remains a notice until its separate form is built.

No employer, college, relationship dates, extended family names, original private photos, or invitation video are published. The artwork is imaginative, not a photograph of the venue. The supplied map link is retained.

## Motion and accessibility

Native scrolling drives reversible doors and a garden zoom, with a sticky story section. The invitation can be skipped. All text and native event disclosures work without JavaScript. Reduced-motion users see the open invitation with no pinned scenes. A motion toggle is also available. No audio is loaded. Assets are local except Google Fonts, with serif/sans-serif fallbacks.

## Artwork

Created using the built-in image generation tool. Only the supplied photographs informed the couple's likeness; no frame from the reference video is used as a site asset. The final images were compressed to JPEG for delivery.

- `src/main/resources/static/images/wedding/couple-pink.jpg`: illustrated couple in a floral garden, pink-and-gold bridal outfit and ivory groom outfit.
- `src/main/resources/static/images/wedding/garden-doors.jpg`: closed carved double doors with garlands and Ganesh relief. CSS splits the same image into two opening leaves.

Final prompts are recorded in `wedding-art-prompts.md`. Lucide icons use the existing bundled license in `static/images/lucide/LICENSE.txt`.
