# Project UAES Compliance Record

**Application:** ClassTimer+ — calm classroom countdown timer
**Repository:** https://github.com/rayjoshuaa/classtimer-plus
**Owner:** Ray Joshua (Project Owner)
**UAES version adopted:** UAES-001 v1.0 (with UAES-UI-001 v1.0)
**Compliance level:** 1
**Status:** Approved — UAES adopted for all applications by the Project Owner, 2026-11-01

## Applicable standards

- [x] UAES-001
- [x] UAES-UI-001
- [x] UAES-DEP-001 — Cloudflare Pages Git integration: every push to `main` deploys automatically
- [x] UAES-SEC-001 — baseline: no accounts, no data collection, no secrets; all input clamped and validated in code
- [x] UAES-TST-001 — Level 1: JS syntax verification plus manual testing of success, invalid-input, and failure flows
- [x] UAES-AI-001 — developed by an AI assistant (Thatch) under Project Owner direction; no change is claimed verified without a check
- [ ] UAES-DB-001 — not applicable: no database. The only stored value is the last-used duration, in the teacher's own browser localStorage (key `classtimer_total`)

## Project-specific stack

- Frontend: Single self-contained `index.html` — HTML, CSS, vanilla JavaScript, Web Audio API. No framework, no build step, no dependencies (per UAES-001 KISS; the React/Tailwind/shadcn foundation in UAES-UI-001 is a recommendation, expressly not a mandate for non-React projects)
- Backend: None
- Database: None (browser localStorage only)
- Hosting/deployment: Cloudflare Pages, project `classtimer-plus`, Git-connected to this repository (production branch `main`, no build command, output = repository root). Live: https://classtimer-plus.pages.dev (verified 2026-11-01)
- Testing: `node --check` on the extracted script; manual flow tests (start/pause/resume/reset, presets, custom valid + invalid input, +1:00, overtime on/off, chime on/off, fullscreen, keyboard Space/R/F); accessibility review against WCAG 2.2 AA (contrast, focus visibility, 44px touch targets, status never conveyed by colour alone, screen-reader announcements on state changes only)

## Exceptions

| Standard/rule | Reason | Impact | Alternative/control | Approval |
|---|---|---|---|---|
| UAES-001 §5, §20 — project `CLAUDE.md` and `.claude/rules/` | The project's developer is Thatch (Muse), not Claude Code, per Project Owner direction | The agent-guidance file is named `AGENTS.md` instead of `CLAUDE.md` | `AGENTS.md` carries the same role and content; the standards repository itself is never modified | Project Owner, 2026-11-01 |

*Retired: an earlier exception covered manual zip deployment (UAES-001 §16). The Project Owner connected Cloudflare Pages to this repository on 2026-11-01, so deployment is version-controlled and the exception is no longer needed.*

## Authoritative project documents

- Requirements: `README.md` (this repository)
- Architecture: This record — single-file application, no backend
- Decisions: The Exceptions table above
- Security: This record — no personal data is collected, stored, or transmitted; the only network requests are Google Fonts
- Deployment: Cloudflare Pages project `classtimer-plus`, Git-connected — pushes to `main` deploy automatically; the Deployments tab in Cloudflare is the release record, and rollback is available there per deployment
