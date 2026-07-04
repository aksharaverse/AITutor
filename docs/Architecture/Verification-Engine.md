---
tags: [type/note, domain/startup, startup/architecture, startup/moat, decision/anchor]
updated: 2026-06-28
---
# 🥇 The Verification Engine (the moat)

> **Principle: "LLM proposes, math disposes."** The LLM generates candidate reasoning; a *deterministic* layer verifies each step; failures are repaired or **abstained** on. This is the single hard-to-copy thing — *most ed-tech teams cannot build it.* Full spec → [[A1-Math-Verified-Tutor-Dev-Plan]] §1.

## Why this is the moat (not a feature)
1. The verifier is **real engineering** (CAS + numeric testing + domain solvers), not a prompt.
2. **Honest abstention** ("I'm not certain — here's what I *can* verify") builds the trust that wins parents/teachers. Nobody else does this.
3. The **diagnostic flywheel**: pinpointing *which step* a student erred → a proprietary Indian-exam step-error dataset → [[Student-Model|personalization]] → [[Durable-Moat|RLVR small model]].

## Structured solutions (not prose)
Force the model to emit machine-checkable steps — each step has a human explanation *and* a checkable `expr`. (JSON schema in [[A1-Math-Verified-Tutor-Dev-Plan]] §1.1.)

## The verification layers (each is a winnable math problem)
| Layer | Checks | Technique |
|---|---|---|
| Final-answer equivalence | answer right? | symbolic `simplify(ans-gold)==0`; numeric + units/sig-figs |
| **Step-transition** | does step *i* imply *i+1*? | **random numeric equivalence testing** — [[Glossary#Schwartz–Zippel\|Schwartz–Zippel]]: a non-zero polynomial is non-zero almost everywhere → near-zero false-pass |
| Dimensional (physics) | units consistent? | `pint` homogeneity |
| Conservation (chem) | balanced? | null space of atom-count matrix `Ax=0` → provably exact |
| Self-consistency | independent solves agree? | sample *k* + symbolic solve; abstain on dispersion |
| Sanity | physically possible? | domain bounds (prob∈[0,1], |sin|≤1) |

## The gate (precision over recall)
```
generate (k) → verify → if all pass & conf≥τ: SHOW (verified)
                        elif a step fails: REPAIR (re-prompt w/ the failure) → re-verify (≤N)
                        else:              ABSTAIN ("here's what I can verify")
```
> **A false "verified" is catastrophic for trust; abstaining is fine.** Target **step-precision ≥ 99%**, even if coverage starts ~70–80%. This is the #1 metric ([[Roadmap]]).

## Honest staging (the real risk = autoformalization)
Turning free-form NL steps into checkable form is itself error-prone. So **stage it**:
- **v1 — curated bank:** only problems where we hold ground-truth (past papers, NCERT, partner content). Tractable, high-precision.
- **v2 — open problems:** user-photographed, full solver-verifier loop with confidence + abstention.
- **v3 — formal (optional):** Lean/Isabelle for select proofs. Research flex, not a v1 dependency.

## RLVR — the crown jewel (12-month)
The verifier = a **verifiable reward**. Fine-tune a small open model on Indian-exam problems with the verifier as reward signal → cheaper, niche-better model. 2026 evidence this works: **DeepSeek R1-Zero went 15.6%→77.9% on AIME from verifiable rewards alone, developing self-verification on its own** ([[Reading-List]]). This folds cost-moat into correctness-moat. → [[Durable-Moat]].

## Open / contested
- `#decision/open` How much open-problem (v2) do we attempt in the first 6 months vs. staying on the curated bank? (Claude: stay curated through Phase 1 — see [[Roadmap]].)
- `#decision/open` Confidence threshold τ and abstention UX — how do we show "unsure" without feeling broken to a stressed student?

## Connections
- Core of → [[Verified-Reasoning-Engine]], [[Cognitive-Architecture]]
- Feeds → [[Student-Model]] (step-errors), [[Durable-Moat]] (RLVR)
- Deep spec → [[A1-Math-Verified-Tutor-Dev-Plan]] · Terms → [[Glossary]] · Hub → [[Startup-MOC]]
