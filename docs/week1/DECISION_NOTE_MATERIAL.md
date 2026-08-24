# 🧠 Week 1 — Raw Material for Your Decision Note

**You write this one.** It's assessed as *your* judgment, in your voice, and
it's worth real marks. Below is the factual record — source material, not a
draft to paste.

**Requirement:** 150–250 words covering **decisions, rejections, and corrections.**

---

## ⭐ The strongest story: it happened twice

Week 0 shipped a dashboard that looked perfect and served **mock data for six
deployments** — the database was live and seeded, but Vercel never got the
environment variables.

Week 1 shipped `/core`, which looked perfect and **never called the model in
production** — the API key was in `.env.local` and worked locally, but was never
added to Vercel.

Same root cause, one week apart: correct code, unconfigured environment. Both
were invisible to inspection, because in both cases the fallback was a real
working feature rather than an error.

**The fix that generalizes:** every degraded path now names itself. Week 0 added
`data-source="supabase|mock"`. Week 1 puts `extractor` and a `fallbackReason` in
every API response, shows it as a badge in the UI, and stores it on every
database row.

**The tradeoff to state plainly:** a fallback good enough to survive an outage
is also good enough to hide a misconfiguration. Resilience and observability
pull against each other, and choosing resilience means you must pay for
observability separately.

---

## Decisions

**Built the regex extractor first, and kept it.** The obvious design calls the
model and errors without a key. Instead a missing key is a *supported state* —
`/core` works for a grader who clones the repo with no credentials. It served
correctly for several deployments before the key existed.

**Stored `extractor` and `prompt_version` on every row.** Not just displayed —
persisted. When the prompt changes, existing rows remain attributable to the
version that produced them.

**Made every field nullable.** A brief that omits a rate produces `null`, never
a guess. The worst outcome for this module is a confident wrong record.

---

## Rejections

| Rejected | Chosen | Why |
|---|---|---|
| Error when API key is missing | Deterministic fallback | The page must work without credentials |
| Deleting regex once the model worked | Kept as permanent fallback | It is the answer to "what if the API is down mid-demo" |
| Higher reasoning effort | `effort: low` | Already ~7s; more would hurt a form a user waits on |
| Hand-written type guards | One zod schema | Validates model output, request, and save payload — three places to drift otherwise |
| Inline prompt string in the route | Versioned constant | Unversionable and untestable inline |
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | Server-only | The prefix would ship a billable key to every visitor |

---

## Corrections

**Latency was assumed, not measured.** Documented as "~1 second"; measured
**~7.3s**. Thinking is on by default on Opus 5 and low effort reduces rather
than removes it. Corrected in place across two documents rather than quietly
edited.

**A required feature was read as satisfied when it wasn't.** "Dashboard
preview" was assumed covered by the saved list on `/core`. Re-reading the spec
against the actual routes showed `app/page.tsx` never referenced the core module
at all. Built it.

**A test failure that was not a bug.** A save returned HTTP 400; the payload
used `brief` where the route expects `raw_input`. The API was right and its
error named the field. Worth recording because treating it as a code defect
would have produced a pointless change.

---

## Where the model genuinely earns its place

Regex is not a stub — it parses rates, hours, and absolute dates, and resolves
bare dates forward. It fails on what language does casually:

| Brief | Regex | Claude |
|---|---|---|
| "by the end of next month" | `null` | `2026-09-30` |
| "— Dana, Northwind Co" | `null` | `Northwind Co` |
| "following up on the redesign" | `Up On The Redesign` | `Website Redesign` |

**The most important test was the incomplete brief.** It mentions "next week"
and discusses pricing — two openings to fabricate a date or a rate. Both paths
returned `null` for every absent field and named them. That restraint is the
feature.

---

## Writing tips

- **Two stories told properly beats six listed.** The repeated environment
  failure plus one rejection is a full note.
- **Specifics beat adjectives.** "Production never called the model, and looked
  fine doing it" says more than "I learned about debugging."
- **A tradeoff needs two sides.** "I kept the fallback for resilience, accepting
  that it can mask a broken deployment — so I made it announce itself" is a
  tradeoff. "I added a fallback" is not.
- 150–250 words ≈ two solid paragraphs.
