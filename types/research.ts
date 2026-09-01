/*
  Research module types.

  The defining decision here is that `sourceUrl` is nullable and `confidence`
  is required. Together they make an unsourced claim *representable but
  visible* — the schema cannot be satisfied by quietly presenting an
  unverified figure as fact.
*/

/** How much weight a claim can carry. Never inferred — always stated. */
export type Confidence = "verified" | "reported" | "estimated";

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  verified: "Verified",
  reported: "Reported",
  estimated: "Estimated",
};

export const CONFIDENCE_MEANING: Record<Confidence, string> = {
  verified: "Fetched from the vendor's own page on the date shown",
  reported: "From a secondary source, not the primary authority",
  estimated: "Informed judgment, not a sourced fact",
};

export type Region = "global" | "mexico";

export type PlayerCategory =
  | "freelance_suite"
  | "time_tracking"
  | "invoicing_cfdi"
  | "substitute";

export const CATEGORY_LABEL: Record<PlayerCategory, string> = {
  freelance_suite: "Freelance suite",
  time_tracking: "Time tracking",
  invoicing_cfdi: "Invoicing / CFDI",
  substitute: "Substitute",
};

/** A competitor or substitute. */
export type Player = {
  id: string;
  name: string;
  category: PlayerCategory;
  region: Region;
  /** Human-readable pricing as published. Not normalized — currencies differ. */
  pricing: string;
  /** Does it track projects and time? */
  projectTracking: boolean;
  /** Does it issue a legally valid Mexican CFDI? */
  cfdi: boolean;
  note: string;
  sourceUrl: string | null;
  verifiedOn: string | null;
  confidence: Confidence;
};

/** One of the five global benchmark examples. */
export type Benchmark = {
  id: string;
  name: string;
  headline: string;
  detail: string;
  pricing: string;
  sourceUrl: string | null;
  verifiedOn: string | null;
  confidence: Confidence;
};

/** A risk to the thesis, plotted on the map. */
export type Risk = {
  id: string;
  title: string;
  likelihood: 1 | 2 | 3;
  impact: 1 | 2 | 3;
  note: string;
};

export const LIKELIHOOD_LABEL = ["", "Low", "Medium", "High"] as const;
export const IMPACT_LABEL = ["", "Low", "Medium", "High"] as const;
