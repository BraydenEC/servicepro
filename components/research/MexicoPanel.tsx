import SourceBadge from "@/components/research/SourceBadge";

/*
  Mexico localization — the required section, and the strongest argument the
  research produced.

  Every claim here is `reported`, not `verified`: the sources are tax-advisory
  and vendor blogs rather than SAT primary documentation. The panel says so
  visibly rather than in a footnote, because a Mexican reader will know this
  material better than the page does, and overclaiming would cost more
  credibility than hedging.
*/

const CLAIMS = [
  {
    label: "CFDI 4.0 is the only valid scheme",
    detail:
      "Mandatory since April 2023; version 3.3 was permanently disabled. There is no PDF-only path.",
  },
  {
    label: "It applies to freelancers, not just companies",
    detail:
      "Every persona física with registered economic activity must issue CFDI — actividad empresarial, servicios profesionales, RESICO, and arrendamiento alike.",
  },
  {
    label: "A PAC must stamp it",
    detail:
      "The invoice is signed with a digital seal, stamped by a government-authorized certification provider, and registered with SAT. This is the moat: it is an integration requirement, not a document template.",
  },
  {
    label: "The client's data is part of the document",
    detail:
      "Exact legal name as it appears on their tax certificate, RFC, tax postal code, and tax regime. Getting any of it wrong invalidates the invoice.",
  },
  {
    label: "RESICO withholding",
    detail:
      "A company paying a RESICO freelancer withholds 1.25% ISR and remits it to SAT on their behalf — creditable, not an extra tax.",
  },
];

const SOURCE = "https://alternativo.mx/como-facturar-freelance-mexico-guia-completa-sat/";

export default function MexicoPanel() {
  return (
    <section
      aria-labelledby="mexico-heading"
      className="border-hairline bg-surface rounded-xl border"
    >
      <div className="border-hairline border-b px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="mexico-heading" className="text-lg font-semibold">
            Mexico localization — why a PDF is not an invoice
          </h2>
          <SourceBadge
            confidence="reported"
            sourceUrl={SOURCE}
            verifiedOn="2026-08-31"
          />
        </div>
        <p className="text-ink-muted mt-1 text-sm">
          The requirement that separates every product in the table below.
        </p>
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <p className="text-ink text-sm leading-relaxed">
          A Mexican freelancer cannot settle a client invoice with a PDF. Mexican
          tax law requires an electronic invoice — a{" "}
          <strong className="text-accent-soft">CFDI</strong> — issued through the
          SAT. Toggl Track describes its own invoicing as{" "}
          <em>&ldquo;generate and download PDF invoices.&rdquo;</em> In Mexico
          that is a picture of a fiscal document, not a fiscal document.
        </p>

        <ul className="space-y-3">
          {CLAIMS.map((c) => (
            <li key={c.label} className="flex gap-3">
              <span
                aria-hidden
                className="bg-accent-soft mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {c.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-accent/30 bg-accent/5 rounded-lg border p-4">
          <p className="text-sm leading-relaxed">
            <strong className="text-accent-soft">The consequence.</strong> A
            Mexican freelancer runs two systems by legal necessity, not
            disorganization — a foreign tool for projects and time, and a local
            tool for the invoice the law actually requires. The fragmentation
            ServicePro set out to solve is structural here, not a discipline
            problem.
          </p>
        </div>

        {/* Stated in the UI, not buried in a doc. The reader should know
            exactly how much weight this section can carry. */}
        <p className="text-ink-faint border-hairline border-t pt-4 text-xs leading-relaxed">
          <strong>On confidence:</strong> these claims are marked{" "}
          <em>reported</em> rather than <em>verified</em> — they come from
          tax-advisory and vendor sources, not from SAT primary documentation.
          They are consistent across several independent sources, but anyone
          relying on them for filing should confirm against SAT directly.
        </p>
      </div>
    </section>
  );
}
