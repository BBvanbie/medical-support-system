import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { caseCreateSchema } from "@/src/lib/validation/case";

export async function GET() {
  const now = new Date();
  const cases = await db.case.findMany({
    where: {
      OR: [{ purgeAt: null }, { purgeAt: { gt: now } }],
    },
    include: {
      patient: true,
    },
    orderBy: { startedAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ data: cases });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = caseCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await db.case.create({
    data: {
      startedAt: parsed.data.startedAt ?? new Date(),
      patient: {
        create: parsed.data.patient,
      },
    },
    include: { patient: true },
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
