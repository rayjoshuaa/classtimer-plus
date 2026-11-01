# AGENTS.md — ClassTimer+

Guidance for Thatch (the developer of record) and any future agent working on this repository. This project follows **UAES-001 v1.0, Level 1** — see `PROJECT-COMPLIANCE.md`. The UAES standards repository (rayjoshuaa/application-engineering-standards) is a read-only reference: never edit it.

## What this is

A single-file classroom countdown timer for the projector screen: traffic-light stages, gentle chime, overtime counting. Everything lives in `index.html` (HTML + CSS + vanilla JS). No build step, no dependencies — keep it that way (UAES KISS/YAGNI).

## Invariants — do not break

- Element IDs used by the script: `ringFg`, `timeDisplay`, `stageLabel`, `subLabel`, `srStatus`, `startBtn`, `addBtn`, `resetBtn`, `fullBtn`, `presets`, `customMin`, `customSec`, `customSet`, `soundToggle`, `overtimeToggle`.
- localStorage key: `classtimer_total` (last-used duration in seconds, clamped 1–5999).
- Stage thresholds: green > 50% remaining, amber > 20%, red ≤ 20% or finished. Stage is always paired with a text label — never colour alone.
- Chime: three sine notes (523.25 / 659.25 / 783.99 Hz). Audio must be created/resumed inside a user gesture (`warmAudio()` is called from Start).
- Screen-reader announcements go to `#srStatus` only on state changes — never per second.
- Design tokens (this app's own, per UAES-UI-001): wine `#5c2438`, wine-deep `#451a2a`, gold `#c39a3f` (graphics) / `#9a742a` (text), teal `#256f66`, paper `#faf7f2`, ink `#262019`, muted `#75634f`, hairline `#e9dfd2`. Fonts: Outfit (display) + Inter (UI) via Google Fonts. Text colours must keep WCAG 2.2 AA contrast on paper/white; touch targets ≥ 44px; visible focus rings; `prefers-reduced-motion` respected.

## Workflow

- Commit prefixes per UAES-001 §14: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- Before calling anything done (UAES-001 §19): JS syntax check, test success + invalid + failure flows, check responsive behaviour and accessibility, update `CHANGELOG.md` and docs.
- Deployment: the Project Owner uploads the release zip to Cloudflare Pages himself (see the compliance record, exception 2). Commit first, then hand over the zip.
