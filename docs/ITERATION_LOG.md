# 🔁 Iteration Log

Rubric requires *"what changed after testing"* and *"at least one improvement
made."* This is the chronological record of changes made in response to
something discovered — a test result, a document conflict, a build warning, or
a tool telling the truth when it was inconvenient.

Ordered by when the problem was found.

---

## Planning stage — before any code

### 1. Deployment moved from last phase to Phase 4
**Found by:** reading the assignment PDF against the draft plan.
**Problem:** the plan deployed once, at the very end, putting the entire grade
floor in the final hour of work — while the assignment states *"no live
deployment = maximum 5/10."*
**Change:** deployment moved to immediately after the mock UI is presentable,
before database work begins. The "2+ deployments" requirement is now satisfied
by later phases naturally rather than manufactured at the end.
**Effect:** the largest single risk in the project was eliminated before a line
of code was written.

### 2. Supabase reclassified from optional to mandatory
**Found by:** cross-reading the handoff spec against the submission packet.
**Problem:** the handoff's mock-data fallback is designed to look complete even
with an empty database. That is good engineering *and* a grading liability —
"Supabase evidence" is scored separately, so a dashboard rendering perfectly off
`mock-data.ts` earns nothing for it.
**Change:** the fallback stays as resilience, but the delivered state must be
real database rows on the live URL.

### 3. Summary metrics changed from hardcoded to derived
**Found by:** internal contradiction in the handoff — §2.2 hardcodes the card
values while §3 fetches live rows.
**Problem:** hardcoded cards would visibly contradict the table directly beneath
them, which is exactly the kind of thing that's obvious on camera.
**Change:** all three metrics derive from whichever dataset is active. Mock data
was then tuned so the derived values land exactly on the spec figures
($3,450 / $4,200 / 5) — matching the spec *and* staying internally consistent.

---

## Build stage

### 4. `.env.example` would never have been committed
**Found by:** checking git status before the first commit.
**Problem:** the generated `.gitignore` contains `.env*`, which silently
excludes `.env.example` — the one env file that must be in the repo, because it
documents required configuration.
**Change:** added a `!.env.example` negation.
**Secondary finding:** the verification command itself was misleading.
`git check-ignore -v` exits 0 when *any* pattern matches, negations included, so
it reported the file as ignored when it wasn't. `git status --short` is the
reliable check — `??` means visible and untracked.

### 5. Turbopack was inferring the wrong workspace root
**Found by:** a warning on every `npm run dev`.
**Problem:** a stray `package-lock.json` in the home directory made Turbopack
guess wrong. Harmless, but it would have appeared in the recorded demo.
**Change:** pinned `turbopack.root` in `next.config.ts`.

### 6. Tailwind v3 syntax used against a v4 install
**Found by:** IDE diagnostics.
**Problem:** wrote `bg-gradient-to-b`; Tailwind v4 renames it `bg-linear-to-b`.
**Change:** used the canonical name. Reinforced the working rule for this
project — verify framework conventions against the bundled v16 docs rather than
assuming, which is exactly what Next 16's `AGENTS.md` warns about.

---

## Testing stage

### 7. ⭐ The route was prerendering as static — the deadline column would have rotted
**Found by:** reading `npm run build` output rather than skimming it. The route
was marked `○ (Static)`.
**Problem:** static prerendering evaluates `new Date()` at **build time** and
freezes it into the HTML. Deployed, "in 3 days" would count from the last
deployment and drift further wrong every day the site sat unbuilt. It would have
looked perfectly correct on launch day and silently degraded — the worst failure
shape, since nothing signals it.
**Change:** `export const dynamic = "force-dynamic"`. Build now reports `ƒ /`.
**Bonus:** this is also required for Phase 5, so database edits appear on
refresh instead of being cached from the last build.

### 8. Defensive numeric coercion added to the row mapper
**Found by:** considering how PostgREST serializes Postgres `numeric` while
writing the row mapper.
**Concern:** `numeric` columns can be serialized as JSON **strings** rather than
numbers to avoid float precision loss. If `hours_logged` arrived as `"64.50"`,
then `hours × rate` would become string arithmetic and render `NaN` — a fault
invisible to every mock-data test, appearing only once the real database was
connected.
**Change:** explicit coercion in `mapRow()`, with non-finite values degrading
to 0.

**⚠️ Correction — this claim was overstated.** When the live database was
connected in the next stage, PostgREST returned `numeric` as JSON **numbers**
(`41.5`, `90.0`), not strings. No `NaN` bug existed to fix. The coercion is
genuine defence in depth — it costs nothing and covers hand-edited rows,
`null`s, and other PostgREST configurations — but it did **not** prevent a live
defect, and the original entry claimed it did. Recorded rather than deleted,
because an evidence log that quietly edits out its own errors is worth less
than one that shows them. See iteration 12.

### 9. Unknown status values could crash the page
**Found by:** considering what a hand-edited row in the Supabase Table Editor
would do.
**Problem:** `StatusBadge` looks up styling by status. An unrecognized value
returns `undefined` and destructuring it throws, taking down the whole page.
**Change:** unknown statuses degrade to `in_progress`. The database `CHECK`
constraint is the real guard; this is defence in depth.

### 10. Acceptance criteria were not testable
**Found by:** reading the rubric's exact wording — *"clear and testable."*
**Problem:** the packet's original criterion was *"the page renders responsively
without errors"* — no method, no pass/fail boundary, not independently
reproducible.
**Change:** rewritten as ~40 numbered criteria, each with a verification method
and an explicit pass condition. See `ACCEPTANCE_CRITERIA.md`.

### 11. Four criteria were marked verified without having been run
**Found by:** reviewing the acceptance criteria document before committing it.
**Problem:** several rows were marked ✅ based on the code being *written*
correctly rather than the behaviour being *observed* — which defeats the purpose
of a verification document.
**Change:** downgraded to 🔲, then actually executed two of them. The timezone
test (rendering under UTC−7, UTC+9, and UTC) genuinely passed, and was promoted
back to ✅ with the raw output recorded in `TEST_EVIDENCE.md`.

---

---

## Database integration stage

### 12. An unverified claim had been written into the evidence as fact
**Found by:** inspecting the actual JSON returned by the live database, rather
than trusting the prediction made when the mapper was written.
**Problem:** iteration 8 asserted that PostgREST serializes `numeric` as a
string and that this *would* have produced `NaN`. The live response returned
plain JSON numbers. The defensive code was reasonable; the stated justification
was not true for this project.
**Change:** iteration 8 amended in place with a visible correction rather than
being rewritten, and the same claim corrected in `TEST_EVIDENCE.md`,
`HANDOFF.md`, and the source comment in `lib/projects.ts`.
**Lesson:** "this would have broken" is a claim requiring evidence, exactly like
any other. Predicting a failure mode is not the same as observing one.

### 13. Row-level security verified by attempting to break it
**Found by:** deciding that "RLS is enabled" is a configuration claim, not a
security result.
**Method:** using the public `anon` key exactly as a browser would, attempted
`INSERT`, `UPDATE`, and `DELETE` against the live table.
**Result:** `INSERT` → HTTP 401. `UPDATE` and `DELETE` → HTTP 204, which is
ambiguous: PostgREST returns it both for success and for matching zero rows.
Re-queried the table to disambiguate — all 6 original rows intact, no injected
row, no renamed row, no deleted row. Writes are genuinely blocked.
**Change:** none needed — but the check turned an assumption into evidence, and
the ambiguous 204 was worth chasing rather than accepting at face value.
Recorded as Test 8.

---

## Pending

Iterations 14+ will come from the live-deployment tests (5–7 in
`TEST_EVIDENCE.md`), which need the Vercel environment.
