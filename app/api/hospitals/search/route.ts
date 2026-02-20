import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { distanceFromBase, toHospitalWhere, type SearchMode } from "@/src/lib/hospital-search";

function parseDepartments(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = (params.get("mode") === "AND" ? "AND" : "OR") as SearchMode;
  const departments = parseDepartments(params.get("departments"));
  const where = toHospitalWhere({
    prefecture: params.get("prefecture") ?? undefined,
    city: params.get("city") ?? undefined,
    q: params.get("q") ?? undefined,
    departments,
    mode,
  });

  const hospitals = await db.hospital.findMany({
    where,
    include: {
      departments: true,
    },
    take: 100,
  });

  const sorted = hospitals
    .map((hospital) => ({
      ...hospital,
      distanceScore: distanceFromBase(hospital.latitude, hospital.longitude),
    }))
    .sort((a, b) => a.distanceScore - b.distanceScore);

  return NextResponse.json({ data: sorted });
}
