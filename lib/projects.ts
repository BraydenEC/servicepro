import { getMockProjects } from "@/lib/mock-data";
import { projectValue } from "@/lib/format";
import type { DashboardMetrics, DataSource, Project } from "@/types/project";

/*
  Data access + metric derivation.

  Supabase is wired in during Phase 5. Until then this returns the mock set,
  but the shape and the fallback contract are already final so the page does
  not change when the database arrives.
*/

export type DashboardData = {
  projects: Project[];
  metrics: DashboardMetrics;
  source: DataSource;
};

/**
 * Derive the three cash-flow figures from whichever dataset is live.
 *
 * The handoff hardcodes these as dummy values (§2.2) while also fetching real
 * rows (§3). Hardcoding would let the cards contradict the table directly
 * beneath them — obvious on camera during the demo. Deriving them keeps the
 * two in agreement no matter which data source is active.
 */
export function deriveMetrics(
  projects: Project[],
  now: Date,
): DashboardMetrics {
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();

  // Money billed to a client but not yet received. Work still in progress
  // isn't counted — nothing has been invoiced yet, so it isn't owed.
  const unpaidInvoices = projects
    .filter(
      (p) =>
        !p.isPaid && (p.status === "invoice_sent" || p.status === "overdue"),
    )
    .reduce((sum, p) => sum + projectValue(p), 0);

  // Cash actually collected this calendar month.
  const monthEarnings = projects
    .filter((p) => {
      if (!p.isPaid || !p.paidAt) return false;
      const paid = new Date(`${p.paidAt}T00:00:00Z`);
      return (
        paid.getUTCMonth() === currentMonth &&
        paid.getUTCFullYear() === currentYear
      );
    })
    .reduce((sum, p) => sum + projectValue(p), 0);

  // Anything not yet invoiced is still live work.
  const activeProjects = projects.filter(
    (p) => p.status !== "invoice_sent",
  ).length;

  return { unpaidInvoices, monthEarnings, activeProjects };
}

/**
 * Load the dashboard.
 *
 * `now` is injected rather than read from the clock so every derived value on
 * the page — deadlines, month boundaries, relative labels — is computed from
 * one consistent instant, and so the logic stays testable.
 */
export async function getDashboardData(now: Date): Promise<DashboardData> {
  const projects = getMockProjects(now);

  return {
    projects,
    metrics: deriveMetrics(projects, now),
    source: "mock",
  };
}
