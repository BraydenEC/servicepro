# 🤖 Week 1 Coding Agent Prompt Log

**Agent:** Claude Code (Opus 5), in VS Code
**Requirement:** minimum 5 prompts · **Logged: 6**

Actual prompts sent, in order, with what each produced and what had to be
corrected. Week 0's log is at `../PROMPT_LOG.md`.

---

## Prompt 1 — Read the spec, audit, then plan

> "Please read these documents. Make sure that I have everything listed in the documents. If so, please continue to develop the website and log all of the changes."
> *(attachments: Week 1 assignment PDF, Week 1 overview PDF)*

**Outcome:** Cross-read the two documents. The overview lists seven required
features and six coding tasks that the assignment PDF does not enumerate —
`core_outputs` as a *named* table, a prompt library entry, and a dashboard
preview distinct from the `/core` page itself.

The Build Discipline Packet was written and committed **before** any Week 1
code, satisfying Gate 1 explicitly rather than retroactively.

---

## Prompt 2 — Build the module

**Outcome:** `/core` page, intake form, structured output renderer, both API
routes, the zod schema, the deterministic extractor, the model extractor, and
`core_outputs.sql`.

**Design decision made here:** build the deterministic extractor *first* and
keep it permanently as the fallback, rather than treating a missing API key as
an error. Week 0 proved a deployment can be missing environment variables
without anyone noticing — so `/core` had to work for a grader with no
credentials at all.

---

## Prompt 3 — API key question

> "If I already have a key can I use that one/ if it is active but unused or do I have to create a new one?"

**Outcome:** Reuse is fine — keys are not consumed or project-bound. Flagged the
common conflation: a Claude Pro/Max subscription is **not** API access, and
billing is separate.

---

## Prompt 4 — Key supplied, verify the model path

**Outcome:** Model path confirmed working. All three required briefs re-run
against both extractors for direct comparison.

**Correction made here:** the prompt library documented model latency as
"~1 second." Measured end-to-end is **~7.3s** — thinking is on by default on
Opus 5 and `effort: "low"` reduces rather than removes it. Corrected in place
across the library and test evidence rather than quietly edited.

---

## Prompt 5 — Audit remaining work

> "please read these documents and create a outline for what there is to work on"

**Outcome:** Audited the live site and live database rather than assuming.
Two findings that visible inspection would have missed:

1. **Production was not running the generative core.** The live API reported
   `extractor: heuristic` with reason *"No ANTHROPIC_API_KEY configured on the
   server."* The key existed locally but was never added to Vercel.
2. **`core_outputs` held zero rows** (`content-range: */0`), so there was no
   Supabase evidence for the week despite the migration having been run.

Both are Week 0's failure mode repeating: correct code, wrong environment.

Also found a real spec gap — **"Dashboard preview"** is a required feature, but
`SavedOutputs` rendered only on `/core` and `app/page.tsx` never referenced the
core module.

---

## Prompt 6 — Close the gaps

> "please continue to work, document all of the changes and create a handoff document when finished. Please tell me the actions I need to take individually"

**Outcome:** Built `CorePreview` and wired it into the dashboard. Verified the
full round trip against the live database: extract → model, save → HTTP 201,
row present, preview renders it with the correct computed value. Wrote the five
missing Week 1 evidence documents.

**Self-inflicted error worth recording:** the first save attempt returned HTTP
400 because the test payload used `brief` where the route expects `raw_input`.
The API was correct and the error message named the exact field — the mistake
was in the test, not the code. Checked what the real UI sends before assuming a
bug existed.

---

## Note on prompt strategy

Across both weeks, the highest-value prompts have been **audits rather than
build requests**. Prompt 5 produced no code and found the single most
consequential problem of the week: the graded URL was not running the feature
being graded. Prompt 1 of Week 0 was similar — a constraint forbidding code
until a plan existed, which surfaced seven document contradictions.

Building is the easy half. Verifying that what shipped is what was intended has
found every serious defect in this project.
