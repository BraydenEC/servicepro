# 🧪 Week 2 Test Evidence

**Required:** 1 real human validation conversation + 3 software tests.
**Delivered:** 6 software tests. The human conversation is outstanding — see §7.

**Live page:** https://servicepro-orpin.vercel.app/research

---

## Test 1 — Every cited source resolves ✅ PASS

**Why this test exists.** It is the only automated check in this project capable of catching a
fabricated citation. A research page can present an invented statistic exactly as convincingly as
a real one, and no amount of prose review reliably detects it. But a source that does not exist
cannot return HTTP 200.

**Method**
```bash
grep -ohE 'https?://[^"]+' lib/research/data.ts components/research/MexicoPanel.tsx \
  | sed 's/[",]*$//' | sort -u > urls.txt
while IFS= read -r u; do curl -s -o /dev/null -L -w "%{http_code} $u\n" "$u"; done < urls.txt
```

**Result**
```
PASS 200 https://alternativo.mx/como-facturar-freelance-mexico-guia-completa-sat/
PASS 200 https://clockify.me/pricing
PASS 200 https://facturama.mx/
PASS 200 https://gigstack.pro/
PASS 200 https://toggl.com/track/pricing/
PASS 200 https://www.alegra.com/mexico/precios/
PASS 200 https://www.freshbooks.com/pricing
PASS 200 https://www.getharvest.com/pricing
PASS 200 https://www.hellobonsai.com/pricing

RESULT: 9/9 resolved, 0 failed
```

**Verdict: PASS.** Every claim marked `verified` points at a page that exists and was fetched on
2026-08-31.

> **A tooling correction inside this test.** The first run reported `0/1 resolved` — apparently a
> catastrophic failure. The cause was the shell, not the data: zsh does not word-split unquoted
> parameter expansions, so the entire URL list was passed to `curl` as a single argument. Rewritten
> with an explicit `while read` loop. Worth recording because a test that reports a false failure
> is as dangerous as one that reports a false pass, and the instinct to "fix" the data first
> would have wasted the effort.

---

## Test 2 — Every factual claim carries a confidence level ✅ PASS

**Method** — count confidence badges and unsourced markers in the rendered page.

**Result (production)**
```
Confidence badges rendered:  28
"unsourced" markers:          9
```
Every benchmark card, every table row, the Mexico panel, and every saved record renders a badge.
The three substitutes with no source render amber and read "unsourced" rather than appearing as
fact.

**Verdict: PASS.** No factual row renders without a stated confidence level.

---

## Test 3 — Filter and search compose as an intersection ✅ PASS (17/17, executed)

**Why.** The common bug is filters that OR together, so adding a second constraint *widens*
results. Selecting "Mexico" and typing "cfdi" must narrow twice.

**How this test was strengthened.** It originally claimed PASS on the basis of reading the code.
For a week whose entire subject is the difference between an asserted result and a checked one,
that was the wrong thing to ship. The predicate was extracted to `lib/research/filter.ts` — the
same function the component uses, not a copy — and is now executed directly:

```bash
npm run test:filters
```

**Result**
```
  PASS  no filters returns everything  →  11
  PASS  category = substitute  →  3
  PASS  category = invoicing_cfdi  →  3
  PASS  region = mexico  →  5
  PASS  region = global  →  6
  PASS  mexico AND invoicing_cfdi intersects  →  3
  PASS  global AND substitute intersects (not union)  →  1
  PASS  search matches a name  →  1
  PASS  search is case-insensitive  →  1
  PASS  search matches note text  →  8
  PASS  search matches pricing  →  4
  PASS  whitespace-only query is ignored  →  11
  PASS  no match yields empty  →  0
  PASS  search AND category compose  →  3
  PASS  search AND region compose  →  6
  PASS  known: "free" matches the "Freelance suite" label  →  2
  PASS  adding a constraint never widens the result

  17 passed, 0 failed
```

The final assertion is the important one: it sweeps every category × region combination and
verifies that adding a constraint can only narrow. A filter that ORs instead of ANDs would pass
several individual cases while failing that one.

### ⭐ The test found that two of its own expectations were wrong

Two cases failed on the first run. Both were the *expected values*, not the code:

| Case | I expected | Actual | Why |
|---|---|---|---|
| search "cfdi" | 6 | **8** | Every global tool's note says it has *no* CFDI, so they match too |
| search "free" + global | 3 | **6** | `"free"` is a substring of **"Free**lance suite**"**, so Bonsai and FreshBooks match on their category label |

Rather than adjust the numbers and move on, each was traced to the field that matched before the
expectation was changed. The second is a real, if minor, wart: substring search across the
category label is what makes "invoicing" and "substitute" findable, and the same mechanism makes
"free" surface freelance suites. It is documented as a known behaviour with its own test case
rather than special-cased away.

**This is the second time in Week 2 that the harness was wrong and the code was right** — the
first was the zsh word-splitting failure in Test 1. Both would have led to "fixing" something
that was never broken.

**Verdict: PASS.** Filters intersect, verified by execution. The count is announced with
`aria-live` so a screen-reader user is told the page changed, and the zero-result case offers a
way out rather than a blank table.

---

## Test 4 — The extractor refuses to overstate confidence ✅ PASS

**Method** — two notes through the live API.

**A. Note containing a real URL**
```
Input:  gigstack automates CFDI 4.0 invoicing from payment events … https://gigstack.pro/
Output: category=competitor  region=mexico  confidence=verified
        source_url=https://gigstack.pro/     extractor=model
```

**B. Opinion with no source**
```
Input:  I think most freelancers here just use Excel because it is free…
Output: category=substitute  region=mexico  confidence=estimated
        source_url=None                      extractor=model
```

**Verdict: PASS.** The model classified an unsourced opinion as `estimated` and did not invent a
citation to fill the field.

**The safeguard behind this.** The prompt forbids inventing URLs, but instruction is not
enforcement. `rejectUnsupportedSource()` compares any returned URL against the note it came from
and discards it if absent, downgrading confidence and appending a note saying so. A citation the
user never supplied cannot be trusted just because it looks plausible.

---

## Test 5 — Validation and the honesty constraint ✅ PASS

| Input | Expected | Actual |
|---|---|---|
| `{"note":"   "}` | 400 | **400** ✅ |
| `{}` | 400 | **400** ✅ |
| `not json` | 400 | **400** ✅ |
| 9,000-character note | 400 | **400** ✅ |
| Save with `confidence:"verified"`, `source_url:null` | refused | **refused with an actionable message** ✅ |

The last row is the interesting one:

```json
{"error":"A record cannot be marked verified without a source URL.
          Set confidence to reported or estimated instead."}
```

Enforced twice on purpose — a `CHECK` constraint in Postgres guarantees it at rest, and the route
returns a message a person can act on. Notably `source_url` remains **nullable**: making it
`NOT NULL` would push users to paste a plausible-looking link to satisfy the constraint, which is
fabrication with extra steps.

---

## Test 6 — Degrades with no model key ✅ PASS

**Method** — restart with `ANTHROPIC_API_KEY=""`, submit a note containing a URL.

**Result**
```
title       Harvest is free forever for one seat with two projects.
category    benchmark
source_url  https://www.getharvest.com/pricing
confidence  reported          ← not "verified"
extractor   heuristic
reason      No ANTHROPIC_API_KEY configured on the server.
```

**Verdict: PASS**, and the confidence level is the point. The heuristic *found* the URL but marks
the record `reported`, never `verified`, because pattern matching can detect that a link exists
and cannot judge whether it supports the claim. The weaker path knows it is the weaker path.

---

## Production verification

| Check | Result |
|---|---|
| `/research` loads | ✅ HTTP 200 in 1.20s |
| Confidence badges | ✅ 28 rendered |
| Unsourced markers | ✅ 9 rendered |
| Filter/search controls | ✅ present |
| Risk map cells | ✅ 9 cells |
| Dashboard widget | ✅ "Market research" live |
| Research API on production | ✅ `extractor: model`, `confidence: verified` |

---

## 7. 🔴 Outstanding — the human validation conversation

**Required and not yet done.** This is the one deliverable that cannot be produced, simulated, or
drafted by a coding agent. Template and interview script: `VALIDATION_CONVERSATION.md`.

Also outstanding: the `research_records` migration has not been run against the live database, so
the save round trip is untested end to end. The API is verified as far as validation; the insert
itself needs the table.
