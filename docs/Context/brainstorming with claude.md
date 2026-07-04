---
tags: [type/note, domain/ai, domain/startup, status/active]
updated: 2026-07-03
---
> 🧠 Raw brainstorm log · Part of the [[Startup-MOC|Startup brain]] · ideas extracted into → [[Lecture-Companion-Overlay]] · [[Fast-vs-Guided-Toggle]] · [[Competitive-Landscape]]

Good — I read both your docs. Quick context check before we go further: those two files already did serious work (the JEE/NEET verified-tutor plan, plus a ranked shortlist where eval-infra and the math-tutor were your top picks). What you're describing now — Cluely + Sarvam as inspiration, wanting something that isn't Khanmigo/Squirrel-AI/Cluely — is a genuine pivot in direction, not a continuation of that doc. So let's ground it properly before you pitch it to your teammates.

**What Cluely actually is (the real story, not the hype)**

Cluely is a desktop app that watches your screen (via OCR) and listens to your mic/system audio, feeds that into an LLM, and shows answers in a floating overlay that's invisible during screen-share — built using low-level GPU rendering tricks so Zoom/Meet/Teams can't capture it. It launched in April 2025 as "Cheat on Everything," got $20.3M in funding (seed + a16z-led Series A), then by late 2025 quietly rebranded as a normal "AI meeting assistant" once the cheating angle got too much heat. Its founder later admitted the $7M ARR he'd claimed publicly was made up. [Techpresso + 2](https://dupple.com/tools/cluely)

Important for you: one detailed reviewer's take is that Cluely is "just another AI chat wrapper as many others," with its only real differentiation being that it stays active and proactive across a call rather than just summarizing afterward. a16z, naturally, sees it differently — they backed it as a new category of "proactive, multimodal AI assistants" for everyday work moments. Both things can be true: the _idea_ (AI helping you live, in the moment) is genuinely interesting; the _company_ is shaky (data breach of 83,000 users, billing complaints, a founder credibility problem). [Efficient + 2](https://efficient.app/apps/cluely)

**Here's the part that matters most for your decision:** "Cluely for India" already exists, and it's already free. There's an Indian competitor (Assisting AI) doing the exact same overlay trick with Hindi/Tamil/Telugu support, UPI pricing, ₹500/day. And there are multiple open-source Cluely clones on GitHub right now — free, run-locally, no subscription. If your pitch is "we'll rebuild the overlay trick for India," you'd be competing with software that already exists and costs ₹0. That's not a moat, that's a weekend project someone already shipped. [Assisting AI + 2](https://assisting-ai.com/blog/assisting-ai-vs-cluely.html)

**What Sarvam AI actually is**

Sarvam isn't really a product to "clone" — it's infrastructure. It's an Indian company building foundation models trained for Indian languages (Sarvam-30B, Sarvam-105B), under India's government-backed sovereign-AI mission. It just became India's newest AI unicorn — $234M raised, led by HCLTech, $1.5B valuation, announced just last week. They already sell multilingual voice agents into banks (Tata Capital), insurance companies, and government services. And critically — they're actively giving away free API credits + engineering support to early-stage startups building on top of their models. So the right way to relate to Sarvam isn't "compete with it," it's "build on it" — same way you planned to use Sarvam/AI4Bharat for voice in your original tutor doc. [Wikipedia + 3](https://en.wikipedia.org/wiki/Sarvam_AI)

**So what's the actual unique idea here?**

Strip away the hype from both companies and you get two real lessons, not two products to copy:

1. **Live, in-the-moment AI assistance is a genuinely sticky pattern** — people pay for AI that helps _during_ the moment, not just before/after it.
2. **Indian-language AI infra is now mature and cheap to build on** — you don't need to build voice/Indic models yourselves anymore.

The unique move is picking a real Indian work moment where live, multilingual AI help is needed _honestly_ — not hidden from anyone, not "cheating" — and owning that. And here's the nice part: your team already designed the hard piece for this in your tutor doc — the verifier. A live AI suggestion that's _wrong_ (bad compliance language to a customer, a wrong medicine name, a wrong loan term) is way more dangerous than a slow one. That's the same "never confidently wrong" math problem, just pointed at a new domain instead of JEE physics.

Three concrete directions that fit this, all genuinely different from Khanmigo/Squirrel-AI (education-only) and from Cluely (hidden/dishonest):

- **Live co-pilot for frontline sales/loan/insurance agents** in Tier-2/3 India — an overlay _the agent's own company gives them_, prompting compliant, accurate product language in Hindi/regional mix during a real call. Disclosed, sanctioned, not hidden from the customer. (Sarvam already sells automated voice agents to BFSI — you'd instead augment the human agent, which is a different, less automation-resistant sell.)
- **Live scribe + co-pilot for doctors/clinics** in regional languages — real-time structured notes and next-question prompts during a consult, verified against drug/dosage facts so it can't quietly hallucinate a wrong detail.
- **Live answer-assist for Indian call centers/BPOs** handling Hindi-English mixed calls — surfacing verified answers from the company's own knowledge base in real time, not from the open internet.

All three keep your team's actual edge (verification math) and avoid being "a wrapper with a nice UI," which is the exact trap your own second doc warned about.





## You said: Q: Which direction feels worth digging into first, so I can help you build the simple explainer for your teammates?

Q: Which direction feels worth digging into first, so I can help you build the simple explainer for your teammates? A: [No preference]

Jun 22





Thought for 30s

Thought for 30s



Claude's response was interrupted.

Try again





## You said: what i meant from inspiration is how they built their startup and now we can clone some of its features for our AI math tutot

what i meant from inspiration is how they built their startup and now we can clone some of its features for our AI math tutot maths is the starting point once the model and the novelty innovation technique and how we resolve the current short comming of the xisting ai tutors wheter gpt based no gpt based and then we expand we can use the cluely overlay as a feature for note taking or understand a video lecture soemthing like that and sarwan ai for the regional languages voices because this thing is the one thing can take us to the great heights right so analyse the plan of this ai tutor u get it

Jun 22





## Claude responded: Got it — that's a much sharper plan, and it actually clicks together nicely.

Validated live-overlay lecture companion as genuine market differentiation

Validated live-overlay lecture companion as genuine market differentiation

Got it — that's a much sharper plan, and it actually clicks together nicely. Let me play back how I now understand it, then give you my honest read:

**Core:** the verified math tutor from your original doc — JEE/NEET, step-by-step solutions checked by a real math engine (SymPy + dimensional checks etc.), so it's never confidently wrong. This stays the foundation, unchanged.

**Borrowed feature #1 — Cluely's overlay, repointed at lectures, not cheating:** instead of an invisible overlay that secretly answers interview questions, you build a visible "study companion" overlay that sits on top of any video the student is already watching — a YouTube lecture, a Physics Wallah/Unacademy recording, whatever. It listens + reads the screen in real time and gives live notes, flags doubts, lets the student ask a question without pausing or switching apps.

**Borrowed feature #2 — Sarvam's regional voice/language layer:** already in your original tech stack as AI4Bharat/Sarvam — now it's just the backbone for Hindi/regional explanations instead of an afterthought.

**Quick gap-check before I judge it:** I searched what's currently out there for JEE/NEET AI tools — ChatGPT-for-notes, photo-based doubt solvers (Photomath-style), upload-a-PDF-get-a-summary tools, adaptive-practice apps. What I did **not** find anywhere is something that sits live on top of a lecture _as it plays_ and reacts in real time. Every existing tool is "upload it, then process it" — not "watch with me, right now." So this specific combination is genuinely a gap, not something you'd be cloning into a crowded space.

**Here's the part that makes it click, not just stack:** if the overlay is just live notes, that's a nice-to-have feature anyone could copy. But because your core is a _math verifier_, the overlay can do something nobody else can: when the recorded teacher (PW, Unacademy, a YouTube channel) makes a step error or skips a step on screen — which happens, lectures are unscripted — your verifier catches it live and flags it to the student. That's not "Cluely for lectures." That's "our verifier, now applied to content we didn't even have to create." It turns your core moat into the overlay's reason to exist, instead of being two separate products bolted together.

**One important simplification — you don't need Cluely's hardest, riskiest piece.** Cluely's whole engineering nightmare (and most of its bad press: data breaches, "raw," laggy, an arms race with anti-cheat detectors) comes from making the overlay _invisible to others_ — because their use case is hiding from an interviewer. You have no one to hide from. A student watching their own lecture alone doesn't need GPU-level screen-share evasion. So you can skip that entire expensive, legally-grey engineering problem and just build a normal floating widget or browser extension. You get ~90% of the "wow" UX for a fraction of the engineering cost and zero of the ethical baggage.

**The one real risk — sequencing.** Live audio + live screen-OCR + live math-verification on _someone else's unscripted video_ is a harder problem than your original Phase 0 plan (verify a typed problem against a known answer). It's closer to your own doc's "v2/v3 — open problems, autoformalization is itself error-prone" tier, not "v1 — curated bank." If you try to build the lecture companion _first_, you'll blow your 2-week de-risking sprint on the hardest version of the problem. My honest recommendation: keep Phase 0 exactly as your doc already had it — prove the verifier on 100 curated problems first — then add the lecture-companion overlay as the headline feature of Phase 1–2, once the verifier core is proven. It becomes your distribution/virality engine (something free, useful, shareable in JEE/NEET Telegram groups) layered on top of a moat that already works, instead of an unproven feature carrying an unproven moat at the same time.

**Sarvam, concretely:** they have a startup program right now giving early-stage teams free API credits for ~6–12 months plus engineering support, specifically for speech/translation/LLM apps. Worth applying for this week regardless of where you are in the build.

**The plain-language version for your teammates**, if you want something to literally say out loud:

> "We're building a JEE/NEET tutor that's never confidently wrong — every step is checked by a real math engine, not just guessed by an AI, so when it says 'correct,' it actually is. On top of that, students can drop our companion onto _any_ lecture video they're already watching — PW, Unacademy, YouTube, whatever — and it gives live notes, answers doubts without pausing, and even catches it if the teacher in the video makes a mistake, because the same verifier is running underneath. And it talks back in Hindi or their regional language, not just English."

Want me to update the Phase 0–3 roadmap from your doc to actually slot the lecture-companion in at the right point, or draft a one-page version of this you can drop straight into your team WhatsApp?





## You said: also research aggresively the problem all the exisiting ais are facing like khanmigo and squirrel ai and other

also research aggresively the problem all the exisiting ais are facing like khanmigo and squirrel ai and other check the web for current ai and all that give me a good report

Jun 22





## Claude responded: Dug into this properly.

Synthesized AI tutor failures across platforms into actionable strategic insights

Synthesized AI tutor failures across platforms into actionable strategic insights

Dug into this properly. The patterns that show up are sharper — and more useful — than I expected, because they split exactly along the line you guessed (GPT-based vs non-GPT-based) plus one problem that hits _everyone_ regardless of tech. Here's the breakdown.

**Problem 1 — The trust/accuracy gap (mainly the GPT-based tutors)**

Khanmigo runs on GPT-4 and its own reviewers/users report it failing at basic arithmetic and misreading questions. One detailed hands-on review documented Khanmigo making a calculation error on a simple fraction problem and getting a physics numerical wrong, catching the mistake only by cross-checking against another model. Common Sense Media's own evaluation flagged that Khanmigo doesn't publish any transparency report on its math accuracy, so nobody — not parents, not schools — actually knows its real error rate. Same story in India: Physics Wallah's "Alakh AI" runs on GPT-4o via Azure, and Physics Wallah is partnering with Microsoft Research specifically _to try to push accuracy up to 95%+_ — which is itself an admission they're not there yet. This is precisely the gap your verifier is built to close, and it's not a minor footnote — it's the headline complaint across every GPT-based tutor I found. [SelectHub + 3](https://www.selecthub.com/p/chatbot-software/khanmigo/)

**Problem 2 — Nobody actually uses the chatbot (this is the big one, and it's brutal)**

This is the most important thing I found. In April 2026, Sal Khan himself told Chalkbeat that for most students, Khanmigo was simply "a non-event" — students who had access to it "just didn't use it much." Khan Academy had to redesign Khanmigo to auto-pop-up uninvited because students weren't seeking it out on their own. Their own efficacy studies showed strong results only after excluding 95% of the study population — critics call this the "5 Percent Problem." Stanford's CEPA found something similar holds across the category, not just Khanmigo: a roughly 60% engagement drop after three weeks of unfacilitated chatbot-tutor use. Quizlet's competing chatbot tutor, Q-Chat, was killed entirely. The structural reason being floated is what one piece calls the "Socratic paradox" — every responsible AI tutor is designed to ask guiding questions instead of giving answers, which is pedagogically correct, but kids who just want help feel like they're being interrogated and quietly stop opening the app. [AgentConn + 5](https://agentconn.com/blog/ai-tutoring-agents-post-khanmigo-mytutor-2026/)

**This is huge for you.** It's not a Khanmigo-specific failure, it's a category-wide failure of the "open a separate chatbot and ask it a question" model. Your overlay idea — meeting the student inside the lecture they're already watching, instead of asking them to remember to go open a doubt-bot — is a direct structural answer to the exact problem that just killed the market leader. That's worth knowing clearly, not just as a nice feature.

**Problem 3 — Squirrel AI: the non-GPT side of the story**

Squirrel AI isn't LLM-based — it's an older-style adaptive engine (neural nets, knowledge graphs, ~10,000+ "knowledge points" per subject) — so its failures are different in kind, not accuracy. By Wikipedia's own description, the system fully decides the learning sequence; the student doesn't direct it. Independent review flags real vendor lock-in and premium features gated behind cost tiers. It depends on physical learning centers and proprietary tablets to function at scale, not a pure software product — capital-heavy, hard to expand purely digitally. And there's a real tension between its "education equity" framing and reality: even the company's own promotional case study admits the model is much harder to bring to poorer regions because someone still has to pay for it. MIT Technology Review's deeper piece raised a broader worry: this style of ultra-granular, system-directed adaptive learning risks entrenching standardized test-taking over the kind of flexible thinking students need for an unpredictable job market. [Wikipedia + 3](https://en.wikipedia.org/wiki/Squirrel_AI)

**Problem 4 — the one that has nothing to do with which tutor you pick**

This is the one I'd take most seriously, because it's not a company failing — it's a finding repeating across multiple independent 2025–2026 studies, including one cited in the 2026 International AI Safety Report: heavy reliance on AI tools is consistently associated with measurably weaker independent critical-thinking performance, via a mechanism researchers call "cognitive offloading" — you stop exercising the reasoning muscle once the tool does it for you. One study of 666 participants found this effect was strongest in younger users. A separate study found that doctors who got used to AI assistance got measurably _worse_ at the task without it three months later. This is the genuinely hard, unsolved problem in the room — and it's a little uncomfortable for you, because it doesn't have a clean engineering fix. Khanmigo _tried_ to solve it (Socratic, hints-first, never just gives the answer) and that exact design choice is plausibly what made students stop using it. You'll have to consciously decide where your product sits on the "give the verified answer fast" vs. "make them think first" spectrum — and be honest with yourselves that you can't fully win both. [arxiv + 2](https://arxiv.org/pdf/2602.21012)

**One more live threat worth flagging:** Google just started offering free JEE/NEET practice tests built on Physics Wallah's own content. A platform with infinite distribution and zero marginal cost just entered the exact market you're aiming at, for free. This is the strongest argument yet for why your moat has to be something Google won't bother building for a niche market — a math-verified, never-wrong, lecture-aware companion in Hindi/regional language is exactly that kind of thing; a generic doubt-chatbot is not. [Practicemock](https://www.practicemock.com/blog/vishleshan-regulatory-exams-15th-april-2026/amp/)

**Net read for your plan:** your verifier directly answers Problem 1 (the one every competitor admits to). Your overlay-on-existing-lectures idea directly answers Problem 2 (the one that just killed the category leader's credibility). Squirrel AI's failures (rigid, capital-heavy, paywalled) are ones a lean software-only team naturally avoids by not building physical infrastructure. Problem 4 is the one real open question your team should discuss honestly as a design decision, not something to solve with more engineering.

Want me to fold this into the existing Phase 0–3 roadmap as a "competitive landscape" section, or keep it as reference material for your team discussion?





## You said: (Socratic, hints-first, never just gives the answer) and that exact design choice is plausibly what made students stop using it.

(Socratic, hints-first, never just gives the answer) and that exact design choice is plausibly what made students stop using it. You'll have to consciously decide where your product sits on the "give the verified answer fast" vs. "make them think first" spectrum — and be honest with yourselves that you can't fully win both

maybe plugin like guided learnig or something not plugin but the option tool like u the websearch and toggle type shit

Jun 22





## Claude responded: That's exactly the right instinct, and it turns out the market already proved it.

Validated toggle-mode idea against market precedent and refined implementation strategy

Validated toggle-mode idea against market precedent and refined implementation strategy

That's exactly the right instinct, and it turns out the market already proved it. A toggle like that — "guide me" vs "just verify/show me" — right next to the problem, not buried in settings, the same way a search bar has a web-search toggle next to it.

Quick grounding: Photomath, the most downloaded math app in the category (220M+ downloads), doesn't do Khanmigo's "ask you Socratic questions before revealing anything" approach at all — it shows the full step-by-step _and_ the answer immediately by default, and that's the dominant pattern in this market. There's already a competitor (Astra AI) explicitly selling this exact idea as its pitch — an instant Solver mode plus a separate step-by-step teaching mode, letting the student pick, marketed directly as "fast solutions when I need them and in-depth learning when I want to study." So you're not guessing — you're matching what's already winning over Khanmigo's forced-Socratic approach. [Helpfulinsightsolution](https://www.helpfulinsightsolution.com/blog/edtech-app-like-photomath)[Astra AI](https://astra-ai.co/blog/photomath-alternative)

**Where your version would actually beat Photomath, not just copy it:** Photomath's own reviews admit it isn't always accurate — "it can sometimes make mistakes, especially with complex equations". So today's market leader gives you speed _without_ trust. Your toggle would give the same speed, but the fast mode is still running through your verifier underneath — so "fast mode" isn't "skip the checking," it's "skip the _hand-holding_, keep the guarantee." That's a real, sayable difference: "the only instant math tutor where instant doesn't mean unchecked." [Legit.ng](https://www.legit.ng/ask-legit/guides/1677303-these-apps-photomath-studying-easier/)

A few refinements worth building in, not just the toggle itself:

- Make it per-problem, not a global setting — a student might want "just show me" for a topic they already know and "walk me through it" for something brand-new, sometimes in the same session.
- Let your mastery model (the BKT/IRT tracker from your original plan) set a smart _default_ per topic — guided mode defaults on for a topic they're weak in, fast mode defaults on for one they've already mastered — but the student can always flip it. Default ≠ force, which is exactly the lesson from Khanmigo.
- Log both modes into the same diagnostic flywheel either way, so even "fast mode" usage keeps feeding your error-pattern data.

One honest caveat, since we're being straight with each other: a toggle doesn't make the cognitive-offloading risk disappear — it just turns it from forced into a choice, and people under deadline pressure will often pick the easy button (that's literally what one Photomath user admitted in the reviews: used it to finish homework fast, then couldn't reproduce it on the test). That's fine — usage-with-some-risk beats Khanmigo's zero-usage-with-perfect-pedagogy any day — but if you want a light safeguard without being preachy, you could surface it back later rather than gate it up front: something like "you used fast mode on 80% of Thermodynamics this week — want a quick check before the test?" Nudge, not a wall.





## You said: yes we can add the reminder things and stuff

yes we can add the reminder things and stuff

Jun 22





## Claude responded: Good — here's how I'd make it concrete so it's buildable, not just a vibe:

Synthesized feature design and mapped consolidation opportunity

Synthesized feature design and mapped consolidation opportunity

Good — here's how I'd make it concrete so it's buildable, not just a vibe:

**Trigger:** per topic, not global. If a student's been in "fast mode" for, say, 70%+ of a topic over the past week or two, and it's a topic with a test/mock coming up — that's when it fires. Not session-by-session (that gets naggy fast, same mistake Khanmigo made by popping up uninvited).

**What it actually does:** instead of a guilt-trip notification, it offers a short "quick check" — 2-3 problems from that topic, redone with no help. This reuses the spaced-repetition engine you already planned (FSRS), so it's not a new system, just a new trigger condition on something you were building anyway.

**Tone:** opportunity framing, never judgmental — "want to make sure Thermodynamics sticks before the test?" not "you've been relying on AI too much."

**Bonus, since it's basically free once built:** the same signal (which students are fast-moding through their weak spots) is exactly what a coaching institute would pay to see on their B2B dashboard — "these 12 students are skipping the thinking step on the topics they're weakest in." That's the same per-seat institute product from your original plan, just with a sharper, more sellable insight than generic usage stats.

We've now built up a pretty complete, coherent picture across this conversation — the verifier core, the lecture-companion overlay, vernacular voice, the fast/guided toggle, and this nudge system, plus the competitive research backing each choice. Want me to pull all of this into one clean document now — the actual "explain it to your teammates" piece you asked for at the start — so you have something concrete to show the other two, instead of it living across this whole chat?





## You said: what about tutor eva

what about tutor eva

Jun 22





## Claude responded: Found it — TutorEva is real, but it's a different animal than what you're building.

Analyzed existing competitor product, contrasted tech approach and ethics

Analyzed existing competitor product, contrasted tech approach and ethics

Found it — TutorEva is real, but it's a different animal than what you're building.

It's a US-focused "snap and solve" homework helper (not India, not JEE/NEET) built on top of ChatGPT, with a friendly anime-style avatar named Eva as the face of the brand. It covers math plus other college subjects, essay writing, and course materials. The interesting part: when the AI can't solve something, it doesn't try harder math-wise — it routes the question to a gig-economy network of human tutors ("EvaSolvers") who answer within half an hour. So their fallback for "AI got it wrong" is paying a human, not verifying the math. That's a real structural difference from your plan — it doesn't scale cheaply at Indian price points, and it caps out at "as good as whichever human picked up the ticket," not "guaranteed correct." It's the same chasing-95%-accuracy story as everyone else, just with people instead of a math engine plugging the gap. [Deeper Insights + 2](https://deeperinsights.com/news/never-heard-of-indus-or-sarvam-ai/)

One thing worth a flag, since you care about not building anything cheating-adjacent: their Essay Writer tool explicitly advertises features to reduce AI-detection, which is a step into "helping students hide that they cheated" territory — good to know what _not_ to copy. [Global South Opportunities](https://www.globalsouthopportunities.com/2026/03/06/sarvam/)

What's genuinely working for them, separate from the tech: the named, friendly persona is driving real organic virality — there's a whole #mathtok / #tutoreva trend on TikTok with students posting about "Eva" like a study buddy, not a tool. That's worth borrowing as a branding lesson, independent of anything technical — your verifier-tutor having a name and a bit of personality (not necessarily anime, fits your audience differently) could matter more for word-of-mouth among JEE/NEET aspirants than any feature on this list. Worth a 10-minute team conversation: what's this thing's name and "voice" going to be, separate from what it does. [BharatGen](https://bharatgen.com/from-llms-to-verticalisation-india-sovereign-ai-stack-takes-shape/)





  



Sonnet 4.6 High





