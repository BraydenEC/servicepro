# 🧠 Build Discipline Packet — Week 2: Research + Benchmarking Dashboard

**Gate 1 artifact. Written and committed before any Week 2 code was produced.**
**Module:** ServicePro Research — evidence, competitors, benchmarks, and gaps
**Live page:** `/research`

---

## 🧩 Problem — What user problem is this feature solving?

The first two weeks built a product on an assumption: that freelancers lose money and miss
deadlines because their project, time, and invoice data lives in three disconnected places.

**Nobody has checked whether that is true.**

That is a real problem, and it is the user's problem before it is the builder's. A freelancer
considering ServicePro has no way to know whether it addresses a genuine gap or duplicates
something Harvest already does for $12 a month. Neither does the person building it.

There is a sharper version specific to this market. A Mexican freelancer cannot settle a client
invoice with a PDF — Mexican tax law requires an electronic invoice (CFDI) issued through the
SAT. If the global tools do not do that, then a Mexican freelancer using one is *already*
running two systems, and the fragmentation ServicePro claims to solve is worse here than the
product's own framing assumes.

This module exists to test the premise instead of assuming it — including the possibility that
the premise is wrong.

## 👤 User — Who will use it?

Two audiences, deliberately:

1. **The builder**, deciding whether to keep going and where to aim. A research page that only
   confirms the plan is worthless.
2. **A prospective user or evaluator** asking the reasonable question: *why does this exist when
   Harvest, Bonsai, and FreshBooks already do?* The page has to answer that with evidence
   somebody else can check.

## 🎯 Success — What must work by the end of the week?

`/research` loads in production and:

1. Presents **5 global benchmark examples**, each with a source and the date it was checked
2. Presents **Mexico-specific localization** — the CFDI/SAT requirement and what it implies
3. Lists **at least 8 competitors and substitutes**, with substitutes weighted equally
4. Filters and searches that list **client-side, instantly**
5. Plots risks on a **likelihood × impact map**, including risks to this project's own thesis
6. Accepts a research note through an **intake form** and saves a structured record to Supabase
7. Surfaces a **research summary widget** on the dashboard
8. Marks every claim as verified, reported, or estimated — **an unsourced claim is visibly
   unsourced**

## 🖼 UX Concept

Wireframe: `wireframe.svg` — a single scrolling page. Header states the claim being tested;
benchmark cards; a Mexico panel; the filterable competitor table; the risk map; saved records.

**Implementation note (planned):** this page reuses the Week 0 dashboard's visual language, but
it is a *document* rather than an instrument panel — longer prose blocks, wider measure, and one
new element type: a verification badge on every factual row. Divergences from the wireframe will
be recorded after the build.

## ✂️ Scope Cut — What looked nice but will not be built this week?

| Cut | Why |
|---|---|
| Live competitor pricing via API | No such API exists across these vendors; scraping breaks silently and would produce exactly the fake-confidence this module exists to prevent |
| Automated re-verification of sources | A `verified_on` date the reader can judge is more honest than a freshness check that quietly fails |
| Charts beyond the risk map | A bar chart of competitor pricing adds decoration, not argument |
| Editing or deleting saved research records | Read and create only, consistent with Weeks 0–1 |
| Multi-user research collaboration | Still single-user |
| Full survey of freelancers | Out of scope at this size. One real conversation, honestly reported, beats a survey with n=4 |
| Auto-generated competitor entries from a model | **Deliberately rejected.** The model can structure a note I supply; it will not invent market facts |

## 🧱 Product Spec — Feature requirements and acceptance criteria

### Requirements

- **R1** — `/research` renders 5 global benchmark cards, each with source and verification date.
- **R2** — A Mexico localization section states the CFDI/SAT requirement and its consequence.
- **R3** — A table lists ≥8 competitors and substitutes with category, region, pricing, and verification status.
- **R4** — The table filters by category and region and searches by free text, client-side.
- **R5** — A risk map plots risks by likelihood and impact.
- **R6** — An intake form converts a research note into a structured record.
- **R7** — Records save to a Supabase `research_records` table.
- **R8** — The dashboard shows a research summary widget.
- **R9** — Every factual row displays its confidence level; unsourced claims render as unverified.

### Acceptance criteria — each testable, with an explicit pass condition

| # | Criterion | Method | Pass condition |
|---|---|---|---|
| C1 | `/research` loads in production | Request the live URL | HTTP 200 |
| C2 | Five global benchmarks render | Count the cards | Exactly 5, each with a source link |
| C3 | Eight or more competitors listed | Count table rows | ≥ 8 |
| C4 | Substitutes are represented | Filter by category | At least 3 substitutes, not only funded products |
| C5 | Filter narrows results | Select a category | Only matching rows remain; count updates |
| C6 | Search matches name and description | Type a partial term | Matching rows only, case-insensitive |
| C7 | Filter + search compose | Apply both | Result is the intersection, not the union |
| C8 | Empty result is handled | Search for nonsense | Explanatory empty state, not a blank table |
| C9 | Filtering requires no page reload | Watch the network tab | Zero requests on filter |
| C10 | Every row shows verification status | Inspect each row | No row lacks a confidence indicator |
| C11 | Unsourced claims are visibly marked | Inspect a row with no source | Rendered as unverified, not as fact |
| C12 | Sources are real and reachable | Follow each link | Resolves to the cited page |
| C13 | Risk map plots every risk | Count plotted items | Matches the risk list length |
| C14 | Intake rejects empty input | Submit blank | Validation error, no write |
| C15 | Save persists | Save, re-query the table | Row present with matching fields |
| C16 | Saved records display | Reload `/research` | The record appears |
| C17 | Dashboard widget renders | Load `/` | Widget present, links to `/research` |
| C18 | Page works with no database | Unset credentials | HTTP 200, seeded content, no crash |
| C19 | Page works with no model key | Unset the key | Intake falls back and says so |

## 🏗 Architecture — Frontend, backend, database, data flow

```
/research  (Server Component)
   │
   ├── curated seed data (in-repo, version-controlled, each entry sourced)
   │        └── benchmarks · competitors · substitutes · risks
   │
   ├── getResearchRecords()  ──▶ Supabase research_records
   │                                (null-safe; empty list on failure, never a crash)
   ▼
 renders
   ├── BenchmarkCards        server
   ├── MexicoPanel           server
   ├── CompetitorTable       CLIENT  ← filter/search state
   ├── RiskMap               server
   ├── ResearchIntake        client → POST /api/research/extract → Claude ─┐
   └── SavedRecords          server                                        │
                                              fallback to heuristic ◀──────┘
                                                        │
                                        POST /api/research/save ──▶ Supabase
```

**The one architectural first:** `CompetitorTable` is this project's first Client Component.
Filtering must be instant, so it holds state in the browser and receives server-fetched data as
props. The page itself stays a Server Component; only the table is a client island. Weeks 0 and 1
were entirely server-rendered.

**Why seed data lives in the repo rather than only in the database:** the research *is* the
deliverable. Putting it in version control means every claim has a commit history, the page is
never empty for a grader, and changing a competitor's pricing shows up as a reviewable diff.
Supabase holds records created through the intake form, which is what the assignment requires
persistence for.

### Data model — `research_records`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `raw_input` | text | Original note, kept for auditability |
| `title` | text | |
| `category` | text | CHECK: competitor, substitute, benchmark, risk, insight |
| `region` | text | CHECK: global, mexico |
| `summary` | text | |
| `source_url` | text **nullable** | **NULL means unverified and renders as such** |
| `verified_on` | date nullable | |
| `confidence` | text | CHECK: verified, reported, estimated |
| `extractor` | text | model or heuristic |
| `prompt_version` | text | |
| `created_at` | timestamptz | |

`source_url` is deliberately nullable. The schema makes an unsourced claim **representable but
visible**, rather than impossible (which would push people to invent citations) or invisible
(which is how fabrication survives).

## 🧰 Tech Stack

| Layer | Choice | Why, and what was rejected |
|---|---|---|
| Research verification | **WebSearch + WebFetch against primary sources** | Pricing is fetched from each vendor's own page and dated. *Rejected: writing from model memory* — the training cutoff predates this assignment, so every figure would be stale and confident, which is this week's specific failure mode |
| Filtering | **Client Component, `useMemo`** | Instant, no round trip, works on a dataset this size. *Rejected: server-side filtering* — a network round trip per keystroke for ~12 rows |
| Risk map | **CSS grid + inline SVG** | *Rejected: Recharts or Chart.js* — a dependency and a bundle for one 3×3 grid |
| Intake extraction | **Reuse Week 1's extractor + fallback** | The module compounds instead of sitting beside the last one. Net new dependencies: zero |
| Seed data | **TypeScript module in-repo** | Version-controlled, diffable, typed |
| Database | **Supabase Postgres** | Third table in the existing project |
| Frontend / Hosting | **Next.js 16 + Tailwind v4 on Vercel** | Unchanged |

**Net new third-party dependencies: zero.**

## ⚙️ DevOps

- **GitHub:** same repository and branch, auto-deploying.
- **Vercel:** existing project. **No new environment variables** — `/research` uses the Supabase and Anthropic keys already configured.
- **Supabase:** `research_records` added as a re-runnable migration alongside `schema.sql` and `core_outputs.sql`.
- **Deployment plan:** deploy at Phase 3, as soon as the page renders seeded content — before the database or intake work. Then, after any environment-dependent change, **verify production reports the expected path before assuming it works.**

> That last step is written in because the previous two weeks both shipped a production site
> that looked correct while running the wrong code path — Week 0 for six deployments, Week 1 for
> several days. No new variables are needed this week, which removes the specific trap, but the
> verification step stays.

## 🧪 Test Plan

**1 real human validation conversation + 3 software tests** are required. Planned:

| # | Test | Method | Expected |
|---|---|---|---|
| 1 | Filter and search compose correctly | Apply a category filter and a search term together | Intersection, correct count, no reload |
| 2 | Every claim carries verification status | Inspect all rows and cards | No unmarked claim; unsourced entries visibly flagged |
| 3 | Sources resolve | Request every cited URL | All return 200 |
| 4 | Save round trip | Submit intake, re-query Supabase | Row persisted, provenance recorded |
| 5 | Degrades without database or model key | Unset each | HTTP 200, seeded content, fallback stated |
| **6** | **Human validation conversation** | One freelancer, open non-leading questions | Recorded verbatim, **including anything that contradicts the thesis** |

**Test 3 is the one that matters this week.** It is the only automated check that can catch a
fabricated citation: a URL that does not resolve is a source that does not exist.

**Test 6 cannot be automated, simulated, or drafted.** A conversation that confirms every
assumption is usually evidence of leading questions, so the template records disconfirming
evidence as a required field rather than an optional one.

## 🤖 Coding Agent Prompt

> Build a `/research` page for the existing ServicePro Next.js 16 app. It presents market research
> as evidence: five global benchmark cards, a Mexico localization section covering the CFDI/SAT
> invoicing requirement, and a table of at least eight competitors and substitutes with
> client-side filter and search. Add a likelihood × impact risk map rendered with CSS grid and
> inline SVG — no chart library. Include an intake form that converts a research note into a
> structured record via the Week 1 extractor, with the same deterministic fallback, saving to a
> new Supabase `research_records` table. Add a summary widget to the dashboard.
>
> Every factual claim must carry a source URL and the date it was checked, and must render its
> confidence level; `source_url` is nullable so an unsourced claim is visibly unsourced rather
> than silently presented as fact. Do not generate market figures from memory — verify each one
> against a primary source and cite it, or mark it unverified. Reuse the existing null-safe
> Supabase client so the page builds and renders with no credentials configured.
