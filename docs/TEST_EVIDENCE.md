# 🧪 Test Evidence

Rubric requires **3 self-tests of deployment and navigation**, plus at least one
improvement made as a result. This file records tests actually executed, with
their commands and raw output.

**Status:** 4 of 7 tests complete. Tests 5–7 require the live deployment.

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

## Test 5 — Live deployment loads ⏳ PENDING

Requires Phase 4. Method: open the Vercel URL in a private window; expect HTTP
200, no auth wall, dashboard fully rendered.

## Test 6 — Live console is clean ⏳ PENDING

Requires Phase 4. Method: DevTools console on the live URL; expect zero errors
and **no hydration warnings** — the reason `now` is captured once server-side
and all locales are pinned.

## Test 7 — Live data displaces mock data ⏳ PENDING

Requires Phase 5. Method: rename a project in the Supabase Table Editor, refresh
the live URL, confirm the new name appears without a redeploy. This is also the
proof that the deployed site reads the real database rather than the fallback.

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

### 3. Numeric values would have rendered as `NaN` once the database connected
PostgREST serializes Postgres `numeric` as a **string** to avoid float precision
loss, so `hours_logged` arrives as `"64.50"`. Multiplying that by a rate string
produces `NaN` — a bug that appears only once real data is connected, i.e.
during the demo.

**Fix:** explicit coercion in the row mapper, with non-finite values falling
back to 0.
