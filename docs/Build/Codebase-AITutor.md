---
tags: [type/note, domain/startup, startup/build, reference]
repo: https://github.com/avideo-guru/AITutor
stack: Angular 18 (standalone, signals)
updated: 2026-06-28
---
# 💻 Codebase — AITutor (frontend prototype)

> **Repo:** https://github.com/avideo-guru/AITutor · **Stack:** Angular 18 (standalone components, signals, `@if`/`@for`). · **State (2026-06-27):** initial commit — a **UI prototype**, not the product yet.

## 🔭 What it actually is right now (honest read)
A clean chat-UI shell with a **fake tutor**:
- `app.component.ts` — chat interface (signals: `chatMessages`, `tutorIsTyping`, `selectedSubject`) + a `StudyTask` to-do list. Good UX skeleton.
- `services/ai-tutor.service.ts` — **the "AI" is hardcoded**: keyword→canned-reply lookup across `math/science/history/coding`, plus `defaultReplies`, with `delay()` to *simulate* streaming. **No LLM, no API, no backend, no verifier.**

> This is a **mockup of the [[Cognitive-Architecture|Teaching/Delivery layer]] only** — the top of the stack. None of the moat exists in code yet: no [[Verification-Engine|verifier]], no [[Retrieval-Knowledge-Layer|retrieval]], no [[Student-Model|student model]], no [[Cognitive-Architecture|reasoning/router]]. That's expected on day 1 — just be clear-eyed that **the UI is the easy 10%; the [[Durable-Moat|moat]] is the other 90%** and it's all still to build.

## 🧩 Where it plugs into our architecture
```
[ AITutor repo = Experience/Delivery layer ]   ← you are here (UI shell)
        │  (the seam: AiTutorService)
        ▼
[ Tutor Orchestrator → Reasoning → VERIFIER → Retrieval → Student Model ]  ← all TODO (the real product)
        ▼
[ External services: LLM router, Sarvam voice, OCR, vector DB ]
```
**`AiTutorService` is the integration seam.** Today it returns fake strings; it should become a thin client that calls our FastAPI backend (`/solve` → structured solution → [[Verification-Engine|verified]] steps → render). Swap the hardcoded map for a real HTTP call and the [[Durable-Moat|Replaceability Principle]] is already respected: the UI won't care what's behind the seam.

## ⚠️ Alignment notes
- **Scope drift:** the scaffold covers `math/science/history/coding` generically. Our scope is **JEE/NEET Physics + Math** ([[Market-and-GTM]]). Narrow the demo to that.
- **Verified rendering:** the UI currently shows plain text. It needs to render **step-by-step solutions with per-step "✓ verified / ⚠ unsure" badges** — that visual *is* the trust pitch ([[Verification-Engine]]). Design the message component for structured steps, not just a string.
- **The toggle:** build the [[Fast-vs-Guided-Toggle]] as a first-class control next to the input, not a setting.
- **India rails:** eventual delivery is **WhatsApp + PWA** ([[Market-and-GTM]]); this Angular app is the PWA half.

## ▶️ Concrete next steps (frontend ↔ backend)
- [ ] Define the **API contract** between `AiTutorService` and the backend (request: problem text/LaTeX/photo; response: structured steps + verification status + confidence). This contract is the most important early artifact — it lets the frontend and the [[Verification-Engine|verifier]] team work in parallel.
- [ ] Replace the hardcoded service with a real HTTP client (keep a `mock` flag so the UI demos without the backend).
- [ ] Build a **StepCard** component (explanation + expr + verified badge) for [[Verification-Engine|verified solutions]].
- [ ] Wire the Phase-0 demo: type a JEE Physics problem → backend → verified steps on screen. → [[Roadmap]] Phase 0/1.

## 🔌 Working with this repo from the vault
It lives on GitHub (not inside the vault). To hack on it via Claude Code:
```bash
git clone https://github.com/avideo-guru/AITutor
cd AITutor && npm install && ng serve   # http://localhost:4200
```
Then run `claude` in that folder for code work. Keep **product/architecture decisions here in the vault**; keep **code in the repo** — this note is the bridge between them.

## Connections
- Implements (UI of) → [[Cognitive-Architecture]] (Teaching/Delivery layer)
- Must integrate → [[Verification-Engine]], [[Student-Model]], [[Fast-vs-Guided-Toggle]]
- Ships per → [[Roadmap]], [[Market-and-GTM]] · Hub → [[Startup-MOC]]
