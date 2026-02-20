import { describe, expect, it } from "vitest";
import { distanceFromBase, expandDepartments, toHospitalWhere } from "../../src/lib/hospital-search";

describe("hospital search", () => {
  it("expands grouped departments", () => {
    const expanded = expandDepartments(["内科"]);
    expect(expanded).toContain("内科");
    expect(expanded).toContain("循環器内科");
  });

  it("builds AND condition for departments", () => {
    const where = toHospitalWhere({
      departments: ["内科", "外科"],
      mode: "AND",
    });
    expect(Array.isArray(where.AND)).toBe(true);
    expect((where.AND as unknown[]).length).toBeGreaterThan(1);
  });

  it("calculates distance from base point", () => {
    expect(distanceFromBase(35.69147, 139.55827)).toBe(0);
  });
});
