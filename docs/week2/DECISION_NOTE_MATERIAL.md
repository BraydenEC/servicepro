# 🧠 Week 2 — Human Decision Note material

**Requirement:** 150–250 words on decisions, rejections, corrections, and tradeoffs.
**Write it yourself.** This is raw material, not a draft to paste.

Your Week 0 feedback was that the note was thinner than the reasoning shown elsewhere. Week 1
fixed that by leading with a decision that cost something. Week 2 has a different and arguably
better angle available.

---

## ⭐ The strongest angle: designing against your own tool

Weeks 0 and 1 both failed the same way — correct code, unconfigured environment — and both were
caught by querying production. Week 2's failure mode is different and worse: **a research module
asks for exactly the material a language model invents fluently.** A fabricated statistic looks
identical to a real one, reads more quotably, and no test detects it by reading.

So the decision was to design the schema against the tool building it: `source_url` on every
record, `confidence` required, and four independent checks against invented citations.

**The rejection worth naming:** making `source_url` `NOT NULL`. It looks like the responsible
choice and it is worse — a required source field pushes people to paste a plausible-looking link
to satisfy the constraint, which is fabrication with extra steps. The schema was built to make an
unsourced claim *visible* rather than impossible.

**The tradeoff:** the page is less impressive as a result. Three substitutes render amber and say
"unsourced" instead of quietly appearing as fact, and several claims are marked `reported` rather
than `verified`. It reads as less authoritative than a page willing to overstate itself.

---

## Other material

**A correction that changed the product, not just the code.** Weeks 0 and 1 framed fragmentation
as a discipline problem — freelancers being disorganised across three tools. The research showed
no surveyed product does both halves, and that CFDI requires a government-authorised PAC rather
than a better invoice template. The problem is structural, not behavioural. That is a better
problem to be solving, and it was invisible until the research was done.

**A correction against your own interest.** FreshBooks currently advertises 90% off. Recording
$2.30 as "the price" would have been technically true and materially false, so list price is
recorded instead. Similarly, Harvest's free tier was reclassified from a freemium on-ramp to a
genuine competitor — free forever for one seat is a complete product for a solo freelancer, and
any pricing argument has to beat free. Both make the analysis less flattering and more honest.

**A test that lied.** The source-resolution check first reported every citation broken. The data
was fine; zsh does not word-split unquoted expansions, so the whole URL list went to `curl` as
one argument. The instinct was to suspect the sources. **A test reporting a false failure is as
dangerous as one reporting a false pass** — both mean you are reading the harness, not the code.

**Instruction is not enforcement.** The prompt forbids inventing URLs. That was judged
insufficient, so the code discards any returned URL not present in the original note.

---

## Writing tips

- The strongest sentence available: *"I designed the schema against the tool I was using to fill it."*
- Name the `NOT NULL` rejection — it shows a considered choice between two defensible options.
- The tradeoff has two sides: **more honest, less impressive.** Say both.
- 150–250 words is two solid paragraphs. Two ideas told properly beats six listed.
