import Link from "next/link";

export default function EmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-300 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 text-sm">
          <Link href="/" className="font-semibold">
            救急搬送支援システム
          </Link>
          <Link href="/cases/new">事案入力</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
