# Changelog

All notable changes to ClassTimer+ are recorded here. Versions follow the releases of the single-file app.

## [1.3.0] — 2026-11-01

Owner review round 2 — visual restyle (Project Owner: the flat render was not premium enough):

- **Glassmorphism restyle in the same family palette** — frosted-glass card (translucent white gradient, 18px backdrop blur, bright glass border, deep soft shadow) over richer gold/teal/wine background glows; preset chips, buttons, stage pill and inputs are now glass too, with the wine gradient kept for the primary button and the active preset. Chunky press-down control behaviour retained. A no-`backdrop-filter` fallback keeps the app solid on older browsers.
- **Fix:** the status line ("Pick a time, then press Start") sat inside the ring and collided with the ring's lower arc, wrapping and striking through. It now sits below the ring, and the time display is slightly smaller — nothing overlaps at any size.
- Layout budget re-checked: fits `100dvh` without scrolling at normal heights with the footer visible.

## [1.2.1] — 2026-11-01

Documentation only (no app changes):

- README rewritten — plainer, more informative and more professional, with a keyboard-shortcut table and an "Under the hood" section.
- `AGENTS.md` moved into `docs/`, so the repository root shows the app and its public documents at first glance.

## [1.2.0] — 2026-11-01

Owner review round (Project Owner feedback on the live site):

- Added a **−1:00 button** beside +1:00 (before starting it shortens the set timer; while running or paused it takes a minute off the clock; keyboard `−` / `+` work too).
- **Fit-to-screen layout:** the app now fills the viewport (`100dvh`) with no scrolling at normal laptop/projector heights — the ring sizes from viewport height and spacing is compressed; the tagline hides on short screens, and scrolling returns only below 600px height so nothing is ever clipped.
- **Tactile controls** (the family style direction): buttons and chips gained a physical bottom edge and a press-down motion; inputs gained a soft inset; the ring sits on a soft shadow.
- Docs: deployment record corrected — the site is deployed from this repository via Cloudflare Pages Git integration (automatic on push), so the earlier manual-upload exception is retired. README live link confirmed.

## [1.1.0] — 2026-11-01

UAES adoption revision (UAES-001 v1.0, Level 1; UAES-UI-001):

- Accessibility: screen-reader announcements moved to a dedicated live region (`#srStatus`) that speaks only on state changes, instead of the whole timer ring updating every tick.
- Accessibility: text contrast raised to WCAG 2.2 AA — darker muted, stage-label, eyebrow, overtime and keyboard-hint colours; decorative gold kept for graphics only.
- Accessibility: preset chips and custom inputs raised to 44px touch targets.
- Fix: the chime's AudioContext is now created/resumed inside the Start gesture (`warmAudio()`), so the chime reliably sounds in browsers that block audio before interaction.
- Fix: pressing Set with an empty or zero custom time now gives visible feedback and focuses the minutes field, instead of silently doing nothing.
- Fix: the Fullscreen button hides itself where the Fullscreen API is unavailable.
- Docs: added `PROJECT-COMPLIANCE.md` (UAES Level 1 record, incl. the AGENTS.md and manual-deployment exceptions) and `AGENTS.md`.

## [1.0.0] — 2026-11-01

- Initial release: traffic-light stage timer with progress ring, presets 1–30 min, custom minutes/seconds, gentle three-note chime, overtime counting, +1:00 button, fullscreen, keyboard shortcuts (Space/R/F), and last-duration memory.
