import type { ResearchExtraction } from "@/lib/research/schema";

/*
  Deterministic fallback for research notes.

  Built first and kept permanently, same as Week 1: the page must work with no
  API key, no credit, and no network. This extractor is deliberately
  conservative — it classifies and summarises, and it never guesses a source.

  It is genuinely weaker than the model at judging category and writing a
  summary. That is fine and expected. What it is not allowed to be is
  *dishonest*, so it defaults confidence to "estimated" unless it finds an
  actual URL in the text.
*/

const CATEGORY_HINTS: [RegExp, ResearchExtraction["category"]][] = [
  [/\b(spreadsheet|excel|sheets|paper|notebook|whatsapp|accountant|contador)\b/i, "substitute"],
  [/\b(risk|threat|could|might|if .* then|danger|vulnerab)/i, "risk"],
  [/\b(price|pricing|costs?|\$|mxn|usd|per month|\/mo|benchmark)\b/i, "benchmark"],
  [/\b(competitor|rival|alternative|vs\.?|compared)\b/i, "competitor"],
];

const MEXICO_HINTS =
  /\b(mexico|méxico|mexican|cfdi|sat\b|rfc\b|resico|pac\b|timbrado|factura|mxn|peso)/i;

/** Only a URL actually present in the text. Never constructed. */
function findUrl(text: string): string | null {
  const m = text.match(/https?:\/\/[^\s<>"')]+/i);
  return m ? m[0].replace(/[.,;:]$/, "") : null;
}

function findTitle(text: string): string {
  const firstSentence = text.trim().split(/(?<=[.!?])\s+/)[0] ?? text.trim();
  const clipped = firstSentence.trim().slice(0, 80);
  if (!clipped) return "Untitled research note";
  return clipped.charAt(0).toUpperCase() + clipped.slice(1);
}

function findSummary(text: string): string {
  const sentences = text.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, 2).join(" ").trim() || text.trim().slice(0, 240);
}

export function heuristicResearchExtract(note: string): ResearchExtraction {
  const sourceUrl = findUrl(note);

  let category: ResearchExtraction["category"] = "insight";
  for (const [pattern, cat] of CATEGORY_HINTS) {
    if (pattern.test(note)) {
      category = cat;
      break;
    }
  }

  return {
    title: findTitle(note),
    category,
    region: MEXICO_HINTS.test(note) ? "mexico" : "global",
    summary: findSummary(note),
    source_url: sourceUrl,
    // A URL in the note is evidence something was consulted, but pattern
    // matching cannot judge whether it supports the claim — so the strongest
    // this path will ever assert is "reported".
    confidence: sourceUrl ? "reported" : "estimated",
  };
}
