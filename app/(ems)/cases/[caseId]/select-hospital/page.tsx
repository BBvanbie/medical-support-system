import Link from "next/link";
import { db } from "@/src/lib/db";
import { RequestButton } from "@/src/components/ems/request-button";
import { VitalsEditor } from "@/src/components/ems/vitals-editor";

type Props = {
  params: Promise<{ caseId: string }>;
};

export default async function SelectHospitalPage({ params }: Props) {
  const { caseId } = await params;
  const [currentCase, hospitals] = await Promise.all([
    db.case.findUnique({
      where: { id: caseId },
      include: {
        patient: true,
      },
    }),
    db.hospital.findMany({
      include: { departments: true },
      take: 20,
      orderBy: { name: "asc" },
    }),
  ]);

  if (!currentCase) {
    return <p>事案が見つかりません。</p>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">病院検索・搬送先選択</h1>
      <p className="text-sm text-slate-700">
        事案ID: <span className="font-mono">{currentCase.id}</span> / 患者:
        {" "}
        {currentCase.patient?.isNameUnknown ? "不明" : currentCase.patient?.name ?? "未入力"}
      </p>

      <VitalsEditor caseId={caseId} />

      <section className="space-y-2 rounded-lg border border-slate-300 bg-white p-4">
        <h2 className="text-lg font-semibold">候補病院（上位20件）</h2>
        <ul className="space-y-2 text-sm">
          {hospitals.map((hospital) => (
            <li key={hospital.id} className="rounded border border-slate-200 p-3">
              <p className="font-semibold">{hospital.name}</p>
              <p className="text-slate-600">
                {hospital.prefecture} {hospital.city} / {hospital.address}
              </p>
              <p className="text-slate-600">
                科目: {hospital.departments.map((department) => department.department).join(", ")}
              </p>
              <div className="mt-2">
                <RequestButton caseId={caseId} hospitalId={hospital.id} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Link href={`/cases/${caseId}/history`} className="text-sky-700 underline">
        選定履歴へ
      </Link>
    </div>
  );
}
