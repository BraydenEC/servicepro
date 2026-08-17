/** The four actionable states a project can be in, per the handoff spec. */
export type ProjectStatus =
  | "in_progress"
  | "awaiting_review"
  | "invoice_sent"
  | "overdue";

export type Project = {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  /** ISO calendar date, "YYYY-MM-DD". Deliberately not a Date — see lib/format.ts. */
  deadline: string;
  hoursLogged: number;
  hourlyRate: number;
  /**
   * Fixed-fee total. When null, the project bills hourly and its value is
   * hoursLogged × hourlyRate. Supporting both billing models with one
   * nullable column avoids a second table for this sprint.
   */
  invoiceTotal: number | null;
  isPaid: boolean;
  /** ISO date the invoice was paid, or null. Drives "This Month's Earnings". */
  paidAt: string | null;
};

/** The three cash-flow figures shown above the table. */
export type DashboardMetrics = {
  unpaidInvoices: number;
  monthEarnings: number;
  activeProjects: number;
};

/** Which source the page rendered from — surfaced for debugging and demo narration. */
export type DataSource = "supabase" | "mock";
