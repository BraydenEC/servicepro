import type { ExtractorKind } from "@/lib/core/schema";

/*
  States plainly which code path produced a result.

  This component is the direct product of a Week 0 failure: production served
  mock data for six deployments because the fallback was designed to be
  invisible. Resilience that hides its own degradation is a liability, so here
  the degraded path announces itself.
*/

export default function ExtractorBadge({
  extractor,
  className = "",
}: {
  extractor: ExtractorKind;
  className?: string;
}) {
  const isModel = extractor === "model";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${
        isModel
          ? "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20"
          : "bg-amber-400/10 text-amber-300 ring-amber-400/20"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${isModel ? "bg-indigo-400" : "bg-amber-400"}`}
      />
      {isModel ? "Claude" : "Pattern matching"}
    </span>
  );
}
