---
tags: [type/note, domain/startup, startup/research]
updated: 2026-06-28
---
# 🔬 Research Questions (the research → build loop)

> We are a **research-first** team. Every open question here should end in: **a dive → a note → a build → a measurement → back here.** This loop *is* the company ([[Durable-Moat]]). Don't let a question sit unlinked.

## 🔥 Tier 1 — must answer before/while building MVP
- [ ] **Does verification actually lift correctness enough to matter?** (Phase-0 kill test — [[Roadmap]]). Target: raw-LLM vs verified pipeline on 100 JEE Physics problems. → owns [[Verification-Engine]].
- [ ] **Autoformalization:** how reliably can we turn an LLM's NL step into a checkable `expr`? This is the #1 technical risk. → [[Glossary#Autoformalization]].
- [ ] **Step-transition checking:** is Schwartz–Zippel random numeric testing robust enough across our problem types? False-pass rate? → [[Verification-Engine]].
- [ ] **Confidence & abstention:** how do we set τ and show "unsure" without feeling broken to a stressed student? → [[Fast-vs-Guided-Toggle]].

## 🟡 Tier 2 — shapes architecture
- [ ] **Mastery model:** BKT vs IRT vs Elo for v1 — which is honest with little data? → [[Student-Model]].
- [ ] **Retrieval:** does a knowledge graph beat hybrid-vectors enough to justify v1 complexity? → [[Retrieval-Knowledge-Layer]].
- [ ] **Model router:** which cheap model handles the 80%? Where's the cost/quality knee? → [[Cognitive-Architecture]].
- [ ] **RLVR:** smallest open model + dataset size where our verifier-as-reward beats GPT on cost-quality for JEE? → [[Durable-Moat]].

## 🟢 Tier 3 — product & pedagogy
- [ ] **Cognitive offloading:** can a nudge measurably protect learning without killing usage? (the unsolved one) → [[Human-vs-AI-Tutor-Gap]].
- [ ] **Overlay:** latency budget for live verification on unscripted lecture video? → [[Lecture-Companion-Overlay]].
- [ ] **Persona/branding:** does a named tutor (TutorEva lesson) drive word-of-mouth among JEE aspirants? → [[Competitive-Landscape]].

## The dive template (copy for each)
```
## <question> — <date>
- Why it matters / what build it unblocks:
- What I read (→ add to [[Reading-List]]):
- Finding:
- Decision / next build:
- Links:
```

## Karpathy's framing (keep us honest)
The agility direction he points to: **spec layer (conceptual info) → verifier → environment.** Map our work to it: [[Retrieval-Knowledge-Layer]] = spec, [[Verification-Engine]] = verifier, [[Lecture-Companion-Overlay]]/[[Student-Model]] = environment.

## Connections
- Feeds → every architecture note · Reading → [[Reading-List]] · Terms → [[Glossary]]
- Execution → [[Roadmap]] · Hub → [[Startup-MOC]]
