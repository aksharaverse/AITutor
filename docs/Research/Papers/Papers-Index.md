---
tags: [type/moc, domain/startup, startup/research]
updated: 2026-06-28
---
# 📚 Papers Library — Index

> **25 papers**, downloaded as PDFs into the 8 folders beside this note, mapped to our architecture. Each links to the relevant build note + its arXiv page. **Tip:** drop a whole folder into **NotebookLM** to get a grounded Q&A + audio overview of that topic. Reading priority → [[Research-Questions]].

> ⭐ = read first (foundational). Each entry: `arXiv id · year · why it matters to us`.

## 01 · Verification & RLVR 🥇 (the [[Verification-Engine|moat]] + [[Durable-Moat|RLVR north star]])
- ⭐ **DeepSeek-R1** — [2501.12948](https://arxiv.org/abs/2501.12948) · 2025 · the proof that RL + verifiable rewards alone produces self-verifying math reasoning. The template for our [[Durable-Moat|RLVR small model]].
- ⭐ **Trust, But Verify** — [2505.13445](https://arxiv.org/abs/2505.13445) · 2025 · jointly trains solving *and* self-verification — directly our [[Verification-Engine]] thesis.
- **Reasoning Gym** — [2505.24760](https://arxiv.org/abs/2505.24760) · 2025 · reusable verifiable-reward environments; useful scaffolding for our eval/training loop.
- **Self-Consistency** — [2203.11171](https://arxiv.org/abs/2203.11171) · 2022 · sample-k-and-agree; the basis of our self-consistency verification layer.

## 02 · Process Reward & Step Verification ([[Verification-Engine]] step-checking)
- ⭐ **Let's Verify Step by Step** — [2305.20050](https://arxiv.org/abs/2305.20050) · 2023 · the canonical case for **process** (per-step) over outcome supervision. Core to step-precision.
- ⭐ **rStar-Math** — [2501.04519](https://arxiv.org/abs/2501.04519) · 2025 · **small** LLMs master math via self-evolved deep thinking + a process reward — exactly our "cheap model + verifier" bet.
- **Entropy-Regularized PRM** — [2412.11006](https://arxiv.org/abs/2412.11006) · 2024 · more robust process reward modeling.

## 03 · Autoformalization (our [[Verification-Engine|#1 risk]]: NL → checkable)
- ⭐ **MathAtlas** — [2605.14061](https://arxiv.org/abs/2605.14061) · 2026 · benchmark for autoformalization "in the wild" — measures the exact gap that gates our v2.
- **Multilingual Math Autoformalization** — [2311.03755](https://arxiv.org/abs/2311.03755) · 2023 · relevant to Hinglish/vernacular intake.
- **Consistent Autoformalization** — [2410.04194](https://arxiv.org/abs/2410.04194) · 2024 · techniques to make NL→formal reliable enough to trust.

## 04 · Knowledge Tracing & Student Modeling ([[Student-Model]])
- ⭐ **Deep Knowledge Tracing** — [1506.05908](https://arxiv.org/abs/1506.05908) · 2015 · the foundational DKT paper; baseline for mastery estimation.
- **Survey of Explainable KT** — [2403.07279](https://arxiv.org/abs/2403.07279) · 2024 · the map of the field — read to pick our v1 approach.
- **Interpretable KT (counterfactual)** — [2312.10045](https://arxiv.org/abs/2312.10045) · 2023 · *why* a student erred — feeds our diagnostic flywheel.

## 05 · Spaced Repetition & Memory ([[Fast-vs-Guided-Toggle|nudge/review engine]])
- ⭐ **Unbounded Human Learning** — [1602.07032](https://arxiv.org/abs/1602.07032) · 2016 · optimal scheduling for spaced repetition — the math behind FSRS-style review.
- **Optimizing Human Learning** — [1712.01856](https://arxiv.org/abs/1712.01856) · 2017 · memory models for scheduling reviews.
- **Adaptive Forgetting Curves** — [2004.11327](https://arxiv.org/abs/2004.11327) · 2020 · per-learner forgetting curves.

## 06 · LLM Tutoring & Pedagogy ([[Human-vs-AI-Tutor-Gap]], [[Competitive-Landscape]])
- ⭐ **Tutoring Systems: Systematic Review** — [2503.09748](https://arxiv.org/abs/2503.09748) · 2025 · the landscape; grounds our differentiation.
- **PATS: Personality-Aware Teaching** — [2601.08402](https://arxiv.org/abs/2601.08402) · 2026 · adapting teaching style (our Gap 6).
- **Private Tutoring by Chaining LLMs** — [2309.08112](https://arxiv.org/abs/2309.08112) · 2023 · multi-component tutor orchestration (our [[Cognitive-Architecture]]).

## 07 · Retrieval / RAG / Knowledge Graph ([[Retrieval-Knowledge-Layer]])
- ⭐ **Knowledge Graph-Guided RAG** — [2502.06864](https://arxiv.org/abs/2502.06864) · 2025 · vectors + KG hybrid — our exact retrieval thesis.
- **KG-extended RAG for QA** — [2504.08893](https://arxiv.org/abs/2504.08893) · 2025 · multi-hop QA over a knowledge graph.
- **TagRAG** — [2601.05254](https://arxiv.org/abs/2601.05254) · 2026 · tag-guided hierarchical retrieval (maps to subject/topic tagging).

## 08 · Model Routing & Efficiency ([[Cognitive-Architecture|the router]], cost arbitrage)
- ⭐ **RouterBench** — [2403.12031](https://arxiv.org/abs/2403.12031) · 2024 · how to benchmark a multi-LLM router — our cost-arbitrage core.
- **Cost-effective LLM Routing** — [2605.28268](https://arxiv.org/abs/2605.28268) · 2026 · batch-prompting routing for cheap inference.
- **MTRouter** — [2604.23530](https://arxiv.org/abs/2604.23530) · 2026 · cost-aware multi-turn routing (tutoring is multi-turn).

---

## How to use this library
1. **Read the ⭐ first** in folders 01, 02, 04 — they touch the moat directly.
2. **Summarize as you go** — run the `paper-summarizer` subagent (or ask Claude) → it writes a linked note tied to a [[Research-Questions|question]].
3. **NotebookLM** — upload a folder, ask it questions, generate an audio overview for commute-learning.
4. **Don't hoard-read** — each paper should end in a decision or an experiment, per the research→build loop.

## Connections
- Part of → [[Reading-List]], [[Research-Questions]] · Hub → [[Startup-MOC]]
