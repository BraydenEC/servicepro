import Link from "next/link";
import { researchSummary } from "@/lib/research/data";

/*
  Dashboard widget — the required surface for Week 2 on the main page.

  It leads with the number that is the whole argument: how many surveyed
  products do both halves of the job. That figure is computed from the dataset
  rather than written here, so the widget cannot claim something the research
  page contradicts.
*/

export default function ResearchWidget() {
  const s = researchSummary();

  return (
    <section
      aria-labelledby="research-widget-heading"
      className="border-hairline bg-surface rounded-xl border"
    >
      <div className="border-hairline flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h2 id="research-widget-heading" className="text-[15px] font-semibold">
            Market research
          </h2>
          <p className="text-ink-faint mt-0.5 text-xs">
            {s.playersSurveyed} products surveyed · verified {s.verifiedOn}
          </p>
        </div>
        <Link
          href="/research"
          className="focus-visible:ring-accent text-accent-soft hover:bg-accent/10 shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          Open Research →
        </Link>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="numeric text-2xl font-semibold tracking-tight">
              {s.withProjectTracking}
            </p>
            <p className="text-ink-muted mt-0.5 text-xs">Track projects</p>
          </div>
          <div>
            <p className="numeric text-2xl font-semibold tracking-tight">
              {s.withCfdi}
            </p>
            <p className="text-ink-muted mt-0.5 text-xs">Can issue a CFDI</p>
          </div>
          <div>
            <p className="numeric text-accent-soft text-2xl font-semibold tracking-tight">
              {s.withBoth}
            </p>
            <p className="text-ink-muted mt-0.5 text-xs">Do both</p>
          </div>
        </div>

        <p className="text-ink-muted border-hairline mt-4 border-t pt-4 text-sm leading-relaxed">
          A Mexican freelancer cannot issue a legal invoice from any tool that
          tracks their work. The gap is structural, not a matter of
          organisation.
        </p>
      </div>
    </section>
  );
}
