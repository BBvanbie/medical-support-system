"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type CreateCaseResponse = {
  data: { id: string };
};

export function CaseForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("65");
  const [sex, setSex] = useState("不明");
  const [jcs, setJcs] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: {
            name: name || undefined,
            isNameUnknown: !name,
            age: Number(age),
            sex,
            isBirthUnknown: true,
          },
        }),
      });

      if (!response.ok) {
        setError("事案の作成に失敗しました。");
        return;
      }

      const payload = (await response.json()) as CreateCaseResponse;

      await fetch(`/api/cases/${payload.data.id}/vitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jcs: Number(jcs),
        }),
      });

      router.push(`/cases/${payload.data.id}/select-hospital`);
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-300 bg-white p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          氏名
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="不明なら空欄"
          />
        </label>
        <label className="text-sm">
          年齢（必須）
          <input
            required
            type="number"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </label>
        <label className="text-sm">
          性別
          <select
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={sex}
            onChange={(event) => setSex(event.target.value)}
          >
            <option value="男性">男性</option>
            <option value="女性">女性</option>
            <option value="不明">不明</option>
          </select>
        </label>
        <label className="text-sm">
          JCS（必須）
          <input
            required
            type="number"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={jcs}
            onChange={(event) => setJcs(event.target.value)}
          />
        </label>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-sky-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {saving ? "保存中..." : "事案を作成して病院選定へ"}
      </button>
    </form>
  );
}
