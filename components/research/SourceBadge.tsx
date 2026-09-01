import type { Confidence } from "@/types/research";
import { CONFIDENCE_LABEL, CONFIDENCE_MEANING } from "@/types/research";

/*
  Confidence and provenance, shown on every factual claim.

  This is the Week 2 equivalent of Week 1's ExtractorBadge, and it exists for
  the same reason: a research page can present an invented figure exactly as
  convincingly as a real one, and nothing on screen would distinguish them.

  So the weakest state is the loudest. An unsourced claim renders amber and
  says "unsourced" rather than quietly appearing as fact.
*/

const STYLES: Record<Confidence, string> = {
  verified: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  reported: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
  estimated: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
};

export default function SourceBadge({
  confidence,
  sourceUrl,
  verifiedOn,
  className = "",
}: {
  confidence: Confidence;
  sourceUrl: string | null;
  verifiedOn: string | null;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        title={CONFIDENCE_MEANING[confidence]}
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ring-1 ring-inset ${STYLES[confidence]}`}
      >
        {CONFIDENCE_LABEL[confidence]}
      </span>

      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-faint hover:text-accent-soft focus-visible:ring-accent rounded text-[11px] underline underline-offset-2 focus-visible:ring-2 focus-visible:outline-none"
        >
          source{verifiedOn ? ` · ${verifiedOn}` : ""}
        </a>
      ) : (
        /* No link is not a missing link — it is the finding. */
        <span className="text-ink-faint text-[11px] italic">unsourced</span>
      )}
    </span>
  );
}
