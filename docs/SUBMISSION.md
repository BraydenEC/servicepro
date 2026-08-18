# 📦 Submission Packet — Week 0: Setup Sprint

**Student:** Brayden Credeur · **Course:** Negocios Inteligentes
**Project:** ServicePro — freelance project & invoice tracker

---

## Required links

| Item | Link |
|---|---|
| 🌐 **Live URL** | <https://servicepro-orpin.vercel.app> |
| 📁 **GitHub** | <https://github.com/BraydenEC/servicepro> |
| 🎥 **Demo video** | _paste link here_ |

---

## Evidence checklist

| Required | Minimum | Actual | Where |
|---|---|---|---|
| Live URL loads | — | ✅ HTTP 200, 0.68s | link above |
| Build Discipline Packet | complete before coding | ✅ | `Build_Discipline_Packet.md` |
| UX mockup / wireframe | 1 | ✅ | [`images/ux-mockup.jpg`](images/ux-mockup.jpg) |
| UX implementation note | — | ✅ | [`IMPLEMENTATION_NOTE.md`](IMPLEMENTATION_NOTE.md) |
| Product spec + acceptance criteria | testable | ✅ ~50 criteria | [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md) |
| Architecture sketch + stack table | — | ✅ 3 diagrams | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| GitHub commits | 5 | ✅ **13** | repo |
| Vercel deployments | 2 | ✅ **7** | Vercel dashboard |
| Supabase evidence | table/data | ✅ verified live | [`TEST_EVIDENCE.md`](TEST_EVIDENCE.md) Test 8 |
| Coding-agent prompt log | 5 | ✅ **5** | [`PROMPT_LOG.md`](PROMPT_LOG.md) |
| Test evidence | 3 | ✅ **9** | [`TEST_EVIDENCE.md`](TEST_EVIDENCE.md) |
| Iteration log | ≥1 improvement | ✅ **16** | [`ITERATION_LOG.md`](ITERATION_LOG.md) |
| Demo video | 2–3 min | 🔲 **you** | — |
| Human Decision Note | 150–250 words | 🔲 **you** | material in [`DECISION_NOTE_MATERIAL.md`](DECISION_NOTE_MATERIAL.md) |

---

## 🔲 What's left for you

### 1. Screenshots
- [ ] Supabase → **Table Editor** → `projects` showing 6 rows
- [ ] Supabase → **Authentication → Policies** showing the read-only policy
- [ ] Vercel → **Deployments** showing 7 successful builds
- [ ] GitHub → **Commits** showing 13
- [ ] Live site at **desktop** width
- [ ] Live site at **mobile** width (DevTools device toolbar, 375px)
- [ ] Live site with **console open**, showing no errors
- [ ] The Mermaid diagrams in `ARCHITECTURE.md`, viewed **on GitHub** (they render there — no image file needed)

### 2. Demo video (2–3 min)

| Time | Content |
|---|---|
| 0:00–0:20 | The problem — freelancers juggling Excel, Word, scattered notes |
| 0:20–1:00 | Live URL walkthrough — cards, table, statuses, deadlines |
| 1:00–1:30 | Resize to mobile, show the layout adapt |
| 1:30–2:10 | **Supabase table → rename a project → refresh the live site → new name appears.** Full stack in fifteen seconds |
| 2:10–2:40 | Stack summary + one engineering decision (the mock-data fallback and how it nearly hid a misconfiguration) |

> Record with the console closed for the main walkthrough. The 1:30 segment is
> the strongest thing you can show — it proves the database is real.

### 3. Human Decision Note
150–250 words. Draw from [`DECISION_NOTE_MATERIAL.md`](DECISION_NOTE_MATERIAL.md).
Must cover decisions, rejections, corrections, **and tradeoffs**.

### 4. Assemble one PDF
Build Discipline Packet + the three links at the top + screenshots + this
checklist. Submit to Dropbox.

---

## One-paragraph project summary

> ServicePro is a single-screen dashboard that answers the two questions a
> freelancer actually opens a tool for: *how much am I owed*, and *what's due
> next*. It replaces the spreadsheet-plus-Word-doc-plus-sticky-notes workflow
> with one view showing unpaid invoices, monthly earnings, active project count,
> and a deadline-aware project table. Built with Next.js 16 and Tailwind v4 on
> Vercel, backed by Supabase Postgres with row-level security. Data is fetched
> server-side, so the database is never exposed to the browser — verified by
> scanning the production bundle. The app degrades to a realistic mock dataset if
> the database is unreachable, which keeps it demonstrable under failure; that
> same resilience nearly concealed a misconfigured deployment, which is why the
> rendered page now records which data path produced it.
