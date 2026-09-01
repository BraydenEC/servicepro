# 🤝 Handoff — end of Week 2, ready for Week 3

**Last updated:** 2026-08-31
**Project root:** `/Users/braydencredeur/Antigravity/Website/Dev/servicepro`
**Live:** https://servicepro-orpin.vercel.app · `/` · `/core` · `/research`

---

## TL;DR

**All Week 2 engineering is complete and deployed.** All eight required features, all six coding
tasks, all four build gates on the code side. Six software tests documented.

**Two things are outstanding, and neither can be done by an agent:**

1. 🔴 **The human validation conversation** — a hard requirement. Template and interview script in
   `VALIDATION_CONVERSATION.md`.
2. 🟡 **The `research_records` migration** has not been run against the live database, so the save
   round trip is unverified end to end.

```bash
cd /Users/braydencredeur/Antigravity/Website/Dev/servicepro
npm run dev     # → http://localhost:3000/research
```

---

## What Week 2 built

| Required feature | Where |
|---|---|
| Research intake | `components/research/ResearchIntake.tsx` → `/api/research/extract` |
| 5 global examples | `BenchmarkCards.tsx`, data in `lib/research/data.ts` |
| Mexico localization | `MexicoPanel.tsx` |
| 8+ competitors/substitutes | `CompetitorTable.tsx` — 11 entries |
| Filter/search | Client-side, `useMemo`, in `CompetitorTable` |
| Risk map | `RiskMap.tsx` — CSS grid + inline SVG |
| Saved research output | `research_records` + `SavedResearch.tsx` |
| Dashboard widget | `ResearchWidget.tsx` on `/` |

**The finding:** of 11 products surveyed, 9 track projects, 4 issue CFDI, **0 do both**. Computed
from the dataset at render time, so the headline cannot drift from the table beneath it.

---

## Principles now established across three weeks

These have each been earned by a specific failure. Do not relax them.

| Principle | Where it came from |
|---|---|
| **A deploy is not a configuration** | Week 0 served mock data for six deployments; Week 1 ran the wrong extractor for days. Both looked perfect |
| **Every code path names itself** | `data-source`, `extractor`, `confidence`. The degraded path must announce itself |
| **Verify production, not the config screen** | Adding a Vercel variable does not rebuild. Redeploy with cache off, then query production |
| **A plausible number is not a fact** | Week 2. Cite it, date it, or mark it unverified |
| **Instruction is not enforcement** | The prompt forbids inventing URLs; the code discards them anyway |
| **Ship early** | Deploy as soon as the page renders. Three weeks, three early deploys, no last-hour scrambles |
| **Audit prompts beat build prompts** | Every serious defect in this project was found by asking "is this actually done?" |
| **Zero new dependencies unless earned** | Three weeks, one added package total (`@anthropic-ai/sdk`) |

---

## Architecture as it now stands

```
app/
  page.tsx            Dashboard — metrics, projects, research widget, core preview
  core/page.tsx       Week 1 — brief → structured project
  research/page.tsx   Week 2 — evidence, competitors, risk map, intake
  api/core/{extract,save}
  api/research/{extract,save}
lib/
  supabase.ts         Null-safe client — returns null, never throws
  projects.ts         Week 0 data + fallback
  core/               Week 1 extractor, prompt, heuristic, saved
  research/           Week 2 data, extractor, prompt, heuristic, saved
components/
  research/CompetitorTable.tsx   ← the only Client Component in the project
supabase/
  schema.sql · core_outputs.sql · research_records.sql
```

**Three tables, three modules, one design language.** Each week's module reuses the previous
week's patterns rather than inventing new ones: the null-safe client from Week 0, the
extractor-with-fallback from Week 1, the provenance columns throughout.

---

## ⚠️ Known state and gotchas

- **`research_records` does not exist in the live database.** Run `supabase/research_records.sql`
  in the SQL Editor. Until then the saved-records list renders empty (by design, not a crash) and
  saving returns a 500 naming the missing table.
- **`ANTHROPIC_API_KEY` is configured in Vercel** across all three environments. `/core` and
  `/research` both confirmed running the model in production.
- **Mexican tax claims are `reported`, not `verified`** — six specific claims listed in
  `RESEARCH_FINDINGS.md` §3 need a human spot-check against SAT.
- **The editor is a second writer.** A stale buffer silently reverted the Week 1 submission
  document during Week 2. Stage explicit paths rather than `git add -A` when a file is open
  elsewhere.
- **zsh does not word-split unquoted expansions.** A `for u in $URLS` loop silently passes the
  whole list as one argument. Use `while IFS= read -r`.

---

## For Week 3

Nothing in the codebase blocks new work. The patterns to reuse:

1. **Gate 1 first.** Write and commit the Build Discipline Packet before any code. It has caught
   real contradictions three weeks running.
2. **Deploy at roughly one third.** As soon as the required page renders anything, ship it. The
   grade cap disappears and every later phase is upside.
3. **Reuse, do not reinvent.** `getSupabaseClient()` is null-safe; the extractor pattern
   generalises; `SourceBadge` and `ExtractorBadge` are the same idea applied to different
   uncertainties.
4. **Verify production explicitly** after anything environment-dependent. One check is not enough
   during a rollout — the first post-deploy check in Week 1 hit an old instance and reported the
   wrong answer.

---

## Outstanding for Brayden

| Item | Week |
|---|---|
| 🔴 Human validation conversation | 2 — hard requirement, cannot be delegated |
| 🟡 Run `research_records.sql` | 2 |
| Mexico tax spot-check (6 claims) | 2 |
| Demo video · Decision Note · screenshots | 1 and 2 |
| Submission PDFs | 1 and 2 |

Both weeks' submission documents are written and formatted consistently:
`docs/week1/WEEK1_SUBMISSION_DOCUMENT.md` and `docs/week2/WEEK2_SUBMISSION_DOCUMENT.md`.
