# 📝 Week 2 Prompt Library — research extraction

**Version:** `v1.0.0` · **Source of truth:** `lib/research/prompt.ts`

The prompt lives in source rather than here, so it cannot drift from what actually runs. This
document explains it. `RESEARCH_PROMPT_VERSION` is stored on every saved record, so any row can
be traced back to the prompt that produced it.

---

## The system prompt

```
You structure research notes about a market into records. Your input is a note somebody
typed while reading about competitors, pricing, regulations, or user behaviour.

RULES

1. Extract only what the note contains. Do not add market knowledge of your own, even if
   you are confident it is correct. You are structuring someone else's finding, not
   contributing your own.

2. NEVER invent, complete, or guess a URL. If the note contains a URL, use it exactly. If
   it does not, source_url must be null. A fabricated citation is the worst possible
   output of this tool, because it looks exactly like a real one.

3. Set confidence honestly:
   - "verified" only when the note contains an actual source URL.
   - "reported" when the note cites a source by name but gives no link.
   - "estimated" when the note is judgment, opinion, inference, or recollection.
   When in doubt, choose the weaker level. Overstating confidence is the failure this
   field exists to prevent.

4. Choose category from what the note is about: competitor, substitute, benchmark, risk,
   or insight.

5. Choose region: "mexico" if the note concerns the Mexican market, regulations, or
   Mexican products; "global" otherwise.

6. The summary is at most two sentences. State the finding and why it matters. Do not pad
   it and do not editorialise.
```

---

## Why each rule exists

**Rule 1 — do not contribute knowledge.** The obvious way to make this tool feel smart is to let
the model enrich a thin note with what it knows about the vendor. That is the single most
dangerous thing it could do here: the user would have no way to tell which parts came from their
research and which the model supplied. The tool structures; it does not contribute.

**Rule 2 — never invent a URL.** The worst possible output of a research tool is a citation that
does not exist, because it survives casual checking. Anyone spot-checking is likely to skim a
plausible domain rather than click every link.

**Rule 3 — confidence, biased toward weakness.** "When in doubt, choose the weaker level" is
deliberate. The asymmetry matters: an understated claim costs a little credibility, an overstated
one costs all of it.

**Rule 6 — two sentences.** A longer summary invites the model to editorialise, and editorial
drift is how a note becomes a claim.

---

## The safeguard that does not live in the prompt

Rule 2 is an instruction, and instructions are not guarantees. `rejectUnsupportedSource()` in
`lib/research/extract.ts` checks any returned URL against the note it came from:

```ts
if (!fields.source_url) return fields;
if (note.includes(fields.source_url)) return fields;
// otherwise: discard the URL, downgrade confidence, say so in the summary
```

A citation the user never supplied cannot be trusted just because it looks plausible. This is the
difference between asking a model to behave and making misbehaviour ineffective.

---

## Model settings

| Setting | Value | Why |
|---|---|---|
| Model | `claude-opus-5` | Same as Week 1 |
| Effort | `low` | Fixed schema, well-specified task. Measured ~3–7s |
| Fallback | Deterministic regex extractor | Page works with no key, no credit, no network |

---

## The fallback's honesty rule

`lib/research/heuristic.ts` can find a URL with a regex. It never claims `verified` on that basis
— the strongest it asserts is `reported`, because detecting that a link exists is not the same as
judging whether it supports the claim. Verified in Test 6.
