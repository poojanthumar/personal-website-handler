# Wedding invitation motion reference

Source: `Reference.mp4`, the 32-second phone recording supplied on 26 November 2026. The clip is a pacing reference for this daytime Gujarati wedding. Use our own ceremony imagery and colors. The showcase montage at the end is outside the invitation flow.

## Sequence to carry forward

- **About 2–5 s, tap and response.** The scene stays framed while light spreads through it. The tap changes the scene before the next message arrives. On this site, the door video supplies that response and starts inline from its first frame.
- **About 5–10 s, celebration then title.** The main effect peaks and makes room for the words. Reveal the blessing, couple names, and actions in order inside the same stage. Put the movement around the text and keep the text readable at rest.
- **About 11–17 s, scroll then touch.** A single swipe carries the scene into the date chapter. The page rests while the guest scratches. Keep the date and venue together for our invitation, and provide a button that reveals the same details without scratching.
- **About 17–25 s, family, story, celebrations.** A steady vertical rhythm links sections, while selected content enters once. Leave headings, images, and practical links in a stable layout after their entrance. Let rituals and family content provide the character.

## Apply to future pages

Use one main effect per screen or ritual. Start with a recognizable ceremony cue, reveal the title and details in reading order, then leave room for the guest to act. Keep ceremony names, times, and cultural details grounded in approved wedding content. Daylight and the current garden treatment set the home page mood. Other events can use their own approved lighting and palette.

The homepage uses [wedding-chapters.css](../src/main/resources/static/css/wedding-chapters.css) for the text beats and one-time section entrances. The hero follows the existing scroll progress. Chapters below the hero use simple opacity and short translations. For another page, mark a section group with `data-chapter-reveal` inside an `.invitation-chapters` container only where that entrance adds something. Content should stay readable with JavaScript off, motion paused, or reduced motion enabled.

Check the sequence from a fresh tab, with a quick swipe, with back-scroll, and with the keyboard. Verify that the date and RSVP remain reachable without motion or gestures. Test the video on a physical iPhone using the [opening video guide](wedding-opening-video.md).
