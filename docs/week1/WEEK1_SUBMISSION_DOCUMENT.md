# Week 1: Generative Core Agent — Submission

**Student:** Brayden Credeur  |  **Course:** Negocios Inteligentes
**Project:** ServicePro Core — client brief → structured project record

---

## Required Links

| Item | Link |
|---|---|
| **Live page (`/core`)** | https://servicepro-orpin.vercel.app/core |
| Dashboard | https://servicepro-orpin.vercel.app |
| **GitHub** | https://github.com/BraydenEC/servicepro |
| **Demo video** | ⬅️ PASTE YOUR VIDEO LINK HERE |

---

# Build Discipline Packet

*Completed and committed before any Week 1 code was written (Gate 1).*

## Problem — What user problem is this feature solving?

Week 0 built a dashboard that answers *how much am I owed* and *what's due next*. It has a hole: **someone has to put the data in.**

Freelance project details never arrive as structured records. They arrive as prose — a client email, a Slack message, notes from a call:

> "Hi — following up on the redesign we discussed. Need it done by Nov 14. We agreed $85/hr, I've tracked about 22 hours so far. — Dana, Northwind Co"

Every field the dashboard needs is in there. Extracting it means reading the message, deciding what matters, and retyping seven fields. It takes two minutes and it is pure transcription — so it gets deferred, and the dashboard sits empty while the information rots in an inbox.

**This is the actual failure mode of the Week 0 product.** A tracker nobody populates is worse than a spreadsheet, because at least the spreadsheet was already open.

## User — Who will use it?

Independent contractors, freelance developers, designers, and consultants — specifically at the moment *after* a client agrees to work and *before* the project exists anywhere but an inbox.

## Success — What must work by the end of the week?

`/core` loads in production and performs the full loop: accepts an unstructured brief, extracts structured fields into an output card, saves to the Supabase `core_outputs` table, displays saved outputs, and degrades to a deterministic extractor when no model key is configured so the page never fails.

**Result: achieved.** All five, verified end to end.

## UX Concept

Wireframe produced during planning: two-column layout, intake left, structured output card right, saved outputs beneath.

*(Insert wireframe.svg here)*

**Implementation note.** The output card mirrors the Week 0 dashboard's visual language exactly — same surfaces, same hairlines, same status badges — because the extracted record *is* a dashboard row. Making the card look like a preview of its destination, rather than a generic result panel, is the design idea.

Two divergences from the wireframe were made during the build:

1. **Added an extractor badge** stating whether Claude or pattern matching produced the result. Not in the wireframe; added because Week 0 proved an invisible fallback can hide a broken deployment.
2. **Added a dashboard preview panel.** The wireframe showed saved outputs only on `/core`. The spec lists "Dashboard preview" as a separate feature, and the core module should feed the product rather than sit beside it.

## Scope Cut — What looked nice but will not be built this week?

| Cut | Why |
|---|---|
| Editing extracted fields before saving | Confirm-or-rerun proves the loop; inline editing is a form-state project |
| Bulk paste / multiple projects per brief | One brief, one project. Multi-extraction doubles schema and validation work |
| File and email upload (`.eml`, PDF) | Parsing beats extracting; the paste box proves the concept |
| Streaming token-by-token output | Impressive, materially harder, and adds nothing to correctness |
| Promoting saved outputs into the `projects` table | `core_outputs` is the required destination; promotion is a natural v2 |
| Authentication | Still single-user, consistent with Week 0 |
| Editing or deleting saved outputs | Read and create only |

## Product Spec — Requirements and acceptance criteria

**Requirements:** `/core` renders an intake form (R1); submitting extracts seven fields including a confidence note (R2); results render in a structured output card (R3); a save button persists to `core_outputs` (R4); saved outputs are listed (R5); with no model key a deterministic extractor produces valid output rather than an error (R6); the prompt is documented as a versioned library entry (R7).

**Acceptance criteria** — each with an explicit pass condition:

| # | Criterion | Pass condition | Result |
|---|---|---|---|
| C1 | `/core` loads in production | HTTP 200 | ✅ PASS |
| C2 | Empty submission rejected | Validation error, no API call | ✅ PASS |
| C3 | Realistic brief extracts all fields | Every field populated | ✅ PASS |
| C4 | Dates normalize to ISO | "Nov 14" → `2026-11-14` | ✅ PASS |
| C5 | Money parses in any format | "$85/hr", "85 an hour" → `85` | ✅ PASS |
| C6 | Value computed, never invented | Equals hours × rate | ✅ PASS |
| C7 | Save persists | Row present on re-query | ✅ PASS (HTTP 201) |
| C8 | Saved outputs display | Record appears after reload | ✅ PASS |
| C9 | Works with no model key | Valid output, HTTP 200 | ✅ PASS |
| C10 | Missing fields degrade honestly | `null`, not fabricated | ✅ PASS |
| C11 | Model failure never 500s | Falls back, page usable | ✅ PASS |
| C12 | Extraction never silently faked | Response names the extractor | ✅ PASS |
| C13 | API key never reaches the browser | Zero matches in bundle | ✅ PASS |
| C14 | Writes to `core_outputs` controlled | Behaves per documented policy | ✅ PASS |

## Architecture — Frontend, backend, database, data flow

```
Browser (/core)
  │  paste brief, submit
  ▼
POST /api/core/extract          ← Route Handler, server-only
  │
  ├─ ANTHROPIC_API_KEY set? ── yes ─▶ Claude ─▶ structured JSON
  │                                      │
  │                                 (error / invalid)
  │                                      ▼
  └─ no ────────────────────────▶ deterministic extractor
                                         │
                                         ▼
                                 validate + normalize (zod)
                                         │
                                         ▼
                    { fields, extractor: "model" | "heuristic" }
  │
  ▼
Output card ──[Save]──▶ POST /api/core/save ──▶ Supabase core_outputs
                                                       │
                                                       ▼
                                        saved list + dashboard preview
```

**Why a Route Handler rather than a Server Action or client call:** the model key must never reach the browser. A Route Handler keeps it server-side, gives one place to enforce the fallback contract, and makes the endpoint `curl`-testable — which is how the required test runs are evidenced.

**Database — `core_outputs`.** Every extraction field is **nullable by design**: a brief that omits the rate must produce a row saying so, not a fabricated number. `status` is CHECK-constrained to the same four values as the Week 0 `projects` table. Two provenance columns, `extractor` and `prompt_version`, are persisted on every row so results remain attributable when the prompt changes.

## Tech Stack

| Layer | Choice | Why, and what was rejected |
|---|---|---|
| Model | **Claude (Anthropic API)**, `effort: low` | Structured extraction from messy prose is exactly the task. *Rejected: regex-only* — brittle on real language. *Rejected: higher effort* — already ~7s |
| Fallback | **Deterministic extractor** | Guarantees the page works with no key, no credit, no network. *Rejected: erroring out* — an unconfigured deploy would score zero |
| Validation | **zod** | One schema validates model output, request, and save payload. *Rejected: hand-written guards* — three places to drift |
| API layer | **Next.js Route Handler** | Keeps the key server-side; `curl`-testable |
| Database | **Supabase Postgres** | Already provisioned; `core_outputs` is a second table, not a second system |
| Frontend | **Next.js 16 + Tailwind v4** | Unchanged from Week 0; reuses existing design tokens |
| Hosting | **Vercel** | Existing pipeline; every push auto-deploys |

Net new third-party dependencies: **one** (`@anthropic-ai/sdk`).

## DevOps

- **GitHub:** same repository, `main`, auto-deploying. **22 commits.**
- **Vercel:** existing project. One new variable, `ANTHROPIC_API_KEY`, **without** the `NEXT_PUBLIC_` prefix — the prefix would ship a billable key to every visitor.
- **Supabase:** `core_outputs` added via a re-runnable migration alongside the Week 0 schema.
- **Deployment plan:** verify locally against the heuristic extractor → deploy → add the model key → redeploy **with build cache disabled** → verify the response reports `model`.

> The redeploy-without-cache step is written into the plan because skipping it is exactly what left Week 0's production database unused for six deployments.

## Test Plan

Three required runs plus resilience and security checks — full results below.

## Coding Agent Prompt

> Build a `/core` page for the existing ServicePro Next.js 16 app. It takes an unstructured freelance project brief pasted into a textarea and extracts seven structured fields — project name, client, hourly rate, hours logged, deadline, status, and a confidence note — rendering them in an output card styled to match the existing dashboard's design tokens. Extraction runs server-side in a Route Handler that calls the Anthropic API when `ANTHROPIC_API_KEY` is present and falls back to a deterministic extractor otherwise; the response must state which extractor ran. A save button persists the result to a Supabase `core_outputs` table, and previously saved outputs are listed on the page. Reuse the null-safe client pattern from Week 0 so the app builds and deploys with no keys configured. Document the exact model prompt in `docs/` as a versioned prompt-library entry.

---

# Test Evidence

**Requirement: 3 self-tests. Delivered: 6 runs** — each brief against both extraction paths — plus validation and resilience checks. All executed against the real endpoint via `curl`.

## Test 1 — Clean brief, all fields present

Input: *"Need the website redesign done by Nov 14. Agreed $85/hr, tracked 22 hours. — Dana, Northwind Co"*

| Field | Pattern matching | Claude |
|---|---|---|
| project_name | `Need The Website` ✗ | `Website Redesign` ✓ |
| client | `null` ✗ | `Northwind Co` ✓ |
| hourly_rate | `85` ✓ | `85` ✓ |
| hours_logged | `22` ✓ | `22` ✓ |
| deadline | `2026-11-14` ✓ | `2026-11-14` ✓ |

**PASS.** Both resolved "Nov 14" **forward**, not into the past — the failure that would mark every new project overdue on arrival. Claude additionally recovered the client from an inline sign-off.

## Test 2 — Messy brief, relative date, non-standard money

Input: *"hey! quick one — the marketing campaign for Solstice Inc is wrapping up. invoice already went out. rate was 120 an hour and I logged 18.5 hrs. needs to be wrapped by the end of next month"*

| Field | Pattern matching | Claude |
|---|---|---|
| deadline | **`null`** ✗ | **`2026-09-30`** ✓ |
| hourly_rate | `120` ✓ | `120` ✓ |
| status | `invoice_sent` ✓ | `invoice_sent` ✓ |

**PASS.** "120 an hour" parsed with no currency symbol; "invoice already went out" drove status correctly. The decisive difference is the deadline: **"end of next month" is unreachable by pattern matching.** This is the clearest justification for calling a model rather than shipping regex alone.

## Test 3 — Incomplete brief: must refuse to invent

Input: *"Starting the API integration work with Vertex Labs next week. We havent settled on pricing yet and there is no hard deadline."*

| Field | Both paths |
|---|---|
| hourly_rate | **`null`** ✓ |
| hours_logged | **`null`** ✓ |
| deadline | **`null`** ✓ |
| client | `Vertex Labs` ✓ |

Claude's confidence note: *"Rate and hours are unsettled/unstated and no deadline was given; status inferred as in_progress from work starting next week."*

**PASS — and the most important of the three.** The brief contains a number ("next week") and discusses pricing, giving a careless extractor two openings to fabricate. Both paths returned `null` and named every missing field. **A confidently wrong record is the one outcome this module exists to prevent.**

## Validation and resilience

| Test | Expected | Actual |
|---|---|---|
| Empty brief | 400 | ✅ 400 |
| Malformed JSON | 400 | ✅ 400 |
| Brief > 8000 chars | 400 | ✅ 400 |
| No API key | Valid output, `heuristic` | ✅ HTTP 200, reason stated |
| Build with no key | Succeeds | ✅ |
| Save round trip | Row persisted | ✅ HTTP 201, verified in table |
| Key in client bundle | 0 matches | ✅ 0 |

**Measured latency:** heuristic < 1 ms; Claude ~7.3 s.

---

# Iteration Log — What Changed After Testing

## 1. Bare dates resolved into the past
"Nov 14" with no year parsed to the current year. Run in December, that yields a deadline eleven months gone — and since the dashboard marks past deadlines overdue, **every project created from a bare date would arrive already overdue.** Changed so dates without a year resolve forward.

## 2. Project names swallowed prepositions *(the Gate 3 bug)*
The reference brief extracted `"Up On The Redesign"` — the extractor captured three words before the project noun, taking "following **up on the** redesign" whole. Added a stopword trim. Same brief now yields `"Redesign"`. Re-ran the test, committed, redeployed.

## 3. Latency was assumed, not measured
Documented as "~1 second"; measured **~7.3 s**. Thinking is on by default on Opus 5 and low effort reduces rather than removes it. Corrected in place across two documents rather than quietly edited.

## 4. ⭐ Production was not running the generative core — found, then fixed
Querying the live API — rather than trusting that deployment implied configuration — returned:

```
extractor: heuristic
reason:    "No ANTHROPIC_API_KEY configured on the server."
```

The entire point of Week 1 was inactive on the graded URL. The key worked locally; it was never added to Vercel. **The page looked completely correct**, because the fallback is a real extractor producing real structured output.

**This is Week 0's failure repeating exactly.** That week, production served mock data for six deployments while looking perfect. Same root cause: correct code, unconfigured environment. Same reason it was catchable: the response states which path produced it.

**Resolved and verified in production (2026-08-27).** The key was added in Vercel across all three environments and the site redeployed with build cache disabled. The same brief that previously returned `deadline: null` now returns `2026-09-30`, and `client: "Kestrel Digital. We"` — where the regex ran through a sentence boundary — is now `"Kestrel Digital"`. Response time moved from 0.57 s to 3.44 s, so latency alone distinguishes the two paths.

**Lesson, now twice over: a deploy is not a configuration.** Pushing code and having it run as intended are separate events, and only the second is worth anything.

A smaller lesson sat inside the fix: adding the variable was not sufficient, and neither was a single verification. The first post-deploy check still reported `heuristic`, because the request hit an instance still serving the previous build; a retry reported `model`. One sample would have produced the wrong conclusion.

## 5. A required feature was read as satisfied when it wasn't
"Dashboard preview" was assumed covered by the saved list on `/core`. Re-reading the spec against the actual routes showed `app/page.tsx` never referenced the core module at all. Built `CorePreview`.

## 6. A test failure that was not a bug
A save returned HTTP 400; the test payload used `brief` where the route expects `raw_input`. The API was correct and its error named the exact field. Recorded because treating it as a code defect would have produced a pointless change.

---

# Prompt Log

**Requirement: 5. Delivered: 6.** Full text in `docs/week1/PROMPT_LOG.md`.

1. **Read the spec and audit** — cross-read both assignment documents; found the overview lists features the assignment PDF does not enumerate. Packet written before any code.
2. **Build the module** — `/core`, both API routes, schema, both extractors, migration. Key decision: build the deterministic extractor *first* and keep it permanently.
3. **API key question** — confirmed reuse is fine; flagged that a Claude subscription is not API access.
4. **Verify the model path** — all three briefs re-run against both extractors. Latency correction made here.
5. **Audit remaining work** — found production was not running the model, and `core_outputs` was empty.
6. **Close the gaps** — built the dashboard preview, verified the full round trip, wrote the evidence documents.

**Observation:** across both weeks, the highest-value prompts have been **audits rather than build requests**. Prompt 5 produced no code and found the most consequential problem of the week.

---

# Human Decision Note

*150–250 words. Decisions, rejections, corrections.*

⬅️ **WRITE YOUR NOTE HERE.** Source material in `docs/week1/DECISION_NOTE_MATERIAL.md`.

---

# Screenshots

*Insert:*

1. Supabase Table Editor — `core_outputs` with saved rows

2. `/core` before extraction (empty form)
3. `/core` after extraction — **output card with the Claude badge visible**
4. Dashboard — "Recent extractions" panel
5. Vercel — Deployments list
6. GitHub — commit history (22 commits)
7. Architecture diagrams (github.com/BraydenEC/servicepro/blob/main/docs/week1/ARCHITECTURE.md)
