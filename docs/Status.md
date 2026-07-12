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

## Backend — **P1 MERGED TO MAIN (PR #5, e6155d7, 2026-07-13)**
- **Status:** `main` now carries P0 + P1 seams + zero-spend Gemini config +
  the SSRF fix. **38 tests passing on merged main.** Deploy/prove-it should
  build from `main` — no more branch juggling.
- **Last update:** 2026-07-13
- **Done (new since last entry):**
  - **SSRF fix LANDED** (5d85a73, review finding #1): route-level prefix
    allowlist for `image_url` (fail closed; derived from `SUPABASE_URL` public
    storage path or `IMAGE_URL_ALLOWED_PREFIX`; checked *before* the quota
    claim), no-redirect fetch with content-type check + hard 4MB mid-stream
    cap (`MAX_IMAGE_BYTES`), refunded `IMAGE_REJECTED` SSE error distinct from
    `LLM_UNAVAILABLE`.
  - **P1 merged via PR #5** — all three seam increments (model plane split w/
    Router-owned failover; `retrieval/vector.py`; thin `ask.py` +
    `orchestrator/pipeline.py`) + `GEMINI_MODEL` env config for the zero-spend
    phase. `core/llm.py` / `core/rag.py` remain as one-release re-export shims.
  - **Rule override, recorded:** merged ahead of the live e2e prove-it on the
    user's direct instruction (2026-07-13). The byte-exact mocked SSE test is
    the interim equivalence baseline; the prove-it now runs against `main`
    directly and doubles as P1's live validation.
- **Next (backend lane):** P2 multi-retrieval (FTS + RRF merge) is the next
  plan phase — but the **eval harness (P3) is the highest-leverage gap**
  (nothing can be proven better/worse until it exists). Also open: review
  finding #2, `GET /v1/sessions/{id}` (small; frontend workaround exists).
- **Deploy account, note:** with P1 on `main`, the ₹0 deploy needs
  `GEMINI_MODEL=gemini-2.5-flash` in `--set-env-vars` (see zero-spend
  guardrails below). `IMAGE_URL_ALLOWED_PREFIX` is optional — it defaults to
  `SUPABASE_URL` + `/storage/v1/object/public/`; images from any other origin
  are now rejected with 400 (fail closed: if `SUPABASE_URL` is unset, ALL
  image questions 400).
- **Blocking:** none.

## UI/UX + Infra (`feat/ui-redesign`, `feat/deploy-cloudrun`)
- **Status:** in progress — UI redesign + owns live-infra/deploy lane
- **Last update:** 2026-07-12
- **Done (UI):** (carried over, not yet committed) modified `index.tsx`,
  `sign-in.tsx`, `thread/[id].tsx`, `Bubble.tsx`, `Input.tsx`, `Screen.tsx`,
  `theme.ts`; new `Branches.tsx`/`.web.tsx`, `Brand.tsx`, `Composer.tsx`,
  `DottedBackground.tsx`, `GoogleG.tsx`/`.web.tsx`, `entrance.ts`/`.web.ts`
- **Done (Infra):** Cloud Run deploy prep on `feat/deploy-cloudrun` (off
  `main`) — **fixed `backend/Dockerfile`** to honor `$PORT` (was hardcoded
  8080; Cloud Run contract) + `exec` for SIGTERM SSE drain; added
  `backend/deploy/cloudrun.sh` (deploy-from-source, `asia-south1`,
  scale-to-zero, Secret Manager, 600s SSE timeout). PR to `main` pending.
  *Backend account: the `$PORT` Dockerfile fix is on that branch — pull it
  before any deploy; it does NOT touch P1 files.*
- **Done (Infra — live DB, 2026-07-12):** P0.1/P0.2/P0.3 applied to live
  Supabase (`xdszkwjkaamyycirfslz`) as tracked migrations — now matches
  `main`'s `schema.sql`. RLS enabled on `chunks`, `billing_events`, **and
  `traces`** (new public table from P0.2, same exposure). All ERROR/critical
  security advisors cleared; only benign `rls_enabled_no_policy` INFO remains
  (backend uses direct asyncpg / service-role, which bypass RLS — no policy
  needed). Pre-existing WARNs untouched (`vector` in `public`, Auth
  leaked-password protection off).
- **Next (Infra):**
  - install/auth `gcloud`, create Secret Manager secrets, run
    `bash backend/deploy/cloudrun.sh` → get service URL.
  - Wire `frontend/.env` API base + Stripe webhook to the URL; ingest
    Physics–Optics; run the P0 prove-it (produces P1's baseline SSE transcript).
- **Next (UI):** review + commit the carried-over redesign changes.
- **Blocking:** actual `gcloud run deploy` needs a human-authenticated GCP CLI
  (account/auth can't be done by the agent) — script is ready to run.

## 3-pass repo review (2026-07-12, UI account — full-branch audit)
Findings both sides should see. **Detailed write-ups now in the repo:**
combined → [[2026-07-12-review-combined]] (`docs/Reviews/`, on `main`);
per-lane → [[2026-07-12-review-ui-account]] (on `feat/ui-redesign`) and
[[2026-07-12-review-backend-account]] (on `feat/backend-phase0`).
Architecture re-validated by execution: `main` 23/23 tests, seams 29/29
in a clean worktree; Google OAuth wiring and Cloud Run deploy config
confirmed by inspection. Summary of the findings:
- **Frontend lags backend by a phase:** P0.3 is "done" on `main` but the app
  never sends `thread_id` (no follow-up questions) and has **no feedback UI**
  (👍/👎 endpoint unused → the data flywheel isn't being fed). These are the
  two highest-leverage UI tasks after the redesign merge.
- **Backend security gap (pre-deploy fix):** `/v1/ask` `image_url` is fetched
  server-side unvalidated in the Gemini path — SSRF on Cloud Run + no size/
  content-type cap (plan edge case #5 not yet implemented). Fix: allowlist the
  Supabase storage URL prefix, cap ~4MB, check content-type. Backend lane.
- **Missing endpoint:** no `GET /v1/sessions/{id}` — thread screen paginates
  up to 5 pages client-side to find one session; sessions older than ~100
  entries show "not found". Small backend add + frontend switch.
- **Critical path unchanged:** nothing is live e2e (gcloud deploy blocked on
  human auth), corpus is empty until Physics–Optics ingest → P0 prove-it →
  P1 merge. Everything else queues behind this.
- **Untracked market-impact items (no owner on this board):** the 100-problem
  Phase-0 dataset (gates P3 evals + P5 verifier — zero code, pure curation);
  institute design-partner conversations (the 90-day kill test); Razorpay/UPI
  vs Stripe for ₹299 India B2C; WhatsApp funnel. Suggest assigning lanes.

## Zero-spend deploy guardrails (2026-07-12, backend account — verified research)
Decision from the user: **₹0 total spend until the app is properly functional.**
Verified free-tier facts + required changes, for whoever runs the deploy:
1. **🔴 Code blocker: `gemini-2.5-pro` is NOT on the Gemini free tier anymore**
   (2.5 Flash / Flash-Lite are; embeddings `gemini-embedding-001` is). Our
   Gemini adapter hardcodes 2.5-pro → every vision/failover call fails on a
   free key. **Fix LANDED on the P1 branch (33e9d09):** adapter reads
   `GEMINI_MODEL` env at call time (default unchanged = 2.5-pro); zero-spend
   deploys add `GEMINI_MODEL=gemini-2.5-flash` to `--set-env-vars`. Free Flash
   limits: 10 RPM / 250 req/day, resets midnight PT — plenty for the prove-it.
   ⇒ the prove-it/deploy should therefore run against the **P1 branch build**
   (or wait for P1's merge) — `main`'s adapter can't do ₹0 vision.
2. **Hard cap = two GCP projects.** Gemini API key from an AI Studio project
   with **no billing attached** (can't be charged — over-limit = 429, not a
   bill). Cloud Run lives in a separate project with billing + a kill switch:
   budget → Pub/Sub → function that detaches billing (official pattern:
   cloud.google.com/billing/docs/how-to/disable-billing-with-notifications;
   turnkey: github.com/Cyclenerd/poweroff-google-cloud-cap-billing). Budget
   ~₹500, alerts 50/90/100%.
3. **`cloudrun.sh` changes for this phase:** `--max-instances 1` (was 4);
   region `us-central1` (was `asia-south1` — Mumbai is pricing Tier 2, burns
   the free allowance ~40% faster; free 1 GiB egress is NA-only; flip back at
   pilot). Trim to ≤6 secrets (Secret Manager free = 6 versions): keep real
   secrets, move `SUPABASE_URL`/`STRIPE_PRICE_ID`/dummy Stripe to env vars,
   **skip `DEEPSEEK_API_KEY` entirely** — no DeepSeek spend this phase, all
   text routes to Flash.
4. **Privacy line = end of ₹0 phase:** Gemini free tier content is "used to
   improve" Google products (training); paid tier is excluded. Test questions
   fine; real students' questions NOT (DPDP). First real student ⇒ attach
   billing to the Gemini project, flip paid, restore DeepSeek/2.5-pro routing.
5. **Supabase free projects pause after ~1 week idle** → dead backend. Put a
   free uptime pinger (UptimeRobot) on `/healthz` every 5 min.
Cloud Run free tier itself (2M req / 180k vCPU-s / 360k GiB-s per month) fits
~6k solves/mo — not the constraint; Flash's 250 req/day is.

## Connections
- Tracks execution of → [[Opus-Execution-Plan]]
- Hub → [[Startup-MOC]]
