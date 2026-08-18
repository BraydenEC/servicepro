# 🧠 Raw Material for Your Human Decision Note

**The note itself must be written by you** — it's assessed as *your* judgement,
in your voice, and it's worth 1.0 point. This file is the factual record to draw
from, not a draft to paste.

**Requirement:** 150–250 words covering **decisions, rejections, corrections,
and tradeoffs.**

---

## The strongest material you have

Pick two or three. The most compelling are the ones where something looked fine
and wasn't.

### 1. Production was serving fake data and looked perfect ⭐ best story
The database was live, seeded, and secured. The app worked against it locally.
But the environment variables were never added during the Vercel import, so the
deployed site had been rendering the mock fallback since day one — and because
the fallback was built to be indistinguishable from real data, every visible
check passed. Six projects, correct totals, correct badges.

It was only caught by adding a `data-source` attribute that records which code
path produced the page. **The tradeoff:** the resilience feature and the
verification problem were the same feature. A fallback good enough to survive an
outage is also good enough to hide a misconfiguration.

### 2. Deployment was moved to the middle of the project, not the end
The original plan deployed once, at the end. The assignment caps the grade at
5/10 without a live deployment, which put the entire floor in the final hour.
**Decision:** deploy as soon as the UI was presentable, before touching the
database. **Tradeoff:** the first deployment knowingly shipped fake data — worth
it to secure the floor early.

### 3. Rejected the spec's own instruction on the summary cards
The handoff document said to hardcode the three figures. It also said to fetch
live rows. Following both would have let the cards contradict the table directly
beneath them. **Decision:** derive the metrics from whatever data is loaded, then
tune the mock dataset so the derived values land on the spec's numbers —
satisfying the requirement without the inconsistency.

### 4. A correction I had to make to my own evidence
I documented that Postgres `numeric` arrives as a string and that this "would
have" caused a `NaN` bug. When the live database connected, it returned plain
numbers — no such bug existed. The defensive code was fine; the claim was
overstated. **Correction:** amended it visibly across three documents rather
than deleting it.

### 5. Treated row-level security as a claim to disprove
Rather than trusting that RLS was on, I used the public key exactly as an
attacker would and attempted INSERT, UPDATE, and DELETE. Two returned HTTP 204
— which is ambiguous, since PostgREST returns it both for success and for
zero matches — so I re-queried the table to confirm nothing had changed.
Nothing had.

### 6. Static rendering would have quietly rotted the deadlines
The build was prerendering the page, freezing the current date into the HTML.
"In 3 days" would have counted from the last deploy and drifted further wrong
daily — looking perfect on launch day. Caught by reading build output rather
than skimming it.

---

## Other tradeoffs available

| Decision | Rejected alternative | Why |
|---|---|---|
| Inert, dimmed sidebar links | `href="#"` links | Dead links read as broken; honest disabled state doesn't |
| Stacked cards on mobile | Horizontally scrolling table | A squeezed table is the fastest way to look unfinished |
| One `projects` table | Separate `time_entries` table | The sprint needs value per project, not a session log |
| Inline SVG icons | An icon library | A dependency and a network request for eight glyphs |
| Dark mode only | A theme toggle | Scope cut — one palette done well |
| Relative deadlines | The mockup's hardcoded 2023 dates | Every row would read as years overdue at grading time |

---

## Writing tips

- **Specifics beat adjectives.** "Production was serving mock data and looked
  identical to the real thing" says more than "I learned a lot about debugging."
- **Name at least one rejection and one correction** — the rubric asks for both
  explicitly, and most submissions only include decisions.
- **A tradeoff needs two sides.** "I deployed early to secure the grade floor,
  accepting that the first deploy shipped fake data" is a tradeoff. "I deployed
  early" is not.
- 150–250 words is roughly two solid paragraphs. Two stories told properly beats
  six listed.
