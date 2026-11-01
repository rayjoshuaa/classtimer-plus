# ClassTimer+

A calm, big-screen countdown timer for classrooms. ClassTimer+ shows the whole class exactly how much time is left — a large, easy-to-read display with a progress ring that changes colour as time runs out — without the stress of a loud alarm.

**Live site:** https://classtimer-plus.pages.dev

## What it does

- **Traffic-light stages** — the ring and label move from "On track" (green) to "Halfway there" (amber) to "Almost done" (red), so students can *see* time passing, not just read numbers.
- **A gentle chime at zero** — three soft notes instead of a buzzer, and it can be turned off.
- **Overtime counting** — when time runs out, the timer quietly counts up (+00:37) so wrap-up never feels rushed. This can be turned off too.
- **Presets and custom times** — one tap for 1–30 minutes, or set any minutes and seconds.
- **±1:00 buttons** — add or take away a minute at any point, even while the timer is running.
- **Fullscreen, fit-to-screen layout** — fills the classroom display with no scrolling.
- **Remembers your last timer** — your most recent duration is restored on the next visit.

No account, no ads, and nothing to install — it is a single web page, and it works offline.

## How to use it

1. Open the live site on the classroom computer and press **Fullscreen**.
2. Choose a preset, or type a custom time, then press **Start**.
3. Use **+1:00** / **−1:00** whenever the class needs a minute more or a minute less.

## Keyboard shortcuts

| Key | Action |
| --- | ------ |
| Space | Start / pause |
| − / + | Take away / add one minute |
| R | Reset |
| F | Fullscreen |

## Under the hood

One self-contained `index.html` — plain HTML, CSS and JavaScript, with the Web Audio API for the chime. No build step and no dependencies. Hosted on Cloudflare Pages and deployed automatically from this repository.

Development follows the [UAES engineering standard](https://github.com/rayjoshuaa/application-engineering-standards) (Level 1) — see `PROJECT-COMPLIANCE.md` for the compliance record and `CHANGELOG.md` for the release history.

## About

ClassTimer+ is part of a small family of free tools for teachers, built by [Ray Joshua](https://rayjoshuaa-portfolio.pages.dev) — an ICT & Robotics Educator based in Bangkok. The rest of the family: FairPick, GroupGrid, CalmMeter, TeamPoints, FlashStudio, SeatPlan, SubReady, QRStations and DiceLab.
