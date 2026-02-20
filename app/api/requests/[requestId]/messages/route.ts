import { NextRequest, NextResponse } from "next/server";
import { MessageSender, MessageType } from "@prisma/client";
import { z } from "zod";
import { db } from "@/src/lib/db";

const messageSchema = z.object({
  sender: z.nativeEnum(MessageSender),
  messageType: z.nativeEnum(MessageType),
  body: z.string().min(1),
});

type Params = {
  params: Promise<{ requestId: string }>;
};

export async function GET(_: NextRequest, { params }: Params) {
  const { requestId } = await params;
  const messages = await db.requestMessage.findMany({
    where: { requestId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ data: messages });
}

export async function POST(request: NextRequest, { params }: Params) {
  const { requestId } = await params;
  const payload = await request.json();
  const parsed = messageSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await db.requestMessage.create({
    data: {
      requestId,
      sender: parsed.data.sender,
      messageType: parsed.data.messageType,
      body: parsed.data.body,
    },
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
