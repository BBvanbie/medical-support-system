import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const schema = readFileSync(resolve(process.cwd(), "prisma/schema.prisma"), "utf8");

describe("single source of truth", () => {
  it("defines shared chest pain model with one record per case", () => {
    expect(schema).toContain("model SymptomChestPain");
    expect(schema).toContain("caseId    String   @unique");
  });

  it("defines shared paresis model with one record per case", () => {
    expect(schema).toContain("model SymptomParesis");
    expect(schema).toContain("caseId         String   @unique");
  });
});
