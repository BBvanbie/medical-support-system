import { describe, expect, it } from "vitest";
import { calcPurgeAt } from "../../src/lib/retention";

describe("retention", () => {
  it("computes purge_at as ended_at + 30 days", () => {
    const endedAt = new Date("2026-02-20T00:00:00.000Z");
    const purgeAt = calcPurgeAt(endedAt);
    expect(purgeAt.toISOString()).toBe("2026-03-22T00:00:00.000Z");
  });
});
