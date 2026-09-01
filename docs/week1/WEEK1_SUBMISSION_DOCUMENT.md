# Week 1: Generative Core Agent — Submission Packet

**Student:** Brayden Credeur **Course:** Negocios Inteligentes **Project:** ServicePro Core — client brief to structured project record **Date:** August 2026

---

## Required Links

| Item | Link |
|---|---|
| Live URL (`/core`) | https://servicepro-orpin.vercel.app/core |
| Dashboard | https://servicepro-orpin.vercel.app |
| GitHub Repository | https://github.com/BraydenEC/servicepro |
| Demo Video | ⬅️ PASTE YOUR VIDEO LINK HERE |

---

# Build Discipline Packet

*Completed and committed before any Week 1 code was written (Gate 1).*

## Problem — What user problem is this feature solving?

Week 0 built a dashboard that answers *how much am I owed* and *what is due next*. It has a hole: someone has to put the data in.

Freelance project details never arrive as structured records. They arrive as prose — a client email, a Slack message, notes from a call:

> "Hi — following up on the redesign we discussed. Need it done by Nov 14. We agreed $85/hr, I've tracked about 22 hours so far. — Dana, Northwind Co"

Every field the dashboard needs is in there. Extracting it means reading the message, deciding what matters, and retyping seven fields. It takes two minutes and it is pure transcription — so it gets deferred, and the dashboard sits empty while the information rots in an inbox.

This is the actual failure mode of the Week 0 product. A tracker nobody populates is worse than a spreadsheet, because at least the spreadsheet was already open.

## User — Who will use it?

Independent contractors, freelance developers, designers, and consultants — specifically at the moment after a client agrees to work and before the project exists anywhere but an inbox.

## Success — What must work by the end of the week?

`/core` must load in production and perform the full loop: accept an unstructured brief, extract structured fields into an output card, save to the Supabase `core_outputs` table, display saved outputs, and degrade to a deterministic extractor when no model key is configured so the page never fails.

**Result: achieved.** All five verified end to end. The live endpoint returns `extractor: "model"`, and `core_outputs` holds four saved records.

## UX Concept

A wireframe was produced during planning, before any code was written: a two-column layout with intake on the left, the structured output card on the right, and saved outputs beneath.

*(Insert wireframe here)*

**Implementation note:** the output card mirrors the Week 0 dashboard's visual language exactly — same surfaces, same hairlines, same status badges — because the extracted record *is* a dashboard row. Making the card look like a preview of its destination, rather than a generic result panel, is the design idea.

Two deliberate divergences were made from the wireframe:

1. **An extractor badge was added** — not in the wireframe. It states whether Claude or pattern matching produced the result. Added because Week 0 proved an invisible fallback can hide a broken deployment for weeks.
2. **A dashboard preview panel was added** — the wireframe showed saved outputs only on `/core`. The specification lists "Dashboard preview" as a separate required feature, and the core module should feed the product rather than sit beside it.

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

Each was cut deliberately. Nothing in the interface hints at these features, so nothing looks broken by their absence.

## Product Spec — Feature requirements and acceptance criteria

**Requirements**

- `/core` renders an intake form accepting free-form text.
- Submitting extracts seven fields: project name, client, hourly rate, hours logged, deadline, status, and a confidence note.
- Results render in a structured output card styled as a dashboard-row preview.
- A save button persists the output to `core_outputs`.
- Previously saved outputs are listed on the page and previewed on the dashboard.
- With no model key configured, a deterministic extractor produces valid output rather than an error.
- The exact model prompt is documented in `/docs` as a versioned prompt-library entry.

**Acceptance criteria (14 total, each with a verification method and explicit pass condition)**

| # | Criterion | Pass condition | Result |
|---|---|---|---|
| C1 | `/core` loads in production | HTTP 200 | PASS |
| C2 | Empty submission is rejected | Validation error, no API call | PASS |
| C3 | A realistic brief extracts all seven fields | Every field populated | PASS |
| C4 | Dates normalize to ISO | "Nov 14" stored as 2026-11-14 | PASS |
| C5 | Money parses regardless of format | "$85/hr", "85 an hour" both yield 85 | PASS |
| C6 | Value is computed, never invented | Exactly equals hours × rate | PASS |
| C7 | Save persists | Row present on re-query | PASS (HTTP 201) |
| C8 | Saved outputs display | Record appears after reload | PASS |
| C9 | Works with no model key | Valid structured output, HTTP 200 | PASS |
| C10 | Missing fields degrade honestly | Marked null, not fabricated | PASS |
| C11 | Model failure never returns 500 | Falls back, page stays usable | PASS |
| C12 | Extraction is never silently faked | Response states which extractor ran | PASS |
| C13 | The API key never reaches the browser | Zero matches in production bundle | PASS |
| C14 | Writes to `core_outputs` are controlled | Behaves per documented policy | PASS |

## Architecture — Frontend, backend, database, data flow

**Frontend:** Next.js 16 (App Router) with Tailwind CSS v4, deployed on Vercel. **Backend:** Two Next.js Route Handlers, server-only. **Database:** Supabase Postgres, one `core_outputs` table.

**Data flow:** A brief pasted into `/core` is posted to `/api/core/extract`. The handler validates length and content, then calls Claude with the versioned prompt and today's date injected. The response is parsed against a zod schema. If the key is absent, the model errors, or the response fails validation, a deterministic regex extractor runs instead. Either way the response includes an `extractor` field naming which path produced it. Saving posts the record to `/api/core/save`, which inserts into `core_outputs`. Saved records render both on `/core` and in a preview panel on the dashboard.

**Failure handling:** Four failure modes — missing key, model error, timeout, and invalid JSON — all converge on the deterministic extractor. The page therefore has exactly one degraded state, and unlike Week 0 it announces itself: in the API response, in a UI badge, and in the saved database row.

**Why a Route Handler rather than a Server Action or client call:** the model key must never reach the browser. A Route Handler keeps it server-side, gives one place to enforce the fallback contract, and makes the endpoint testable with `curl` — which is how the required test runs were evidenced.

**Data model:** `core_outputs` stores the original brief alongside the extracted fields, so any record can be audited against its source. Every extraction field is nullable by design: a brief that omits the rate must produce a row saying so, not a fabricated number. `status` is CHECK-constrained to the same four values as the Week 0 `projects` table. Two provenance columns, `extractor` and `prompt_version`, are persisted on every row so results remain attributable when the prompt changes.

## Tech Stack

| Layer | Choice | Why this, and what was rejected |
|---|---|---|
| Model | Claude (Anthropic API), effort `low` | Structured extraction from messy prose is exactly the task. *Rejected: regex-only* — brittle on real language. *Rejected: higher effort* — already ~7s, and more would hurt a form a user waits on |
| Fallback | Deterministic regex extractor | Guarantees the page works with no key, no credit, and no network. *Rejected: erroring out* — an unconfigured deploy would score zero |
| Validation | zod | One schema validates the model's JSON, the API request, and the save payload. *Rejected: hand-written type guards* — three places to drift |
| API layer | Next.js Route Handler | Keeps the key server-side; `curl`-testable. *Rejected: Server Action* — harder to evidence in a test log |
| Prompt storage | Versioned constant in `lib/core/prompt.ts` | The version string is persisted with each row. *Rejected: inline string in the route* — unversionable and untestable |
| Database | Supabase Postgres | Already provisioned in Week 0; `core_outputs` is a second table, not a second system |
| Frontend | Next.js 16 + Tailwind v4 | Unchanged from Week 0; the core reuses the existing design tokens |
| Hosting | Vercel | Existing pipeline; every push auto-deploys |

Net new third-party dependencies: **one** (`@anthropic-ai/sdk`).

## DevOps — GitHub, Vercel, Supabase, env variables, deployment plan

**GitHub:** github.com/BraydenEC/servicepro — **25 commits** on `main`. **Vercel:** connected to the repository; every push to `main` triggers an automatic deployment. **10+ successful deployments.** **Supabase:** `core_outputs` added via a re-runnable migration in `supabase/core_outputs.sql`, alongside the Week 0 schema. **Environment variables:** one new variable, `ANTHROPIC_API_KEY`, stored in the Vercel dashboard across all three environments and never committed.

**A note on key safety:** `ANTHROPIC_API_KEY` deliberately carries **no** `NEXT_PUBLIC_` prefix. It is read only by `lib/core/extract.ts`, which is imported solely by a Route Handler, so Next.js never inlines it into client JavaScript. Adding the prefix would ship a billable API key to every visitor.

**Deployment plan:** build and verify locally against the heuristic extractor, deploy, add the model key, redeploy **with build cache disabled**, then verify the response reports `model`. The redeploy-without-cache step was written into the plan because skipping it is exactly what left Week 0's production database unused for six deployments — and, as recorded below, it was needed again.

## Test Plan — How will you verify it works?

Ten tests were executed and documented with raw output. The three required runs were each executed against **both** extraction paths, so the two can be compared directly. Summary:

| # | Test | Result |
|---|---|---|
| 1 | Clean brief, all fields present | PASS — both paths resolve "Nov 14" forward to 2026-11-14 |
| 2 | Messy brief, relative date, odd money format | PASS — model resolves "end of next month" to 2026-09-30; regex returns null |
| 3 | Incomplete brief, must refuse to invent | PASS — both paths return null for every absent field and name them |
| 4 | Empty / malformed / oversized input | PASS — HTTP 400 with field-level issues |
| 5 | No API key configured | PASS — HTTP 200, valid output, reason stated |
| 6 | Build and deploy with no key | PASS — succeeded, served for several deployments |
| 7 | Save round trip | PASS — HTTP 201, row present in `core_outputs` |
| 8 | Dashboard preview renders saved records | PASS — value computed correctly ($95 × 31 = $2,945.00) |
| 9 | No credentials in production bundle | PASS — 0 matches |
| 10 | Production runs the model | PASS after remediation — see Iteration Log |

**The decisive test was #2.** Pattern matching handles rates, hours, and absolute dates competently — it is not a stub. It fails on what language does casually. "End of next month" is unreachable by regex; the model resolved it to `2026-09-30` against the injected current date, and explained itself: *"Deadline was inferred from 'end of next month' relative to today (2026-08-27)."*

**The most important test was #3.** The incomplete brief mentions "next week" and discusses pricing, giving a careless extractor two openings to fabricate a rate or a date. Both paths returned null for every absent field. A confidently wrong record is the one outcome this module exists to prevent.

**Measured latency:** heuristic under 1 ms; model approximately 7.3 seconds. This was recorded because the original design assumed roughly one second — the estimate was wrong and is corrected rather than left standing.

## Coding Agent Prompt

Six prompts were logged. The prompt that produced the module:

> "Build a `/core` page for the existing ServicePro Next.js 16 app. It takes an unstructured freelance project brief pasted into a textarea and extracts seven structured fields — project name, client, hourly rate, hours logged, deadline, status, and a confidence note — rendering them in an output card styled to match the existing dashboard's design tokens. Extraction runs server-side in a Route Handler that calls the Anthropic API when `ANTHROPIC_API_KEY` is present and falls back to a deterministic extractor otherwise; the response must state which extractor ran. A save button persists the result to a Supabase `core_outputs` table, and previously saved outputs are listed on the page. Reuse the null-safe client pattern from Week 0 so the app builds and deploys with no keys configured. Document the exact model prompt in `docs/` as a versioned prompt-library entry."

The most valuable prompt, however, was an audit rather than a build instruction: *"please read these documents and create an outline for what there is to work on."* It produced no code and found the most consequential problem of the week — that production was not running the generative core at all. Across both weeks, audit prompts have found every serious defect in this project.

---

# Weekly Submission Evidence

| Item | Required | Delivered |
|---|---|---|
| Live URL | Working deployed page | ✅ https://servicepro-orpin.vercel.app/core |
| Build Discipline Packet | Complete before coding | ✅ Committed before any Week 1 code |
| UX mockup | Image-generated concept or wireframe | ✅ Plus a documented implementation note |
| Product spec | Requirements + acceptance criteria | ✅ 14 testable criteria |
| Architecture sketch | Data flow and components | ✅ 3 diagrams |
| GitHub commits | Minimum 5 | ✅ **25** |
| Vercel deployments | Minimum 2 | ✅ **10+** |
| Supabase evidence | Table/data evidence | ✅ 4 records in `core_outputs` |
| Prompt log | Minimum 5 | ✅ **6** |
| Test evidence | Minimum 3 | ✅ **10** |
| Iteration log | What changed after testing | ✅ **8 entries** |
| Demo video | 2–3 minutes | ⬅️ TO BE ADDED |
| Human Decision Note | 150–250 words | ⬅️ TO BE WRITTEN BELOW |

**Build gates:** Gate 1 (Plan) ✅ packet committed before code · Gate 2 (Build) ✅ code, commits, deploys · Gate 3 (Test) ✅ tests documented, bug fixed, redeploy completed · Gate 4 (Explain) — demo and decision note below.

---

# Iteration Log — Selected Entries

Eight iterations were recorded. The five most significant:

## 1. Bare month-day dates resolved into the past

"Nov 14" with no year parsed to the current year. Run in December, that yields a deadline eleven months gone — and since the dashboard marks past deadlines overdue, every project created from a bare date would arrive already overdue. Changed so dates without a year resolve forward. Both extractors follow the rule; the model receives today's date so it can apply the same logic.

## 2. Project names swallowed prepositions (the Gate 3 bug fix)

The reference brief extracted `"Up On The Redesign"`. The extractor captured up to three words before the project noun, so "following **up on the** redesign" was taken whole. A stopword trim now strips leading articles and prepositions, and the same brief yields `"Redesign"`. The test was re-run, the fix committed, and the site redeployed.

## 3. Model latency was assumed rather than measured

The prompt library documented "approximately one second." Measured end-to-end latency is approximately 7.3 seconds — thinking is enabled by default on this model, and low effort reduces rather than removes it. The claim was corrected in place across two documents rather than quietly edited, and the tradeoff stated: seven seconds to replace roughly two minutes of manual transcription is acceptable, and the form shows an explicit "Extracting…" state.

## 4. Production was not running the generative core

Querying the live API — rather than trusting that deployment implied configuration — returned `extractor: "heuristic"` with the reason *"No ANTHROPIC_API_KEY configured on the server."* The entire point of Week 1 was inactive on the graded URL. The key worked locally and was never added to Vercel. The page looked completely correct, because the fallback is a real extractor producing real structured output.

This is Week 0's failure repeating exactly. That week, production served mock data for six deployments while looking perfect. Same root cause: correct code, unconfigured environment. Same reason it was catchable: the response states which path produced it.

The key was added across all three Vercel environments and the site redeployed with build cache disabled. Verified afterward with the same brief: `deadline` moved from `null` to `2026-09-30`, `client` from `"Kestrel Digital. We"` to `"Kestrel Digital"`, and response time from 0.57s to 3.44s.

**The lesson, now twice over: a deploy is not a configuration.** Pushing code and having it run as intended are separate events, and only the second one is worth anything.

## 5. A required feature had been read as satisfied when it was not

"Dashboard preview" was assumed covered by the saved-outputs list on `/core`. Re-reading the specification against the actual routes showed that `app/page.tsx` never referenced the core module at all. A preview panel was built and added to the dashboard, so saved extractions feed the product rather than sitting beside it.

Two details came out of building it. The empty state is load-bearing — the panel is empty until the first save, so it must read as "nothing here yet" and say what to do, not as breakage. And the dashboard's two data reads now run concurrently, so the core query does not add its latency to every dashboard render.

---

# Human Decision Note

⬅️ **WRITE YOUR NOTE HERE** — 150–250 words covering decisions, rejections, and corrections.

---

# Screenshots

1. Supabase Table Editor — `core_outputs` showing saved records with the `extractor` and `prompt_version` columns
2. `/core` before extraction — empty intake form
3. `/core` after extraction — output card with the **Claude** badge visible
4. Dashboard — "Recent extractions" preview panel
5. Vercel — Deployments list
6. GitHub — commit history (25 commits)
7. Architecture diagram — data flow with every fallback branch
