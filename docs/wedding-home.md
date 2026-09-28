# Wedding home page

Scope: the wedding host's home page only. Static Thymeleaf copy; no wedding-content query, migrations, RSVP submission, or new event routes. Portfolio, admin, and the existing Roka route remain unchanged.

## Review locally

Run `./mvnw spring-boot:run -Dspring-boot.run.arguments='--server.port=8091 --server.address=127.0.0.1'` and open http://wedding.localhost:8091/ . The default profile uses in-memory H2. Do not activate production profiles for local review.

## Content and future pages

The supplied invitation confirms 2026 and all event times. Wedding: December 13 at 8 AM. The separate muhurat is deliberately omitted at the user's request. Engagement, Haldi, and Sangeet: December 12 at 9 AM, 4 PM, and 9 PM respectively; all IST.

Each event card opens a native modal dialog with a stable `placard-*` ID. Replace its disabled future-event-link button with a real anchor when the dedicated event page is implemented. Roka is omitted from the home schedule. Do not link to unfinished routes. RSVP remains a notice until its separate form is built.

No employer, college, relationship dates, extended family names, original private photos, or invitation video are published. The artwork is imaginative, not a photograph of the venue. The supplied map link is retained.

## Motion and accessibility

A click opens the envelope and lifts the letter; native scrolling enlarges it into the invitation. The opening can be skipped. Without JavaScript the invitation and compact schedule remain visible; interactive placards require JavaScript. Reduced-motion users can open or skip directly to the static invitation. A motion toggle is also available. No audio is loaded. Assets are local except Google Fonts, with serif/sans-serif fallbacks.

## Artwork

Created using the built-in image generation tool. Only the supplied photographs informed the couple's likeness; no frame from the reference video is used as a site asset. The final images were compressed to JPEG for delivery.

- `src/main/resources/static/images/wedding/couple-pink.jpg`: illustrated couple in a floral garden, pink-and-gold bridal outfit and ivory groom outfit.
- `src/main/resources/static/images/wedding/couple-logo.png` and `favicon.png`: user-provided logo and resized favicon. The envelope is built in CSS.

Final prompts are recorded in `wedding-art-prompts.md`. Wedding icons are copied from the user-provided Bootstrap Icons package; their license is in `static/images/bootstrap/LICENSE`.
