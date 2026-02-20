"use client";

import { useState } from "react";

type Props = {
  caseId: string;
};

export function VitalsEditor({ caseId }: Props) {
  const [jcs, setJcs] = useState("1");
  const [copied, setCopied] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function addVital() {
    const response = await fetch(`/api/cases/${caseId}/vitals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jcs: Number(jcs),
        copyFromPrevious: copied,
        measuredAt: new Date().toISOString(),
      }),
    });

    setMessage(response.ok ? "バイタルを追加しました。" : "追加に失敗しました。");
  }

  return (
    <section className="space-y-3 rounded-lg border border-slate-300 bg-white p-4">
      <h2 className="text-lg font-semibold">バイタル追加入力</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm">
          JCS
          <input
            value={jcs}
            onChange={(event) => setJcs(event.target.value)}
            type="number"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="flex items-end gap-2 text-sm">
          <input
            type="checkbox"
            checked={copied}
            onChange={(event) => setCopied(event.target.checked)}
          />
          前回値をコピーして追加
        </label>
      </div>
      <button onClick={addVital} className="rounded bg-slate-800 px-4 py-2 text-white">
        バイタル追加
      </button>
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
