import CorePreview from "@/components/core/CorePreview";
import ProjectsTable from "@/components/ProjectsTable";
import Sidebar from "@/components/Sidebar";
import SummaryCards from "@/components/SummaryCards";
import { getSavedOutputs } from "@/lib/core/saved";
import { getDashboardData } from "@/lib/projects";

/*
  The dashboard — the single route this sprint delivers.

  A Server Component, so the data fetch happens before HTML is sent: no
  loading spinner, no client-side waterfall, and no Supabase round trip from
  the browser.

  `now` is captured once here and threaded down to every child. Reading the
  clock inside components would let two of them disagree across a midnight
  boundary and would risk server/client hydration mismatches.
*/

/*
  Render per request, never at build time.

  Without this the route prerenders as static and `new Date()` is frozen into
  the HTML at build time — so "in 3 days" would count from whenever the site
  was last deployed and drift further wrong every day it sits unbuilt. The
  deadline column is the whole point of the table, so it has to be computed
  against the viewer's actual today.

  Segment configs like this still apply in Next 16 because `cacheComponents`
  is off (the default). This is also what Phase 5 needs so Supabase edits
  appear on refresh instead of being cached from the last build.
*/
export const dynamic = "force-dynamic";

export default async function Home() {
  const now = new Date();

  /*
    Both reads are independent, so they run concurrently rather than in
    sequence — awaiting them one after the other would add the core query's
    latency to every dashboard render for no reason.

    getSavedOutputs never throws: an unconfigured or unreachable database
    returns an empty list, which the preview renders as its empty state. The
    dashboard cannot be broken by the core module failing.
  */
  const [{ projects, metrics, source }, savedOutputs] = await Promise.all([
    getDashboardData(now),
    getSavedOutputs(4),
  ]);

  return (
    /*
      `data-source` records whether this render came from Supabase or the mock
      fallback. It exists because the two are deliberately indistinguishable to
      a viewer — same projects, same figures — which is the right behaviour for
      resilience but leaves no way to prove the deployed site is actually
      reading the database.

      An attribute rather than visible UI: it must not look like a debug badge
      on a finished product, but `curl … | grep data-source` answers the
      question in one command.
    */
    <div data-source={source} className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <div className="relative">
          {/* The only decorative effect in the design — depth otherwise comes
              from 1px hairlines and generous spacing rather than shadows. */}
          <div
            aria-hidden
            className="from-accent/8 pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b to-transparent"
          />

          <div className="relative mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <header>
              <h1 className="text-2xl font-semibold tracking-tight">
                Projects Overview
              </h1>
              <p className="text-ink-muted mt-1 text-sm">
                Welcome back — here&rsquo;s where your money and deadlines
                stand.
              </p>
            </header>

            <SummaryCards metrics={metrics} />
            <ProjectsTable projects={projects} now={now} />
            <CorePreview outputs={savedOutputs} now={now} />
          </div>
        </div>
      </main>
    </div>
  );
}
