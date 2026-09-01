import BenchmarkCards from "@/components/research/BenchmarkCards";
import MexicoPanel from "@/components/research/MexicoPanel";
import Sidebar from "@/components/Sidebar";
import { researchSummary } from "@/lib/research/data";

/*
  /research — the Week 2 module.

  Unlike the dashboard and /core, this page is a *document* rather than an
  instrument panel: longer prose, wider measure, and a verification badge on
  every factual claim. The argument is the product here, so the page is built
  to be read and checked rather than operated.
*/

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Research & Benchmarking — ServicePro",
  description:
    "Evidence that the problem is real: competitors, substitutes, benchmarks, and the CFDI gap in the Mexican market.",
};

export default async function ResearchPage() {
  const summary = researchSummary();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <div className="relative">
          <div
            aria-hidden
            className="from-accent/8 pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b to-transparent"
          />

          <div className="relative mx-auto max-w-6xl space-y-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <header className="max-w-3xl">
              <h1 className="text-2xl font-semibold tracking-tight">
                Research &amp; Benchmarking
              </h1>
              <p className="text-ink-muted mt-2 text-sm leading-relaxed">
                ServicePro was built on an assumption: that freelancers lose
                money because their projects, time, and invoices live in
                separate places. This page tests that assumption against the
                market — including the possibility that it is wrong.
              </p>
            </header>

            {/* The finding, stated before the evidence. `withBoth` is computed
                from the dataset, so this claim cannot drift out of sync with
                the table that supports it. */}
            <section
              aria-label="Headline finding"
              className="border-accent/30 bg-accent/5 rounded-xl border p-5 sm:p-6"
            >
              <p className="text-lg leading-relaxed font-medium">
                Of{" "}
                <span className="text-accent-soft numeric">
                  {summary.playersSurveyed}
                </span>{" "}
                products and substitutes surveyed,{" "}
                <span className="text-accent-soft numeric">
                  {summary.withProjectTracking}
                </span>{" "}
                track projects and{" "}
                <span className="text-accent-soft numeric">
                  {summary.withCfdi}
                </span>{" "}
                can issue a Mexican CFDI —{" "}
                <span className="text-accent-soft numeric">
                  {summary.withBoth}
                </span>{" "}
                do both.
              </p>
              <p className="text-ink-muted mt-3 text-sm leading-relaxed">
                That gap is the entire thesis, and it holds from both
                directions: the global tools have the projects and cannot
                invoice legally in Mexico, while the Mexican invoicing tools are
                legally correct and do not track work.{" "}
                <span className="text-ink-faint">
                  {summary.sourced} of {summary.playersSurveyed} entries carry a
                  primary source, verified {summary.verifiedOn}. The rest are
                  marked estimated.
                </span>
              </p>
            </section>

            <BenchmarkCards />
            <MexicoPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
