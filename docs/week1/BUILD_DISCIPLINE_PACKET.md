# 🧠 Build Discipline Packet — Week 1: Generative Core Agent

**Gate 1 artifact. Written before any code was produced.**
**Module:** ServicePro Core — brief-to-project extraction
**Live page:** `/core`

---

## 🧩 Problem — What user problem is this feature solving?

Week 0 built a dashboard that answers *how much am I owed* and *what's due next*.
It has a hole: **someone has to put the data in.**

Freelance project details never arrive as structured records. They arrive as
prose — a client email, a Slack message, notes scribbled during a call:

> "Hi — following up on the redesign we discussed. Need it done by Nov 14. We
> agreed $85/hr, I've tracked about 22 hours so far. — Dana, Northwind Co"

Every field the dashboard needs is in there. Extracting it means reading the
message, deciding what matters, and retyping seven fields into a form. It takes
two minutes and it is pure transcription — so it gets deferred, and deferred
again, and the dashboard sits empty while the information rots in an inbox.

**This is the actual failure mode of the Week 0 product.** A tracker nobody
populates is worse than a spreadsheet, because at least the spreadsheet was
already open.

The generative core removes the transcription step: paste the message, get a
structured project, confirm it, save it.

## 👤 User — Who will use it?

The same person Week 0 serves: independent contractors, freelance developers,
designers, and consultants. Specifically the moment *after* a client agrees to
work and *before* the project exists anywhere but an inbox.

## 🎯 Success — What must work by the end of the week?

`/core` loads in production and performs the full loop:

1. Accepts an unstructured brief in a text form
2. Extracts seven structured fields and renders them in an output card
3. Saves the result to the Supabase `core_outputs` table
4. Displays previously saved outputs
5. Degrades to a deterministic extractor when no model key is configured, so
   the page never fails

## 🖼 UX Concept

Wireframe: [`wireframe.svg`](wireframe.svg) — a two-column layout, intake on the
left, structured output card on the right, saved-output preview beneath.

**Implementation note (planned):** the card mirrors the Week 0 dashboard's visual
language exactly — same surfaces, same hairlines, same status badges — because
the extracted record *is* a dashboard row. Making the output card look like a
preview of the destination row, rather than a generic result panel, is the whole
design idea. Divergences from this wireframe will be recorded after the build.

## ✂️ Scope Cut — What looked nice but will not be built this week?

| Cut | Why |
|---|---|
| Editing extracted fields before saving | Confirm-or-rerun is enough to prove the loop; inline editing is a form-state project |
| Bulk paste / multiple projects per brief | One brief, one project. Multi-extraction doubles schema and validation work |
| File and email upload (`.eml`, PDF) | Parsing beats extracting; the paste box proves the concept |
| Streaming token-by-token output | Impressive, materially harder, and the extraction takes ~2 seconds anyway |
| Writing extracted projects into the `projects` table | `core_outputs` is the required destination. Promoting a saved output into a live project is a natural v2 and deliberately out of scope |
| Authentication | Still single-user, consistent with Week 0 |
| Editing or deleting saved outputs | Read and create only |

## 🧱 Product Spec — Feature requirements and acceptance criteria

### Requirements

- **R1** — `/core` renders an intake form accepting free-form text.
- **R2** — Submitting extracts seven fields: project name, client, hourly rate, hours logged, deadline, status, and a confidence note.
- **R3** — Results render in a structured output card styled as a dashboard-row preview.
- **R4** — A save button persists the output to `core_outputs`.
- **R5** — Previously saved outputs are listed on the page.
- **R6** — With no model key configured, a deterministic extractor produces valid output rather than an error.
- **R7** — The exact model prompt is documented in `/docs` as a versioned prompt-library entry.

### Acceptance criteria — each testable, with an explicit pass condition

| # | Criterion | Method | Pass condition |
|---|---|---|---|
| C1 | `/core` loads in production | Request the live URL | HTTP 200 |
| C2 | Empty submission is rejected | Submit blank form | Validation message; no API call |
| C3 | A realistic brief extracts all seven fields | Submit the reference brief | Every field populated, none `null` |
| C4 | Dates normalize to ISO | Brief says "Nov 14" | Stored as `2026-11-14` |
| C5 | Money parses regardless of format | "$85/hr", "85 an hour", "85USD" | All yield `85.00` |
| C6 | Value is computed, never invented | Compare card to hours × rate | Exactly equal |
| C7 | Save persists | Click save, re-query the table | Row present with matching fields |
| C8 | Saved outputs display | Reload `/core` | The saved record appears |
| C9 | Works with no model key | Unset the key, submit | Valid structured output, HTTP 200 |
| C10 | Missing fields degrade honestly | Brief omitting the rate | Field marked "not found", not fabricated |
| C11 | Model failure never 500s | Force an API error | Falls back, page stays usable |
| C12 | Extraction is never silently faked | Inspect the response | Response states which extractor ran |
| C13 | The API key never reaches the browser | Scan production bundle | Zero matches |
| C14 | Anonymous writes to `core_outputs` are controlled | Attempt write with anon key | Behaves per the documented policy |

## 🏗 Architecture — Frontend, backend, database, data flow

```
Browser (/core)
  │  paste brief, submit
  ▼
POST /api/core/extract        ← Route Handler, server-only
  │
  ├─ ANTHROPIC_API_KEY set? ──── yes ──▶ Claude ──▶ structured JSON
  │                                        │
  │                                    (error/timeout)
  │                                        ▼
  └─ no ──────────────────────────▶ deterministic extractor
                                           │
                                           ▼
                                    validate + normalize
                                           │
                                           ▼
                              { fields, extractor: "model" | "heuristic" }
  │
  ▼
Output card  ──[Save]──▶  POST /api/core/save  ──▶  Supabase core_outputs
                                                          │
                                                          ▼
                                              saved-outputs preview list
```

**Why an API route rather than a Server Action or client call:** the model key
must never reach the browser. A Route Handler keeps the key server-side, gives
one place to enforce the fallback contract, and makes the endpoint testable with
`curl` — which is how the three required test runs will be evidenced.

**The fallback contract is the same one proven in Week 0**, with one correction
learned there: the response explicitly reports *which* extractor produced it.
Week 0's fallback was invisible, and a silently-degraded production deploy went
unnoticed for six deployments. This one is observable by design.

### Data model — `core_outputs`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `raw_input` | `text` | The original brief, kept for auditability |
| `project_name` | `text` | |
| `client` | `text` | |
| `hourly_rate` | `numeric(8,2)` | Nullable — absent is a valid outcome |
| `hours_logged` | `numeric(6,2)` | Nullable |
| `deadline` | `date` | Nullable |
| `status` | `text` | CHECK-constrained to the same four values as `projects` |
| `confidence_note` | `text` | What the extractor was unsure about |
| `extractor` | `text` | `model` or `heuristic` — provenance, not decoration |
| `created_at` | `timestamptz` | |

Nullable extraction fields are deliberate: a brief that omits the rate should
produce a row saying so, not a fabricated number.

## 🧰 Tech Stack

| Layer | Choice | Why, and what was rejected |
|---|---|---|
| Model | **Claude (Anthropic API)** | Structured extraction from messy prose is exactly the task. *Rejected: regex-only* — brittle on real language, and "generative" implies generation |
| Fallback | **Deterministic extractor** | Guarantees the page works with no key, no credit, and no network. *Rejected: erroring out* — an unconfigured deploy would score zero |
| API layer | **Next.js Route Handler** | Keeps the key server-side; `curl`-testable. *Rejected: Server Action* — harder to evidence in a test log |
| Database | **Supabase Postgres** | Already provisioned in Week 0; `core_outputs` is a second table, not a second system |
| Frontend | **Next.js 16 + Tailwind v4** | Unchanged from Week 0; the core reuses the existing design tokens |
| Hosting | **Vercel** | Existing pipeline; every push auto-deploys |

Net new third-party dependencies: **one** (`@anthropic-ai/sdk`).

## ⚙️ DevOps

- **GitHub:** same repository, `main` branch, auto-deploying.
- **Vercel:** existing project. One new environment variable, `ANTHROPIC_API_KEY`, **without** the `NEXT_PUBLIC_` prefix — it must never be inlined into client JavaScript.
- **Supabase:** `core_outputs` added via a re-runnable migration in `supabase/`, alongside the Week 0 schema.
- **Deployment plan:** build and verify locally against the heuristic extractor, deploy, add the model key, redeploy **with build cache disabled**, then verify the extractor field reports `model`.

> The redeploy-without-cache step is written into the plan because skipping it is
> exactly what caused Week 0's production database to sit unused for six
> deployments.

## 🧪 Test Plan

Three required test runs, plus resilience and security checks:

| # | Test | Method | Expected |
|---|---|---|---|
| 1 | Clean brief | Submit a brief containing all seven fields | All fields populated and correct |
| 2 | Messy brief | Submit conversational text with an implied date and an odd money format | Fields normalized; date ISO; rate numeric |
| 3 | Incomplete brief | Submit a brief with no rate and no deadline | Those fields null and flagged; the rest correct |
| 4 | No model key | Unset `ANTHROPIC_API_KEY`, resubmit | Valid output, `extractor: "heuristic"`, HTTP 200 |
| 5 | Model failure | Supply an invalid key | Falls back, no 500 |
| 6 | Persistence | Save, then re-query the table | Row matches the card |
| 7 | Key exposure | Scan production HTML and client chunks | Zero matches |

## 🤖 Coding Agent Prompt

> Build a `/core` page for the existing ServicePro Next.js 16 app. It takes an
> unstructured freelance project brief pasted into a textarea and extracts seven
> structured fields — project name, client, hourly rate, hours logged, deadline,
> status, and a confidence note — rendering them in an output card styled to
> match the existing dashboard's design tokens. Extraction runs server-side in a
> Route Handler that calls the Anthropic API when `ANTHROPIC_API_KEY` is present
> and falls back to a deterministic extractor otherwise; the response must state
> which extractor ran. A save button persists the result to a Supabase
> `core_outputs` table, and previously saved outputs are listed on the page.
> Reuse the null-safe client pattern from Week 0 so the app builds and deploys
> with no keys configured. Document the exact model prompt in `docs/` as a
> versioned prompt-library entry.
