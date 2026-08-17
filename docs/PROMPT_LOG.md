# 🤖 Coding Agent Prompt Log

**Agent used:** Claude Code (Opus 5), running in VS Code
**Requirement:** minimum 5 prompts
**Status:** 4 logged / 5 minimum

This is a live record of the actual prompts sent to the coding agent, in order,
with what each one produced and what had to be corrected. Prompts are recorded
verbatim where practical; long attachments are summarized in brackets.

---

## Prompt 1 — Planning, with an explicit no-code constraint
**Sent:** Aug 17, 2026 · *Attachment: `Claude_Handoff_Document.md`*

> `__ASK__` Read the attached document and begin to plan out the development for the website.
>
> `__CONSTRAINT__` DO NOT build anything yet, to start I want to create an organized plan for the development of the website before generating any code

**Outcome:** Produced `Development_Plan.md` — directory structure, data model, design tokens, phased build.

**Why the constraint mattered:** Forcing a planning pass before codegen surfaced seven
contradictions across the source documents that would otherwise have become bugs. The two
most costly:
- The handoff asks for a 4-item sidebar (§2.1) *and* forbids routing (§4) — mutually exclusive as written.
- Missing Supabase env vars would crash the **Vercel build**, not just the request, meaning the
  documented mock-data fallback could never run. This alone would have cost the deployment points.

---

## Prompt 2 — Validate the plan against the real assignment
**Sent:** Aug 17, 2026 · *Attachment: Week 0 Dropbox Assignment PDF*

> This is the file the my website is supposed to be based off of. please read this file and make sure that everything development matches before coding

**Outcome:** Revealed that the handoff document is a *coding* spec while the assignment grades an
*evidence packet*. Seven required deliverables were missing from the plan entirely: 2+ deployments,
the prompt log, an iteration log, a visual architecture sketch, the demo video, Supabase data
evidence, and the assembled submission document.

**Correction made:** The build order was **restructured**. The original plan deployed once, at the
end. Because "no live deployment = max 5/10," deployment moved to Phase 4 — immediately after the
mock UI is presentable and *before* Supabase work begins — so the grade floor is secured early
rather than depending on the final hour.

**Rejected approach:** Leaving Supabase as an optional stretch. The handoff's mock-data fallback is
good engineering but a grading liability: a dashboard rendering perfectly off `mock-data.ts` earns
nothing for "Supabase evidence." Supabase became mandatory, with the fallback retained purely as
resilience.

---

## Prompt 3 — Validate against the point-weighted rubric, then build
**Sent:** Aug 17, 2026 · *Attachment: Week 0 Rubric PDF*

> I just attached the rubric to make sure everything matches as well. Please begin phase 1 and create a handoff document when you use up all available tokens

**Outcome:** Rubric analysis showed **4.5 of 10 points** sit in planning documentation
(build discipline 1.5, UX planning 1.0, product spec 1.0, architecture 1.0) versus 2.0 for the
deployed product. Three gaps found against the rubric's exact wording — a required UX
*implementation note*, acceptance criteria that are explicitly *testable*, and a *stack table*
rather than prose. Phase 1 then executed.

---

## Prompt 4 — Original packet prompt (written before agent work began)
**Source:** `Build_Discipline_Packet.md` → "Coding Agent Prompt" section

> "Create a Next.js homepage (`page.tsx`) using Tailwind CSS that serves as a freelancer 'Projects'
> dashboard. Strictly use a premium dark-mode aesthetic with slate/charcoal backgrounds and
> indigo/purple accents. Include a sidebar, a main content area with three critical summary stats
> (Unpaid Invoices, This Month's Earnings, Active Workload), and a table for projects. The table
> columns should be Project Name, Client, Actionable Status (In Progress, Awaiting Review, Invoice
> Sent, Overdue), Deadline, and Financial Value (Total Invoice). Connect to Supabase via
> `@supabase/supabase-js` to fetch this data if available, otherwise show a clean fallback UI with
> mock data."

**Outcome:** Served as the source spec that was expanded into the full handoff document. Retained
here as the original intent statement.

---

## Prompt 5 — *(pending — Phase 2/3 UI implementation)*

---

## Notes on agent usage

Corrections the agent required, worth recording for the Human Decision Note:
1. It initially planned a single end-of-project deployment; the assignment's grade cap forced a rewrite.
2. Its first plan treated the Supabase step as gated/optional; the rubric made it mandatory.
3. During Phase 1 it caught that the generated `.gitignore` pattern `.env*` would have silently
   excluded `.env.example` from the repo — a file that must be committed.
