---
tags: [type/note, domain/startup, startup/architecture]
updated: 2026-06-28
---
# 📚 Knowledge & Retrieval Layer

> **RAG ≠ "upload PDFs."** Good retrieval is almost an entire field. A bad system returns *"Physics Chapter 7."* A good one returns **knowledge**:
> ```
> Circular Motion → Acceleration → Vector derivation → Example → Common misconception → Practice problem
> ```
> One retrieves *documents*. The other retrieves *understanding*. That difference is a moat input.

## Content quality > model (in education)
> GPT-5 with garbage notes → teaches garbage. A 7B model with phenomenal content → can outperform it.

So the **Knowledge Layer** questions come first (ChatGPT's ordering):
- What content do we **own**? (authored, partner-supplied)
- What do we **retrieve**? (NCERT, past papers)
- What can we **legally use**? (govt NCERT = safe; copyrighted papers = careful — see [[Competitive-Landscape]] risks)
- How do we **organize** it? (subject/topic/type tags; concept graph)

## Retrieval is several engines, merged (not one vector DB)
Most startups: `Question → Embedding → Vector DB → Top-5 → LLM`. Works until questions get hard. We route instead:
```
Question → Classifier (math? physics? theory? numerical? revision?)
         → Retriever Router → [Vector · Keyword · Knowledge Graph · Formula DB ·
                               Definitions · Examples · Student History · Past Mistakes]
         → Merge → LLM
```
Example: *"Why does integration work here?"* doesn't need lecture notes — it needs `concept graph + formula sheet + this student's past misconception`. **Personalized retrieval** = pull from [[Student-Model]] too.

## Hybrid pattern (vectors + knowledge graph)
- **Vectors** (pgvector/Qdrant) → broad fuzzy recall.
- **Knowledge graph** (Neo4j) → precise multi-hop reasoning (link a physics concept to its math formula).
- Generate answers **strictly from retrieved sources, with citations** (page numbers) — anti-hallucination, complements [[Verification-Engine]].

## Open / contested
- `#decision/open` Knowledge graph in v1 or defer? (Lean defer: curated bank + vectors first; add KG when multi-hop pain is real.)
- `#decision/open` Build the concept graph by hand for one subject, or extract it from content automatically?

## Connections
- Layer 1–2 of → [[Cognitive-Architecture]]
- Personalized by → [[Student-Model]] · complements → [[Verification-Engine]]
- Reference → [[High Level Architecture]] · Hub → [[Startup-MOC]]
