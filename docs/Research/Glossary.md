---
tags: [type/note, domain/startup, startup/research]
updated: 2026-06-28
---
# 🔤 Glossary

> Plain-language definitions so all 4 teammates share vocabulary. Link these terms from anywhere.

### Verified reasoning
AI that **checks its own steps with a deterministic method before showing them.** Our platform thesis → [[Verified-Reasoning-Engine]].

### Autoformalization
Turning a natural-language math step into a **machine-checkable formal expression.** Hard and error-prone → our #1 technical risk. Why we **stage** the [[Verification-Engine]] (curated bank first).

### Schwartz–Zippel lemma
A non-zero polynomial is non-zero at *almost every* point. So if you plug **random values** into two expressions and they disagree, a step is wrong — with near-zero false-pass. The math under **step-transition checking** in [[Verification-Engine]].

### RLVR (Reinforcement Learning with Verifiable Rewards)
Train a model using a **checkable correct/incorrect signal** (not human preference). Our verifier *is* that reward function → fine-tune a cheap niche model. → [[Durable-Moat]], [[Reading-List]].

### GRPO
Group Relative Policy Optimization — the RL algorithm behind DeepSeek-R1-style reasoning training. Pairs with RLVR.

### BKT / IRT
**Bayesian Knowledge Tracing / Item Response Theory** — psychometric models that estimate a student's true **per-skill mastery** from their answers. The math of the [[Student-Model]].

### FSRS
Free Spaced Repetition Scheduler — decides *when* to re-show material for retention. Powers the [[Fast-vs-Guided-Toggle]] nudge.

### Abstention
The tutor **declining to answer** when confidence is low, instead of guessing. Trust-builder; precision-over-recall in [[Verification-Engine]].

### Cognitive offloading
Outsourcing thinking to a tool until your own reasoning **weakens**. The unsolved risk → [[Human-vs-AI-Tutor-Gap]] Gap 4.

### B2B2C
Sell to a **business (coaching institute)** that delivers to **consumers (students)**. Our distribution → [[Market-and-GTM]].

### Model router
Send each task to the **cheapest model that's good enough**; escalate only the hard ones. Cost arbitrage in [[Cognitive-Architecture]].

### Thin wrapper
A product that is just **prompt + UI** over an API — no moat, copied in weeks. What we refuse to be → [[Durable-Moat]].

## Connections
- Hub → [[Startup-MOC]] · used across all architecture notes
