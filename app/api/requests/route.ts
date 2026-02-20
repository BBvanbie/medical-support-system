import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/src/lib/db";

const createRequestSchema = z.object({
  caseId: z.string().min(1),
  hospitalId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = createRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await db.hospitalRequest.create({
    data: {
      caseId: parsed.data.caseId,
      hospitalId: parsed.data.hospitalId,
      status: "PENDING",
    },
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
