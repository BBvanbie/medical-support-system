import { NextRequest, NextResponse } from "next/server";
import { RequestStatus } from "@prisma/client";
import { z } from "zod";
import { db } from "@/src/lib/db";
import { canTransition } from "@/src/lib/request-status";

const statusSchema = z.object({
  status: z.nativeEnum(RequestStatus),
  conditionsText: z.string().optional(),
  conditionsAck: z.boolean().optional(),
});

type Params = {
  params: Promise<{ requestId: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  const { requestId } = await params;
  const payload = await request.json();
  const parsed = statusSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const current = await db.hospitalRequest.findUnique({ where: { id: requestId } });
  if (!current) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  if (!canTransition(current.status, parsed.data.status)) {
    return NextResponse.json({ error: "Invalid status transition." }, { status: 409 });
  }

  const update = await db.hospitalRequest.update({
    where: { id: requestId },
    data: {
      status: parsed.data.status,
      conditionsText: parsed.data.conditionsText,
      conditionsAck: parsed.data.conditionsAck ?? current.conditionsAck,
      conditionsAckAt: parsed.data.conditionsAck ? new Date() : current.conditionsAckAt,
      decisionAt: parsed.data.status === "TRANSPORT_DECIDED" ? new Date() : current.decisionAt,
    },
  });

  return NextResponse.json({ data: update });
}
