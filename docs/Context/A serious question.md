---
tags: [type/note, domain/ai, domain/startup, status/active]
updated: 2026-07-03
---
> 🧠 Part of the [[Startup-MOC|Startup brain]] · synthesized into → [[Durable-Moat]] · [[Verified-Reasoning-Engine]]

This is exactly the question founders should ask themselves.

Not

> "Why hasn't anyone built this?"

But

> **"If this idea is so obvious, why hasn't it won?"**

Those are very different questions.

And the answer is usually **not** "because nobody thought of it."

It's usually one of these.

---

# Reason 1 — They HAVE thought about it.

Almost every major AI lab has papers on these ideas.

OpenAI has memory.

Anthropic has constitutional AI and learning research.

Google has tutoring research.

Microsoft has agent frameworks.

Meta has world models.

Academic labs have student modeling, knowledge tracing, curriculum learning, educational data mining...

None of these ideas are new individually.

The innovation is often **how you combine them**.

Think about the smartphone.

Apple didn't invent:

- touchscreen
    
- lithium batteries
    
- ARM chips
    
- mobile internet
    
- MP3 players
    
- capacitive displays
    

They combined mature technologies into one experience.

---

# Reason 2 — Research ≠ Product

This is probably the biggest one.

Researchers publish papers like

> Better knowledge tracing.

Cool.

Someone else publishes

> Better retrieval.

Someone else

> Better planning.

Someone else

> Better multimodal perception.

Nobody integrates all of them into one production system.

Research incentives reward **novelty**.

Startups reward **integration**.

---

# Reason 3 — It's much harder than the diagram suggests

Look at this:

```text
Observe

↓

Infer intent

↓

Retrieve

↓

Reason

↓

Verify

↓

Teach

```

Looks simple.

Reality:

Suppose a student uploads

- blurry notebook photo
    
- asks in Hinglish
    
- wrong units
    
- missing page
    
- asks about previous lecture
    
- wants exam shortcut
    
- has weak calculus
    

Now your system has to

- OCR correctly
    
- identify the chapter
    
- infer hidden intent
    
- retrieve correct material
    
- remember last week's mistakes
    
- verify the derivation
    
- adapt difficulty
    
- speak naturally
    
- stay under 5 seconds
    

Every module has failure modes.

---

# Reason 4 — Engineering complexity explodes

A chatbot looks like this.

```text
User

↓

LLM

↓

Answer
```

Your architecture becomes

```text
Perception

↓

Planner

↓

Memory

↓

Retriever

↓

Knowledge Graph

↓

Vector Search

↓

Verifier

↓

Python

↓

Teaching Engine

↓

Reflection

↓

Evaluation

↓

Student Model

↓

Answer
```

That's no longer a chatbot.

That's an operating system.

Each arrow introduces latency, bugs, and maintenance.

---

# Reason 5 — Data

This one is huge.

Let's say you invent the world's greatest Student Model.

How do you train it?

You need

- thousands of students
    
- months of interactions
    
- quizzes
    
- corrections
    
- engagement
    
- outcomes
    
- exam scores
    
- misconceptions
    

Google can collect that.

A first-year startup cannot.

So you often have to **bootstrap** with heuristics and gradually replace them with learned systems.

---

# Reason 6 — Economics

This one surprises many engineers.

Imagine your perfect architecture.

Each question triggers

- Vision model
    
- OCR
    
- Embedding
    
- Vector DB
    
- Knowledge graph
    
- Planner
    
- GPT-5 reasoning
    
- Python
    
- Symbolic verifier
    
- Reflection
    
- Second verifier
    

Amazing.

Also...

It costs ₹15 per question.

Your competitor costs ₹0.20.

Parents won't pay ₹5000/month.

So architecture has to respect economics.

---

# Reason 7 — Most users don't care about architecture

This hurts.

You spend

18 months

building

```text
Dynamic Knowledge Graph

Hybrid Retrieval

Self Reflection

Multi-agent Planning

```

Student sees

> "It answered my question."

They don't know why it was better.

Your technical moat still matters—but only if it produces a noticeably better experience.

---

# Reason 8 — AI is changing every three months

Suppose you spend a year building

```text
Intent Engine
```

Three months later

a new frontier model becomes dramatically better at intent inference.

Now your custom module may no longer be worth maintaining.

This is why many startups avoid over-engineering pieces that are improving rapidly at the model level.

---

# Here's the part where I think you're thinking correctly

Notice your list again.

|Ability|Likelihood frontier models solve it alone|
|---|---|
|OCR|High|
|Speech|High|
|Translation|High|
|Retrieval ranking|Medium–High|
|Symbolic verification|Low|
|Student modeling|Low|
|Curriculum planning|Medium|
|Learning analytics|Low|
|Knowledge tracing|Low|
|Pedagogical adaptation|Low|

This is where I'd focus.

Don't compete with the frontier models on things they're likely to absorb.

Build around the pieces that remain domain-specific.

---

# There's another danger I want you to avoid

Many first-time founders think

> "Nobody has built it, therefore billion-dollar idea."

Reality is usually

```text
Nobody built it

↓

Was it impossible?

↓

Was it too expensive?

↓

Did nobody want it?

↓

Were users confused?

↓

Could AI not do it yet?

↓

Or is it actually a good opportunity now?
```

Those are very different answers.

---

# Here's the question I'd ask for every idea

Suppose you propose

> "Intent Engine"

Ask

**Why doesn't ChatGPT already have this?**

Possible answers:

- It doesn't generalize well across domains.
    
- It requires long-term student data.
    
- It's too expensive for general chat.
    
- It only matters in education.
    
- It needs institutional integrations.
    
- It hasn't been productized.
    

If you can answer **why**, then you understand whether it's a genuine opportunity or just wishful thinking.

---

# The opportunity I see

I don't think your startup wins because of **one revolutionary invention**.

I think it wins—if it does—because of **excellent systems engineering**.

Imagine it's 2030.

People ask,

> "How is their tutor so much better?"

The answer probably won't be:

> "They invented a new transformer."

It'll be something like:

> "They built the best educational reasoning system. Every part—student modeling, retrieval, verification, personalization, and teaching—works together."

That's much more plausible for a startup.

---

## One final caution

As you're brainstorming, keep a running table with three columns:

|Idea|Is this already solved by frontier models?|Is this a durable moat?|
|---|---|---|
|Better OCR|Probably yes|❌|
|Better speech recognition|Probably yes|❌|
|Better symbolic verification|Probably no|✅|
|Student misconception graph|Probably no|✅|
|Personalized curriculum engine|Partially|✅|
|Educational evaluation framework|Probably no|✅|

This exercise will keep your team focused on building things that are still likely to matter even as the underlying AI models continue to improve. That's where the most durable opportunities tend to be.

I actually like the direction you're thinking now. You're no longer asking "What model should we use?" You're asking a much more important engineering question:

> **"How do we build a company that survives when AI changes every 3 months?"**

That is exactly how companies like Cursor, Perplexity, and others have had to think.

Let's go point by point.

---

# 1. Can we use Sarvam AI?

Absolutely.

And this is a mindset I want your whole team to adopt.

Don't ask

> Should we build speech recognition?

Ask

> **Is speech recognition our competitive advantage?**

If the answer is **no**, buy or integrate it.

For example

|Capability|Build?|Why|
|---|---|---|
|OCR|❌|Already excellent services exist|
|Speech Recognition|❌|Sarvam, AI4Bharat, Whisper, etc.|
|Translation|❌|Existing models are very good|
|Voice Synthesis|❌|Existing providers are strong|
|Authentication|❌|Commodity|
|Cloud Storage|❌|Commodity|
|Payments|❌|Commodity|
|**Verification**|✅|Your moat|
|**Student Model**|✅|Your moat|
|**Learning Analytics**|✅|Your moat|
|**Pedagogical Engine**|✅|Your moat|

The rule is simple:

> **Build only what makes your company unique.**

Everything else is infrastructure.

---

# 2. Perplexity's research graph

You're referring to ideas like multi-step retrieval, graph-based exploration, and iterative research workflows.

Those ideas are useful.

Instead of

```
Question

↓

Top 5 chunks

↓

Answer
```

Imagine

```
Question

↓

Research Planner

↓

Concept Graph

↓

Definitions

↓

Formulae

↓

Examples

↓

Past Student Mistakes

↓

Answer
```

That's a richer retrieval pipeline.

But here's the important part:

**Don't copy Perplexity.**

Copy the principle.

Perplexity is solving

> Research

You're solving

> Learning

Those are different optimization problems.

---

# 3. "We have to deal with bugs"

Exactly.

Every serious software company does.

That's why companies build

- logging
    
- evaluation
    
- regression tests
    
- monitoring
    
- A/B testing
    

Ironically, your verifier becomes useful here too.

You can verify not only math solutions but also whether a new model or pipeline introduced regressions.

---

# 4. "What if we sell to AI labs?"

Interesting question.

Let's separate two possibilities.

### Path A — Build an education company

```
Verified Tutor

↓

Schools

↓

Coaching

↓

Students
```

### Path B — Build technology that education uses

```
Verification Engine

↓

Evaluation Platform

↓

Reasoning Infrastructure

↓

AI Labs

↓

Enterprise
```

Notice something?

The second path has a much broader market.

Your original documents actually hinted at this evolution: start with education, but the verification technology itself becomes valuable beyond education.

---

# 5. "Should we keep ourselves versatile?"

This is the most important strategic question.

My answer is

## Yes.

But **not** by constantly changing products.

Instead,

build a modular architecture.

Think LEGO.

```
Speech Module

Vision Module

Memory Module

Retriever

Planner

Verifier

Teacher

Analytics
```

Tomorrow

A better speech model comes out.

Replace only

```
Speech Module
```

Everything else continues working.

---

A better reasoning model?

Replace

```
Reasoner
```

Everything else stays.

---

Better OCR?

Replace OCR.

Done.

---

This is exactly how mature systems evolve.

---

# Think in terms of interfaces.

Instead of

```python
answer = GPT5(question)
```

Think

```python
reasoner.solve(question)
```

Today

```
reasoner

↓

GPT-5
```

Tomorrow

```
reasoner

↓

Open-source model
```

Next year

```
reasoner

↓

Reasoning agent
```

Your application doesn't care.

That's how Cursor, Perplexity, and many modern AI products survive rapid model evolution.

---

# I call this the "Replaceability Principle"

Every module should be replaceable.

```
Current OCR

↓

Replace

↓

New OCR
```

No rewrite.

---

```
Current Voice

↓

Replace

↓

Sarvam 3
```

No rewrite.

---

```
Current LLM

↓

Replace

↓

Whatever OpenAI or another lab releases
```

No rewrite.

---

# One thing I **wouldn't** optimize for

Don't chase every shiny model.

A lot of startups fall into this cycle:

```
New model released

↓

Rewrite everything

↓

Another model released

↓

Rewrite again
```

Six months later, they've shipped almost no user value.

Instead, have a stable architecture and evaluate whether a new model actually improves your metrics—accuracy, latency, cost, or learning outcomes—before swapping it in.

---

# Here's the architecture I'd want your team to build

```
                Student
                    │
                    ▼
          Experience Layer
   (UI, Voice, Overlay, Whiteboard)
                    │
                    ▼
        Tutor Orchestrator
                    │
    ┌──────┬────────┼─────────┬─────────┐
    ▼      ▼        ▼         ▼         ▼
 Memory  Retriever Reasoner Verifier Analytics
    │       │        │         │         │
    └───────┴────────┴─────────┴─────────┘
                    │
                    ▼
         External Services Layer
 (LLMs, Sarvam, OCR, Search, Storage,
  Cloud, Vector DB, Knowledge Graph)
```

Everything below the orchestrator is replaceable.

Everything above it is your product.

Everything in the middle is your moat.

---

## If I were advising your founding team from day one, I'd give you one sentence to repeat in every design meeting:

> **We don't want to own models—we want to own the intelligence architecture.**

Models will change.

Speech providers will change.

Cloud providers will change.

The companies that last usually own the **system design**, the **user experience**, the **data flywheel**, and the **domain expertise** that sit above those interchangeable components.

That's a strategy that gives you flexibility without forcing you to reinvent your product every time the AI landscape shifts.

I actually think you're at the point where many founders make a critical mistake.

You said:

> **"We need to over engineer things."**

I'd change one word.

> **We need to deeply understand things.**

Those are not the same.

---

## Elon didn't start SpaceX by building rockets.

He first read hundreds of books on

- propulsion
    
- materials
    
- manufacturing
    
- orbital mechanics
    

The first product wasn't a rocket.

The first product was **understanding**.

You guys are first-year students.

That is **not** your disadvantage.

Your disadvantage is not experience.

Your disadvantage is **mental models**.

And those can absolutely be built.

---

# I think your startup has three research tracks.

Not coding.

Research.

```
Track A

How humans learn.

----------------

Track B

How LLMs reason.

----------------

Track C

How tutoring businesses work.
```

Notice coding isn't even on here.

Because if you understand these three, the architecture almost designs itself.

---

# Let's answer your question.

> What makes 1Blue3Brown, Khan Sir, PW, Allen teachers so good?

This is a fantastic question.

And I don't think the answer is

> "They explain simply."

That's true...

but it's only about 10% of the story.

Let's dissect them like scientists.

---

# Great teachers are compression algorithms.

Imagine a textbook.

```
400 pages

↓

Teacher

↓

20 minute explanation
```

How?

They don't repeat information.

They compress it.

Compression requires understanding.

---

# They teach intuition before mathematics.

Example.

Imagine explaining derivatives.

Poor explanation

> The derivative is

dy/dx

Great.

Student remembers nothing.

---

1Blue3Brown's style is closer to

> Imagine driving a car.

Speed changes.

Acceleration changes.

Slope changes.

The derivative is measuring that change.

Only THEN

```
dy/dx
```

appears.

See the difference?

Mathematics comes **after intuition**.

---

# They use layered teaching.

Human teachers rarely dump everything.

Instead

```
Picture

↓

Analogy

↓

Animation

↓

Simple example

↓

Generalization

↓

Mathematics

↓

Applications

↓

Exam trick
```

Most AI tutors do

```
Definition

↓

Formula

↓

Example
```

---

# They predict confusion.

This is probably the biggest superpower.

Imagine a teacher saying

> Now many students think...

before anyone asks.

That's magic.

Except...

it isn't.

It's experience.

They've seen

50,000 students.

They know

> here's where people fail.

Your AI can eventually learn this too—but only if you collect and analyze student mistakes over time.

---

# They tell stories.

Think about Khan Sir.

Half of physics becomes

```
Auto rickshaw

↓

Cricket

↓

Train

↓

Village

↓

Bucket

↓

Fan

```

Those aren't random.

They're cognitive anchors.

Humans remember stories.

---

# They build emotion.

Students don't remember

```
F = ma
```

They remember

> The apple falling.

or

> Newton getting hit.

The story may be simplified, but it creates a memorable hook.

---

# They adapt.

Imagine explaining inertia.

Student A

Loves football.

Teacher uses football.

Student B

Loves cricket.

Teacher changes.

Student C

Likes Formula 1.

Teacher changes again.

LLMs could do this, but only if they know the student.

---

# They know when to stop talking.

This one is huge.

AI tends to produce

```
800 words
```

Human teacher

```
One sentence.

Pause.

Question.

Continue.
```

Teaching isn't information transfer.

It's interaction.

---

# They ask questions.

Not because they're Socratic.

Because they're checking the student's mental model.

Imagine

Teacher

> Which direction do you think this force acts?

Student

> Left.

Teacher instantly knows

> Ah.

You misunderstood vectors.

That's diagnosis.

Not questioning.

---

# This changes your startup completely.

Instead of asking

> How do we build a tutor?

Ask

> **How do we build a teacher?**

Those are different.

---

# I think your architecture is missing something.

Not another LLM.

A

## Teaching Engine

Imagine

```
Reasoning Engine

↓

Correct Answer

↓

Teaching Engine

↓

Explanation
```

The Teaching Engine decides

- analogy
    
- animation
    
- difficulty
    
- examples
    
- pace
    
- questions
    
- humor
    
- diagrams
    
- storytelling
    

This is **not** the same as reasoning.

---

# Now let's talk about training.

You said

> We need to train on good content.

Absolutely.

But here's something many beginners misunderstand.

Training is not the first step.

Think of educational knowledge as three layers.

---

## Layer 1

External knowledge

```
NCERT

HC Verma

MIT OCW

1Blue3Brown

Physics lectures

Research papers

```

You don't own this.

---

## Layer 2

Retrieved knowledge

```
Question

↓

Retrieve

↓

Relevant pieces
```

This is RAG.

---

## Layer 3

Internal knowledge

Eventually

your own model begins to know

```
JEE

NEET

Misconceptions

Teaching styles

Student errors

```

without retrieval.

This comes much later.

---

# Here's a roadmap I think is realistic.

### Year 1

No training.

Use APIs.

Learn.

Prototype.

Build evaluation.

Collect data.

---

### Year 2

Fine-tune small open models.

Maybe a 7B model.

Teach it your style.

---

### Year 3

Distill.

Compress.

Train specialized components.

---

### Year 5+

Maybe train a larger educational model if you have enough proprietary data and a clear reason to do it.

---

# The thing I want you to obsess over isn't training.

It's something much more valuable.

## Educational DNA.

Imagine asking

> What is momentum?

GPT

gives an answer.

Your tutor asks itself

```
Student Level?

↓

Weak in vectors?

↓

Visual learner?

↓

JEE?

↓

Needs intuition?

↓

Needs exam trick?

↓

Needs analogy?

↓

Likes football?

```

Then

it writes the explanation.

That's not just a language model.

That's a **pedagogical system**.

---

# If I were your CTO, I'd make everyone on the team read four completely different subjects—not just AI.

1. **Learning science**
    
    - How humans remember.
        
    - Cognitive load.
        
    - Spaced repetition.
        
    - Knowledge tracing.
        
2. **Great teachers**
    
    - Watch 100 hours of 1Blue3Brown, Khan Sir, PW, and other outstanding educators.
        
    - Don't watch to learn calculus—watch to reverse engineer _why_ students stay engaged.
        
    - Pause every few minutes and ask: _What teaching technique just happened?_
        
3. **Modern AI systems**
    
    - Agents
        
    - Retrieval
        
    - Fine-tuning
        
    - Evaluation
        
    - Multimodal models
        
4. **Product design**
    
    - Why students open an app.
        
    - Why they stop using it.
        
    - How habits are formed.
        

Notice something?

Only one of those four is "AI."

The other three are equally important if you're building an AI tutor.

---

## One last thought

You said:

> "Who cares... training your own LLM isn't kid's play."

That's true.

But remember this:

**OpenAI has thousands of researchers who know how to train large language models.**

**Very few teams know how to build a truly exceptional AI teacher.**

Those are different problems.

If your team becomes world-class at the second one, you'll have something that is difficult to imitate regardless of which frontier model is underneath. The models will keep improving, but great pedagogy, deep understanding of students, and a robust educational architecture remain valuable no matter which LLM is powering the system.