import { CATEGORY_LABEL } from "@/types/research";
import type { Player, PlayerCategory, Region } from "@/types/research";

/*
  Filter predicate, extracted from CompetitorTable so it can be executed
  directly by a test rather than exercised only through a browser.

  This was pulled out because the Week 2 acceptance criteria claimed that
  filter and search compose as an intersection, and that claim had been
  verified by reading the code rather than by running it. For a week whose
  entire subject is the difference between a plausible assertion and a checked
  one, an untested "PASS" was the wrong thing to ship.
*/

export type CategoryFilter = PlayerCategory | "all";
export type RegionFilter = Region | "all";

export type FilterState = {
  query: string;
  category: CategoryFilter;
  region: RegionFilter;
};

export function matchesFilter(p: Player, state: FilterState): boolean {
  if (state.category !== "all" && p.category !== state.category) return false;
  if (state.region !== "all" && p.region !== state.region) return false;

  const q = state.query.trim().toLowerCase();
  if (!q) return true;

  return (
    p.name.toLowerCase().includes(q) ||
    p.note.toLowerCase().includes(q) ||
    p.pricing.toLowerCase().includes(q) ||
    CATEGORY_LABEL[p.category].toLowerCase().includes(q)
  );
}

/** Constraints AND together — adding one must never widen the result. */
export function applyFilters(players: Player[], state: FilterState): Player[] {
  return players.filter((p) => matchesFilter(p, state));
}
