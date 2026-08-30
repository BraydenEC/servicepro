# 🧠 Week 1 — Human Decision Note (working draft)

**Requirement:** 150–250 words covering decisions, rejections, corrections, and tradeoffs.
**Status:** student's draft below, ~218 words. Four small edits recommended, marked inline.

---

## Instructor feedback on the Week 0 note

> "Strengthen the dedicated Human Decision Note — the note at the end is
> noticeably thinner than the reasoning you demonstrate everywhere else in the
> document. The implementation note and iteration log actually contain much
> richer explanations of decisions, rejections, and tradeoffs than the note
> itself does. Next time, pull some of that stronger reasoning directly into the
> Human Decision Note so it reflects the quality of thinking you're already
> doing elsewhere."

**What changed in response:** the Week 0 note opened with *"I didn't have to make
many adjustments,"* which read as *nothing went wrong* and undersold the work.
The Week 1 note leads with a decision that carried a real cost, names what was
rejected and why, and states the tradeoff explicitly.

---

## Current draft (student's wording)

> The central decision this week was to build the extractor first, before
> touching the Anthropic API, and to keep it permanently rather than delete it
> once the model worked. I rejected the obvious alternative, returning an error
> when no API key is configured, because it would leave /core broken for anyone
> opening the repo without credentials. The fallback was good enough that
> production ran on it for days without noticing the model was never being
> called. The key was configured correctly in my local environment and wasn't in
> Vercel yet. This was the same failure as Week 0, where the deployed site served
> mock data for six deployments while appearing completely correct. Both times
> the code was right and the environment was wrong, and both times nothing
> visible revealed it. Every response now names which extractor produced it, the
> UI shows it as a badge, and it is stored on every saved row, so it's flagged if
> the wrong output is made. The tradeoff I would state plainly: a fallback good
> enough to survive an outage is also good enough to conceal a misconfiguration.
> So, a smaller correction: adding the variable in Vercel was not sufficient, and
> neither was checking once. My first verification still reported the fallback,
> because the request hit an instance serving the previous build.

**Rubric coverage — all four elements present:**

| Element | Where it lands |
|---|---|
| Decision | Build the deterministic extractor first, keep it permanently |
| Rejection | Erroring on a missing key, with the reason |
| Correction | Two — the observability fix, and that one check was not enough |
| Tradeoff | Resilience vs. observability, stated explicitly |

---

## Four recommended edits (~5 words total)

**1. Restore "deterministic."** The draft says "the extractor," but the note
depends on there being *two* — a model path and a fallback. Without the
adjective, "keep it permanently rather than delete it once the model worked"
does not parse for a reader coming in cold.

> build **the deterministic extractor** first

**2. Tighten one claim that is slightly inaccurate.** The badge does not detect
wrong output; it reports *which path ran*. The fallback's output is not wrong,
only less capable.

> ~~so it's flagged if the wrong output is made~~
> → **so the degraded path announces itself instead of hiding**

**3. Fix the connector.** The preceding sentence is the tradeoff, not a cause, so
"So," is doing the wrong work.

> ~~So, a smaller correction:~~ → **A smaller correction:**

**4. Put yourself in the sentence.** As written, *production* is doing the
noticing. This is a Human Decision Note, so the human should appear in it.

> ~~production ran on it for days without noticing~~
> → **production ran on it for days before I caught it**

---

## Note on voice

The student's simplifications to the original draft read more naturally than the
source material did, and were kept. The instructor is explicitly comparing this
note against the surrounding document, so voice consistency matters more than
polish.
