# 📚 Prompt Library

Versioned record of every prompt this application sends to a model.

The prompt itself lives in [`lib/core/prompt.ts`](../../lib/core/prompt.ts), not in
this file. Documentation that restates a prompt drifts from the one that
actually runs; this file explains and versions it, and source stays the single
source of truth.

Every saved row in `core_outputs` stores the `prompt_version` that produced it,
so any extraction can be traced back to the exact instructions behind it.

---

## `core-extraction` — v1.0.0

| | |
|---|---|
| **Purpose** | Convert an unstructured freelance brief into a structured project record |
| **Model** | `claude-opus-5` |
| **Effort** | `low` |
| **Max tokens** | 2000 |
| **Output** | Structured output via Zod schema (`CoreExtractionSchema`) |
| **Called from** | `lib/core/extract.ts` → `POST /api/core/extract` |
| **Fallback** | `lib/core/heuristic.ts` when no key is set or the call fails |

### Why these settings

**`claude-opus-5`** — extraction from genuinely messy human text is a
comprehension task, not a pattern-matching one. The failure this module exists
to prevent is a *plausible but wrong* number, and that is exactly where model
quality shows.

**`effort: "low"`** — the task is well-specified with a fixed output schema, so
deep reasoning buys little. Measured end-to-end latency at this setting is
**~7 seconds**, not the sub-second figure originally assumed when this was
written; thinking is on by default on Opus 5 and low effort reduces rather than
removes it. The form shows an explicit "Extracting…" state because of this.

Seven seconds is an acceptable trade for replacing roughly two minutes of
manual transcription, and correctness is what this module is graded on — but
the assumption was wrong and is corrected here rather than left standing.

**Structured outputs rather than free-text JSON** — the schema is enforced by
the API, so a malformed response is impossible rather than merely unlikely. The
same Zod schema is reused to validate the save payload, so the model path and
the heuristic path cannot drift apart.

**`max_tokens: 2000`** — the output is a small fixed record. Generous headroom
without paying for an unbounded response.

### Prompt design decisions

| Rule | Why it exists |
|---|---|
| "Extract only what is present… never estimate" | The core design decision of the module. A fabricated rate is worse than a missing one, because the user cannot tell which figures were read and which were invented |
| `TODAY` injected into the user turn | Relative dates ("end of month", "in two weeks") are unresolvable without it, and a model guessing at today's date silently produces wrong deadlines |
| Year-less dates resolve to the future | "Nov 14" in December means *next* November. Resolving backwards would mark every new project overdue on arrival |
| "Do not compute totals" | Value is `rate × hours`, computed in application code. Arithmetic delegated to a model is arithmetic nobody verified |
| `confidence_note` must name specific fields | A vague "some information was unclear" is unactionable. Naming the fields tells the user exactly what to check |
| Explicit status definitions | Left open, "status" is interpreted differently run to run, and the four values must match the `CHECK` constraint on the table |

### Reference input / output

**Input**

```
TODAY: 2026-08-19

BRIEF:
"""
Hi — following up on the redesign we discussed. Need it done by Nov 14.
We agreed $85/hr, I've tracked about 22 hours so far.

— Dana, Northwind Co
"""
```

**Expected output**

```json
{
  "project_name": "Website Redesign",
  "client": "Northwind Co",
  "hourly_rate": 85,
  "hours_logged": 22,
  "deadline": "2026-11-14",
  "status": "in_progress",
  "confidence_note": "All fields were stated explicitly; the project name was derived from 'the redesign' and hours were approximate ('about 22')."
}
```

### Version history

| Version | Date | Change |
|---|---|---|
| v1.0.0 | 2026-08-19 | Initial prompt |

> Bump the version in `lib/core/prompt.ts` on **any** wording change. Rows saved
> under different versions are not comparable, and without the stamp there is no
> way to tell them apart after the fact.

---

## Fallback extractor — not a prompt

`lib/core/heuristic.ts` is deterministic regex parsing with no model involved.
It is documented here only so the two paths can be compared:

| | Model | Heuristic |
|---|---|---|
| Handles conversational phrasing | Yes | Only recognized patterns |
| Resolves "end of next month" | Yes | No — returns null |
| Infers a readable project name | Yes | Approximates from nearby nouns |
| Invents missing values | No (instructed) | No (structurally cannot) |
| Cost | ~$0.01 / run | Free |
| Latency | ~7s (measured) | <1ms |

Both are held to the same contract: what cannot be found is returned as `null`
and named in the confidence note. The response always states which one ran.
