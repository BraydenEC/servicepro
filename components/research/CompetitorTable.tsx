"use client";

import { useMemo, useState } from "react";
import SourceBadge from "@/components/research/SourceBadge";
import { applyFilters } from "@/lib/research/filter";
import type { CategoryFilter, RegionFilter } from "@/lib/research/filter";
import { CATEGORY_LABEL } from "@/types/research";
import type { Player } from "@/types/research";

/*
  Competitors and substitutes, with filter and search.

  This is the first Client Component in the project — Weeks 0 and 1 were
  entirely server-rendered. Filtering has to feel instant, and a network round
  trip per keystroke for eleven rows would be absurd, so the full dataset is
  passed from the server once and narrowed in the browser.

  Substitutes sit in the same table as funded products rather than in a
  sidebar, because the honest competitive picture is that the incumbent is a
  spreadsheet. Segregating them would flatter the analysis.
*/

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All categories" },
  { value: "freelance_suite", label: CATEGORY_LABEL.freelance_suite },
  { value: "time_tracking", label: CATEGORY_LABEL.time_tracking },
  { value: "invoicing_cfdi", label: CATEGORY_LABEL.invoicing_cfdi },
  { value: "substitute", label: CATEGORY_LABEL.substitute },
];

const REGION_OPTIONS: { value: RegionFilter; label: string }[] = [
  { value: "all", label: "All regions" },
  { value: "global", label: "Global" },
  { value: "mexico", label: "Mexico" },
];

function Capability({ has, label }: { has: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${
        has ? "text-emerald-300" : "text-ink-faint"
      }`}
    >
      <span aria-hidden>{has ? "✓" : "—"}</span>
      <span className="sr-only">{has ? `has ${label}` : `no ${label}`}</span>
      <span aria-hidden>{label}</span>
    </span>
  );
}

const selectClass =
  "border-hairline bg-raised/50 text-ink focus-visible:ring-accent rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none";

export default function CompetitorTable({ players }: { players: Player[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");

  /*
    Filters compose as an intersection, not a union — selecting "Mexico" and
    typing "cfdi" must narrow twice. Search covers the note as well as the
    name, because the note is where the actual finding lives.
  */
  const visible = useMemo(
    () => applyFilters(players, { query, category, region }),
    [players, query, category, region],
  );

  const isFiltered =
    query.trim() !== "" || category !== "all" || region !== "all";

  function reset() {
    setQuery("");
    setCategory("all");
    setRegion("all");
  }

  return (
    <section aria-labelledby="competitors-heading" className="space-y-4">
      <div>
        <h2 id="competitors-heading" className="text-lg font-semibold">
          Competitors &amp; substitutes
        </h2>
        <p className="text-ink-muted mt-1 text-sm">
          Eleven entries. Substitutes are included on equal terms — the product
          most freelancers actually use is a spreadsheet.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="competitor-search" className="sr-only">
            Search competitors and substitutes
          </label>
          <input
            id="competitor-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, pricing, or finding…"
            className="border-hairline bg-raised/50 text-ink placeholder:text-ink-faint focus-visible:ring-accent w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>

        <label htmlFor="competitor-category" className="sr-only">
          Filter by category
        </label>
        <select
          id="competitor-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryFilter)}
          className={selectClass}
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <label htmlFor="competitor-region" className="sr-only">
          Filter by region
        </label>
        <select
          id="competitor-region"
          value={region}
          onChange={(e) => setRegion(e.target.value as RegionFilter)}
          className={selectClass}
        >
          {REGION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Live count — announced to screen readers, since filtering changes the
          page without any navigation the reader would otherwise notice. */}
      <p aria-live="polite" className="text-ink-faint text-xs">
        Showing {visible.length} of {players.length}
        {isFiltered && (
          <>
            {" · "}
            <button
              type="button"
              onClick={reset}
              className="text-accent-soft focus-visible:ring-accent rounded underline underline-offset-2 focus-visible:ring-2 focus-visible:outline-none"
            >
              clear filters
            </button>
          </>
        )}
      </p>

      <div className="border-hairline bg-surface overflow-hidden rounded-xl border">
        {visible.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-ink-muted text-sm">
              No products match those filters.
            </p>
            <button
              type="button"
              onClick={reset}
              className="bg-accent/10 text-accent-soft hover:bg-accent/15 focus-visible:ring-accent mt-3 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm lg:table">
              <caption className="sr-only">
                Competitors and substitutes with category, region, pricing,
                capabilities, and source.
              </caption>
              <thead className="bg-raised/50 text-ink-muted text-xs tracking-wide uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Product
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Pricing
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Capabilities
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr
                    key={p.id}
                    className="border-hairline hover:bg-raised/40 border-t align-top transition-colors"
                  >
                    <th scope="row" className="px-5 py-4 font-normal">
                      <span className="text-ink block font-medium">
                        {p.name}
                      </span>
                      <span className="text-ink-faint block text-xs">
                        {CATEGORY_LABEL[p.category]} ·{" "}
                        {p.region === "mexico" ? "Mexico" : "Global"}
                      </span>
                      <span className="text-ink-muted mt-1.5 block max-w-md text-xs leading-relaxed">
                        {p.note}
                      </span>
                    </th>
                    <td className="numeric px-5 py-4 whitespace-nowrap">
                      {p.pricing}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex flex-col gap-1">
                        <Capability has={p.projectTracking} label="Projects" />
                        <Capability has={p.cfdi} label="CFDI" />
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <SourceBadge
                        confidence={p.confidence}
                        sourceUrl={p.sourceUrl}
                        verifiedOn={p.verifiedOn}
                        className="flex-col items-start gap-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards — a four-column table at 375px is unreadable */}
            <ul className="lg:hidden">
              {visible.map((p) => (
                <li
                  key={p.id}
                  className="border-hairline space-y-2 border-t px-5 py-4 first:border-t-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-ink-faint text-xs">
                        {CATEGORY_LABEL[p.category]} ·{" "}
                        {p.region === "mexico" ? "Mexico" : "Global"}
                      </p>
                    </div>
                    <span className="numeric text-ink-muted shrink-0 text-xs">
                      {p.pricing}
                    </span>
                  </div>
                  <p className="text-ink-muted text-xs leading-relaxed">
                    {p.note}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Capability has={p.projectTracking} label="Projects" />
                    <Capability has={p.cfdi} label="CFDI" />
                    <SourceBadge
                      confidence={p.confidence}
                      sourceUrl={p.sourceUrl}
                      verifiedOn={p.verifiedOn}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
