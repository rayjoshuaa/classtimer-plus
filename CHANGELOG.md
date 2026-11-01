# Changelog

All notable changes to ClassTimer+ are recorded here. Versions follow the releases of the single-file app.

## [1.5.0] — 2026-11-01

Owner review round 3 (Project Owner feedback on the live app, with screenshots):

- **Fix — the time could overlap the ring.** The digits were sized from the viewport width while the ring is sized from the viewport height, so on wide, short screens (or at browser zoom) "05:00" grew wider than the circle and crossed its stroke. The digits are now sized from the ring itself (container units, `cqw`), so the time always fits inside the circle at any window shape or zoom; overtime counts use a slightly smaller size for the extra character.
- **Tab label:** the browser tab now reads **Teacher Tools: ClassTimer+** (favicon unchanged); while the timer runs, the live countdown still prefixes it so the time can be read from the tab.
- **Wider stage:** the card now spans about 80% of the window (capped at 980px) instead of a narrow 700px column.
- **No personal name in the interface:** the header eyebrow is now simply "Teacher Tools", and the footer credit line is gone.
- **Practical footer:** the footer is now the keyboard-shortcut reference (Space / − / + / R / F as key caps, always visible) plus a one-line "Free forever · No sign-up · Works offline".
- **Status above the ring:** the stage pill (Ready / On track / …) sits above the circle again — outside it, so nothing competes with the digits.
- **Instructions behind an info icon:** the standing instruction sentence under the timer is removed. A round ⓘ button beside the status pill opens a "How to use" panel with the steps and shortcuts (closes on outside click or Esc). The line under the controls is now only for transient feedback (paused state, overtime, and the custom-time error).

## [1.4.0] — 2026-11-01

Senior UX review pass (the Project Owner asked for a UI/UX audit of the live app — what was not appropriate, fixed):

- **The timer is the hero now.** The header is slimmed to a compact wordmark and a one-line tagline (which steps aside on shorter screens), and the reclaimed space goes to the countdown: the ring grows to up to 440px and the digits to up to 140px — sized to be read from the back of a classroom.
- **Status moved out of the ring for good.** The stage pill no longer sits inside the circle above the digits; it sits beside the status sentence below the ring, so the digits are dead-centre and nothing competes with them.
- **Clearer controls.** Start/Pause is unmistakably the primary action (larger and wider than every other control); the ± buttons now read "1 min" with their icon instead of an ambiguous "1:00", flank the primary button, and every secondary action uses a quieter utility size.
- **Settings are switches.** The two raw browser checkboxes are now proper glass pill toggle switches, moved out of the card into a slim settings strip beneath it — set-once preferences no longer compete with the timer controls.
- **Glass edges made honest.** Chips, buttons and inputs gained a faint wine-tinted edge so they stay defined over the bright background glows (the old white-on-white glass border could vanish), and the card glass is slightly more opaque for text contrast.
- **Stage glows agree with the stage.** The background glows now follow the stage colour — the teal glow no longer fights the red "almost done" stage.
- **Focus visibility.** The keyboard focus outline changed from pale gold to wine, so it can actually be seen on the light background.
- **Responsive ladder reworked** (breakpoints at 900px and 740px height) so header, card, settings and footer all stay on screen at common laptop and projector heights.
- No behaviour changes: same element IDs, storage key, stage thresholds, chime and keyboard shortcuts.

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
