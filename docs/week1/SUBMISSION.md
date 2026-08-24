# 📦 Week 1 Submission Packet — Generative Core Agent

**Student:** Brayden Credeur · **Course:** Negocios Inteligentes
**Module:** ServicePro Core — client brief → structured project record

---

## Required links

| Item | Link |
|---|---|
| 🌐 **Live page (`/core`)** | <https://servicepro-orpin.vercel.app/core> |
| 🌐 Dashboard | <https://servicepro-orpin.vercel.app> |
| 📁 **GitHub** | <https://github.com/BraydenEC/servicepro> |
| 🎥 **Demo video** | _paste link here_ |

---

## Required features

| Feature | Status | Where |
|---|---|---|
| Intake form | ✅ | `components/core/CoreWorkbench.tsx` |
| Core extraction output card | ✅ | structured renderer, 6 typed fields |
| Save button | ✅ | `POST /api/core/save` → HTTP 201 verified |
| Supabase table `core_outputs` | ✅ | `supabase/core_outputs.sql`, rows confirmed |
| Dashboard preview | ✅ | `components/core/CorePreview.tsx` on `/` |
| Prompt library entry | ✅ | [`PROMPT_LIBRARY.md`](PROMPT_LIBRARY.md) |
| 3 test runs | ✅ **6** | [`TEST_EVIDENCE.md`](TEST_EVIDENCE.md) |

## Required coding tasks

| Task | Status |
|---|---|
| Create `/core` page | ✅ |
| Add form | ✅ |
| Add structured output renderer | ✅ |
| Add Supabase save | ✅ |
| Display saved output | ✅ on `/core` **and** the dashboard |
| Document prompt in `/docs` | ✅ |

## Build gates

| Gate | Requirement | Status |
|---|---|---|
| 1 — Plan | Packet complete before coding | ✅ committed before any Week 1 code |
| 2 — Build | Code, commits, deploys | ✅ 21 commits, 10+ deployments |
| 3 — Test | Tests documented, bug fixed, redeploy | ✅ stopword bug found → fixed → redeployed |
| 4 — Explain | Demo + decision note | 🔲 **you** |

---

## Evidence checklist

| Required | Minimum | Actual | Where |
|---|---|---|---|
| Live `/core` loads | — | ✅ HTTP 200 | link above |
| Build Discipline Packet | before coding | ✅ | [`BUILD_DISCIPLINE_PACKET.md`](BUILD_DISCIPLINE_PACKET.md) |
| UX mockup / wireframe | 1 | ✅ | [`wireframe.svg`](wireframe.svg) |
| Product spec + acceptance criteria | testable | ✅ | in the packet |
| Architecture sketch | data flow | ✅ 3 diagrams | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| GitHub commits | 5 | ✅ **21** | repo |
| Vercel deployments | 2 | ✅ **10+** | Vercel dashboard |
| Supabase evidence | table/data | ✅ rows verified | [`TEST_EVIDENCE.md`](TEST_EVIDENCE.md) |
| Prompt log | 5 | ✅ **6** | [`PROMPT_LOG.md`](PROMPT_LOG.md) |
| Test evidence | 3 | ✅ **6 runs + validation + resilience** | [`TEST_EVIDENCE.md`](TEST_EVIDENCE.md) |
| Iteration log | what changed after testing | ✅ **8 entries** | [`ITERATION_LOG.md`](ITERATION_LOG.md) |
| Demo video | 2–3 min | 🔲 **you** | — |
| Human Decision Note | 150–250 words | 🔲 **you** | material in [`DECISION_NOTE_MATERIAL.md`](DECISION_NOTE_MATERIAL.md) |

---

## 🔲 What's left for you

### 1. Screenshots
- [ ] Supabase → Table Editor → `core_outputs` showing saved rows
- [ ] `/core` **before** extraction (empty form)
- [ ] `/core` **after** extraction — output card with the **Claude** badge visible
- [ ] Dashboard showing the "Recent extractions" panel
- [ ] Vercel → Deployments
- [ ] GitHub → Commits showing 21
- [ ] The Mermaid diagrams in `ARCHITECTURE.md`, viewed on GitHub

### 2. Demo video (2–3 min)

| Time | Content |
|---|---|
| 0:00–0:20 | The problem — client details arrive as prose, not as form fields |
| 0:20–1:10 | Paste a messy brief into `/core`. Point out **"end of next month" → a real date** — the thing pattern matching cannot do |
| 1:10–1:35 | Click Save. Show the row appear in the Supabase table |
| 1:35–1:55 | Dashboard → "Recent extractions" shows it. The module feeds the product |
| 1:55–2:30 | The engineering decision: the fallback, and how it hid a broken deployment twice |

> Strongest possible moment: **show the "Claude" badge, then explain that for
> several deployments it said "Pattern matching" and nobody could tell.** That's
> the story of this project.

### 3. Human Decision Note
150–250 words, from [`DECISION_NOTE_MATERIAL.md`](DECISION_NOTE_MATERIAL.md).
Decisions, rejections, **and** corrections.

### 4. Assemble one PDF and submit to Dropbox

---

## One-paragraph summary

> ServicePro Core converts an unstructured client brief — an email, a Slack
> message, a note — into a validated, structured project record. A freelancer
> pastes what the client actually wrote; the module returns project name,
> client, rate, hours, deadline, and status, along with a note stating what was
> inferred versus stated. Every field is nullable, because a brief that omits a
> rate must produce nothing rather than a guess. Extraction runs server-side
> against Claude, validated by a shared schema; if the API key is absent or the
> response fails validation, a deterministic extractor takes over and the
> response says so. That fallback is why the page works for anyone cloning the
> repo without credentials — and why the deployed site quietly ran without the
> model for several deployments until the response was queried directly rather
> than trusted.
