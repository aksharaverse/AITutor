---
tags: [type/note, domain/startup, startup/architecture, decision/anchor, status/active]
updated: 2026-07-06
---
# 🧭 Architecture Options — three designs, one evolution path

> Multi-architecture analysis for the [[Verified-Reasoning-Engine]]: three candidate designs, a model/API selection matrix, and 2026 orchestration best practices from production-LLM literature. Complements [[Cognitive-Architecture]] (the conceptual layers) and answers its open question *"how agentic in v1?"* — **answer: not agentic in v1.** The concrete MVP build (`frontend/` + `backend/` in this repo) implements Option A — see [[AITutor-MVP-Architecture]] for the exact stack, API surface, and data model.

---

## 1. The three candidate architectures

### Option A — Deterministic Pipeline (v1 · Phase 0–1) ✅ *start here*
A fixed, non-agentic DAG. Every request takes the same path; all "intelligence" is in the components, none in the control flow.

```
POST /solve
  → Intake (OCR / LaTeX normalize)
  → Understand (classify topic; extract given/find/units)   [1 cheap LLM call, JSON schema]
  → Bank lookup (exact hash → semantic match on pgvector)   [cache hit ≈ 60–80% for exam problems]
      hit  → serve stored verified solution (₹~0)
      miss → Solve: k=3 samples, routed model + SymPy independent solve
  → Verify: answer-equiv · step-transition (Schwartz–Zippel) · dimensional · sanity
      fail → Repair (≤2 retries, failure message in prompt) → re-verify
  → Gate: VERIFIED / PARTIAL / ABSTAIN  + confidence
  → Render (steps + badges) → log everything (F7 data flywheel)
```
- **Stack:** FastAPI monolith · Postgres (+pgvector) · Redis (cache + queue) · SymPy/pint workers · one LLM SDK behind a thin `Reasoner` interface.
- **Why it wins v1:** debuggable, cheap, testable in CI, no framework lock-in, latency predictable. Matches the "kill test" scope.
- **Limits:** no multi-turn pedagogy state, no open-problem handling, control flow can't adapt.

### Option B — Gateway + Router platform (v2 · Phase 2–3) ✅ *evolve into this*
Same pipeline, but the LLM plumbing moves into a **gateway layer** — the 2026 production standard.

```
            ┌──────────────── LLM GATEWAY (LiteLLM / Portkey / self-host) ────────────────┐
 App ──────▶│ authn · rate limits · per-request ₹ budget · logging/compliance             │
            │ ① exact+semantic cache (Redis) → ② difficulty router → ③ provider fallback │
            └───────┬───────────────┬───────────────┬─────────────────┬──────────────────┘
                    ▼               ▼               ▼                 ▼
              cheap model     mid reasoning    frontier (hard 5–10%)  vision/OCR · Indic ASR/TTS
```
- **Difficulty router:** start with heuristics (topic, length, bank-miss, past failure rate), graduate to a learned RouteLLM-style router — published results retain ~95% of strong-model quality while sending only ~14% of queries to it. **Our twist: verifier feedback trains the router** (a failed verification = evidence the problem needed a bigger model). That closed loop is something generic gateways don't have.
- **Semantic cache before the router:** cache hit = no routing, no LLM, ₹~0 — and exam problems repeat massively. Three cache tiers: exact problem hash → semantic (embedding sim ≥ τ) → verified-solution bank.
- **Adds:** observability (Langfuse/OpenTelemetry traces per solve), evals-in-CI as deploy gate, multi-tenant keys per institute, provider failover (the Replaceability Principle — [[Durable-Moat]] — enforced in infra, not in discipline).

### Option C — Agentic Orchestrator (v3 · only when needs demand it)
A stateful graph (LangGraph-style state machine, *not* free-form autonomous agents): `Planner → {Retriever, Solver, Verifier, Diagnoser, Tutor} → Reflector`, with the [[Student-Model]] as shared state.
- **Justified only by:** open/user-submitted problems needing decomposition; multi-turn Socratic dialogue that adapts mid-conversation; the lecture-companion overlay reacting to a video timeline.
- **Dangers (why not v1):** latency stacking, non-determinism where our brand demands determinism, debugging pain, framework churn. Agentic control flow must never sit *between* the student and a fast answer — it belongs in the guided/tutoring mode only. Verification stays a deterministic function call, never an "agent."

### Decision matrix
| Criterion | A Pipeline | B Gateway | C Agentic |
|---|---|---|---|
| Time to kill-test | **days** | weeks | months |
| Latency control | **best** | good | worst |
| Cost control | good | **best** (cache+router+budgets) | poor |
| Determinism/trust | **best** | best | needs care |
| Multi-turn pedagogy | none | limited | **best** |
| Ops complexity | lowest | medium | high |

**Ruling:** A → B is an evolution (B wraps A's LLM calls; nothing is thrown away). C is bolted on later *only* for guided-mode and the overlay. This resolves [[Cognitive-Architecture]]'s `#decision/open` items: defer the knowledge graph, defer agentic control.

---

## 2. The verifier as a service boundary (the second-act insurance)
Expose verification as its own internal API from day 1 — `POST /verify {structured_solution} → {step_verdicts[], confidence, failures[]}` — stateless, pure, no LLM inside. Costs nothing now; preserves the option to sell **verification-as-infrastructure** later ([[Viability-Brutal-Honesty]] G8) and keeps the RLVR reward function cleanly callable.

## 3. API contract for the frontend seam
The Angular app's `AiTutorService` ([[Codebase-AITutor]]) binds to:
```
POST /v1/solve        {problem: {text|latex|image}, mode: "fast"|"guided", lang}
  → 202 {solve_id}    (async; SSE stream at /v1/solve/{id}/events)
  events: understanding → step{nl, latex, badge: verified|checking|unverified} → final{value, confidence, badge}
POST /v1/diagnose     {problem_id, student_steps[]} → {first_wrong_step, error_type, misconception, remediation}
GET  /v1/practice/next {student_id} → problem selected by mastery model
```
Badges stream as `checking` and upgrade to `verified` asynchronously — this is how we meet the <8s latency contract while verification completes (G10).

## 4. Model & API selection matrix (July 2026 — revisit quarterly, swap via gateway)
| Task | Primary | Fallback/escalation | Note |
|---|---|---|---|
| High-volume solving (80%+) | Gemini Flash-class / GPT-5-mini-class / Claude Haiku-class | — | Verifier makes cheap models safe = the cost weapon |
| Hard problems (5–10%) | Frontier reasoning (Gemini Pro/Deep Think-class, GPT-5.x, Claude) | second frontier provider | Router escalates on bank-miss + verify-fail |
| Structured-solution emit | Any of the above **with JSON-schema enforced outputs** | — | Never parse free prose |
| Independent solve | **SymPy** (free, deterministic) | Wolfram-style CAS if needed | Not an LLM |
| Math OCR | Vision LLM | **Mathpix** when quality demands | Printed first; handwriting later |
| Indic ASR/TTS | **Sarvam / AI4Bharat** | Deepgram/ElevenLabs | Sarvam startup credits |
| Embeddings/retrieval | small embedding model + pgvector | Qdrant at scale | Bank match, semantic cache |
| Future volume model | **Qwen-Math-class 7B + RLVR (GRPO)** on Modal/RunPod | — | The 12-month north star ([[Durable-Moat]]) |

## 5. Orchestration best practices we adopt (2026 production canon)
1. **Gateway owns cost/reliability/governance** — routing, caching, retries, budgets, logging live in one layer, not scattered in app code.
2. **Cache before route, route before escalate** — cheapest sufficient path always.
3. **Structured outputs everywhere**; validation errors = repair-loop input.
4. **Evals as CI** — the gold benchmark + red-team false-verified suite gate every prompt/model/router change (this is also our published proof — G1).
5. **Traces per solve** (understanding→samples→verdicts→cost) — debugging, transparency reports, and RLVR training data are the same log.
6. **Async-first UX** — stream fast, verify in parallel, upgrade badges.
7. **Determinism where trust lives** — verification and billing are code, not model calls.
8. **Per-tenant isolation** — institute banks/keys/data walled off (DPDP + partner IP).
9. **No framework marriage** — LangGraph et al. only at the v3 edge; the core is plain Python.
10. **Kill-switch metrics** — false-verified rate and p95 latency page a human; badge feature flags off instantly.

## Connections
- Implements → [[Cognitive-Architecture]] (and closes its open decisions) · Moat spec → [[Verification-Engine]]
- Serves → [[PRD]] §F-modules · Strategy constraints → [[Viability-Brutal-Honesty]]
- Concrete build → [[AITutor-MVP-Architecture]] · Frontend seam → [[Codebase-AITutor]] · Hub → [[Startup-MOC]]

## Sources
- [Redis — LLM router architecture best practices 2026](https://redis.io/blog/llm-router-architecture-best-practices/) (RouteLLM ~95% quality at 14% strong-model traffic; semantic-cache-first)
- [Digital Applied — LLM gateway architecture 2026](https://www.digitalapplied.com/blog/llm-gateway-architecture-2026-engineering-reference) (gateway as governance layer)
- [Orq — LLM orchestration 2026](https://orq.ai/blog/llm-orchestration) · [AIMultiple — 22 frameworks](https://aimultiple.com/llm-orchestration)
- [Redis — LLMOps guide 2026](https://redis.io/blog/large-language-model-operations-guide/) (caching + routing + batching for cost)
