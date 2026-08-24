# 🗺️ Week 1 — What's Left

**Audited against the live site, the live database, and the repo — not assumed.**
Live `/core`: https://servicepro-orpin.vercel.app/core (HTTP 200 ✅)

---

## ✅ Already done

| Required feature | Status |
|---|---|
| `/core` page live | ✅ HTTP 200 |
| Intake form | ✅ `CoreWorkbench.tsx` |
| Core extraction output card | ✅ structured renderer, 6 fields |
| Save button | ✅ `POST /api/core/save` |
| Supabase table `core_outputs` | ✅ **migration has been run** — table exists |
| Prompt library entry | ✅ `PROMPT_LIBRARY.md` |
| 3 test runs | ✅ **6** (3 briefs × 2 extraction paths) |
| UX wireframe | ✅ `wireframe.svg` |
| Build Discipline Packet | ✅ committed **before** any code (Gate 1) |
| Commits | ✅ 19 total |
| Deployments | ✅ 8+ |

**Gate 1 (Plan)** ✅ · **Gate 2 (Build)** ✅ · **Gate 3 (Test)** ✅ bug found + fixed + redeployed

---

## 🔴 Blocking — must fix, ~10 min, needs you

### 1. `ANTHROPIC_API_KEY` is not in Vercel
The live API confirms it:
```
extractor: heuristic
reason:    "No ANTHROPIC_API_KEY configured on the server."
```
The generative core — the entire point of Week 1 — **is not running in production.**
It works locally; production is falling back to pattern matching.

**Fix:** Vercel → Settings → Environment Variables → add `ANTHROPIC_API_KEY`
(no `NEXT_PUBLIC_` prefix) → Deployments → ⋯ → Redeploy → **uncheck build cache**.

### 2. `core_outputs` has zero rows
```
content-range: */0
```
The table exists but nothing has been saved through it. "Supabase evidence" is
separately graded, and an empty table proves nothing.

**Fix:** after step 1, open `/core`, extract a brief, click **Save**. Do it 2–3
times so the saved list has something to show.

> These two are the same failure mode as Week 0, where production silently
> served mock data for six deployments. The pattern is consistent: the code is
> correct, the *environment* is not.

---

## 🟡 Gap in required features — I can build this

### 3. "Dashboard preview" is not on the dashboard
The spec lists **Dashboard preview** as a required feature. `SavedOutputs`
currently renders only on `/core`; `app/page.tsx` doesn't reference it at all.

**Work:** add a compact "Recent extractions" panel to the dashboard linking
through to `/core`. Small change — one server-side fetch plus a card.

---

## 📄 Missing Week 1 evidence documents — I can write these

| Document | Why it's needed |
|---|---|
| `ITERATION_LOG.md` | Explicitly required: *"what changed after testing"* |
| `PROMPT_LOG.md` | Minimum **5** coding prompts — Week 1 has its own |
| `ARCHITECTURE.md` | Required sketch: brief → API → model → schema → Supabase |
| `SUBMISSION.md` | Packet checklist + links |
| `DECISION_NOTE_MATERIAL.md` | Source material for your 150–250 word note |

Week 0 has all of these; Week 1 has none of them yet.

---

## 🔲 Only you can do these

- **Demo video** (2–3 min) — the strongest shot: paste a messy brief, watch
  Claude extract "end of next month" → `2026-09-30`, save it, show the row
  appear in Supabase
- **Human Decision Note** (150–250 words) — decisions, rejections, corrections
- **Screenshots** — `core_outputs` with rows, `/core` before/after extraction,
  Vercel deployments, GitHub commits
- **Assemble one PDF** and submit

---

## Suggested order

1. **You:** add the key to Vercel + redeploy *(unblocks everything)*
2. **You:** save 2–3 extractions so the table has data
3. **Me:** verify the live extractor flips to `model`
4. **Me:** build the dashboard preview
5. **Me:** write the five missing documents
6. **You:** screenshots → video → decision note → PDF

Steps 4 and 5 don't depend on 1–3, so say the word and I'll start on them now
while you handle Vercel.
