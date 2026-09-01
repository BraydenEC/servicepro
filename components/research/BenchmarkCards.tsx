import SourceBadge from "@/components/research/SourceBadge";
import { BENCHMARKS } from "@/lib/research/data";

/*
  The five global benchmark examples required by the spec.

  Each card leads with what the product proves rather than what it is, because
  a list of five competitors is a directory; five findings is an argument.
*/

export default function BenchmarkCards() {
  return (
    <section aria-labelledby="benchmarks-heading" className="space-y-4">
      <div>
        <h2 id="benchmarks-heading" className="text-lg font-semibold">
          Five global benchmarks
        </h2>
        <p className="text-ink-muted mt-1 text-sm">
          What the established products do, and what each one proves. Pricing
          fetched from each vendor&rsquo;s own page.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {BENCHMARKS.map((b) => (
          <article
            key={b.id}
            className="border-hairline bg-surface flex flex-col rounded-xl border p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold">{b.name}</h3>
              <span className="bg-rose-400/10 text-rose-300 ring-rose-400/20 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset">
                No CFDI
              </span>
            </div>

            <p className="text-accent-soft mt-1 text-sm font-medium">
              {b.headline}
            </p>
            <p className="text-ink-muted mt-2 flex-1 text-sm leading-relaxed">
              {b.detail}
            </p>

            <p className="numeric text-ink mt-3 text-sm">{b.pricing}</p>
            <div className="border-hairline mt-3 border-t pt-3">
              <SourceBadge
                confidence={b.confidence}
                sourceUrl={b.sourceUrl}
                verifiedOn={b.verifiedOn}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
