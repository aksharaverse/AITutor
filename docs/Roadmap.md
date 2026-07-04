---
tags: [type/note, domain/startup, startup/roadmap, status/active]
updated: 2026-06-28
---
# 🗺️ Roadmap & Next Steps

> Full phased plan lives in [[A1-Math-Verified-Tutor-Dev-Plan]] §4 & §9. This note is the **navigable summary + "right now."**

## ▶️ Right now (this week)
- [ ] **Decide the lane** — commit India-tutor (Lane A) for 6 months, or run the 2-week build-off vs eval-infra (Lane B). → [[Market-and-GTM]] open decision.
- [ ] **Apply for credits** — AWS Activate, Google/OpenAI/Anthropic for Startups, **Sarvam startup program**.
- [ ] **Curate 100 JEE Main Physics problems** (mechanics + electricity) with ground-truth answers (the Phase-0 dataset).
- [ ] **Merge ChatGPT + Claude brainstorms** into the `Open / contested` sections across these notes.

> 💻 Frontend already scaffolded → [[Codebase-AITutor]]. Phase-0 work = stand up the verifier backend behind its `AiTutorService` seam (define the API contract first).

## Phase 0 — De-risk the core (Weeks 0–2) ← *the kill test*
Prove the one thing that can kill us: **does [[Verification-Engine|verification]] lift correctness enough to matter?**
- Throwaway pipeline: typed/LaTeX → structured LLM solution → verifier (numeric step-check + dimensional + final-answer) → 1 repair retry → confidence/abstain.
- **Gate:** ≥95% final-answer accuracy **and** ≥99% step-precision. In parallel: 3 coaching-institute conversations + 5 student testers.

## Phase 1 — Verified-solutions MVP on a curated bank (Weeks 3–8)
Ingest problem bank (past papers + NCERT + partner) → intake (typed + photo OCR) → solve → verify → step-by-step with [[Fast-vs-Guided-Toggle]] + Hinglish/voice. Ship via WhatsApp + PWA. **KPIs:** coverage, step-precision, helpfulness, latency.

## Phase 2 — Practice + diagnostic engine (the flywheel) (Weeks 9–16)
Localize the first wrong step → classify error → remediate. Begin capturing **step-error data** ([[Student-Model]]) + BKT/IRT mastery + spaced repetition. Add the **[[Lecture-Companion-Overlay]]** as the headline/virality feature *(now that the verifier is proven)*.

## Phase 3 — Personalize, monetize, fine-tune (Months 5–8)
Adaptive selection + mocks. **B2B institute dashboard** (the paying product → [[Market-and-GTM]]). Start the **RLVR fine-tune** ([[Durable-Moat]]) to cut inference cost.

## Team roles (4 people)
| Person | Owns | Note |
|---|---|---|
| P1 | [[Verification-Engine\|Verifier + solver core]] (the moat) | strongest math/CAS |
| P2 | [[Student-Model\|ML/personalization]] — BKT/IRT, RLVR | stats/ML |
| P3 | Backend + data platform + integrations | systems/CS |
| P4 | Product + pedagogy + GTM ([[Market-and-GTM]]) | users/partners — *as critical as P1* |

## The metric that rules them all
**Step-precision ≥ 99%** — a false "verified" destroys trust. Honest uncertainty > confident hallucination. Full KPI table → [[A1-Math-Verified-Tutor-Dev-Plan]] §6.

## Connections
- Detail → [[A1-Math-Verified-Tutor-Dev-Plan]] · Research that gates it → [[Research-Questions]]
- Hub → [[Startup-MOC]]
