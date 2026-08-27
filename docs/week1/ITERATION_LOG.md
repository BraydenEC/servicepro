# 🔁 Week 1 Iteration Log

Required evidence: *"what changed after testing."* Gate 3 requires tests
documented, a bug fixed, and a redeploy completed.

Ordered by when each problem was found. Week 0's log is at `../ITERATION_LOG.md`.

---

## Build stage

### 1. Bare month-day dates resolved into the past
**Found by:** running the reference brief through the deterministic extractor.
**Problem:** "Nov 14" with no year parsed to the current year. Run in December,
that yields a deadline eleven months gone — and since the dashboard marks past
deadlines overdue, **every project created from a bare date would arrive
already overdue.**
**Change:** dates without a year resolve **forward** — if the parsed date is in
the past, roll to next year. Both extractors follow the rule; the model gets
`TODAY` injected so it can apply the same logic.

### 2. `project_name` swallowed prepositions
**Found by:** the reference brief extracting `"Up On The Redesign"`.
**Problem:** `findProjectName` captured up to three words before the project
noun, so "following **up on the** redesign" was taken whole.
**Change:** a stopword trim strips leading articles and prepositions. The same
brief now yields `"Redesign"`.
**Verification:** re-ran Test 1, committed, redeployed. **This is the Gate 3
bug fix.**

### 3. A missing API key was going to be an error
**Found by:** thinking through what a grader with no credentials would see.
**Problem:** the natural design returns 500 when `ANTHROPIC_API_KEY` is absent,
which would leave `/core` broken for anyone cloning the repo — and Week 0
proved a deployment can lack environment variables without anyone noticing.
**Change:** a missing key is a supported state. The deterministic extractor runs
instead, and the response says so. `/core` served correctly for several
deployments before the key existed.

---

## Testing stage

### 4. Model latency was assumed, not measured
**Found by:** timing the first real model call.
**Problem:** the prompt library documented "~1 second." Measured end-to-end is
**~7.3 seconds**; thinking is on by default on Opus 5 and `effort: "low"`
reduces rather than removes it.
**Change:** corrected in `PROMPT_LIBRARY.md` and `TEST_EVIDENCE.md` in place,
with the tradeoff stated — seven seconds to replace roughly two minutes of
manual transcription is acceptable, and the form already shows an explicit
"Extracting…" state. The estimate was wrong and is marked as corrected rather
than silently edited.

---

## Deployment audit

### 5. ⭐ Production was not running the generative core
**Found by:** querying the live API instead of trusting that deployment implied
configuration.

```
extractor: heuristic
reason:    "No ANTHROPIC_API_KEY configured on the server."
```

**Problem:** the entire point of Week 1 — calling a model — was inactive on the
graded URL. The key was in `.env.local` and worked locally; it was never added
to Vercel. The page looked completely correct, because the fallback is a real
extractor producing real structured output.

**This is Week 0's failure repeating exactly.** That week, production served
mock data for six deployments while looking perfect. Same root cause: correct
code, unconfigured environment. Same reason it was catchable: the response
states which path produced it.

**Change:** `ANTHROPIC_API_KEY` added in Vercel across all three environments,
redeployed with build cache disabled.

**Resolved 2026-08-27 and verified in production:** the same brief that
previously returned `deadline: null` now returns `2026-09-30`, and
`client: "Kestrel Digital. We"` — where the regex ran through a sentence
boundary — is now `"Kestrel Digital"`. Response time moved from 0.57 s to
3.44 s, so latency alone distinguishes the two paths. Recorded as Test 10.

**A smaller lesson inside the fix:** adding the variable was not sufficient, and
neither was a single verification. The first post-deploy check still reported
`heuristic` because the request hit an instance serving the previous build; a
retry reported `model`. One sample would have produced the wrong conclusion in
either direction.

**Lesson, now twice over: a deploy is not a configuration.** Pushing code and
having it *run as intended* are separate events, and only the second one is
worth anything. Every degraded path in this project now names itself for
exactly this reason.

### 6. `core_outputs` existed but was empty
**Found by:** `content-range: */0` on the live table.
**Problem:** the migration had been run, but nothing had ever been saved
through the UI — so the required Supabase evidence was an empty table.
**Change:** verified the save round trip end to end against the live database:
extract → `HTTP 201` → row present with `extractor: model` and
`prompt_version: v1.0.0`.

### 7. "Dashboard preview" was a required feature that did not exist
**Found by:** re-reading the Week 1 overview against the actual routes.
**Problem:** the spec lists **Dashboard preview** separately from the `/core`
page. `SavedOutputs` rendered only on `/core`; `app/page.tsx` never referenced
the core module at all. The feature had been read as satisfied by the `/core`
list.
**Change:** built `CorePreview` and added it to the dashboard, so saved
extractions feed the product rather than sitting beside it.

Two details that came out of building it:
- **The empty state is load-bearing.** The panel is empty until the first save,
  so it must read as "nothing here yet" and say what to do — not as breakage.
- The dashboard's two reads now run **concurrently** via `Promise.all`, so the
  core query does not add its latency to every dashboard render.

### 8. A test failure that was not a bug
**Found by:** a save attempt returning HTTP 400.
**Problem:** the test payload used `brief` where the route expects `raw_input`.
**Resolution:** none needed — the API was correct, and its error named the
exact offending field. Checked what the real UI sends before concluding a bug
existed. Recorded because "the test was wrong" is a legitimate and common
outcome, and treating it as a code defect would have produced a pointless change.

---

## Pattern across both weeks

Every serious problem in this project has been an **environment or verification**
failure, not a coding failure:

| Week | Symptom | Reality |
|---|---|---|
| 0 | Dashboard looked perfect | Served mock data for 6 deployments |
| 1 | `/core` looked perfect | Never called the model in production |

Both were invisible to inspection and both were caught the same way — by making
each code path state which one it took, then querying production directly rather
than assuming.
