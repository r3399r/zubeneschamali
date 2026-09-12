import Link from "next/link";
import { areas } from "@/data/candidates";

export default function LocationPage() {
  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#19352f]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-[#19352f]/15 pb-5">
          <Link href="/" className="text-sm font-bold tracking-[0.18em] uppercase">公民選擇</Link>
          <span className="text-xs font-semibold tracking-[0.16em] text-[#b85c38] uppercase">下一步</span>
        </header>
        <section className="flex flex-1 flex-col justify-center py-16">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#b85c38] uppercase">選擇地區</p>
          <h1 className="mt-5 max-w-2xl text-5xl leading-[0.98] font-semibold tracking-[-0.04em] sm:text-7xl">你想先看哪裡的候選人？</h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-[#19352f]/65">地區只會決定要比較的候選人集合，不會改變你剛剛整理的政策偏好。</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {areas.map((area) => (
              <Link key={area.id} href={`/result?area=${area.id}`} className="border border-[#19352f]/20 p-5 text-left transition hover:border-[#19352f] hover:bg-[#19352f] hover:text-[#f4f0e8]">
                <span className="block text-xs font-bold tracking-[0.14em] text-[#b85c38] uppercase">{area.city}</span>
                <span className="mt-2 block text-2xl font-semibold">{area.district}</span>
                <span className="mt-3 block text-sm opacity-60">市議員 seed data · 查看政策比較 →</span>
              </Link>
            ))}
          </div>
          <Link href="/survey" className="mt-8 text-sm font-semibold underline underline-offset-4">← 回到問卷</Link>
        </section>
      </div>
    </main>
  );
}