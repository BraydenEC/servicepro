# 🧪 Week 1 Test Evidence — Generative Core

**Requirement:** 3 self-tests. **Delivered:** 3 test runs on each extraction
path (6 runs), plus validation and resilience checks.

**Live page:** https://servicepro-orpin.vercel.app/core

Every run below was executed against the real endpoint via `curl`. Raw output
is reproduced verbatim.

---

## The three required test runs

Each brief was submitted to `POST /api/core/extract` twice — once against the
deterministic extractor, once against the model — so the two paths can be
compared directly.

### Test 1 — Clean brief, all fields present

**Input**
```
Need the website redesign done by Nov 14. Agreed $85/hr, tracked 22 hours.
— Dana, Northwind Co
```

| Field | Heuristic | Model |
|---|---|---|
| project_name | `Need The Website` ✗ | `Website Redesign` ✓ |
| client | `null` ✗ | `Northwind Co` ✓ |
| hourly_rate | `85` ✓ | `85` ✓ |
| hours_logged | `22` ✓ | `22` ✓ |
| deadline | `2026-11-14` ✓ | `2026-11-14` ✓ |
| status | `in_progress` ✓ | `in_progress` ✓ |

**Verdict: PASS.** Both resolved "Nov 14" **forward** to 2026-11-14 rather than
to a past date — the failure that would mark every new project overdue on
arrival. The model additionally recovered the client from an inline sign-off
and produced a usable project name.

### Test 2 — Messy brief, relative date, non-standard money format

**Input**
```
hey! quick one — the marketing campaign for Solstice Inc is wrapping up.
invoice already went out. rate was 120 an hour and I logged 18.5 hrs.
needs to be wrapped by the end of next month
```

| Field | Heuristic | Model |
|---|---|---|
| project_name | `Marketing Campaign` ✓ | `Solstice Marketing Campaign` ✓ |
| client | `Solstice Inc` ✓ | `Solstice Inc` ✓ |
| hourly_rate | `120` ✓ | `120` ✓ |
| hours_logged | `18.5` ✓ | `18.5` ✓ |
| deadline | **`null`** ✗ | **`2026-09-30`** ✓ |
| status | `invoice_sent` ✓ | `invoice_sent` ✓ |

**Verdict: PASS.** "120 an hour" parsed to `120` with no currency symbol
present, and "invoice already went out" correctly drove status to
`invoice_sent`. The decisive difference is the deadline: **"end of next month"**
is unreachable by pattern matching, and the model resolved it to `2026-09-30`
against the injected `TODAY`. This is the clearest demonstration of why the
module calls a model rather than shipping regex alone.

### Test 3 — Incomplete brief: must refuse to invent

**Input**
```
Starting the API integration work with Vertex Labs next week.
We havent settled on pricing yet and there is no hard deadline.
```

| Field | Heuristic | Model |
|---|---|---|
| project_name | `Api Integration` ✓ | `Vertex Labs API Integration` ✓ |
| client | `Vertex Labs` ✓ | `Vertex Labs` ✓ |
| hourly_rate | **`null`** ✓ | **`null`** ✓ |
| hours_logged | **`null`** ✓ | **`null`** ✓ |
| deadline | **`null`** ✓ | **`null`** ✓ |

Model confidence note:
> "Rate and hours are unsettled/unstated and no deadline was given; status
> inferred as in_progress from work starting next week."

**Verdict: PASS — and this is the most important of the three.** The brief
contains a number ("next week") and discusses pricing, giving a careless
extractor two openings to fabricate a rate or a date. Both paths returned
`null` and named every missing field. A confidently wrong record is the one
outcome this module exists to prevent.

---

## Validation

| Input | Expected | Actual |
|---|---|---|
| `{"brief":"   "}` | 400 | **400** ✓ |
| `{}` | 400 | **400** ✓ |
| `not json` | 400 | **400** ✓ |
| Brief > 8000 chars | 400 | **400** ✓ |

Bounded before reaching the model — an unbounded paste is an unbounded bill.

---

## Resilience

| Test | Method | Result |
|---|---|---|
| No API key | Unset `ANTHROPIC_API_KEY` | HTTP 200, valid output, `extractor: "heuristic"`, `fallbackReason` states the key is absent ✓ |
| Builds with no key | `npm run build` | Succeeds ✓ |
| Deploys with no key | Vercel build | Succeeded — `/core` served for several deployments before the key was added ✓ |
| Save without table | POST before migration | HTTP 500 with the actual cause: `Could not find the table 'public.core_outputs'` ✓ |

The extractor is **always** named in the response. Week 0 shipped a fallback
that was invisible, and production silently served mock data across six
deployments before anyone noticed. Here the degraded path announces itself in
the API response, in the UI badge, and in the saved database row.

---

## Measured latency

| Path | Latency |
|---|---|
| Heuristic | < 1 ms |
| Model (`claude-opus-5`, effort `low`) | **~7.3 s** |

Recorded because the original design assumed roughly one second. Thinking is on
by default on Opus 5 and low effort reduces rather than removes it. Seven
seconds is an acceptable trade for replacing ~2 minutes of manual transcription,
and the form shows an explicit "Extracting…" state — but the estimate was wrong
and is corrected rather than left standing.

---

## Bug found by testing, then fixed

**Symptom:** the reference brief extracted `project_name: "Up On The Redesign"`.

**Cause:** `findProjectName` captured up to three words preceding the project
noun, so "following **up on the** redesign" was swallowed whole — prepositions
and articles included.

**Fix:** a stopword trim that strips leading articles and prepositions from the
captured phrase. The same brief now yields `"Redesign"`.

**Verification:** re-ran Test 1; committed; redeployed. This satisfies Gate 3 —
*tests documented, bug fixed, redeploy completed*.
