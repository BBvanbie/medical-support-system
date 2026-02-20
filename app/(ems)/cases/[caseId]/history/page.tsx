import { db } from "@/src/lib/db";

type Props = {
  params: Promise<{ caseId: string }>;
};

export default async function HistoryPage({ params }: Props) {
  const { caseId } = await params;
  const requests = await db.hospitalRequest.findMany({
    where: { caseId },
    include: { hospital: true, messages: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">選定履歴</h1>
      <p className="text-sm text-slate-700">事案ID: {caseId}</p>
      <ul className="space-y-3">
        {requests.map((request) => (
          <li key={request.id} className="rounded-lg border border-slate-300 bg-white p-4 text-sm">
            <p className="font-semibold">{request.hospital.name}</p>
            <p>ステータス: {request.status}</p>
            <p>条件: {request.conditionsText ?? "-"}</p>
            <p>メッセージ件数: {request.messages.length}</p>
          </li>
        ))}
      </ul>
      {requests.length === 0 ? <p className="text-sm text-slate-600">履歴はまだありません。</p> : null}
    </div>
  );
}
