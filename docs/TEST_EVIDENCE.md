# 🧪 Test Evidence

Rubric requires **3 self-tests of deployment and navigation**, plus at least one
improvement made as a result. This file records tests actually executed, with
their commands and raw output.

**Status:** 6 of 9 tests complete — already double the required 3. Tests 7–9
require the live deployment.

---

## Test 1 — Renders with no database credentials ✅ PASS

**Why this test exists:** the app is specified to fall back to mock data when the
database is unavailable. If the Supabase client throws on missing credentials,
that throw happens during `next build` — failing the *deployment*, not just a
request — and the fallback never runs.

**Method**
```bash
# .env.local present but both values blank
npm run build && npm run dev
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

**Result**
```
Build: ✓ Compiled successfully
HTTP: 200
Cards: $3,450  $4,200  5
Log:   [projects] Supabase credentials not set — rendering mock data.
```

**Verdict:** PASS. Builds, serves, and renders the complete dashboard with no
configuration at all.

---

## Test 2 — Survives an unreachable database ✅ PASS

**Method** — point the app at a Supabase host that does not exist:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://nonexistent-project-abc123xyz.supabase.co" \
NEXT_PUBLIC_SUPABASE_ANON_KEY="fake-key-for-failure-testing" \
npm run dev
```

**Result**
```
HTTP: 200
Cards: $3,450  $4,200  5
Rows rendered: 6
Log: [projects] Supabase query failed — falling back to mock data. TypeError: fetch failed
```

**Verdict:** PASS. Network failure is caught, logged distinctly, and invisible to
the visitor — no error banner, no empty state, no layout shift.

---

## Test 3 — Dates are timezone-independent ✅ PASS

**Why this test exists:** `new Date("2026-08-20")` parses as UTC midnight. Formatted
in a timezone behind UTC it renders as the *previous day*. A deadline tracker
that shows the wrong day is worse than useless, and the bug is invisible to
anyone developing in UTC.

**Method** — render the same data under three timezones spanning 16 hours:
```bash
for TZ_TEST in America/Los_Angeles Asia/Tokyo UTC; do
  TZ="$TZ_TEST" npm run dev
  curl -s http://localhost:3000 | grep -oE '>[A-Z][a-z]{2} [0-9]{1,2}<'
done
```

**Result**

| Timezone | Offset | Dates rendered |
|---|---|---|
| America/Los_Angeles | UTC−7 | Aug 4, Aug 16, Aug 21, Aug 27, Aug 30, Sep 8 |
| Asia/Tokyo | UTC+9 | Aug 4, Aug 16, Aug 21, Aug 27, Aug 30, Sep 8 |
| UTC | UTC±0 | Aug 4, Aug 16, Aug 21, Aug 27, Aug 30, Sep 8 |

Relative labels were identical in all three runs
(`in 3 days`, `in 9 days`, `in 12 days`, `in 21 days`, `2 days overdue`,
`14 days overdue`).

**Verdict:** PASS. Identical output across a 16-hour spread.

---

## Test 4 — Navigation and accessibility markup ✅ PASS

**Why this test exists:** the sprint ships one route, so "navigation" means the
sidebar communicates state correctly and contains no dead ends.

**Method** — inspect the rendered HTML:
```bash
curl -s http://localhost:3000 > out.html
grep -o 'aria-current="page"' out.html | wc -l
grep -o 'href="#"'            out.html | wc -l
```

**Result**

| Check | Expected | Actual | |
|---|---|---|---|
| `aria-current="page"` | 1 (Dashboard only) | 1 | ✅ |
| `aria-disabled="true"` | 3 (inactive items) | 3 | ✅ |
| `href="#"` dead links | 0 | 0 | ✅ |
| `<caption>` on table | 1 | 1 | ✅ |
| `scope="col"` | 4 | 4 | ✅ |
| `scope="row"` | 6 (one per project) | 6 | ✅ |
| `lang="en"` | 1 | 1 | ✅ |
| Deadline urgency colours | rose + amber + grey all present | all 3 | ✅ |

**Verdict:** PASS. Exactly one item claims active state, the other three are
correctly marked unavailable, and there are no links that go nowhere.

---

## Test 5 — Live database displaces mock data ✅ PASS

**Method** — connected the real Supabase project and loaded the app:
```bash
# .env.local populated with the project URL and anon key
npm run dev && curl -s http://localhost:3000
```

**Result**
```
HTTP: 200
Cards: $3,450  $4,200  5
NaN occurrences: 0
Fallback log messages: none
Projects rendered: API Integration · Brand Identity Refresh · Logo & Style Guide
                   Marketing Site Launch · Mobile App Development · Website Redesign
```

**Verdict:** PASS. The absence of any `[projects]` fallback log confirms the
rows came from Postgres, not `mock-data.ts`. The three derived metrics land on
the same figures the mock dataset produced, confirming the seed data and the
mock set model the same scenario.

---

## Test 6 — Row-level security blocks anonymous writes ✅ PASS

**Why this test exists:** the `anon` key is embedded in the browser, so anyone
can read it out of the page source and call the API directly. "RLS is enabled"
is a configuration claim; whether writes are actually refused is a separate
question that has to be answered by trying.

**Method** — using the public key exactly as an attacker would:
```bash
curl -X POST   .../projects -H "apikey: $ANON" -d '{"name":"PENTEST",...}'
curl -X PATCH  .../projects?name=eq.Website%20Redesign -d '{"name":"HACKED"}'
curl -X DELETE .../projects?name=eq.API%20Integration
```

**Result**

| Operation | HTTP | Effect |
|---|---|---|
| `INSERT` | 401 | Refused |
| `UPDATE` | 204 | **0 rows affected** |
| `DELETE` | 204 | **0 rows affected** |

The `204`s are ambiguous — PostgREST returns that status both for a successful
write and for a write matching zero rows — so the table was re-queried to
disambiguate:

```
Row count:              6 (unchanged)
Rows named "PENTEST":   []
Rows named "HACKED":    []
"API Integration":      still present
```

**Verdict:** PASS. Reads succeed, all writes are refused. The `SELECT`-only
policy behaves exactly as intended, and the public key grants no write access.

### Additional finding — credentials never reach the browser at all

```bash
grep -r "thoiiclzmxzvdylteupn" .next/static/   # 0 files
grep -r "service_role"          .next/static/  # 0 files
grep -r "eyJhbGciOiJIUzI1..."   .next/static/  # 0 files
```

The variables carry the `NEXT_PUBLIC_` prefix — which *permits* them to ship to
the browser — but they are only referenced from `lib/supabase.ts`, which is
imported exclusively by Server Components. Next.js therefore never inlines them
into client JavaScript.

So the anon key is protected by two independent layers: it grants no write
access even if obtained, **and** it is never served to the client in the first
place. The second property came free from the decision to fetch server-side.

---

## Test 7 — Live deployment loads ⏳ PENDING

Requires Phase 4. Method: open the Vercel URL in a private window; expect HTTP
200, no auth wall, dashboard fully rendered.

## Test 8 — Live console is clean ⏳ PENDING

Requires deployment. Method: DevTools console on the live URL; expect zero
errors and **no hydration warnings** — the reason `now` is captured once
server-side and all locales are pinned.

## Test 9 — Deployed site reads the live database ⏳ PENDING

Requires deployment. Method: rename a project in the Supabase Table Editor,
refresh the live URL, confirm the new name appears without a redeploy. Proves
the deployed site reads Postgres rather than the fallback.

---

## Improvements made as a result of testing

The rubric requires at least one. Three were made.

### 1. Route was prerendering as static — dates would have rotted
`npm run build` reported the route as `○ (Static)`, meaning `new Date()` was
evaluated at **build time** and frozen into the HTML. Deployed, "in 3 days"
would have counted from the last deployment and drifted further wrong every day
the site sat unbuilt — while looking perfectly correct on day one.

**Fix:** `export const dynamic = "force-dynamic"`. Build now reports `ƒ /`.
This is also required for Phase 5, so database edits appear on refresh.

### 2. `.env.example` would never have reached the repository
The generated `.gitignore` contains `.env*`, which silently swallows
`.env.example` — the one env file that must be committed, since it documents
the app's required configuration.

**Fix:** added a `!.env.example` negation.

*Secondary finding:* `git check-ignore -v` exits 0 when **any** pattern matches,
including a negation — so it reported the file as ignored when it wasn't. The
reliable check is `git status --short`, where `??` means visible and untracked.

### 3. Defensive numeric coercion in the row mapper
Postgres `numeric` can be serialized as a JSON **string** rather than a number
to avoid float precision loss. Had `hours_logged` arrived as `"64.50"`,
`hours × rate` would have become string arithmetic and rendered `NaN`.

**Fix:** explicit coercion in `mapRow()`, non-finite values degrading to 0.

**⚠️ Correction:** once the live database was connected, PostgREST returned
`numeric` as JSON numbers (`41.5`, `90.0`) — so no `NaN` defect actually
existed. The coercion remains as defence in depth (it also handles `null`s and
hand-edited rows at zero cost), but the original claim that it *fixed* a bug was
overstated. Corrected here rather than deleted; see iteration 12.
