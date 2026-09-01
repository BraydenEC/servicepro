/*
  Executable test for the competitor filter.

  Run: npm run test:filters

  No test framework — this project has added one dependency in three weeks and
  a handful of assertions does not justify a second. The point is that these
  results are produced by running the code, not by reading it.
*/

import { applyFilters } from "@/lib/research/filter";
import { PLAYERS } from "@/lib/research/data";
import type { FilterState } from "@/lib/research/filter";

type Case = {
  name: string;
  state: FilterState;
  expected: number;
  /** Optional stricter check on which rows came back. */
  expectIds?: string[];
};

const base: FilterState = { query: "", category: "all", region: "all" };

const CASES: Case[] = [
  { name: "no filters returns everything", state: base, expected: 11 },

  {
    name: "category = substitute",
    state: { ...base, category: "substitute" },
    expected: 3,
    expectIds: ["spreadsheet", "whatsapp-notes", "contador"],
  },
  {
    name: "category = invoicing_cfdi",
    state: { ...base, category: "invoicing_cfdi" },
    expected: 3,
    expectIds: ["alegra", "facturama", "gigstack"],
  },
  { name: "region = mexico", state: { ...base, region: "mexico" }, expected: 5 },
  { name: "region = global", state: { ...base, region: "global" }, expected: 6 },

  // The composition cases — the actual claim under test.
  {
    name: "mexico AND invoicing_cfdi intersects",
    state: { ...base, region: "mexico", category: "invoicing_cfdi" },
    expected: 3,
    expectIds: ["alegra", "facturama", "gigstack"],
  },
  {
    name: "global AND substitute intersects (not union)",
    state: { ...base, region: "global", category: "substitute" },
    expected: 1,
    expectIds: ["spreadsheet"],
  },

  // Search.
  { name: "search matches a name", state: { ...base, query: "harvest" }, expected: 1 },
  { name: "search is case-insensitive", state: { ...base, query: "HARVEST" }, expected: 1 },
  // 8, not 6: every global tool's note says it has no CFDI, and the three
  // Mexican tools match on both note and category label. Counted by hand
  // first at 6 — the test was wrong, not the filter.
  { name: "search matches note text", state: { ...base, query: "cfdi" }, expected: 8 },
  { name: "search matches pricing", state: { ...base, query: "mxn" }, expected: 4 },
  { name: "whitespace-only query is ignored", state: { ...base, query: "   " }, expected: 11 },
  { name: "no match yields empty", state: { ...base, query: "zzzznope" }, expected: 0 },

  // Search + filter compose.
  {
    name: "search AND category compose",
    state: { ...base, query: "cfdi", category: "invoicing_cfdi" },
    expected: 3,
  },
  {
    // 6, not 3. "free" is a substring of "Freelance suite", so Bonsai and
    // FreshBooks match on their category label rather than on price. Known
    // and accepted: substring search across the label is what makes
    // "invoicing" and "substitute" findable, and the same mechanism produces
    // this. Documented rather than special-cased.
    name: "search AND region compose",
    state: { ...base, query: "free", region: "global" },
    expected: 6,
  },
  {
    name: 'known: "free" matches the "Freelance suite" label',
    state: { ...base, query: "free", category: "freelance_suite" },
    expected: 2,
    expectIds: ["bonsai", "freshbooks"],
  },
];

let passed = 0;
let failed = 0;

console.log("\nFilter composition tests\n" + "─".repeat(64));

for (const c of CASES) {
  const got = applyFilters(PLAYERS, c.state);
  const countOk = got.length === c.expected;
  const idsOk =
    !c.expectIds ||
    (got.length === c.expectIds.length &&
      c.expectIds.every((id) => got.some((p) => p.id === id)));

  if (countOk && idsOk) {
    passed++;
    console.log(`  PASS  ${c.name}  →  ${got.length}`);
  } else {
    failed++;
    console.log(
      `  FAIL  ${c.name}  →  expected ${c.expected}, got ${got.length}` +
        (c.expectIds ? `\n        ids: ${got.map((p) => p.id).join(", ")}` : ""),
    );
  }
}

/*
  The property that matters most, checked separately: adding a constraint can
  only ever narrow. A filter bug that ORs instead of ANDs would pass several
  individual cases above while failing this.
*/
console.log("─".repeat(64));
const all = applyFilters(PLAYERS, base).length;
let monotonic = true;
for (const category of ["substitute", "invoicing_cfdi", "time_tracking", "freelance_suite"] as const) {
  for (const region of ["global", "mexico"] as const) {
    const one = applyFilters(PLAYERS, { ...base, category }).length;
    const two = applyFilters(PLAYERS, { ...base, category, region }).length;
    if (two > one || one > all) monotonic = false;
  }
}
if (monotonic) {
  passed++;
  console.log("  PASS  adding a constraint never widens the result");
} else {
  failed++;
  console.log("  FAIL  adding a constraint widened the result — filters are ORing");
}

console.log("─".repeat(64));
console.log(`\n  ${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
