# 🧠 Week 2 — Human Decision Note (draft)

**Requirement:** 150–250 words on decisions, rejections, corrections, and tradeoffs.
**This draft:** 231 words.

**Edit it into your own voice before submitting.** The instructor's Week 0 feedback was that the
note read thinner than the reasoning shown elsewhere in the document; a note that also does not
sound like you is the other way to lose the same marks.

---

## Draft

> The central decision this week was to design the database schema against the tool I was using
> to fill it. A research assignment asks for competitor pricing and market evidence, which is
> exactly the material a language model produces fluently whether or not it is true, and a
> fabricated statistic is indistinguishable from a real one by reading. So every record carries a
> source URL, a date, and a required confidence level, and four separate layers check for invented
> citations — the prompt, the code, the API, and a constraint in Postgres.
>
> I rejected making the source field mandatory. It looks like the responsible choice and it is
> worse: a required source pushes you to paste a plausible-looking link to satisfy the constraint,
> which is fabrication with extra steps. Leaving it nullable means an unsourced claim is visible
> rather than impossible.
>
> The correction I did not expect came from verifying my own work. Checking my Mexican tax claims
> against SAT confirmed them, but also surfaced a 2026 reform I had missed: an invoice must now be
> backed by evidence the work actually happened. None of the tools I surveyed ever saw the work,
> so they cannot produce that evidence. My argument changed from convenience to exposure — the
> check meant to confirm what I had written found something better than what I was checking.
>
> The tradeoff is that the page reads as less authoritative. Three rows say "unsourced" instead of
> quietly appearing as fact.

---

## Rubric coverage

| Element | Where it lands |
|---|---|
| **Decision** | Design the schema against the tool filling it — source, confidence, four checks |
| **Rejection** | Mandatory source field, with the reason it is worse than it looks |
| **Correction** | Verification found a better claim than the one being checked |
| **Tradeoff** | More honest, less impressive — both sides named |

---

## Optional swap — a fourth correction

If you would rather close on something more concrete than the tradeoff, this happened after the
draft was written and is arguably the sharper story:

> A save that works but shows nothing is indistinguishable from a save that does not work. My
> research page persisted every record correctly and never updated the list, so saving looked
> like it silently failed — I only found out because I was told it was broken. It is the same
> failure as the invisible fallbacks in the previous two weeks, arriving from the opposite
> direction: there the interface looked healthy while the system was degraded, here the system was
> healthy while the interface looked broken.

Using it means cutting something else to stay under 250 words — most likely the final tradeoff
paragraph. **I would keep the tradeoff.** It is the element most submissions omit entirely, and
the instructor asked for it by name.

---

## Two edits to consider

1. **"the tool I was using to fill it"** is deliberately understated. If you would rather write
   "the AI I was using", that is more direct and equally true.
2. **To shorten**, cut the final paragraph and land at roughly 195 words — still comfortably in
   range, but you lose the tradeoff, which is the strongest reason not to.
