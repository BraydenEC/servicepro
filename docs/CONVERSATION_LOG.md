# 💬 Conversation Log — ServicePro Build Session

**Date:** August 17, 2026
**Participants:** Brayden Credeur · Claude Code (Opus 5)
**Course:** Negocios Inteligentes — Week 0, Setup Sprint: Builder Infrastructure

A narrative record of how this project was planned and built: what was asked,
what was decided, what was rejected, and what had to be corrected. Written to
support the Human Decision Note and the iteration log.

---

## Stage 1 — Planning, with codegen deliberately blocked

**Request:** Read the handoff document and plan the development. Explicit
constraint: *do not build anything yet.*

That constraint did the heavy lifting. Reading the three source documents
(`Brainstorm`, `Build_Discipline_Packet.md`, `Claude_Handoff_Document.md`) plus
the generated mockup against each other surfaced **seven contradictions** that
would otherwise have been discovered as bugs mid-build:

| # | Conflict | Resolution |
|---|---|---|
| 1 | Handoff §2.1 requires a 4-item sidebar; §4 forbids routing | Sidebar is presentational — inert `<span>`s, no dead links |
| 2 | Mockup shows 7 nav items and brands it "FreelanceIO" | Handoff wins: 4 items, "ServicePro" |
| 3 | Mockup dates hardcoded to Oct 2023 | Deadlines computed relative to today |
| 4 | `new Date()` / `Intl` differ server vs. client | Pin locale, inject `now`, format server-side |
| 5 | Missing env vars crash `createClient()` at **build** time | Null-safe factory; build must pass with no credentials |
| 6 | Anon key is public with no auth | RLS on, `SELECT`-only policy for `anon` |
| 7 | §2.2 hardcodes summary metrics while §3 fetches live rows | Derive metrics from whichever dataset is active |

**Outcome:** `Development_Plan.md` — architecture, data model, design tokens,
phased build.

**Decisions made here:** app lives at `Website/Dev/servicepro`; mock-data-first
build order; sidebar links inert and dimmed; git initialized with a commit per
phase.

---

## Stage 2 — Checking the plan against the actual assignment

**Request:** Read the assignment PDF and make sure the plan matches before coding.

This exposed a category error in the original plan. **The handoff document is a
coding spec; the assignment grades an evidence packet.** Seven required
deliverables appeared nowhere in the plan: 2+ deployments, a coding-agent prompt
log, an iteration log, a visual architecture sketch, Supabase data evidence, a
demo video, and a single assembled submission document.

### The change that mattered most
The original plan deployed **once, at the end**. The assignment states *"No live
deployment = maximum 5/10."* Concentrating the entire grade floor in the final
hour of work was the single biggest risk in the plan.

**Correction:** deployment moved to **Phase 4** — as soon as the mock UI is
presentable, before Supabase is touched. The grade floor gets secured early, and
the "minimum 2 deployments" requirement is satisfied naturally by the later
phases rather than manufactured.

### The trap that was nearly missed
The handoff's mock-data fallback is designed so the dashboard looks complete
*even when the database is empty*. That is genuinely good engineering — and a
grading liability, because "Supabase evidence" is scored separately. A dashboard
rendering perfectly off `mock-data.ts` earns **nothing** on that line.

**Rejected:** treating Supabase as an optional stretch goal.
**Adopted:** Supabase is mandatory; the fallback stays purely as resilience, and
becomes a talking point in the demo rather than the delivered state.

---

## Stage 3 — Checking against the point-weighted rubric

**Request:** Validate against the rubric, then begin Phase 1.

The rubric reframed priorities again:

> **4.5 of 10 points are planning documentation** (build discipline 1.5, UX 1.0,
> product spec 1.0, architecture 1.0) versus **2.0 for the working deployed
> product.**

Writing is worth more than double the application. Since the packet already
existed in draft, this was the cheapest available scoring in the project.

Three gaps were visible only in the rubric's precise wording — none of them
appear in the assignment PDF:

1. **"implementation note"** required under UX planning — no such artifact existed
2. acceptance criteria must be **"testable"** — the packet's "renders responsively
   without errors" is not a pass/fail assertion
3. **"stack table"** named explicitly — the packet had prose bullets

---

## Stage 4 — Phase 1: Scaffold

Scaffolded Next.js **16.3.1** / React **19.2.8** / Tailwind **v4**.

**Verified rather than assumed.** The plan required checking which Tailwind major
shipped, and it mattered: v4 is CSS-first, with **no `tailwind.config.ts` at
all** — theme tokens live in `@theme` inside `globals.css`. A v3-shaped
assumption would have produced a config file that silently did nothing.

Next 16 also ships an `AGENTS.md` warning that its conventions differ from model
training data. Consulting the bundled docs at `node_modules/next/dist/docs/`
confirmed three things later phases depend on: top-level `turbopack` config is
correct for v16, `export const dynamic` segment configs still apply while
`cacheComponents` is off, and Turbopack is now the default bundler.

**Two defects caught and fixed:**

- **`.gitignore` would have silently excluded `.env.example`.** The generated
  `.env*` pattern catches it. Added a `!.env.example` negation so the repository
  documents its own required configuration.
- **Turbopack inferred the wrong workspace root.** A stray `package-lock.json` in
  the home directory triggered a warning on every dev start — noise that would
  have appeared in the recorded demo. Pinned `turbopack.root`.

**Verified:** `npm run build` passes **with empty Supabase credentials** — the
guarantee that protects the deployment points.

---

## Stage 5 — Phases 2 & 3: Shell and dashboard

**Phase 2** replaced the default scaffolding with the ServicePro shell: semantic
design tokens (`surface`, `ink`, `hairline`, `accent` rather than raw palette
names), the sidebar, and the page header. The default `prefers-color-scheme`
block was removed outright rather than overridden — the scope cut excludes a
theme toggle, so there is one palette.

**Phase 3** built the dashboard on mock data. The mock figures were tuned so the
three **derived** metrics land exactly on the values named in the handoff:
`$3,450` unpaid · `$4,200` earned this month · `5` active. Confirmed by grepping
the rendered HTML rather than by eye.

### A bug caught by reading the build output
The build reported the route as `○ (Static)` — **prerendered at build time**,
which freezes `new Date()` into the HTML. Deployed, "in 3 days" would have
counted from the last deploy and drifted further wrong every day the site sat
unbuilt. The deadline column is the entire point of the table.

**Fix:** `export const dynamic = "force-dynamic"`. Build now reports `ƒ /`.
This is also what Phase 5 needs for Supabase edits to appear on refresh.

### Corrections during the build
- The IDE flagged `bg-gradient-to-b` as non-canonical; Tailwind v4 renamed it
  `bg-linear-to-b`. Exactly the version drift `AGENTS.md` warns about.
- An initial `git check-ignore -v` test reported `.env.example` as ignored when
  it wasn't — the command exits 0 on *any* pattern match, negations included.
  `git status` was the correct check.

---

## Running list of rejected approaches

Useful raw material for the Human Decision Note, which must cover tradeoffs:

| Rejected | Chosen instead | Why |
|---|---|---|
| Deploy once at the end | Deploy at Phase 4, three times total | 5/10 grade cap made late deployment the dominant risk |
| Supabase as optional stretch | Supabase mandatory | "Supabase evidence" is separately scored; mock renders too well to expose an empty DB |
| Hardcoded summary metrics (per handoff §2.2) | Derived from live data | Hardcoded cards would visibly contradict the table beneath them |
| `href="#"` sidebar links | Inert `<span>`s, dimmed | Dead links are worse than honest disabled state |
| Horizontally scrolling table on mobile | Stacked cards below `sm` | Mobile rendering is explicitly graded |
| Icon library dependency | Inline SVG | No dependency, no network request, inherits `currentColor` |
| Fighting the default light theme with overrides | Deleted the media query | Dark-only is a scope decision, not a default to override |
| Static prerender | `force-dynamic` | Frozen build-time dates would rot silently |

---

## Where things stand at the end of this session

**Done:** Phases 1–3. Six commits. Dashboard visually complete on mock data;
build and lint pass; all three metrics and all four status badges verified in
rendered output.

**Blocked on account creation (Brayden):** GitHub repo, Vercel project, Supabase
project — see `ACTION_ITEMS.md`.

**Next:** Phase 4 — the first deployment, which removes the 5/10 ceiling.
