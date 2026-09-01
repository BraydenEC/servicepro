import { z } from "zod";

/*
  The research extraction contract.

  Mirrors lib/core/schema.ts, with one addition that matters: `confidence` is
  required and `source_url` is nullable. The model is asked to judge how much
  weight a note can carry, and to say so — rather than presenting everything
  it structures as equally solid.
*/

export const RESEARCH_CATEGORIES = [
  "competitor",
  "substitute",
  "benchmark",
  "risk",
  "insight",
] as const;

export const RESEARCH_REGIONS = ["global", "mexico"] as const;
export const RESEARCH_CONFIDENCE = ["verified", "reported", "estimated"] as const;

export const ResearchExtractionSchema = z.object({
  title: z
    .string()
    .describe("Short title for the finding, in sentence case."),
  category: z
    .enum(RESEARCH_CATEGORIES)
    .describe("What kind of finding this is."),
  region: z
    .enum(RESEARCH_REGIONS)
    .describe("Whether the finding concerns the global or Mexican market."),
  summary: z
    .string()
    .describe("Two sentences at most, stating the finding and why it matters."),
  source_url: z
    .string()
    .nullable()
    .describe(
      "A URL if one appears in the note. Null otherwise. Never invent or guess a URL.",
    ),
  confidence: z
    .enum(RESEARCH_CONFIDENCE)
    .describe(
      "verified only if a source URL is present in the note; reported if it cites a source without a link; estimated if it is judgment or opinion.",
    ),
});

export type ResearchExtraction = z.infer<typeof ResearchExtractionSchema>;

export type ExtractorKind = "model" | "heuristic";

export type ResearchExtractionResult = {
  fields: ResearchExtraction;
  extractor: ExtractorKind;
  fallbackReason?: string;
};
