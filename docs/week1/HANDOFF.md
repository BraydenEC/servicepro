# 🤝 Week 1 Handoff — Generative Core

**Updated:** end of Week 1 build · **Commits:** 21
**Live:** <https://servicepro-orpin.vercel.app/core>
**Repo:** <https://github.com/BraydenEC/servicepro>

Week 0's handoff is at `../HANDOFF.md` and still accurate for the dashboard.

---

## TL;DR

**All Week 1 engineering is complete.** Every required feature and coding task
is built, tested, and deployed. Gates 1–3 are cleared.

**Two things need the user, and one of them is blocking:**

1. 🔴 `ANTHROPIC_API_KEY` is **not in Vercel** — production runs the fallback
   extractor, not Claude
2. 🔲 Demo video + Decision Note (Gate 4)

**Do not invent new features.** The scope is fixed by the spec and the scope cut
is itself graded.

---

## ⚠️ Read before writing any code

Next.js 16, Tailwind v4 — conventions differ from training data. `AGENTS.md` in
the repo root says to consult `node_modules/next/dist/docs/`. Already verified:

| Question | Answer |
|---|---|
| Tailwind config file? | **None** — v4 is CSS-first, tokens in `@theme` in `globals.css` |
| Turbopack config? | Top-level `turbopack` in `next.config.ts` |
| `export const dynamic`? | Still valid — `cacheComponents` is off |
| Gradient utilities | `bg-linear-to-*`, **not** `bg-gradient-to-*` |

---

## What Week 1 added

```
app/
  core/page.tsx              /core — server component, fetches saved outputs
  api/core/extract/route.ts  POST — brief → structured record
  api/core/save/route.ts     POST — record → core_outputs
components/core/
  CoreWorkbench.tsx          intake form + output card (client component)
  ExtractorBadge.tsx         states which path produced a result
  SavedOutputs.tsx           full saved list, on /core
  CorePreview.tsx            compact preview, on the dashboard
lib/core/
  schema.ts                  zod — validates model output, request, save payload
  prompt.ts                  versioned prompt constant (v1.0.0)
  extract.ts                 model path + fallback orchestration
  heuristic.ts               deterministic regex extractor
  saved.ts                   reads core_outputs, never throws
supabase/core_outputs.sql    table + RLS + insert policy
docs/week1/                  8 documents, all graded evidence
```

### Verified working
- `/core` HTTP 200 live
- Model path: `extractor: "model"` locally
- Save round trip: HTTP 201, row in `core_outputs` with `extractor` + `prompt_version`
- Dashboard preview renders saved rows; value computes correctly ($95 × 31 = $2,945.00)
- Empty state renders as an invitation, not as breakage
- Build passes, lint clean

---

## 🚨 Design decisions — do not silently reverse

| Decision | Why |
|---|---|
| **Every response names its `extractor`** | Week 0 served mock data for 6 deployments because the fallback was invisible. Week 1 repeated it — production ran without the model. Every degraded path must announce itself. |
| **Missing API key is a supported state** | `/core` must work for a grader cloning the repo with no credentials. |
| **Regex extractor stays permanently** | It is the answer to "what if the API is down mid-demo." Not dead code. |
| **All extracted fields nullable** | A brief that omits a rate produces `null`, never a guess. A confident wrong record is the worst outcome. |
| **`extractor` + `prompt_version` persisted per row** | Rows stay attributable when the prompt changes. |
| **`ANTHROPIC_API_KEY` has no `NEXT_PUBLIC_` prefix** | The prefix would ship a billable key to every visitor. |
| **Bare dates resolve forward** | "Nov 14" without a year must not land in the past — every such project would arrive already overdue. |
| **`effort: "low"`** | ~7.3s measured. Higher effort would worsen a form the user waits on. |

---

## The one-command health check

Because the fallback is indistinguishable from the real thing by eye:

```bash
curl -s -X POST https://servicepro-orpin.vercel.app/api/core/extract \
  -H "Content-Type: application/json" \
  -d '{"brief":"Acme Co, \$50/hr, 10 hours, due Dec 1"}' | grep -o '"extractor":"[a-z]*"'
```

`"model"` = healthy. `"heuristic"` = the key is missing from Vercel, or the
build was cached. Adding env vars does **not** trigger a rebuild — redeploy with
build cache **off**.

Same check for Week 0's dashboard:
```bash
curl -s https://servicepro-orpin.vercel.app | grep -o 'data-source="[a-z]*"'
```

---

## Documents

| File | Contents |
|---|---|
| `BUILD_DISCIPLINE_PACKET.md` | Gate 1 — written before code |
| `ARCHITECTURE.md` | 3 Mermaid diagrams, data model, stack table |
| `PROMPT_LIBRARY.md` | The prompt, versioned, with design rationale |
| `TEST_EVIDENCE.md` | 6 test runs + validation + resilience |
| `ITERATION_LOG.md` | 8 entries — what changed after testing |
| `PROMPT_LOG.md` | 6 coding prompts |
| `SUBMISSION.md` | Packet checklist, links, video shot list |
| `DECISION_NOTE_MATERIAL.md` | Source material — **user writes the note** |
| `REMAINING_WORK.md` | The audit that found the production gap |

---

## If asked to keep working

There is no remaining engineering. The honest answer is that Gate 4 — demo and
decision note — cannot be done by an agent, and adding features would violate
the scope cut that the packet is graded on.

If something genuinely needs doing, it is verification: re-run the health check
above and confirm production still reports `model`.
