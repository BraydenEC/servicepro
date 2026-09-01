# 🔁 Week 2 Iteration Log

What changed, and why — in the order the problems appeared.

---

## Planning

### 1. The failure mode for this week was identified as different from the last two

Weeks 0 and 1 both failed identically: correct code, unconfigured environment, caught by querying
production. Planning for Week 2 started by asking what *this* assignment fails at, and the answer
is fabrication. A research module asks for competitor pricing and market evidence — precisely the
material a language model produces fluently and confidently regardless of truth. A fabricated
statistic looks identical to a real one and no test detects it by reading.

**Change:** verification was designed in as a first-class field before any code — `source_url`,
`verified_on`, and a required `confidence` enum on every record.

### 2. `source_url` was deliberately left nullable

The obvious way to force sourcing is `NOT NULL`. That was rejected: a required source field
pushes people to paste a plausible-looking link to satisfy the constraint, which is fabrication
with extra steps.

**Change:** nullable column, required confidence, and a `CHECK` that only forbids the specific
dishonest combination — `confidence = 'verified'` with no source. The schema makes weakness
*visible* rather than impossible.

---

## Research

### 3. Writing figures from memory was rejected outright

The training cutoff predates this assignment. Any price recalled rather than fetched would be
both stale and confident.

**Change:** every figure fetched from the vendor's own page on 2026-08-31, dated in the data file.

### 4. FreshBooks' promotional price would have been misleading

The pricing page currently shows $2.30/$4.30/$7.00 — a 90%-off-for-three-months promotion. Quoting
that as "the price" would have been technically accurate and materially false, and it is exactly
the misleading precision this module exists to prevent.

**Change:** list price recorded ($23/$43/$70), promotion noted in the entry.

### 5. Harvest's free tier was reclassified as a competitor, not a trial

Initially treated as a freemium on-ramp. It is free forever for one seat with two projects, which
for a solo freelancer is a complete product.

**Change:** recorded as a genuine competitor, and the benchmark card says so. Any pricing argument
ServicePro makes has to beat free.

### 6. The research changed the product's problem statement

Weeks 0 and 1 framed fragmentation as a discipline problem — freelancers being disorganised. The
research showed that no surveyed product does both halves, and that CFDI requires integration
with a government-authorised PAC rather than a better invoice template.

**Change:** the problem is structural, not behavioural. A Mexican freelancer runs two systems by
legal necessity. This is a better problem to be solving and it was not visible before the research.

---

## Build

### 7. `zodOutputFormat` was called with the wrong arity

Wrote `zodOutputFormat(Schema, "research_record")` from habit; the installed SDK takes one
argument. Caught by `tsc --noEmit` before it ever ran.

**Change:** matched the Week 1 call signature. Small, but it is the reason the typecheck runs
before the build rather than after.

### 8. Instructing the model not to invent URLs was judged insufficient

The prompt forbids fabricating a citation. Prompts are instructions, not guarantees, and the
consequence of a single invented URL in a research assignment is severe.

**Change:** `rejectUnsupportedSource()` compares any returned URL against the note it came from
and discards it if absent, downgrading confidence and appending an explanation to the summary.
Enforcement, not just instruction.

---

## Testing

### 9. ⭐ A test reported a catastrophic false failure

The source-resolution check first reported `0/1 resolved` — apparently every citation broken. The
data was fine. zsh does not word-split unquoted parameter expansions, so the whole URL list was
handed to `curl` as one argument.

**Change:** rewritten with an explicit `while read` loop; 9/9 now resolve.

**Why it is logged:** the instinct on seeing that result was to suspect the URLs. Had the sources
been "fixed" first, real effort would have gone into repairing data that was never broken. **A
test that reports a false failure is as dangerous as one that reports a false pass** — both mean
the harness, not the code, is the thing being read.

### 10. The heuristic path was checked for honesty, not just function

It correctly extracts a URL from a note. The question was what confidence it then claims.

**Verified:** it marks such records `reported`, never `verified` — pattern matching can detect
that a link exists but cannot judge whether it supports the claim. The weaker path knows it is the
weaker path, which is the same principle as Week 1's extractor badge applied to confidence rather
than provenance.

---

## Outstanding

The `research_records` migration has not been run against the live database, so the save round
trip is unverified end to end. And the human validation conversation — the one deliverable no
agent can produce — has not happened yet.
