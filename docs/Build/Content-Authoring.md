---
tags: [type/guide, domain/startup, startup/content]
updated: 2026-07-17
audience: anyone adding items — you do not need to know the rest of this codebase
---
# ✍️ Content authoring guide

> **Goal of this page:** you have never seen this project before, and in ~20
> minutes you add ten valid items. If that fails, this page is the bug — say so.

Content is code here. It has a schema, a linter, and a review checklist, and bad
content fails the same way bad Python does: before it lands, with a message
telling you which line to fix. Nothing in this guide requires a database.

## 0. Setup (once)

```sh
cd backend
python -m venv .venv && . .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
```

Check it works — this must print a report and `OK`:

```sh
python -m app.ingest.items ../content/items/phy_mechanics.yaml \
    --kc ../content/kc/phy_mechanics.yaml --check
```

`--check` never touches a database. It is what CI runs, and it is the only
command you need while authoring.

## 1. The loop you're in

```
edit content/items/phy_mechanics.yaml  →  --check  →  fix what it says  →  repeat  →  PR
```

Run `--check` after every item or two. It is instant, and a message in front of
you now beats one in a PR review tomorrow.

## 2. What to author next

The bottom of the `--check` report tells you:

```
Next up (emptiest first):
     0 items   phy.mech.angular_momentum
     0 items   phy.mech.axis_theorems
```

**Breadth before depth.** Every KC reaches 5 items before any KC gets a 6th.
Reason: the policy picks an item *within* a KC to hit ~70% expected success — so
a KC with 1 item can be *served* but not *adapted over*, and a KC with 0 items
is a hole the student can never be routed through. A deep ladder on one KC buys
nothing while its neighbours are unreachable. The report flags it if you drift:

```
NOTE: 1 KC(s) are past 5 items while 43 are still below it
  Breadth before depth — finish the floor first.
```

(Justified exceptions exist — a KC that genuinely carries more exam weight. Say
so in the PR; don't do it silently.)

## 3. Anatomy of an item

```yaml
# VALID
subject: PHY
chapter: PHY::mechanics::11
items:
  - slug: phy.mech.free_fall.q004
    kc: phy.mech.free_fall
    stem: |
      A stone is released from rest at a height of $20\ \mathrm{m}$. Taking
      $g = 10\ \mathrm{m/s^2}$, find the speed with which it strikes the ground.
    answer:
      value: 20.0
      unit: m/s
    hints:
      - The initial velocity is zero.
      - $v^2 = u^2 + 2gh$.
    source: Written for AITutor pipeline seed (A.3)
```

| Field | Rule |
|---|---|
| `slug` | **Identity. Never changes, never reused.** Convention: `<kc_id>.qNNN`. Pick the next free number in that KC. |
| `kc` | Exactly one, and it must exist in `content/kc/phy_mechanics.yaml`. See §4. |
| `stem` | The question. LaTeX in `$…$`. Use a `|` block so line breaks survive. |
| `answer` | The gold. See §5. |
| `hints` | Optional ladder, cheapest first. See §6. |
| `source` | **Required.** See §7. |

**Never write `difficulty`.** The linter rejects it. Elo learns difficulty from
real attempts ([[ADR-012]]); anything you write would be overwritten and would
mislead the next author into thinking it mattered.

**Why the slug never changes:** fixing a typo in a stem must keep the item's
identity, or it silently becomes a *new* item and every attempt ever recorded
against the old one is orphaned ([[ADR-015]]). Edit stems freely. Never edit a
slug — if an item is genuinely a different question now, give it a new slug and
leave the old one.

## 4. Choosing the KC (tagging)

Open `content/kc/phy_mechanics.yaml`. 57 KCs; each has an `id` and a `name`.

Ask: **"which single concept must a student have mastered to get this right,
assuming they already know that KC's prerequisites?"**

That last clause does the work. For "a block slides down a rough incline, find
its speed at the bottom using energy methods":
- ❌ `phy.mech.vectors_basics` — needed, but it's a *prerequisite*, not what's
  being tested.
- ❌ `phy.mech.inclined_plane` — the setting, not the skill.
- ✅ `phy.mech.energy_conservation` — the thing that fails if they don't know it.

Rules of thumb:
- **Tag the skill being *assessed*, not every skill *touched*.** Prerequisites
  are already in the graph; that's the graph's job, not the tag's.
- **If two KCs feel equally right, the item is probably testing both** — which
  means it's a bad practice item (you can't tell *which* one they got wrong
  from one attempt). Split it into two simpler items, or pick the later KC in
  the prerequisite chain.
- **If no KC fits**, don't invent one in the item file. Adding a KC is a change
  to the graph (a separate PR, separate review) — flag it and move on.
- **The graph, drawn:** `python -m app.ingest.kc ../content/kc/phy_mechanics.yaml
  --check --dot kc.dot && dot -Tpng kc.dot -o kc.png`. Easier than reading YAML
  when you're deciding where something sits.

## 5. Gold answers

The single most important rule: **an item the verifier cannot grade never enters
the bank** ([[ADR-016]]). Your `answer` is handed to the *real* grader at lint
time, so if the linter accepts it, a student's answer will be gradeable too.

### Numeric

```yaml
# VALID
subject: PHY
chapter: PHY::mechanics::11
items:
  - slug: phy.mech.power.q001
    kc: phy.mech.power
    stem: A $60\ \mathrm{W}$ bulb runs for $5\ \mathrm{s}$. Find the energy used.
    answer:
      value: 300
      unit: J
    source: Written for AITutor pipeline seed (A.3)
```

- Tolerance is **relative 1e-3**, so give enough significant figures: `28.28`,
  not `28`.
- **Units are compared as normalized strings, not dimensionally** — `N/kg` does
  NOT currently match `m/s^2` even though they're identical ([[ADR-009]]; `pint`
  fixes this at P5.0). So: **write the unit the way a student would**, in the
  form the question invites. If the question says "in m/s", the gold is `m/s`.
- Omit `unit` only for genuinely dimensionless answers (a ratio, a count).

### Multiple choice

```yaml
# VALID
subject: PHY
chapter: PHY::mechanics::11
items:
  - slug: phy.mech.torque.q001
    kc: phy.mech.torque
    stem: |
      A force acts along a line passing through the axis of rotation. The torque
      about that axis is
      (A) maximum  (B) zero  (C) negative  (D) undefined
    answer:
      choices: [B]
    source: Written for AITutor pipeline seed (A.3)
```

Multi-correct (JEE Advanced) is `choices: [A, C, D]` — order doesn't matter, it's
compared as a set. Put the options in the `stem`; `choices` is the *answer key*.

### Symbolic — not yet

```yaml
# INVALID: symbolic gold has no checker until P5.0
subject: PHY
chapter: PHY::mechanics::11
items:
  - slug: phy.mech.projectile_ground.q900
    kc: phy.mech.projectile_ground
    stem: Derive the range of a projectile launched at $\theta$ with speed $u$.
    answer:
      expr: u**2 * sin(2*theta) / g
    source: Written for AITutor pipeline seed (A.3)
```

Rejected today: symbolic equivalence needs the sympy checker (P5.0). Give a
numeric `value` instead — pick concrete numbers and ask for the result. When
P5.0 lands these become admissible with no change to the linter.

## 6. Hints

Optional, ordered **cheapest first**: a nudge, then the principle, then the
formula. Never the answer. Hints are the zero-LLM path — a student who takes a
hint costs us nothing, whereas "explain this" costs a model call. Good hints are
therefore a margin decision as well as a pedagogical one.

## 7. Sourcing and attribution

`source` is **required** because attribution for NCERT / past-paper material is a
licensing obligation, not metadata garnish. Be specific enough to find it again:

- `NCERT Exemplar Physics XI, Ch 4, Q4.12`
- `JEE Main 2023, Session 1, Shift 2, Q14`
- `Written for AITutor` — only for genuinely original items.

Use **public** sources: NCERT, NCERT Exemplar, past JEE papers. Do **not** copy
from a coaching institute's proprietary material.

## 8. The review checklist

For the author before opening a PR, and the reviewer before approving. `--check`
covers the mechanical half; **only a human can do the second half.**

The linter already guarantees: the KC exists · exactly one KC · the answer is
gradeable · no duplicate stems in a KC · no duplicate slugs · `source` present ·
no authored `difficulty`.

A reviewer must check the things no linter can:

- [ ] **Is the gold answer actually correct?** Work it. A confidently wrong gold
      is the worst possible bug: the student is right, gets marked wrong, and
      Elo learns the opposite of the truth from every future attempt.
- [ ] **Is the KC tag the skill being assessed** (§4), not merely touched?
- [ ] **Is the stem unambiguous?** One reading, one answer. State every constant
      the student needs ($g = 10$ vs $9.8$ changes the gold).
- [ ] **Do the units in the gold match what the stem asks for?** (§5 — string
      compare, so `N/kg` vs `m/s^2` fails until P5.0.)
- [ ] **Does the LaTeX render?** Unbalanced `$` breaks the client.
- [ ] **Is it a *practice* item?** Answerable in a couple of minutes, testing one
      thing. Not a 40-minute multi-part derivation.
- [ ] **Do the hints ladder** without giving the answer away?
- [ ] **Is the source real and specific** enough to check?
- [ ] **Is it genuinely different** from the other items on that KC — a different
      *case*, not the same question with new numbers? (The linter only catches
      identical text.)

## 9. Batch workflow

For a batch of ten:

1. Pull `main`, branch: `git checkout -b content/mechanics-batch-3`
2. Take the top of the **Next up** list from `--check`. Claim them in the PR
   title (`content: mechanics — angular momentum, torque, +3`) so two curators
   don't author the same KC twice.
3. Append items to `content/items/phy_mechanics.yaml`, grouped by KC, slugs
   sequential within the KC.
4. `--check` until clean. **Read the report** — coverage and median are the
   numbers that matter; item count is the one that flatters.
5. Self-review against §8. Then PR. Keep batches ~10–30: big enough to be worth
   a review, small enough to actually get reviewed.

Nothing is ingested by a PR merge. Importing into a database is a separate,
deliberate step (drop `--check`), and it can't happen until the live-DB
reconciliation in `supabase/README.md` is done.

## 10. When the linter is wrong

It will be, eventually. If it rejects a legitimate item, that's a bug in the
linter, not a reason to weaken the item — say so in the PR rather than working
around it. If it *accepts* something that's wrong, that's a missing rule, and
it's worth more than the item: it'll catch the same mistake forever.

## Connections
- Format + rules → `backend/app/ingest/item_spec.py` · Graph →
  [[Adaptive-Loop-Architecture]] §3.2
- Why gold is checked at lint time → [[ADR-016]] · Why slugs never change →
  [[ADR-015]] · Why you can't author difficulty → [[ADR-012]] · Why units are
  strings for now → [[ADR-009]]
- Board → [[Status]]
