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
- **Status:** in progress — P0.1 done, starting P0.2
- **Last update:** 2026-07-12
- **Done:** P0.1 Pro fair-use monthly cap — `questions_month` /
  `questions_month_reset_on` columns (additive migration in `schema.sql`),
  atomic SQL in `routes/ask.py` gates Pro on a 1500/mo IST-calendar-month
  counter instead of an unconditional bypass, distinct `PRO_FAIR_USE_LIMIT`
  402 copy, `remaining_month` helper + unit tests in `core/quota.py` /
  `tests/test_quota.py` (10/10 passing).
- **Next:** P0.2 trace logging — `traces` table, move `sessions`
  persistence into `try/finally` around the SSE stream, refund-on-zero-token
  mid-stream failure.
- **Blocking:** local test env is missing `asyncpg` (pre-existing, not from
  this change) — `test_rag.py` fails to collect; full backend deps aren't
  installed in this worktree.

## UI/UX (`feat/ui-redesign`)
- **Status:** in progress — picking up pre-existing uncommitted changes
- **Last update:** 2026-07-12
- **Done:** (carried over, not yet committed) modified `index.tsx`,
  `sign-in.tsx`, `thread/[id].tsx`, `Bubble.tsx`, `Input.tsx`, `Screen.tsx`,
  `theme.ts`; new `Branches.tsx`/`.web.tsx`, `Brand.tsx`, `Composer.tsx`,
  `DottedBackground.tsx`, `GoogleG.tsx`/`.web.tsx`, `entrance.ts`/`.web.ts`
- **Next:** review + commit the above, continue redesign pass
- **Blocking:**

## Connections
- Tracks execution of → [[Opus-Execution-Plan]]
- Hub → [[Startup-MOC]]
