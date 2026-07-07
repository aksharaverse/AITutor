---
tags: [type/note, domain/startup, startup/product, decision/anchor, status/active]
updated: 2026-07-06
---
# 📋 PRD / BRD — Verified-Reasoning Tutor (v1)

> Combined business-requirements + product-requirements document for the first product on the [[Verified-Reasoning-Engine]]. Strategy rationale → [[Viability-Brutal-Honesty]]. Technical design → [[Architecture-Options]]. Execution → [[Roadmap]].

## 1. Business context (BRD)

### 1.1 Problem statement
- **Students** (JEE/NEET aspirants): doubts stall study sessions for hours/days; free AI answers are unaligned with exam method and occasionally wrong at exactly the moment of maximum trust; nobody tells them *which step of their own attempt* is wrong.
- **Small/mid coaching institutes** (the buyer): can't build AI, are losing students to PW/Allen and to free ChatGPT, and cannot defend a generic chatbot's accuracy to fee-paying parents.
- **Parents** (the payer behind the buyer): pay ₹50k–2L/yr for accountability and results; get zero visibility between mock tests.

### 1.2 Business objectives (12 months)
| Objective | Target | Why |
|---|---|---|
| Prove the moat | Phase-0 gate: ≥95% final-answer accuracy, ≥99% step-precision | Kill test — see [[Viability-Brutal-Honesty]] §5 |
| Prove GTM | 3 institute pilots by day 90; 5 paying institutes by month 8 | The only revenue thesis that survives free incumbents |
| Prove engagement | D7 ≥ 25%, D30 ≥ 12% in pilot cohorts; ≥5 problems/student/week | Engagement, not accuracy, killed our predecessors |
| Unit economics | Blended cost/verified-solve < ₹0.5 (< ₹0.2 with cache) | The verifier as a cost weapon |
| Data flywheel | ≥50k verified solutions + ≥10k localized student errors captured | Feeds [[Student-Model]] and the RLVR north star |

### 1.3 Revenue model
- **Primary — B2B2C:** ₹40–80/seat/month, white-label/co-branded, sold to small & mid coaching institutes (annual contracts, UPI/Razorpay). Includes teacher dashboard + parent reports.
- **Secondary — B2C freemium:** free tier (N verified solves/day) as funnel + credibility; ₹199–299/mo unlimited + practice engine. No paid acquisition.
- **Later (option, not plan):** verification API for edtechs/publishers; RLVR exam-math model as an API.

### 1.4 Non-goals (v1)
- Biology/UPSC/essay subjects (no verifier leverage), proof-based Olympiad math (Lean is v3 research), a mobile native app (PWA + WhatsApp only), building our own foundation model, US/global markets.

## 2. Users & personas

| Persona | Snapshot | Job-to-be-done | Success looks like |
|---|---|---|---|
| **Arjun, 17** — JEE aspirant, Tier-2 city, institute batch of 60 | Stuck at 11pm on a rotational-mechanics problem | "Unstick me *now*, the way the exam wants it solved, and don't lie to me" | Verified step-by-step in <8s; hint mode when he wants to try; Hinglish voice when reading fatigue hits |
| **Priya, 16** — NEET aspirant, self-study + one weak local institute | Gets answers from free ChatGPT but doesn't trust them before the exam | "Tell me which of MY steps is wrong" | Pastes her attempt → the first wrong step is flagged with the misconception named |
| **Sharma sir** — owner, 300-student institute | Losing students to PW; can't afford tech staff | "Give my institute an AI edge my parents will believe" | White-label bot on his brand; weekly cohort weak-topic report; zero embarrassing wrong answers |
| **Arjun's mother** — the payer | No visibility between mocks | "Is the fee working?" | WhatsApp weekly report: topics mastered, effort, readiness trend |

## 3. Product requirements (PRD)

### 3.1 Functional requirements by module
Priority: **P0** = MVP (Phase 0–1), **P1** = Phase 2, **P2** = Phase 3+.

**F1 — Intake & understanding**
- F1.1 (P0) Typed/LaTeX problem input. F1.2 (P0) Photo → math OCR (printed). F1.3 (P1) Student-attempt input (typed steps / MCQ work). F1.4 (P2) Voice input (Indic ASR). 
- F1.5 (P0) Classify subject/topic/type; extract given/find/units; match against the curated bank (retrieval hit = cheap path).

**F2 — Solver**
- F2.1 (P0) Structured JSON solution (steps with `nl` + `expr` + `op`) from routed LLM, k-sample self-consistency. F2.2 (P0) Independent SymPy solve where applicable. F2.3 (P0) Difficulty-based model routing (see [[Architecture-Options]] §4).

**F3 — Verifier** (the moat — spec in [[Verification-Engine]])
- F3.1 (P0) Final-answer equivalence vs ground truth (symbolic + numeric + units/sig-figs).
- F3.2 (P0) Step-transition numeric equivalence (Schwartz–Zippel sampling).
- F3.3 (P0) Dimensional analysis (pint). F3.4 (P1) Conservation/stoichiometry (chem). F3.5 (P0) Sanity/domain constraints.
- F3.6 (P0) Confidence gate → **VERIFIED / PARTIALLY VERIFIED / UNVERIFIED** with honest badge copy ("every computation step machine-checked" — never claim more than checked; see [[Viability-Brutal-Honesty]] G5).
- F3.7 (P0) Repair loop (≤2 retries, verifier failure fed back to the LLM). F3.8 (P0) Abstention UX: show what *is* verified, say what isn't.

**F4 — Teaching & delivery**
- F4.1 (P0) Step-by-step render with per-step badge; LaTeX. F4.2 (P0) [[Fast-vs-Guided-Toggle]]: fast full solution (default) vs one-step-at-a-time hints. F4.3 (P1) Hinglish explanations; (P2) regional languages + TTS voice. F4.4 (P0) PWA; F4.5 (P1) WhatsApp bot; F4.6 (P2) [[Lecture-Companion-Overlay]].
- F4.7 (P0) **Latency contract:** first token <3s, full fast-mode answer p50 <8s typed / <20s photo; verification badge may upgrade asynchronously.

**F5 — Diagnosis & practice (the flywheel)**
- F5.1 (P1) Localize first wrong step in a student attempt; classify error (conceptual/computational/careless); name the misconception. F5.2 (P1) Adaptive practice from mastery model (BKT/IRT — [[Student-Model]]). F5.3 (P1) Spaced-repetition review queue (FSRS). F5.4 (P2) Mock tests + readiness score.

**F6 — Accountability layer (the human-gap answer)**
- F6.1 (P1) Institute dashboard: cohort weak topics, usage, at-risk students, escalate-to-teacher flags. F6.2 (P1) Parent weekly WhatsApp report. F6.3 (P1) White-label branding per institute. F6.4 (P1) Seat management + Razorpay billing.

**F7 — Data & evals platform**
- F7.1 (P0) Every solve/verification/error logged as structured training data. F7.2 (P0) Gold benchmark + eval harness in CI (no model/prompt change ships without eval pass). F7.3 (P1) Red-team false-verified suite. F7.4 (P2) RLVR fine-tune pipeline.

### 3.2 Non-functional requirements
| NFR | Requirement |
|---|---|
| **Correctness** | Step-precision ≥99%; false-verified rate <1% on red-team set (release blocker) |
| **Latency** | §F4.7; WhatsApp round-trip <15s |
| **Cost** | <₹1/solve uncached, <₹0.2 blended at scale; per-request budget enforcement in the gateway |
| **Availability** | 99.5% during 5am–1am IST (exam-season peak) |
| **Privacy/compliance** | India **DPDP Act 2023**: users are mostly minors → verifiable parental/institute consent at onboarding, data minimization, no ads/profiling of children, India-region data residency, deletion on request |
| **Security** | Per-institute tenant isolation; problem banks are partner IP — encrypted, never used to train shared models without contract |
| **Portability** | Every model behind the gateway is swappable (Replaceability Principle — [[Durable-Moat]]) |

### 3.3 Success metrics (the dashboard)
Tech: step-precision, false-verified rate, final-answer accuracy, coverage %, p50/p95 latency, cost/solve. Engagement: D7/D30, problems/student/week, hint-completion, "this helped" %. Business: pilots→paid conversion, seats live, ₹MRR, logo churn. Flywheel: verified solutions banked, step-errors labeled, diagnosis agreement %.

### 3.4 Release plan (maps to [[Roadmap]])
- **R0 (wk 2):** Phase-0 kill test — eval harness + verifier on 100 JEE physics problems. Gate: ≥95%/≥99%.
- **R1 (wk 8):** MVP — curated-bank verified solutions, PWA + WhatsApp, 3 pilot institutes, fast/guided toggle, public accuracy report v1.
- **R2 (wk 16):** Diagnosis on in-app typed practice, mastery model v1, institute dashboard beta, parent reports.
- **R3 (mo 8):** Paid seats live, adaptive practice + mocks, Hinglish voice, RLVR fine-tune started.

### 3.5 Top risks & mitigations (full analysis → [[Viability-Brutal-Honesty]])
| Risk | Mitigation |
|---|---|
| Frontier models erase the accuracy wedge | Verifier repositioned as cost-weapon + proof + diagnosis; publish transparency benchmarks |
| Students don't come back (the Khanmigo failure) | Fast-mode default, latency contract, overlay, streaks; D7 tracked as a release gate |
| Institutes won't buy | 90-day design-partner kill-switch; founder-led sales; white-label + parent reports as the un-copyable-by-free bundle |
| False "verified" on a wrong physical model | Curated-bank ground truth, k-sample agreement, honest badge scope, red-team suite as release blocker |
| DPDP non-compliance with minors | Consent via institute onboarding contracts; privacy-by-design from R1 |

## Connections
- Why these choices → [[Viability-Brutal-Honesty]] · How it's built → [[Architecture-Options]]
- Moat spec → [[Verification-Engine]] · Buyer/GTM → [[Market-and-GTM]] · Hub → [[Startup-MOC]]
