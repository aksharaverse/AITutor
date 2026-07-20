---
tags: [type/runbook, domain/infra, status/active]
updated: 2026-07-19
---
# 🚀 Deploy Runbook — backend to Cloud Run (zero-spend phase)

> The one page a human copy-pastes to take the backend live. Every command is
> inline — you do **not** need the `cloudrun.sh` script (that one is the
> paid-tier/pilot variant on `feat/deploy-cloudrun`; this runbook is the ₹0
> variant per [[Status]] § zero-spend guardrails).
>
> **What only a human can do here** (why this isn't automated): `gcloud auth
> login` opens a browser and binds to your Google identity; an agent cannot
> hold that credential. Everything after auth is copy-paste.
>
> **Prohibited-action note:** entering the Google account password / 2FA is
> yours to do in the browser. This runbook never asks you to paste a password
> anywhere on the command line.

---

## 0. The zero-spend shape (read once, 60 seconds)

Four decisions bake ₹0 into the deploy — all from [[Status]]'s verified
guardrails:

1. **Two GCP projects.** The **Gemini key** comes from an **AI Studio project
   with NO billing account attached** — it physically cannot be charged
   (over-limit returns HTTP 429, never a bill). **Cloud Run** lives in a
   **separate project that HAS billing**, capped by a budget kill-switch (§6).
2. **Region `us-central1`, not Mumbai.** `asia-south1` is pricing Tier-2 and
   burns the free allowance ~40% faster; the free 1 GiB egress is
   NA-only. Flip back to `asia-south1` at the pilot (latency for Indian users).
3. **`--max-instances 1`.** One warm-at-most container. Scale-to-zero when idle.
4. **≤6 Secret Manager secrets** (free tier = 6 active versions). Real keys go
   in Secret Manager; non-secret config (`SUPABASE_URL`, price id, flags) goes
   in `--set-env-vars`; `GEMINI_MODEL=gemini-2.5-flash` because **2.5-pro is
   not on the free tier**.

> ⚠️ **DeepSeek in the ₹0 phase — known caveat.** The plan skips
> `DEEPSEEK_API_KEY` (no DeepSeek spend). The router
> (`app/models/router.py`) still *tries* DeepSeek first for text, gets a 401
> on the empty key, and **fails over to Gemini Flash before the first token** —
> so it works, but every text question eats one wasted ~200–400 ms round-trip
> to DeepSeek. Acceptable for the prove-it. If it annoys you, the clean fix is
> a one-line router change (route text→Gemini directly when
> `deepseek_api_key` is unset) — out of scope for this deploy; note it for
> whoever owns P4 routing.

---

## 1. Prerequisites (once per machine)

```bash
# Install the CLI: https://cloud.google.com/sdk/docs/install
gcloud --version            # confirm it's on PATH

# Log in (opens a browser — this is the human-only step)
gcloud auth login
```

You will create/choose **two project IDs** below. Pick your own names;
`aksharaverse-run` and `aksharaverse-ai` are used here as placeholders.

---

## 2. Project A — the Gemini key (no billing, cannot be charged)

Do this in [Google AI Studio](https://aistudio.google.com/apikey), NOT the
gcloud CLI:

1. Create a new API key → **"Create API key in new project"** (this makes a
   project with **no billing** — exactly what we want).
2. Copy the key (starts `AIza…`). You'll paste it into Secret Manager in §4.

Free Flash limits: **10 RPM / 250 requests/day**, reset midnight PT — plenty
for the prove-it. Over the limit = 429, not a charge.

> 🔒 Privacy line: the Gemini **free** tier may use request content to improve
> Google products. Fine for your own test questions; **NOT** for real
> students' data (DPDP). First real student ⇒ attach billing to this project
> and switch to the paid tier.

---

## 3. Project B — Cloud Run (has billing, capped by a kill-switch)

```bash
# Create the run project and point gcloud at it
gcloud projects create aksharaverse-run --name="AksharaVerse Run"
gcloud config set project aksharaverse-run

# Link a billing account (list yours first)
gcloud billing accounts list
gcloud billing projects link aksharaverse-run --billing-account=XXXXXX-XXXXXX-XXXXXX

# Enable the three APIs the deploy needs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

**Set the budget kill-switch now, before deploying** (§6 has the automated
detach; at minimum set a budget with email alerts today):

```bash
gcloud billing budgets create \
  --billing-account=XXXXXX-XXXXXX-XXXXXX \
  --display-name="aksharaverse-run ₹500 cap" \
  --budget-amount=500INR \
  --threshold-rule=percent=0.5 \
  --threshold-rule=percent=0.9 \
  --threshold-rule=percent=1.0
```

---

## 4. Create the secrets (≤6, in Project B)

```bash
# --- real secrets: keep these in Secret Manager ---
printf '%s' "postgresql://postgres:<pw>@db.xdszkwjkaamyycirfslz.supabase.co:5432/postgres" \
  | gcloud secrets create DATABASE_URL --data-file=-
printf '%s' "<supabase-service-role-key>" \
  | gcloud secrets create SUPABASE_SERVICE_ROLE_KEY --data-file=-
printf '%s' "AIza…"  \
  | gcloud secrets create GEMINI_API_KEY --data-file=-      # the Project-A key
printf '%s' "sk_test_…" \
  | gcloud secrets create STRIPE_SECRET_KEY --data-file=-   # dummy ok pre-billing
printf '%s' "whsec_…" \
  | gcloud secrets create STRIPE_WEBHOOK_SECRET --data-file=-  # dummy ok pre-billing
```

That's **5 secrets**. `DEEPSEEK_API_KEY` is deliberately omitted (see caveat).
`SUPABASE_URL`, `STRIPE_PRICE_ID`, and the flags are **not** secret and go in
`--set-env-vars` below — keeping us under the 6-version free ceiling with room
to spare.

> Get the real Supabase values from the dashboard:
> **Project Settings → Database** (connection string) and **→ API**
> (service_role key). `DATABASE_URL` uses the direct Postgres connection, not
> the pooler, for asyncpg.

---

## 5. Deploy

```bash
# Run from the repo root. --source backend builds server-side with Cloud Build,
# so you do NOT need Docker locally. Uses backend/Dockerfile.
gcloud run deploy aitutor-backend \
  --source backend \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 1 \
  --timeout 600 \
  --cpu 1 --memory 512Mi \
  --set-env-vars "GEMINI_MODEL=gemini-2.5-flash,SUPABASE_URL=https://xdszkwjkaamyycirfslz.supabase.co,STRIPE_PRICE_ID=price_dummy,FRONTEND_URL=https://aksharaverse.com,FREE_DAILY_LIMIT=10" \
  --set-secrets "DATABASE_URL=DATABASE_URL:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest,STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest"
```

`gcloud` prints the **service URL** on success
(`https://aitutor-backend-….a.run.app`). Copy it — the next steps need it.

**Smoke-test immediately:**

```bash
curl -s https://aitutor-backend-….a.run.app/healthz   # expect a 200 / ok body
```

---

## 6. Billing kill-switch (do not skip)

The budget in §3 only *emails* you. For a hard stop, wire budget → Pub/Sub →
a function that detaches billing. Turnkey (10 min):

- Official pattern: <https://cloud.google.com/billing/docs/how-to/disable-billing-with-notifications>
- Drop-in repo: <https://github.com/Cyclenerd/poweroff-google-cloud-cap-billing>

Set the budget's Pub/Sub topic to the one the function subscribes to. Test it
by temporarily setting the budget to ₹1.

---

## 7. Wire the frontend to the live backend

The live site currently builds with `EXPO_PUBLIC_API_URL=localhost:8080`, so
its chat can't reach anything. Fix it in the **Cloudflare Workers build
config** (dashboard → Workers → `aksharaverse` → Settings → Build →
Environment variables):

```
EXPO_PUBLIC_API_URL = https://aitutor-backend-….a.run.app
```

Then trigger a rebuild (push any commit to `main`, or "Retry build" in the
dashboard). After it deploys, aksharaverse.com's chat talks to Cloud Run.

**Stripe webhook** (when billing goes live): point it at
`https://aitutor-backend-….a.run.app/v1/billing/webhook` and replace the dummy
`STRIPE_WEBHOOK_SECRET` secret with the real signing secret.

---

## 8. Keep Supabase awake

Free Supabase projects **pause after ~1 week idle** → dead backend. Add a free
[UptimeRobot](https://uptimerobot.com) HTTP monitor:

```
URL:      https://aitutor-backend-….a.run.app/healthz
Interval: every 5 minutes
```

---

## 9. First real end-to-end (the P0 prove-it)

Everything above just makes the plumbing exist. To actually prove the pipeline:

1. **Reconcile + push the DB** (separate blocker, needs the Supabase CLI —
   see `supabase/README.md` § "Reconciling the live project"):
   `supabase link` → `supabase migration list` → **post that output to
   [[Status]]** → `supabase migration repair` → `supabase db push`.
   *(CI already proves the migrations apply to a fresh DB — PR #17 — so only
   the live-ledger step remains.)*
2. **Ingest one chapter** so retrieval has content:
   `python -m app.ingest.cli notes/optics.md --subject PHY --chapter PHY::optics::12`
3. **Ask a real question** on aksharaverse.com; confirm a streamed grounded
   answer, a `sessions` row, and a `traces` row land. That transcript is P1's
   baseline and the first live e2e in the project's history.

---

## Rollback / teardown

```bash
# Roll back to the previous revision (instant, no rebuild)
gcloud run services update-traffic aitutor-backend --region us-central1 --to-revisions PREVIOUS=100

# Tear the service down entirely (stops all cost)
gcloud run services delete aitutor-backend --region us-central1
```

---

## Connections
- Ships the deploy half of → [[Roadmap]] Horizon 1
- Guardrails from → [[Status]] § zero-spend deploy guardrails
- Paid-tier/pilot script → `backend/deploy/cloudrun.sh` on `feat/deploy-cloudrun`
