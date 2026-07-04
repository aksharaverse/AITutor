---
tags: [type/note, domain/startup, startup/research]
updated: 2026-06-28
---
# 📖 Reading List & Tools

> 📚 **25 papers already downloaded & organized** into 8 topic folders → see [[Papers-Index]] (in `Research/Papers/`). This note is the broader pointer list; the index is the curated, on-disk library.

> Digest → summarize into a note → link from [[Research-Questions]]. Use NotebookLM for the PDFs (drop a folder in, ask, get audio overviews). Some PDFs also live in your `08_Research/` folder.

## 🧮 Verification / RLVR (the moat)
- **Trust, But Verify: Self-Verification for RLVR** — https://arxiv.org/pdf/2505.13445 — aligns problem-solving *and* self-verification jointly. Direct to [[Verification-Engine]].
- **DeepSeek R1-Zero** (GRPO + verifiable rewards, 15.6%→77.9% AIME, self-verification *emerged*) — the proof RLVR works for math. → [[Durable-Moat]].
- **JudgeRLVR: Judge First, Generate Second** — https://arxiv.org/pdf/2601.08468 — verify-then-generate efficiency.
- **Schwartz–Zippel lemma** — the theory under random numeric step-checking. → [[Glossary]].
- Tools: **SymPy** (CAS), **pint** (units), **RDKit** (chem), **Lean/Isabelle** (formal, v3).

## 🧠 Student modeling / learning science
- **Bayesian Knowledge Tracing (BKT)** + **Item Response Theory (IRT)** — mastery estimation. → [[Student-Model]].
- **FSRS** (Free Spaced Repetition Scheduler) — the nudge/review engine. → [[Fast-vs-Guided-Toggle]].
- Khanmigo efficacy + Stanford CEPA engagement studies — the [[Competitive-Landscape|Problem 2]] evidence.
- Cognitive-offloading studies / 2026 International AI Safety Report — [[Human-vs-AI-Tutor-Gap]] Gap 4.

## 🔎 Retrieval / orchestration
- Hybrid retrieval (vector + knowledge graph), retrieval routing — → [[Retrieval-Knowledge-Layer]].
- Karpathy on LLM limits (car-wash / latent-goal) + spec→verifier→environment framing. → [[Research-Questions]].
- Agent orchestration patterns (planner/retriever/verifier/teacher). → [[Cognitive-Architecture]].

## 🛠️ Build / infra tools to evaluate
- **Sarvam / AI4Bharat** (Indic ASR/TTS) · **Mathpix** (math OCR) · **Modal/RunPod** (serverless GPU) · **WhatsApp Business API** (Gupshup/AiSensy) · **Razorpay**.
- Second-brain workflow: **NotebookLM** (corpus Q&A + audio), **Obsidian + Claude Code** (this vault), **Perplexity** (live research).

## 📂 Already in your vault (`08_Research/`)
Propulsion / FEEP / quantum PDFs — *separate research track*; keep distinct from startup unless a method (e.g. finite-difference, stats) transfers.

## Connections
- Answers → [[Research-Questions]] · Terms → [[Glossary]] · Hub → [[Startup-MOC]]
