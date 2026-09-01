# 🤝 Week 2 Handoff — end of Phase 2 (research)

**Last updated:** 2026-08-31
**Project root:** `/Users/braydencredeur/Antigravity/Website/Dev/servicepro`
**Plan:** `docs/week2/PLAN.md` · **Gate 1 packet:** `docs/week2/BUILD_DISCIPLINE_PACKET.md`

---

## TL;DR

**Gates 1 and Phase 2 are done.** The Build Discipline Packet was committed before any Week 2
code exists, and the research is complete with every figure fetched from a primary source on
2026-08-31 rather than recalled.

**Next action: Phase 3** — build the `/research` page shell with benchmark cards and the Mexico
panel, then deploy early. Nothing is blocked. No new environment variables and no new
dependencies are required this week.

```bash
cd /Users/braydencredeur/Antigravity/Website/Dev/servicepro
npm run dev     # → http://localhost:3000
```

---

## What Phase 2 established

The research supports the thesis **from both directions**, which is stronger than a one-sided
argument:

- **Five global tools** (Harvest, Bonsai, FreshBooks, Toggl, Clockify) — projects and time
  tracking, PDF invoices, **zero CFDI support** on any pricing page.
- **Three Mexican tools** (Alegra, Facturama, gigstack) — full CFDI with timbrado, **no project
  or time tracking**. gigstack states the absence explicitly.

So a Mexican freelancer runs two systems by legal necessity, not disorganization. Toggl phrases
the gap itself: *"Generate and download PDF invoices."* In Mexico a PDF is a picture of a fiscal
document, not a fiscal document.

**This reframes the product.** Weeks 0–1 treated fragmentation as a discipline problem. It is a
structural one, and that is a better problem to be solving. The Week 2 packet's problem statement
already anticipated this; the research confirmed it.

---

## ⚠️ The one thing that needs a human before submission

**Everything in `RESEARCH_FINDINGS.md` §3 is marked `reported`, not `verified`.** Mexican tax
claims come from tax-advisory and vendor blogs, not SAT primary documentation.

Six specific claims for Brayden to spot-check:

1. CFDI 4.0 mandatory since 2023-04-01, with 3.3 disabled
2. The RESICO annual income threshold (~3.5M MXN)
3. The 1.25% ISR withholding rate for personas morales paying RESICO personas físicas
4. The 1%–2.5% RESICO ISR range
5. Whether the CFDI 4.0 required-fields list is complete
6. Whether anything changed in 2026 that these secondary sources missed

A Mexican business professor will know this material cold. An incorrect CFDI claim is worse than
a hedged one — which is why the schema lets a claim ship marked unverified.

---

## Research discipline in force

Do not relax these when building the seed data:

| Rule | Why |
|---|---|
| Every figure carries a source URL and `verified_on` | The only automated fabrication check is that a cited URL returns 200 |
| Vendor pricing comes from the vendor's own page | Not from a comparison article, and not from memory |
| **List price, not promotional price** | FreshBooks currently shows a 90%-off promo. Seed data records the list price ($23/$43/$70) and notes the promo |
| Behavioral claims are `estimated` | The substitutes section is informed judgment, not sourced fact, and says so |
| Model does not invent market facts | It may structure a note supplied to it — nothing more |

---

## Findings worth preserving in the build

1. **Harvest's free tier is the real benchmark.** Free forever, 1 seat, 2 projects. For a solo
   freelancer that is a genuine competitor, not a trial. Any pricing argument must beat free.
2. **gigstack is the most important competitor row.** Modern, developer-oriented Mexican CFDI
   automation. It confirms the gap from the side most likely to close it, and it automates
   invoicing *from payment events* — meaning it assumes something else already tracked the work.
3. **The top risk is uncomfortable and belongs at the top of the risk map:** the gap most likely
   closes from the Mexican side. A CFDI vendor adding a project table is a small step; a US
   vendor implementing SAT/PAC integration is not.
4. **CFDI requires a PAC.** This is why it is a regulatory moat rather than a formatting feature,
   and it is the strongest single argument in the research.
5. **Substitutes get equal weight.** The incumbent is a spreadsheet — free, familiar, already
   open, and it never goes down.

---

## ▶️ Next: Phase 3

1. `lib/research/data.ts` — seed data typed and sourced, transcribed from `RESEARCH_FINDINGS.md`
2. `app/research/page.tsx` — Server Component shell
3. `BenchmarkCards` — 5 global examples, each showing source and verified date
4. `MexicoPanel` — the CFDI requirement and its consequence, marked `reported`
5. Add "Research" to the sidebar (a link only because it now leads somewhere — the rule has held since Week 0)
6. **Deploy.** Ship as soon as it renders, consistent with Weeks 0–1
7. Commit per phase

Then Phase 4 (competitor table + client-side filter/search — this project's **first Client
Component**), Phase 5 (risk map), Phase 6 (`research_records` + intake + save), Phase 7
(dashboard widget), Phase 8 (tests).

---

## Still outstanding for Brayden

| Item | Notes |
|---|---|
| **Human validation conversation** | 🔴 Hard requirement, cannot be produced or simulated. Script is in `PLAN.md` §7; a recording template will be provided |
| Mexico tax spot-check | The six claims above |
| Week 1 demo video, decision note, screenshots | Carried over |
| Week 2 demo video, decision note, screenshots | Later |

---

## Repository state

- **30 commits**, clean tree, pushed to `origin/main`
- Live: `/` and `/core` both HTTP 200, `/core` confirmed running the model
- Week 2 code written so far: **none** — by design, Gate 1 first

### One incident worth remembering

The Week 2 Gate 1 commit accidentally reverted the Week 1 submission document, because the file
was open in the editor with a stale buffer that overwrote the restructure, and `git add -A`
staged it. Restored in commit `18e8cb5`.

**Two lessons:** stage explicit paths rather than `-A` when a file is known to be open elsewhere,
and an editor buffer is a second writer competing with the working tree. It is the same shape as
the last two weeks — the state you believe is live is not necessarily the state that is live.
