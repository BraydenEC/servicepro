import { NextResponse } from "next/server";
import { z } from "zod";
import { extractResearch } from "@/lib/research/extract";

/*
  POST /api/research/extract

  Server-only so ANTHROPIC_API_KEY never reaches the browser. Same contract as
  the Week 1 route: always 200 with a valid record unless the *request* is
  malformed, and always name which extractor produced it.
*/

export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  note: z
    .string()
    .trim()
    .min(1, "A research note is required.")
    // Bounded before it reaches the model. An unbounded paste is an unbounded bill.
    .max(8000, "Note is too long — 8000 characters maximum."),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request.",
        issues: parsed.error.issues.map((i) => i.message),
      },
      { status: 400 },
    );
  }

  const result = await extractResearch(parsed.data.note);
  return NextResponse.json(result);
}
