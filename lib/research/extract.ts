import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { heuristicResearchExtract } from "@/lib/research/heuristic";
import {
  buildResearchUserMessage,
  RESEARCH_SYSTEM_PROMPT,
} from "@/lib/research/prompt";
import {
  ResearchExtractionSchema,
  type ResearchExtractionResult,
} from "@/lib/research/schema";

/*
  Research extraction orchestration.

  Identical fallback discipline to Week 1, for identical reasons: a missing key
  is a supported state, the client is never constructed at module scope, and
  the result always names which path produced it.
*/

function getApiKey(): string | null {
  const key = process.env.ANTHROPIC_API_KEY;
  return key && key.trim() ? key.trim() : null;
}

export function isModelConfigured(): boolean {
  return getApiKey() !== null;
}

/*
  One safeguard that has no Week 1 equivalent.

  The model is instructed never to invent a URL, but instruction is not
  enforcement. This checks the returned source against the note it came from:
  if the URL is not present in the original text, it is discarded and the
  record is downgraded. A citation the user never supplied cannot be trusted
  simply because it looks plausible.
*/
function rejectUnsupportedSource(
  fields: ResearchExtractionResult["fields"],
  note: string,
): ResearchExtractionResult["fields"] {
  if (!fields.source_url) return fields;
  if (note.includes(fields.source_url)) return fields;

  return {
    ...fields,
    source_url: null,
    confidence: fields.confidence === "verified" ? "estimated" : fields.confidence,
    summary:
      fields.summary +
      " (A source URL returned by the extractor was discarded because it did not appear in the original note.)",
  };
}

export async function extractResearch(
  note: string,
): Promise<ResearchExtractionResult> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      fields: heuristicResearchExtract(note),
      extractor: "heuristic",
      fallbackReason: "No ANTHROPIC_API_KEY configured on the server.",
    };
  }

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 2000,
      system: RESEARCH_SYSTEM_PROMPT,
      output_config: {
        effort: "low",
        format: zodOutputFormat(ResearchExtractionSchema),
      },
      messages: [
        { role: "user", content: buildResearchUserMessage(note) },
      ],
    });

    const parsed = response.parsed_output;
    if (!parsed) {
      return {
        fields: heuristicResearchExtract(note),
        extractor: "heuristic",
        fallbackReason: "The model returned no parsable structured output.",
      };
    }

    return {
      fields: rejectUnsupportedSource(parsed, note),
      extractor: "model",
    };
  } catch (error) {
    return {
      fields: heuristicResearchExtract(note),
      extractor: "heuristic",
      fallbackReason:
        error instanceof Error
          ? `Model call failed: ${error.message}`
          : "Model call failed for an unknown reason.",
    };
  }
}
