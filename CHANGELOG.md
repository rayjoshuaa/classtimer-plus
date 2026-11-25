# Changelog

## v2.1.5 — Custom label, bold section titles, digit colours

- The Custom minutes and Custom seconds fields now share one
  "Custom" label (inputs keep their min/sec placeholders).
- Section labels (Time, Custom, Adjust) are bold like titles.
- The Set button is bigger.
- The timer digits change colour: orange once half the time is gone,
  red in the last 10 seconds and when time is up.
- No other behaviour changes.

## v2.1.4 — no more shifting, overflow trimmed

- Fixed the layout moving between Play and Pause: the Start/Pause and
  Reset buttons now have fixed widths (the label change no longer
  pushes Reset sideways), the status line always reserves its space
  even when empty, and the digits sit in a fixed-height box.
- Trimmed the small overflow that clipped the Pause/Reset row:
  slightly smaller digit cap, tighter card and header spacing.
- No behaviour changes.

## v2.1.3 — congestion and overlap fixes (desktop + mobile)

- Timer digits now size from the smaller of screen width and height,
  so 10:00 no longer overflows the card on portrait phones.
- The space between sections is now flexible spacer gaps that absorb
  extra or tight space, so sections can never crush into or overlap
  each other or the keyboard-hints footer again.
- Tighter gaps throughout, and the two description lines hide on
  short screens to give the timer room.
- Still fills the viewport height, still no scrolling, no behaviour
  changes.

## v2.1.2 — fills the viewport height

- The card now stretches to the full viewport height and the sections
  spread evenly across it, so the app fills the screen instead of
  sitting small at the top.
- Timer digits scale with the screen height (up to 12rem), the card is
  wider, the progress bar is thicker, and preset buttons are larger.
- Fixed the footer overlapping the switches row.
- Removed the short-screen zoom-down from v2.1.1. Still one fixed
  screen, still no scrolling, no behaviour changes.

## v2.1.1 — icon removed from page, one fixed screen

- Removed the app icon brand mark from the page header (the favicon in
  the browser tab stays).
- The app now fits exactly one screen and never scrolls: fixed
  viewport-height layout, tighter spacing, and the whole layout scales
  down slightly on short screens.
- No behaviour changes: timer logic, storage, shortcuts and settings
  are identical to v2.1.0.

## v2.1.0 — black & white app icon

- New black & white app icon set for all 10 Teacher Tools apps (see
  `../icons-bw/`): solid black sharp-square tile, white Lucide symbol,
  no colour. ClassTimer+ uses the `timer` icon.
- ClassTimer+ ships its icon as `public/icon.svg`, now the site's favicon
  (`<link rel="icon">` in `index.html`) and the brand mark shown above the
  "ClassTimer+" title in the app header.
- No behaviour changes: all timer logic, storage, shortcuts and settings are
  identical to v2.0.0.

## v2.0.0 — shadcn/ui rebuild

- Rebuilt ClassTimer+ from the v1.9.1 single-file vanilla app into a
  React + Vite + TypeScript project.
- UI redesigned to use **only official shadcn/ui components**
  (`radix-nova` style, neutral base, Tailwind CSS v4): Button, ButtonGroup,
  Card, Badge, Input, Label, Switch, Dialog, Tooltip, Kbd, Separator,
  Progress, ToggleGroup/ToggleGroupItem (plus the Toggle dependency the
  shadcn CLI installs with ToggleGroup). Components were added with
  `npx shadcn@latest init` / `npx shadcn@latest add` and are used unmodified.
- Removed the v1.9.1 custom UI: burgundy/glass/paper palette, glassmorphism,
  Outfit/Inter webfonts, and the custom SVG countdown ring. shadcn/ui has no
  ring component, so stage progress is now the shadcn Progress component and
  the stage itself is a Badge (default / secondary / outline / destructive
  variants); the time remains plain text inside the Card.
- All v1.9.1 behaviour preserved: presets 1/2/3/5/10/15/20/30 min (default
  5), custom minutes + seconds with Set and the empty-input feedback, Start /
  Pause / Resume, Reset, +1 min / −1 min (including −1 min reducing the
  total on an untouched timer), green/amber/red stages, gentle WebAudio
  chime at zero (sound switch, default on), overtime counting (switch,
  default on), fullscreen, How to use dialog, Space / + / − / R / F keyboard
  shortcuts, `classtimer_total` localStorage key, live tab-title updates,
  and sr-only aria-live announcements.

## v1.9.1 and earlier

See the vanilla project in `../classtimer-plus/` (its history is kept in
`../classtimer-plus/history/`, with v1.9.1 backed up as
`index-v1.9.1-vanilla.html`).
