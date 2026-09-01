import SourceBadge from "@/components/research/SourceBadge";
import type { SavedResearch as Record } from "@/lib/research/saved";

/*
  Saved research records from Supabase.

  The empty state matters here: this list is empty until someone saves their
  first note, and it must read as "nothing yet" rather than as a broken
  database — which, given the page renders fine without credentials, is a real
  possibility a reader might otherwise suspect.
*/

export default function SavedResearch({ records }: { records: Record[] }) {
  return (
    <section aria-labelledby="saved-research-heading" className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="saved-research-heading" className="text-lg font-semibold">
            Saved records
          </h2>
          <p className="text-ink-muted mt-1 text-sm">
            Notes structured through the intake form and persisted to Supabase.
          </p>
        </div>
        <span className="text-ink-faint shrink-0 text-xs">
          {records.length === 0
            ? "none yet"
            : `${records.length} saved`}
        </span>
      </div>

      <div className="border-hairline bg-surface rounded-xl border">
        {records.length === 0 ? (
          <p className="text-ink-faint px-5 py-8 text-center text-sm">
            Structured research notes will appear here once saved.
          </p>
        ) : (
          <ul>
            {records.map((r) => (
              <li
                key={r.id}
                className="border-hairline space-y-2 border-t px-5 py-4 first:border-t-0 sm:px-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-ink-faint text-xs">
                      {r.category} ·{" "}
                      {r.region === "mexico" ? "Mexico" : "Global"} ·{" "}
                      {r.promptVersion}
                    </p>
                  </div>
                  <SourceBadge
                    confidence={r.confidence}
                    sourceUrl={r.sourceUrl}
                    verifiedOn={r.verifiedOn}
                  />
                </div>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {r.summary}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
