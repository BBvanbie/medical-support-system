import { z } from "zod";

export const caseCreateSchema = z.object({
  startedAt: z.coerce.date().optional(),
  patient: z.object({
    name: z.string().trim().optional(),
    isNameUnknown: z.boolean().default(false),
    birthDate: z.string().optional(),
    isBirthUnknown: z.boolean().default(false),
    age: z.number().int().min(0),
    sex: z.string().min(1),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});

export const caseEndSchema = z.object({
  endedAt: z.coerce.date(),
});

export const vitalCreateSchema = z.object({
  measuredAt: z.coerce.date().optional(),
  jcs: z.number().int().min(0),
  gcsE: z.number().int().min(1).max(4).optional(),
  gcsV: z.number().int().min(1).max(5).optional(),
  gcsM: z.number().int().min(1).max(6).optional(),
  copyFromPrevious: z.boolean().default(false),
});
