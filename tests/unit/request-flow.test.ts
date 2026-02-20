import { describe, expect, it } from "vitest";
import { canTransition } from "../../src/lib/request-status";

describe("request status flow", () => {
  it("allows transport decision from acceptable", () => {
    expect(canTransition("ACCEPTABLE", "TRANSPORT_DECIDED")).toBe(true);
  });

  it("blocks invalid transition from cancelled", () => {
    expect(canTransition("CANCELLED", "PENDING")).toBe(false);
  });
});
