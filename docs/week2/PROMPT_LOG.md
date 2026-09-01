# 🤖 Week 2 Coding Agent Prompt Log

**Agent:** Claude Code (Opus 5) in VS Code · **Requirement:** minimum 5 · **Delivered:** 6

---

## Prompt 1 — Plan before building
> Read these documents and create a plan/outline for what there is to work on for Week 2/Module 2

Produced `PLAN.md`. The output that mattered was not the task list but the identification of this
week's characteristic failure: unlike Weeks 0 and 1, which failed on configuration, a research
module fails by fabrication — and no test catches an invented statistic by reading it. Verification
was designed into the schema before any code existed.

## Prompt 2 — Choose an approach
> What are the options you have, and out of them what do you recommend most?

Four sourcing options were laid out. Drafting from memory was rejected on the grounds that the
model's training cutoff predates the assignment, so every figure would be stale and confident.
The chosen split: live verification of vendor pricing, with the Mexican tax claims spot-checked
by a human, because a Mexican business professor will know that material better than either
party and an incorrect CFDI claim is worse than a hedged one.

## Prompt 3 — Gate 1
> please start working on Phase 2 create a handoff document when finished

Research executed against primary sources — nine vendor and reference pages fetched and dated.
The finding came back stronger than expected because it held from both directions: five global
tools with projects and no CFDI, three Mexican tools with CFDI and no projects.

## Prompt 4 — Completeness audit
> Is Week 2 fully finished according to the rubric and required contents?

Answered no, with evidence: `/research` returned HTTP 404, no code existed, and the rubric caps
written-work-without-code at 5/10. As in Week 1, the audit prompt produced no code and identified
the most consequential gap.

## Prompt 5 — Build
> please continue to work on Week 2 until fully finished, when done create a handoff document for the next week

Built all eight required features across five phases, deploying at Phase 3 rather than at the end
so the deployment cap was cleared before the remaining work began.

## Prompt 6 — Continue after interruption
> please continue working

Completed the intake form, saved-records display, dashboard widget, six software tests, and the
evidence documents.

---

## Observation across three weeks

The highest-value prompts in this project have consistently been **audits rather than build
requests**. Prompt 4 wrote no code and found that the required page did not exist. The same
pattern held in Week 1, where an audit found that production had never once called the model, and
in Week 0, where a planning constraint surfaced seven contradictions before a line was written.

Asking *"is this actually done?"* has outperformed asking *"build this"* every single week.
