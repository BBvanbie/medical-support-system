import { describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";

describe("schema", () => {
  it("loads prisma client", () => {
    expect(PrismaClient).toBeDefined();
  });
});
