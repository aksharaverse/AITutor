---
tags: [type/note, domain/startup, startup/competition]
updated: 2026-06-28
---
# ⚔️ Competitive Landscape — the 4 failures we exploit

> Research split exactly along the line we guessed (GPT-based vs non-GPT-based) **plus one problem that hits everyone.** Each of our pillars answers one failure.

## Problem 1 — Trust / accuracy gap (the GPT-based tutors)
- **Khanmigo** (GPT-4): own reviewers report basic arithmetic + physics-numerical errors; **no published math-accuracy transparency report**.
- **Physics Wallah "Alakh AI"** (GPT-4o/Azure): partnering with Microsoft Research *to try to reach 95%+ accuracy* — an admission they're not there.
→ **Our answer:** the [[Verification-Engine]]. This is the headline complaint across *every* GPT-based tutor.

## Problem 2 — Nobody actually uses the chatbot (the big one)
- **April 2026: Sal Khan** called Khanmigo "a non-event" for most students; they had to make it **auto-pop-up** because students wouldn't seek it out.
- Efficacy shown only after **excluding 95%** of the study population (the "5 Percent Problem").
- **Stanford CEPA:** ~60% engagement drop after 3 weeks of unfacilitated use. **Quizlet's Q-Chat: killed.**
- Root cause — the **"Socratic paradox"**: responsible tutors ask guiding questions; stressed kids feel interrogated and quit.
→ **Our answer:** [[Lecture-Companion-Overlay]] (meet them in the lecture) + [[Fast-vs-Guided-Toggle]] (don't force Socratic).

## Problem 3 — Squirrel AI (the non-GPT side)
Older adaptive engine (neural nets + knowledge graph, ~10k knowledge points). Failures are *structural*, not accuracy: system **fully directs** learning (student has no agency); **vendor lock-in**; depends on **physical centers + proprietary tablets** (capital-heavy, hard to scale digitally); equity claims vs. reality (someone must pay).
→ **Our answer:** lean, software-only; student keeps agency; no hardware.

## Problem 4 — Cognitive offloading (hits everyone, no clean fix)
Multiple 2025–26 studies (incl. the 2026 International AI Safety Report): heavy AI reliance → measurably **weaker independent reasoning**; strongest in younger users. Khanmigo *tried* to fix this (forced Socratic) — and that's plausibly what killed usage.
→ **Our answer:** the [[Fast-vs-Guided-Toggle]] nudge — a *choice* + gentle later check, not a wall. Honest: we can't fully win both ([[Human-vs-AI-Tutor-Gap]]).

## Other players (quick reads)
- **Photomath** — 220M+ downloads; fast answers by default but "not always accurate." We match speed, add the [[Verification-Engine|guarantee]]. → [[Fast-vs-Guided-Toggle]]
- **TutorEva** — US "snap & solve" on ChatGPT + an **anime persona "Eva"** driving #mathtok virality; fallback for wrong answers = **route to human gig tutors** (doesn't scale at Indian price). Lesson to borrow: **give our tutor a name + personality** (worth a 10-min team call).
- **Cluely** — overlay done for *cheating*; shaky company (fabricated ARR, 83k-user breach). We borrow the **overlay UX**, drop the invisibility/ethics. → [[Lecture-Companion-Overlay]]
- **Sarvam AI** — *not* a competitor, it's **infra**: Indian-language foundation models, now a unicorn, **gives startups free credits**. We **build on it** for vernacular voice.

## ⚠️ The live incumbent threat
**Google now offers free JEE/NEET practice tests built on PW content** — infinite distribution, zero marginal cost, in *our* market, for free. Strongest argument for why our moat must be something Google won't build for a niche: a **verified, never-wrong, lecture-aware, vernacular** companion — *not* a generic doubt-chatbot. See [[Durable-Moat]].

## Connections
- Each problem → answered in [[Verification-Engine]], [[Lecture-Companion-Overlay]], [[Fast-vs-Guided-Toggle]]
- Feeds → [[Market-and-GTM]], [[Durable-Moat]]
- Hub → [[Startup-MOC]] · Source → [[brainstorming with claude]]
