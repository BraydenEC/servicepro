import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { PROMPT_VERSION } from "@/lib/core/prompt";
import { CoreExtractionSchema } from "@/lib/core/schema";
import { z } from "zod";

/*
  POST /api/core/save — persist one extraction to core_outputs.

  Writes go through the server rather than straight from the browser so the
  payload can be re-validated against the same schema the extractor produced.
  A client could otherwise POST anything the RLS policy allows.
*/

export const dynamic = "force-dynamic";

const SaveRequestSchema = z.object({
  raw_input: z.string().min(1).max(8000),
  extractor: z.enum(["model", "heuristic"]),
  fields: CoreExtractionSchema,
});

export async function POST(request: Request) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Database is not configured on this deployment." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = SaveRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload did not match the expected shape.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { raw_input, extractor, fields } = parsed.data;

  const { data, error } = await supabase
    .from("core_outputs")
    .insert({
      raw_input,
      project_name: fields.project_name,
      client: fields.client,
      hourly_rate: fields.hourly_rate,
      hours_logged: fields.hours_logged,
      deadline: fields.deadline,
      status: fields.status,
      confidence_note: fields.confidence_note,
      extractor,
      prompt_version: PROMPT_VERSION,
    })
    .select("id")
    .single();

  if (error) {
    // The likeliest cause is RLS refusing the insert. Surfaced plainly rather
    // than as a generic 500, because that distinction is what makes it
    // debuggable from the browser.
    console.warn("[core] Save failed:", error.message);
    return NextResponse.json(
      { error: `Could not save: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
