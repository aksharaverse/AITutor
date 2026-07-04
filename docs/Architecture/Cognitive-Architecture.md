---
tags: [type/note, domain/startup, startup/architecture, decision/anchor]
updated: 2026-06-28
---
# 🏗️ Cognitive Architecture (our "AI OS")

> A human tutor's brain isn't one giant LLM. It's `Perception → Attention → Memory → Reasoning → Verification → Planning → Teaching → Reflection`. Today's tutors are `Prompt → LLM → Response`. **That architecture mismatch is our biggest opportunity.** Our differentiator is a better *cognitive architecture*, not a better model.

## The 5 layers (decompose the tutor)
An AI tutor has only 5 jobs. If any fails, the tutor fails:
```
Question → Understand → Find Knowledge → Reason → Verify → Teach
```

| Layer | Job | Our note | Where the math is the edge |
|---|---|---|---|
| 1. **Knowledge** | what content we own/retrieve/organize | [[Retrieval-Knowledge-Layer]] | content quality > model |
| 2. **Retrieval** | find the *right* knowledge | [[Retrieval-Knowledge-Layer]] | hybrid search + knowledge graph |
| 3. **Reasoning** | solve, routed by difficulty | this note (§Model Router) | routing = cost arbitrage |
| 4. **Verification** | know it's correct; abstain if not | [[Verification-Engine]] 🥇 | the moat |
| 5. **Teaching** | present it; adapt style | [[Fast-vs-Guided-Toggle]], [[Lecture-Companion-Overlay]] | pedagogy + analytics |

> 💻 The **UI for layer 5** already exists in code → [[Codebase-AITutor]] (Angular 18). Today it's a shell with a fake service; layers 1–4 (the moat) are still to build behind its `AiTutorService` seam.

> **Order of work (ChatGPT's sequencing, adopted):** answer Knowledge → Retrieval → Reasoning → Verification → Teaching *in that order* before chasing "cool features." See [[Roadmap]].

## The Model Router (not one flagship model)
There should be **no single flagship model** — there should be a **router**:
```
easy arithmetic     → small cheap model
concept explanation → medium reasoning model
hard Olympiad proof → powerful reasoning model
OCR                 → vision model
speech              → Indic speech model (Sarvam/AI4Bharat)
```
Three wins: **lower cost**, **best model per task**, **freedom to swap providers** ([[Durable-Moat]]). Routing the 80% to cheap models and escalating the hard 10% *is* the cost arbitrage.

## Orchestration (delegate, don't monolith)
Modern systems win by **delegating**, not by being one smarter model:
```
Planner → Retriever → Verifier → Python → Knowledge Graph → Memory → Teaching Agent → Evaluator
```
Each is a specialized component cooperating. Maps directly onto the [[Human-vs-AI-Tutor-Gap|10 gaps]] (Gap 10 = orchestration). Reference backend → [[High Level Architecture]].

## What we build vs. assemble (first-years: don't reinvent everything)
- **Concentrate our invention** in: the [[Verification-Engine|verifier]], reasoning **orchestration**, and the [[Student-Model|learning model]].
- **Assemble from managed services**: cloud, DB, auth, storage, observability, OCR, ASR/TTS. Full stack list → [[A1-Math-Verified-Tutor-Dev-Plan]] §3.

## Open / contested
- `#decision/open` Knowledge graph (Neo4j) in v1, or defer until after the curated-bank MVP? (Lean: defer — see [[Retrieval-Knowledge-Layer]].)
- `#decision/open` How "agentic" in v1 vs a simpler fixed pipeline? Over-orchestration adds latency/bugs ([[A serious question]] Reason 4).

## Connections
- Implements → [[Verified-Reasoning-Engine]], [[Durable-Moat]]
- Contains → [[Verification-Engine]], [[Retrieval-Knowledge-Layer]], [[Student-Model]]
- Hub → [[Startup-MOC]] · Sources → [[Brainstorming with Chatgpt]], [[High Level Architecture]]
