import type { ProjectStatus } from "@/types/project";

/*
  Status pill.

  Colour carries meaning here, so it can't be the only signal — the label is
  always present, which keeps the badge readable for colour-blind viewers and
  in a greyscale printout of the submission PDF.

  Tailwind v4 scans source files for complete class strings, so these are
  written out in full rather than assembled from fragments. `bg-${color}/10`
  would silently produce no styles.
*/

const STYLES: Record<ProjectStatus, { label: string; className: string }> = {
  in_progress: {
    label: "In Progress",
    className: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20",
  },
  awaiting_review: {
    label: "Awaiting Review",
    className: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  },
  invoice_sent: {
    label: "Invoice Sent",
    className: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
  },
  overdue: {
    label: "Overdue",
    className: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
  },
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = STYLES[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}
