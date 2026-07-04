---
tags: [type/note, domain/startup, startup/product]
updated: 2026-06-28
---
# 🎚️ Fast vs Guided Toggle

> A toggle next to the problem — **"just verify / show me"** vs **"walk me through it"** — like a search bar's web-search toggle. Not buried in settings. This resolves the [[Competitive-Landscape|Socratic paradox]] that killed engagement for forced-Socratic tutors.

## The market already proved this
- **Photomath** (220M+ downloads, the category leader) shows the full step-by-step **and** the answer immediately by default — the dominant pattern, *not* Khanmigo's forced Socratic questioning.
- **Astra AI** sells exactly this: instant Solver mode + separate step-by-step teaching mode, "fast when I need it, in-depth when I study."

So we're matching what's **already winning over Khanmigo**, not guessing.

## Where we beat Photomath (not just copy it)
Photomath's own reviews admit it's "not always accurate, especially with complex equations." Today's leader gives speed **without trust**. Our toggle gives the same speed, but **fast mode still runs through the [[Verification-Engine|verifier]] underneath** — so "fast mode" isn't "skip the checking," it's "skip the *hand-holding*, keep the guarantee."
> **The sayable line:** *"the only instant math tutor where instant doesn't mean unchecked."*

## Refinements (build these in)
- **Per-problem, not global** — a student may want "just show me" for a known topic and "walk me through" for a new one, same session.
- **Smart default from the [[Student-Model]]** — guided defaults on for weak topics, fast for mastered ones. **Default ≠ force** (the Khanmigo lesson).
- **Both modes feed the same diagnostic flywheel** — even fast-mode usage keeps generating step-error data.

## The anti-cognitive-offloading nudge (not a wall)
The [[Human-vs-AI-Tutor-Gap|Gap-4 problem]] is real: a toggle turns offloading from *forced* into a *choice*, and stressed students pick the easy button. Light safeguard, surfaced *later*, never preachy:
- **Trigger:** per topic, if >70% fast-mode over 1–2 weeks **and** a test/mock is near.
- **Action:** offer a short "quick check" — 2–3 no-help problems (reuses the FSRS spaced-repetition engine).
- **Tone:** opportunity, never guilt — *"want to make sure Thermodynamics sticks before the test?"*
- **Bonus (free B2B value):** "these 12 students are fast-moding through their weakest topics" is exactly what a coaching institute pays to see → [[Market-and-GTM]].

## Open / contested
- `#decision/open` Where do *we* sit on the speed↔think spectrum as a value, not just a toggle default? (Honest: we can't fully win both — [[Human-vs-AI-Tutor-Gap]].)

## Connections
- Built on → [[Verification-Engine]], [[Student-Model]] (defaults)
- Answers → [[Competitive-Landscape]] (Socratic paradox, Problem 2)
- Hub → [[Startup-MOC]] · Source → [[brainstorming with claude]]
