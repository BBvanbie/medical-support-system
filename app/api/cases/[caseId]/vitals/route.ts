import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { vitalCreateSchema } from "@/src/lib/validation/case";

type Params = {
  params: Promise<{ caseId: string }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  const { caseId } = await params;
  const payload = await request.json();
  const parsed = vitalCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await db.caseVital.findMany({
    where: { caseId },
    orderBy: { sequence: "desc" },
  });

  if (existing.length >= 5) {
    return NextResponse.json({ error: "Vitals are limited to 5 entries." }, { status: 409 });
  }

  const nextSequence = (existing[0]?.sequence ?? 0) + 1;
  const source = parsed.data.copyFromPrevious ? existing[0] : null;

  const created = await db.$transaction(async (tx) => {
    if (parsed.data.measuredAt) {
      await tx.caseVital.updateMany({
        where: { caseId, isActive: true },
        data: { isActive: false },
      });
    }

    return tx.caseVital.create({
      data: {
        caseId,
        sequence: nextSequence,
        measuredAt: parsed.data.measuredAt,
        isActive: Boolean(parsed.data.measuredAt),
        copiedFromVitalId: source?.id,
        jcs: source?.jcs ?? parsed.data.jcs,
        gcsE: source?.gcsE ?? parsed.data.gcsE,
        gcsV: source?.gcsV ?? parsed.data.gcsV,
        gcsM: source?.gcsM ?? parsed.data.gcsM,
      },
    });
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
