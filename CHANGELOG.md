# Changelog

All notable changes to ClassTimer+ are recorded here. Versions follow the releases of the single-file app.

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
