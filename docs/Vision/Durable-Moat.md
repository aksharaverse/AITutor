---
tags: [type/note, domain/startup, startup/vision, startup/moat]
updated: 2026-06-28
---
# 🛡️ The Durable Moat — surviving an AI that changes every 3 months

> **Our deepest fear, named:** you spend a year building an "Intent Engine," then a new frontier model does it for free. **The companies that last own the *system design*, not the models.**

## The Replaceability Principle
Every model/provider is a **swappable module** behind a stable interface. Don't write `answer = GPT5(question)`. Write `reasoner.solve(question)`.
```
reasoner → GPT-5   (today)
reasoner → open model (tomorrow)
reasoner → whatever ships next (next year)
```
The application doesn't care. Better OCR? Swap OCR. Better voice? Swap to Sarvam-3. **No rewrite.** This is how Cursor and Perplexity survive model churn. Architecture detail → [[Cognitive-Architecture]].

> **One sentence for every meeting:** *"We don't want to own models — we want to own the intelligence architecture."*

## What we will NOT optimize for
Chasing every shiny model → rewrite → another model → rewrite → six months, zero user value. Instead: **stable architecture**, and a [[Research-Questions|rigorous eval]] that decides whether a new model actually improves *our metrics* before we swap it in.

## The 4 real moats (2026) — and ours
~80% of "AI startups" are thin wrappers that will disappear. Real moats:
| Moat | Meaning | Ours |
|---|---|---|
| **Proprietary data flywheel** | data nobody else collects | Indian-exam **step-error dataset** (from [[Student-Model]] diagnosis) |
| **Workflow ownership** | you're the system of record | the student's whole [[Lecture-Companion-Overlay\|learning environment]] |
| **Domain-specific logic** | correctness an LLM can't match | the [[Verification-Engine]] (CAS + Schwartz–Zippel + stoichiometry) |
| **Deep integrations** | wired into their tools | WhatsApp Business API, coaching-institute banks ([[Market-and-GTM]]) |

## Why being first-years is an *advantage* here
We can't out-train OpenAI. We don't have to. The history of computing rewards **assembling existing components into a system that solves the real problem** — not a single better algorithm. If we get exceptionally good at: modeling how students learn, orchestrating specialized components, verifying correctness, and adapting over time → we've built something **much harder to copy than another chatbot**.

## The compounding asset: RLVR (12-month north star)
Our verifier is a **verifiable reward function** — exactly what frontier math models train on (RLVR / GRPO). Once we have volume, fine-tune a small open model (Qwen-Math-class) on Indian-exam problems *using our verifier as the reward* → a specialized model **cheaper and better than GPT for this niche**. The moat literally trains a better model over time. See [[Reading-List]] (RLVR papers) and [[Verification-Engine]] §RLVR.

## Connections
- Implemented by → [[Cognitive-Architecture]], [[Verification-Engine]]
- Feeds → [[Market-and-GTM]] (defensibility vs incumbents)
- Hub → [[Startup-MOC]] · Sources → [[AI-Startup-Ideas-US-Europe-to-India]], [[A serious question]]
