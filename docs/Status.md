---
tags: [type/status, domain/startup]
updated: 2026-07-12
---
# 🛰️ Status — cross-account orchestration board

> Two people, two accounts, two machines, one repo. This file is the async
> message board between them — update your section every session, before you
> stop and before the other side starts. Keep entries short: what's done,
> what's next, anything blocking. Full context lives in the branch's commits,
> not here.

## Branches
- `feat/backend-phase0` — backend work (this laptop's other account).
  Executes [[Opus-Execution-Plan]] starting at Phase 0.
- `feat/ui-redesign` — UI/UX work (this account, this laptop).
- `main` — only merge into this once a branch is stable and reviewed. Don't
  push work-in-progress directly to `main`.

## Workflow (both sides)
1. **Pull `main` before starting a session** — `git checkout <your-branch> &&
   git merge main` (or rebase if you prefer) — to avoid basing work on stale
   code.
2. **Push small, push often** — commit in reviewable chunks, not one giant
   diff at the end of a session.
3. **Update your section below before ending a session.**
4. **Merge to `main` via PR**, not a direct push, once a phase/feature is done
   — gives the other side a clean point to pull from.

---

## Backend (`feat/backend-phase0`)
- **Status:** not started
- **Last update:** —
- **Done:**
- **Next:** Phase 0 of [[Opus-Execution-Plan]] — P0.1 Pro fair-use cap, P0.2
  trace logging, P0.3 feedback + history wiring.
- **Blocking:**

## UI/UX (`feat/ui-redesign`)
- **Status:** in progress — picking up pre-existing uncommitted changes
- **Last update:** 2026-07-12
- **Done:** (carried over, not yet committed) modified `index.tsx`,
  `sign-in.tsx`, `thread/[id].tsx`, `Bubble.tsx`, `Input.tsx`, `Screen.tsx`,
  `theme.ts`; new `Branches.tsx`/`.web.tsx`, `Brand.tsx`, `Composer.tsx`,
  `DottedBackground.tsx`, `GoogleG.tsx`/`.web.tsx`, `entrance.ts`/`.web.ts`
- **Next:** review + commit the above, continue redesign pass
- **Blocking:**

## Decisions (cross-account, both sides honor)
- **2026-07-12 — Infra locked:** backend host is **Google Cloud Run**
  (`asia-south1`/Mumbai, scale-to-zero pre-launch, `min-instances=1` at pilot).
  Railway/Fly/Render dropped. Docs (`CLAUDE.md`, MVP-Architecture, backend
  README, Codebase, Dev-Plan) updated to match.
- **2026-07-12 — Stay on Supabase, not Firebase:** Google OAuth is brokered
  through Supabase; pgvector, atomic-SQL quotas, the `traces` table, and
  Phase-2 Postgres FTS are all load-bearing on Postgres. Firebase would force
  a rewrite for zero auth gain.

## Connections
- Tracks execution of → [[Opus-Execution-Plan]]
- Hub → [[Startup-MOC]]
