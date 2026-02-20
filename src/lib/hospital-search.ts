import type { Prisma } from "@prisma/client";

const BASE_POINT = {
  lat: 35.69147,
  lng: 139.55827,
};

const DEPARTMENT_GROUPS: Record<string, string[]> = {
  内科: ["内科", "循環器内科", "呼吸器内科", "消化器内科", "神経内科"],
  外科: ["外科", "整形外科", "脳神経外科", "形成外科", "心臓血管外科"],
};

export type SearchMode = "AND" | "OR";

export function expandDepartments(input: string[]) {
  const expanded = new Set<string>();

  for (const value of input) {
    expanded.add(value);
    for (const grouped of DEPARTMENT_GROUPS[value] ?? []) {
      expanded.add(grouped);
    }
  }

  return Array.from(expanded);
}

export function toHospitalWhere(args: {
  prefecture?: string;
  city?: string;
  q?: string;
  departments?: string[];
  mode: SearchMode;
}): Prisma.HospitalWhereInput {
  const departments = expandDepartments(args.departments ?? []);
  const where: Prisma.HospitalWhereInput = {};

  if (args.prefecture) {
    where.prefecture = args.prefecture;
  }

  if (args.city) {
    where.city = { contains: args.city };
  }

  if (args.q) {
    where.name = { contains: args.q };
  }

  if (departments.length > 0) {
    if (args.mode === "AND") {
      where.AND = departments.map((department) => ({
        departments: {
          some: { department },
        },
      }));
    } else {
      where.departments = {
        some: {
          department: { in: departments },
        },
      };
    }
  }

  return where;
}

export function distanceFromBase(latitude: number, longitude: number) {
  const dy = latitude - BASE_POINT.lat;
  const dx = longitude - BASE_POINT.lng;
  return Math.sqrt(dx * dx + dy * dy);
}
