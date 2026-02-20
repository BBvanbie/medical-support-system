import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const schema = readFileSync(resolve(process.cwd(), "prisma/schema.prisma"), "utf8");

describe("vital constraints", () => {
  it("defines per-case unique sequence for vitals", () => {
    expect(schema).toContain("model CaseVital");
    expect(schema).toContain("@@unique([caseId, sequence])");
  });

  it("keeps copy traceability fields for repeated vitals", () => {
    expect(schema).toContain("copiedFromVitalId");
    expect(schema).toContain('@@index([caseId])');
  });
});
