---
tags: [type/status, domain/startup]
updated: 2026-07-16
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

## Adaptive-loop — **A.0/A.1 merged; A.2 in [PR #10](https://github.com/aksharaverse/AITutor/pull/10); next = A.3 items** (2026-07-16)
- **Status:** design + A.0 + A.1 on `main` (PRs #6, #7, **#8 `c317331`**,
  **#9 `fb90092`**). **A.2 = [PR #10](https://github.com/aksharaverse/AITutor/pull/10), open**
  — the Mechanics KC graph + a validating ingest tool. **192 tests pass**
  (126 + 66). No routes/orchestrator/models touched by any of them.
- **A.2 shipped:** `content/kc/phy_mechanics.yaml` — **57 KCs, 86 edges, longest
  chain 10, 1 component, 0 cycles, 0 isolated** · `app/ingest/kc_graph.py` (pure:
  parse/validate/metrics/topo/dot) · `app/ingest/kc.py` (`--check` = no DB;
  `--dot` = Graphviz; upsert is one transaction, never partial).
  `requirements.txt += PyYAML` (app/ingest ships in the container, so it's a real
  runtime dep). New: [[ADR-013]] (telemetry sets KC granularity, not a target
  number — 57 is coherent, not aimed at) and [[ADR-014]] (the ingest tool is the
  graph's integrity boundary, because Postgres cannot express acyclicity).
- **🔴🔴 CONTENT LANE — the chapter string is now a contract.** `chunks.chapter`
  is `PHY::optics::12` and retrieval filters on **exact string equality**
  (`where chapter = $2`). A KC with `chapter: Mechanics` matches **zero chunks**,
  so "explain this item" would silently retrieve nothing and look like a bad
  prompt. The seed declares **`PHY::mechanics::11`** and the validator enforces
  the format. **Whoever RAG-ingests mechanics notes must use exactly:**
  `python -m app.ingest.cli notes/mechanics.md --subject PHY --chapter PHY::mechanics::11`
  (the trailing number follows the existing `::12` convention = NCERT class,
  inferred — if that's wrong, say so and it's a one-line YAML fix, but both sides
  must match).
- **🔴 A.1's migration (now on `main`) has STILL NOT been executed against any
  database.** Docker's daemon was down on this machine, so no fresh-DB apply was
  possible — it is *reviewed, not proven*, and merging didn't change that.
  Someone with Docker or the Supabase CLI must run `supabase db reset` (or psql
  against `pgvector/pgvector:pg16` with `auth.users` stubbed — command in
  `backend/tests/test_migration_hygiene.py`'s docstring) **before** it goes near
  live. That plus the ledger reconciliation are the two gates on `db push`.
  A.2's ingest tool cannot be run against a real DB until this is done either
  (`--check` works with no DB and is what's been exercised).
- **🔴 There is NO CI in this repo** (`.github/workflows/` does not exist). The
  126 tests only ever run on whoever's laptop remembers to run them. This is now
  the biggest infrastructure gap: it's also where the schema-drift check belongs
  (migration → fresh DB → introspect → compare against a snapshot), which would
  have caught the drift ADR-011 was written about. **Suggest the infra lane take
  this next** — it's small (pytest + a postgres service container) and it
  unblocks trusting any of the above.
- **A.1 deviated from the design in 3 ways, all found by implementing it** —
  backend lane should know before writing B.1:
  1. **`item_state` is a new table; `items.difficulty` no longer exists**
     ([[ADR-012]]). Content and derived state can't share a table — A.3's
     `content_hash` re-ingest would clobber learned difficulty, and `rebuild()`
     would write to the content table.
  2. **`student_kc_state` has `p_correct`/`confidence`/`estimator` columns**
     (§3.2 omitted them). Without a stored `p_correct` the policy would have to
     recompute it from `rating` with Elo's formula in SQL — hard-coding the
     estimator into the policy, exactly what [[ADR-005]] forbids. The schema has
     to honour the ADR too, not just the Python.
  3. **`attempts.correct` is NULLABLE on purpose** — null = "not gradeable" = a
     Verdict of INAPPLICABLE. Don't default it to false.
  Also: `kc_edges` blocks self-loops but **cannot** block longer cycles (A→B→A)
  — Postgres can't express it. **A.2's seed ingest must check reachability.**
- **🆕 Engineering metrics to instrument alongside the product KPIs**
  ([[Adaptive-Loop-Architecture]] §4.1): `rebuild()` wall time per student ·
  `/v1/next` p50/p95 (the "one SQL query" claim, measured) · event-log growth
  per student/day · attempts-per-KC-to-mastery (tells us if KC granularity is
  wrong, measured instead of argued) · `p_correct` calibration error (ECE) ·
  item-state coverage. Each is a query, not a project; land each with the phase
  that makes it measurable (B.1/B.2).
- **What A.0 landed:** `app/adaptive/contracts.py` (KnowledgeState, KCMastery,
  AttemptEvent, StateDelta, NextRequest, NextDecision + StateEstimator/Policy
  Protocols) · `app/verify/registry.py` (dispatch + aggregation) ·
  `app/verify/checkers/gold.py` (first real checker) · widened
  `app/verify/base.py`.
- **🆕 ADRs now exist — `docs/Decisions/` (ADR-001…011), on `main`.** Tiny
  records (Decision / Context / Reason / Consequences, ~35 lines) of the calls
  that look weird without their reason. **Both sides: read the ADR before
  "fixing" something odd, and add one when you make a call a future reader would
  question.** The module docstrings point at the relevant record, so you'll hit
  them from the code. Index + when-not-to-write-one → `docs/Decisions/README.md`.
  The two corrections below are ADR-001 and ADR-002.
- **Also resolved:** [[Student-Model]]'s `#decision/open` BKT-vs-IRT-vs-Elo —
  **struck through, resolved to Elo** (ADR-007). It had been open since
  2026-06-28.
- **🔴 Backend account — two corrections that change what you'd have written:**
  1. **`verify/base.py` was widened in place; there is NO `verify/contracts.py`**
     (the doc's §7 originally said to create one). P1 had already locked
     `Verdict`/`Outcome`/`Verifier` in `base.py`, so a second contracts module
     would have meant two competing `Verdict` types. The widening is additive
     (`+Outcome.TIMEOUT`, `+Verdict.checker`, `+Claim`,
     `+name/domain/applies_to`) and P1's field names are kept — so **your P5
     checkers implement `Verifier` from `app.verify.base` and register on
     `Registry`**. §7 of the doc records this.
  2. **`StateEstimator.observe(ev, prior)`** takes the prior mastery as an
     argument (the doc's sketch said `observe(ev)`, which contradicted its own
     purity rule — Elo needs the current rating and a pure fn can't fetch it).
     B.1's EloEstimator implements that signature; the caller passes the row it
     already holds. `prior=None` = cold start.
- **Aggregation precedence is now `FAIL > TIMEOUT > PASS > INAPPLICABLE`**
  (pinned by a truth-table test). TIMEOUT outranks PASS deliberately: "3 passed,
  1 timed out" must abstain, not badge — directly relevant to P5's gate. A
  checker that raises degrades to INAPPLICABLE, never FAIL, and is logged.
- **Known, accepted A.0 limitation:** the gold checker's unit check is a
  normalized *string* compare, so `N/kg` != `m/s^2` (a false negative). Pinned
  by `test_dimensionally_equivalent_units_fail_until_pint_lands` — that test is
  **meant to fail and be deleted** when `pint` lands at P5.0. Use it to grade
  curated items; don't badge a student's own physics work on it before P5.
- **Why contracts first:** implementations churn (Elo → Student-JEPA; one
  checker → six), contracts don't. `KnowledgeState`, `Verdict`, and the
  `p_correct`-as-portable-unit convention are frozen before anything is built
  against them. Same discipline as P1's seams.
- **Next:** A.1 migrations → A.2 KC graph seed → A.3 item bank → B.1 Elo →
  B.2 routes → B.3 UI (order + gates in §7).
- **Review outcome (2026-07-16), things both sides should know:**
  - Phases A/B are **"JEPA-inspired"**, NOT JEPA — the name is only earned in
    Phase C, when an encoder actually predicts future latent states. Please use
    this wording externally (investors/paper); the earlier framing overstated it.
  - The verifier is a **Verification *Engine*** (registry + per-domain
    checkers: sympy · units · gold · chemistry · sandbox · SMT), not one
    checker. P5's checkers become registry entries — backend lane, note this.
  - **Event sourcing is now a rule:** `attempts`/`traces` append-only;
    `student_kc_state` is a *derived cache* that must be rebuildable by
    replaying the log. That property is what makes the Phase C estimator swap
    a re-run instead of a migration.
- **What it is:** the 2026-07-15 brainstorm (JEPA papers + Squirrel AI's
  closed loop + Cursor's loop→data→model sequence) compressed into a design
  on the existing stack: closed practice loop where the LLM is a *selectively
  invoked decoder* — adaptive decisions (next item, mastery, review
  scheduling) are pure SQL ≈ ₹0, fitting the zero-spend phase. Annotated
  research reading list included (KT/Elo/JEPA/RLVR/public datasets).
- **Key calls:** Elo state estimator v1 behind a `StateEstimator` Protocol
  (resolves [[Student-Model]]'s open BKT-vs-IRT-vs-Elo decision); additive
  migrations (`knowledge_components`, `kc_edges`, `items`, `attempts`,
  `student_kc_state`); `GET /v1/next` + `POST /v1/attempts`; phases A–D with
  gates (A log+graph → B Elo loop → C Student-JEPA, gated ≥100k attempts →
  D RLVR own model, gated on funding). Golden-set problems double as items
  (curate once, use twice with P3).
- **🆕🔴 SCHEMA WORKFLOW CHANGED — read before writing any SQL ([[ADR-011]], on
  `main`).** `backend/schema.sql` is **no longer the source of truth and must not
  be run**; it is now a pointer file. The schema lives in immutable, timestamped
  migrations under **`supabase/migrations/`** (baseline
  `20260716120000_baseline_p0_p1.sql` = the old schema.sql, squashed — verified
  lossless by object-set diff, but **not yet executed anywhere**). Rules,
  naming, apply flow → `supabase/README.md`.
  - *Why:* schema.sql was 16 `if not exists` guards pasted into the SQL editor
    by hand — guards that **silently no-op on drift**, so a diverged live DB
    reports "ran fine". Meanwhile the MCP wrote a real migration ledger into the
    live project on 2026-07-12 that this repo has no copy of. Two histories,
    neither aware of the other, and the authoritative one wasn't in git.
  - *New work:* `supabase migration new <name>` → one file → review → merge →
    `supabase db push`. Don't append to schema.sql. Don't use `if not exists` in
    new migrations. Prove it with a local `supabase db reset` (free, Docker) —
    that's the test that a migration builds an empty DB, not just your laptop.
- **🔴🔴 INFRA ACCOUNT — one-time reconciliation; it BLOCKS A.1's *push*.**
  The live project's ledger (`xdszkwjkaamyycirfslz`) and `supabase/migrations/`
  disagree, and **nobody currently knows what the remote ledger contains** — the
  Supabase MCP is disconnected from the agent side, so this needs your
  authenticated CLI (same class of blocker as gcloud). **Do not `supabase db
  push` against live until done.** Steps in `supabase/README.md` § "Reconciling
  the live project": `supabase link` → `supabase migration list` → **post that
  output here** → `migration repair` (ledger-only, does not touch tables) →
  verify → then push. **Writing A.1's migration file is NOT blocked** — only
  applying it to live is.
- **🔴 A.3 (~300 items for Mechanics) IS NOW THE CRITICAL PATH and still has no
  owner.** A.0/A.1/A.2 are done; the loop has a graph and nowhere to get
  questions. This is curation hours, not code — the only non-code thing between
  us and a measurable D7. Sourcing = past JEE papers + NCERT exemplar (public;
  same attribution rules as the P3 golden set), tagged with `kc_id` from
  `content/kc/phy_mechanics.yaml` and given `answer_gold` in the shape
  `GoldAnswerChecker` already reads: `{value, unit}` or `{choices: [...]}`.
  ~300 = 57 KCs x ~5-6 items for a difficulty ladder; **do not build 5,000 before
  D7 is measured** (inventory before demand = the Byju's/Doubtnut trap already in
  the Opus plan's lesson table).
- **Suggested lane split (needs both sides' ack):** backend account —
  Phase A/B server side (migrations + `adaptive/` + `routes/practice.py`,
  meshes after P1, parallel to P2/P3); UI account — practice screen + the
  missing feedback UI (same screen). Phase C is a research lane.
- **Blocking:** nothing blocks A.0/A.1/A.2/B.1 — start now.
  **The one human blocker is A.3:** sourcing ~150 items for the first chapter
  (NCERT exemplar + past JEE papers, same sourcing/attribution as the P3 golden
  set) **needs an owner** — it's curation hours, not code, and it's the line
  item this plan most underestimates. Tag the P3 golden problems with `kc_id`
  and they become the first items for free. First chapter should be whichever
  the golden set seeds from (Physics–Optics is already queued for ingest).

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
