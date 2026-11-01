# Changelog

All notable changes to ClassTimer+ are recorded here. Versions follow the releases of the single-file app.

## [1.9.0] — 2026-11-01

Owner review round 7 (Project Owner feedback on the live app, with screenshots):

- **Copyright to the very corner:** the footer now spans the full page width, so the "© 2026 Ray Joshua. All rights reserved." line sits at the page's bottom-right corner (it previously stopped at the edge of the centred footer row).
- **Digit spacing:** the timer digits were cramped (−1 px tracking); they now have +2 px letter-spacing and breathe, in both the countdown and overtime sizes.
- **Custom fields reset:** after pressing **Set**, the minutes/seconds fields clear back to their "min" / "sec" placeholders, ready for the next entry.
- **Double-plus tab title fixed:** in overtime the tab showed "ClassTimer+ | ++00:11" — the title and the display were both adding a plus. The title now uses the display text as-is: exactly one plus.
- **Overtime OFF means stop at 00:00:** with "Count overtime after zero" off, a finished timer now rests at a plain **00:00** — no plus sign, no overtime wording (previously it still rendered "+00:00"). Relatedly, pressing Start on a finished timer now cleanly restarts the full set time instead of instantly re-finishing.
- **New overtime wording:** "Overtime — wrap up and share" is now "Overtime — wrap up and finish up".

## [1.8.0] — 2026-11-01

Owner review round 6 (Project Owner feedback on the live app, with screenshots):

- **Info moved to the corner:** the ⓘ button now sits in the card's top-left corner, mirroring the fullscreen icon at top-right (same 42 px glass style); the "How to use" panel drops down from it. The stage pill now sits alone, centred above the ring.
- **More air before the actions:** the gap between the Adjust section and the Start/Reset row was increased at every size (the ring's height budget absorbed the difference, so nothing else shrank or clipped).
- **Formal copyright line:** the footer credit is now "© 2026 Ray Joshua. All rights reserved." (name still linked to his portfolio), set at the bottom-right of the page under the settings/shortcuts row.
- **Animated stage vignette:** a soft vignette now glows at the page edges in the current stage colour — green while on track, amber as time runs down, red at the end — breathing gently on a 5-second cycle. Together with the drifting background glows and the stage tint, the whole page now signals the stage before you even read the ring. Off under `prefers-reduced-motion`.

## [1.7.0] — 2026-11-01

Owner review round 5 (Project Owner feedback on the live app, with screenshots):

- **Bigger timer again:** the short-screen trims had been shrinking the ring version over version. The ring is now sized from the *leftover* viewport height (`clamp(190px, calc(100dvh - 540px), 440px)`, tighter budget under 740 px height) — it takes all the space the controls leave instead of a fixed fraction, so it is larger at every window size and the layout still fits.
- **Play/Pause responsiveness fixed:** if the Start button still had keyboard focus, pressing Space fired both the global shortcut and the button's own click — toggling twice and looking dead. The Space shortcut now steps aside when a button has focus (the button's native click fires exactly once), and buttons use `touch-action: manipulation` to remove tap delay.
- **Zero layout shift:** the feedback line under the ring now has a permanently reserved slot (fixed height) — messages appear and disappear without pushing the sections around — and the stage pill has a fixed width, so its label changes no longer nudge the info button. The finished pulse was softened.
- **Footer rebuilt:** the "Free forever · No sign-up · Works offline" line is removed; the settings toggles and the keyboard shortcuts now share one footer row, with the "Created by Ray Joshua" credit beneath — visible without fullscreen at ~700 px-tall browser windows.
- **More air in Time:** the gap between the preset row and the Custom row was increased.
- Verified by screenshot at 1366×700, 1366×768 (idle and paused — section positions identical) and 1920×1080.

## [1.6.0] — 2026-11-01

Owner review round 4 (Project Owner feedback on the live app, with screenshots):

- **Footer credit:** the footer line now leads with "Created by Ray Joshua", linked to his portfolio, followed by "Free forever · No sign-up · Works offline". (The header eyebrow stays "Teacher Tools".)
- **Description below the circle:** the status/feedback line ("Overtime — wrap up and share", paused and error messages) moved from the bottom of the card to directly under the ring, where the eye already is.
- **Labelled sections, more air:** the card is organised into sections with small labels — **Time** (presets + custom), **Adjust** (− 1 min / + 1 min, now their own section), then the centred action row (Start/Pause + Reset) — with hairline dividers and looser spacing, replacing the single compact stack.
- **Custom fields are type-only:** the browser's up/down spinner arrows are removed from the minutes/seconds fields (type the numbers; numeric keypad on touch devices), and the **Set** button is properly wide.
- **Fullscreen is a corner icon:** the labelled Fullscreen button left the action row; it is now an icon-only button in the top-right corner of the card.
- **Tab title while running:** when a timer is active the tab reads **ClassTimer+ | 05:00** (overtime: ClassTimer+ | +02:35); idle it returns to "Teacher Tools: ClassTimer+".
- **Animated background:** the gold/teal/wine glows now drift very slowly (a 26-second ease, transform-only) for a bit of life without distraction; the stage tints still take over as time runs down, and `prefers-reduced-motion` turns the drift off.
- Layout budget re-checked at 1366×768 and 1600×800 after the sections added height: tighter short-screen spacing keeps header, card, settings, shortcuts and footer on one screen.

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
