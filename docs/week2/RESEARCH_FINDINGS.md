# 🔎 Week 2 Research Findings

**All figures below were fetched from primary sources on 2026-08-31**, not recalled from model
memory. Each entry carries its source and a confidence level.

| Confidence | Meaning |
|---|---|
| **verified** | Fetched directly from the vendor's own pricing page on the date shown |
| **reported** | From a secondary source (industry blog, tax advisory site), not the primary authority |
| **estimated** | Inference or judgment, clearly labeled as such |

> ⚠️ **Everything in §3 (Mexican tax law) is `reported`, not `verified`.** Those claims come from
> tax-advisory and vendor blogs, not from SAT primary documentation. **This is the section
> Brayden should spot-check before submission** — a Mexican business professor will know this
> material far better than either of us, and an incorrect CFDI claim is worse than a vague one.

---

## 1. The finding

The research supports the thesis, and — more usefully — it supports it **from both directions at
once**, which is stronger than a one-sided argument:

> **Global freelance tools do projects and time, and produce PDF invoices. They do not issue CFDI.
> Mexican invoicing tools issue CFDI and do not do projects or time. A Mexican freelancer
> therefore runs two systems by necessity, not by disorganization.**

Toggl Track states the gap almost verbatim in its own feature list: *"Create invoices — Generate
and download PDF invoices."* In Mexico a PDF is not a fiscal document. It is a picture of one.

**This reframes ServicePro's Week 0 premise.** Weeks 0 and 1 assumed fragmentation was a
*discipline* problem — freelancers being disorganized across three tools. For a Mexican
freelancer it is a *structural* problem: no single tool in this survey does both halves. That is
a better problem to be solving, and it was not visible before this research.

---

## 2. Global tools — projects and time, no CFDI

All five fetched from vendor pricing pages, 2026-08-31. **All five: no mention of CFDI, SAT, or
Mexican electronic invoicing anywhere on their pricing pages.**

| Product | Pricing | Invoicing | CFDI | Confidence |
|---|---|---|---|---|
| **Harvest** | Free (1 seat, 2 projects) · Teams $9/seat/mo · Enterprise $14/seat/mo | Yes, all tiers | ❌ None | verified |
| **Bonsai** | Basic $15 · Essentials $25 · Premium $39 · Elite $59 /user/mo (monthly); $9/$19/$29/$49 annual | Yes, Essentials+ | ❌ None | verified |
| **FreshBooks** | **List: Lite $23 · Plus $43 · Premium $70/mo.** Currently discounted 90% for 3 months | Yes | ❌ None | verified |
| **Toggl Track** | Free · Starter $9 · Premium $14/license/mo (first year, then $18) | Yes — **"download PDF invoices"** | ❌ None | verified |
| **Clockify** | Free (5 users) · Basic $3.99 · Standard $5.49 · Pro $7.99 · Enterprise $11.99/seat/mo annual | Yes, Standard+ | ❌ None | verified |

**Note on FreshBooks:** the pricing page currently shows $2.30/$4.30/$7.00, which is a
limited-time 90%-off-for-three-months promotion. **The list prices above are the honest figures**
— quoting the promotional rate as the price would be exactly the kind of misleading precision
this module is supposed to avoid.

**Note on Harvest's free tier:** genuinely free forever for one seat with two projects. For a
solo freelancer with few concurrent clients, **Harvest free is a real competitor to ServicePro,**
not a trial. Worth stating plainly rather than burying.

---

## 3. Mexican requirement — ⚠️ needs Brayden's spot-check

**Confidence: `reported`.** Sources are tax-advisory and vendor blogs, not SAT primary docs.

| Claim | Detail | Source type |
|---|---|---|
| CFDI 4.0 is mandatory | Sole valid scheme since 2023-04-01; version 3.3 permanently disabled | reported |
| Applies to freelancers | Every persona física with registered economic activity must issue CFDI — including actividad empresarial, servicios profesionales, RESICO, arrendamiento | reported |
| A PAC is required | The CFDI is signed with a digital seal, **stamped by an Authorized Certification Provider (PAC)**, and registered with SAT | reported |
| Required fields | Recipient's exact legal name as on their tax certificate, RFC, tax postal code, and tax regime | reported |
| RESICO | Regime for freelancers under ~3.5M MXN annual income; ISR roughly 1%–2.5% of amounts actually collected | reported |
| Withholding | A persona moral paying a RESICO persona física withholds **1.25% ISR**, creditable against monthly ISR | reported |

**Why the PAC detail matters for the product argument:** it means CFDI is not a document-formatting
problem a foreign vendor could solve with a template. It requires integration with a
government-authorized intermediary. That is a regulatory moat, and it explains why the global
tools have not crossed it — and, conversely, why a Mexican vendor adding a project table is the
likelier way this gap closes.

**Spot-check list for Brayden — six claims:** the 2023-04-01 date, the RESICO income threshold,
the 1.25% withholding rate, the ISR range, whether the required-fields list is complete, and
whether any regulation changed in 2026 that these sources have not picked up.

---

## 4. Mexican tools — CFDI, no projects or time

| Product | Pricing (MXN/mo) | CFDI | Projects / time tracking | Confidence |
|---|---|---|---|---|
| **Alegra México** | Facturación: Inicial $187 · Pro $337 · Plus $524 (annual, 25% off) | ✅ Unlimited CFDI | ❌ **Not mentioned on any tier** | verified |
| **Facturama** | $110 (25 invoices/yr) up to $1,650 (unlimited) | ✅ All CFDI types, with timbrado | ❌ Invoicing, payroll, fiscal only | verified |
| **gigstack** | Plan Pro ~$890 | ✅ CFDI 4.0 automation, SAT reconciliation, self-invoicing portal | ❌ **States explicitly it does not include** project management, time tracking, or freelancer client tools | verified |

**gigstack is the most important entry in this table.** It is the closest thing to a direct
threat — a modern, developer-oriented Mexican CFDI platform — and it confirms the gap from the
side most likely to close it. It automates invoicing *from payment events*, which means it
assumes something else already tracked the work.

---

## 5. Substitutes — the real incumbent

Deliberately weighted equally with funded products. The thing ServicePro actually displaces is
not Harvest; it is a spreadsheet.

| Substitute | Cost | Why people use it | Confidence |
|---|---|---|---|
| **Excel / Google Sheets** | Free | Total flexibility, zero learning curve, already open | estimated |
| **WhatsApp + notes app** | Free | Where the client conversation already happens | estimated |
| **Paper / notebook** | Free | Zero friction, no account, works offline | estimated |
| **Accountant (contador)** | ~$500–$2,000 MXN/mo | Common in Mexico — outsource the fiscal problem entirely | estimated |

**These are marked `estimated` on purpose.** They are informed judgment about behavior, not
sourced facts, and labeling them anything stronger would be the exact failure this module guards
against. The contador price range especially needs a real source or should stay a range.

**The strategic point:** a free spreadsheet that already works beats a paid tool that works
slightly better. Any honest competitive analysis has to reckon with the fact that the incumbent
costs nothing and never goes down.

---

## 6. Risks — including to this project's own thesis

| Risk | Likelihood | Impact | Note |
|---|---|---|---|
| A Mexican CFDI vendor adds project tracking | **High** | **High** | The likeliest way the gap closes. gigstack or Alegra adding a project table is a small step; a US vendor implementing SAT integration is not |
| Freelancers keep using spreadsheets | High | High | Free, familiar, already open. The default outcome for most tools |
| A global suite adds CFDI | Low | High | Requires PAC integration and Mexican tax expertise — a regulatory moat, not a feature gap |
| CFDI regulations change | Medium | Medium | 3.3 → 4.0 happened once and invalidated existing integrations |
| Mexican market too small for a global tool to care | Medium | Low | Explains the gap's persistence — this is *why the opportunity exists* |
| Single-developer capacity | High | Medium | Honest constraint on a course project |

**The first row is the uncomfortable one and it belongs at the top.** The strongest risk to
ServicePro is not competition from Harvest — it is that a Mexican invoicing company adds the
simpler half of the product before ServicePro adds the harder half.

---

## 7. What this changes about the product

1. **The Mexico angle is not decoration — it is the strategy.** Without CFDI, ServicePro is a
   worse Harvest. With it, it occupies a gap no surveyed product fills.
2. **The Week 0 problem statement was too weak.** "Freelancers use three tools" is a discipline
   problem. "Mexican freelancers must use two systems because no single tool is legally
   sufficient" is a structural one.
3. **Harvest's free tier is the honest benchmark**, not the paid tiers. Any pricing argument has
   to beat free.
4. **CFDI is the moat and the barrier simultaneously.** It is why no one has done this, and it is
   also why doing it is hard.

---

## Sources

Vendor pricing, fetched 2026-08-31:
[Harvest](https://www.getharvest.com/pricing) ·
[Bonsai](https://www.hellobonsai.com/pricing) ·
[FreshBooks](https://www.freshbooks.com/pricing) ·
[Toggl Track](https://toggl.com/track/pricing/) ·
[Clockify](https://clockify.me/pricing) ·
[Alegra México](https://www.alegra.com/mexico/precios/) ·
[Facturama](https://facturama.mx/) ·
[gigstack](https://gigstack.pro/)

CFDI and tax context (secondary — **spot-check required**):
[Alegra — CFDI 4.0 en 2026](https://blog.alegra.com/mexico/que-es-cfdi-4-0/) ·
[gigstack — CFDI 4.0 guía 2026](https://blog.gigstack.pro/post/cfdi-40-guia-completa-2026-emprendedores-mexico) ·
[Alternativo — Cómo facturar como freelance en México](https://alternativo.mx/como-facturar-freelance-mexico-guia-completa-sat/) ·
[Siempre Al Día — Retención ISR en RESICO](https://siemprealdia.co/mexico/fiscal/retencion-del-isr-en-el-resico/) ·
[Trámite CA Digital — RESICO Personas Físicas 2026](https://www.tramitecadigital.com/sat-impuestos-y-empresas/regimenes-fiscales/resico-personas-fisicas/)
