import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { calcPurgeAt } from "@/src/lib/retention";
import { caseEndSchema } from "@/src/lib/validation/case";

type Params = {
  params: Promise<{ caseId: string }>;
};

export async function GET(_: NextRequest, { params }: Params) {
  const { caseId } = await params;
  const found = await db.case.findUnique({
    where: { id: caseId },
    include: {
      patient: true,
      vitals: { orderBy: { sequence: "asc" } },
      requests: { include: { hospital: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!found) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }

  return NextResponse.json({ data: found });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { caseId } = await params;
  const payload = await request.json();
  const parsed = caseEndSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await db.case.update({
    where: { id: caseId },
    data: {
      endedAt: parsed.data.endedAt,
      purgeAt: calcPurgeAt(parsed.data.endedAt),
    },
  });

  return NextResponse.json({ data: updated });
}
