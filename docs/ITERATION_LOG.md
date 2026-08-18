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

### 8. Currency would have rendered `NaN` the moment the database connected
**Found by:** reading the PostgREST serialization contract while writing the row
mapper.
**Problem:** Postgres `numeric` is serialized as a **string**, not a number, to
avoid float precision loss. `hours_logged` arrives as `"64.50"`, so
`hours × rate` becomes string arithmetic → `NaN`. This would not have appeared
in any mock-data test — only once real data was connected, i.e. during the demo.
**Change:** explicit numeric coercion in `mapRow()`, with non-finite values
degrading to 0.

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

## Pending

Iterations 12+ will come from the live-deployment tests (5–7 in
`TEST_EVIDENCE.md`), which need the Vercel and Supabase environments.
