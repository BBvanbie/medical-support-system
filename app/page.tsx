import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <main className="mx-auto max-w-3xl space-y-4 rounded-lg border border-slate-300 bg-white p-6">
        <h1 className="text-2xl font-bold">救急搬送支援システム（MVP）</h1>
        <p className="text-sm text-slate-700">
          A側の事案入力、病院検索、要請ステータス管理の初期実装です。
        </p>
        <div className="flex gap-3">
          <Link href="/cases/new" className="rounded bg-sky-700 px-4 py-2 text-white">
            救急事案入力を開始
          </Link>
        </div>
      </main>
    </div>
  );
}
