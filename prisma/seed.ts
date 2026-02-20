import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TOKYO_CITIES = [
  "三鷹市",
  "杉並区",
  "新宿区",
  "渋谷区",
  "品川区",
  "世田谷区",
  "練馬区",
  "江東区",
  "足立区",
  "八王子市",
];

const SAMPLE_DEPARTMENTS = [
  "救急科",
  "内科",
  "循環器内科",
  "呼吸器内科",
  "消化器内科",
  "神経内科",
  "外科",
  "整形外科",
  "脳神経外科",
  "小児科",
  "婦人科",
  "ICU",
  "CCUネットワーク",
];

type RegionSeed = {
  prefecture: string;
  cityPool: string[];
  count: number;
  latBase: number;
  lngBase: number;
};

const REGION_PLAN: RegionSeed[] = [
  {
    prefecture: "東京都",
    cityPool: TOKYO_CITIES,
    count: 100,
    latBase: 35.6764,
    lngBase: 139.6500,
  },
  {
    prefecture: "神奈川県",
    cityPool: ["横浜市", "川崎市", "相模原市", "藤沢市"],
    count: 10,
    latBase: 35.4437,
    lngBase: 139.6380,
  },
  {
    prefecture: "埼玉県",
    cityPool: ["さいたま市", "川口市", "所沢市", "川越市"],
    count: 10,
    latBase: 35.8617,
    lngBase: 139.6455,
  },
  {
    prefecture: "千葉県",
    cityPool: ["千葉市", "船橋市", "柏市", "松戸市"],
    count: 10,
    latBase: 35.6074,
    lngBase: 140.1065,
  },
];

function pick<T>(values: T[], index: number): T {
  return values[index % values.length];
}

function createHospitalName(prefecture: string, city: string, index: number) {
  return `${city}${prefecture.replace("都", "").replace("県", "")}第${index + 1}救急病院`;
}

function createCoordinates(baseLat: number, baseLng: number, index: number) {
  const lat = baseLat + ((index % 7) - 3) * 0.01;
  const lng = baseLng + ((index % 9) - 4) * 0.01;
  return { lat, lng };
}

async function main() {
  const hospitalCount = await prisma.hospital.count();

  if (hospitalCount === 0) {
    for (const region of REGION_PLAN) {
      for (let i = 0; i < region.count; i += 1) {
        const city = pick(region.cityPool, i);
        const { lat, lng } = createCoordinates(region.latBase, region.lngBase, i);

        const created = await prisma.hospital.create({
          data: {
            name: createHospitalName(region.prefecture, city, i),
            prefecture: region.prefecture,
            city,
            address: `${city}${i + 1}-1-1`,
            latitude: lat,
            longitude: lng,
          },
        });

        const departmentStart = i % SAMPLE_DEPARTMENTS.length;
        const assigned = [
          SAMPLE_DEPARTMENTS[departmentStart],
          SAMPLE_DEPARTMENTS[(departmentStart + 3) % SAMPLE_DEPARTMENTS.length],
          SAMPLE_DEPARTMENTS[(departmentStart + 5) % SAMPLE_DEPARTMENTS.length],
        ];

        await prisma.hospitalDepartment.createMany({
          data: assigned.map((department) => ({
            hospitalId: created.id,
            department,
          })),
        });
      }
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
