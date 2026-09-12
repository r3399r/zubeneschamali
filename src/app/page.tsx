import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#19352f]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-[#19352f]/15 pb-5"><span className="text-sm font-bold tracking-[0.18em] uppercase">公民選擇</span><span className="text-xs font-semibold tracking-[0.16em] text-[#b85c38] uppercase">2026 台灣地方選舉</span></header>
        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <section><p className="text-sm font-semibold tracking-[0.16em] text-[#b85c38] uppercase">先看政策，再做選擇</p><h1 className="mt-6 max-w-3xl text-6xl leading-[0.93] font-semibold tracking-[-0.05em] sm:text-8xl">你的在乎，<br /><span className="text-[#b85c38]">值得被算進去。</span></h1><p className="mt-8 max-w-lg text-lg leading-8 text-[#19352f]/70">回答幾個政策問題，整理你的優先順序，再看看不同候選人的公開政策與你的距離。</p><Link href="/survey" className="mt-10 inline-flex items-center gap-8 bg-[#19352f] px-6 py-4 font-semibold text-[#f4f0e8] transition hover:bg-[#285149]">開始政策問卷 <span aria-hidden="true" className="text-xl">→</span></Link></section>
          <aside className="border-t-2 border-[#19352f] pt-5"><p className="text-xs font-bold tracking-[0.16em] uppercase">這裡不會告訴你該投誰</p><p className="mt-5 text-3xl leading-tight font-semibold tracking-[-0.03em]">我們把政策、資料與計算方式攤開，讓你自己判斷。</p><div className="mt-12 grid grid-cols-2 gap-4 border-t border-[#19352f]/20 pt-5 text-sm"><div><span className="block text-3xl font-semibold text-[#b85c38]">01</span><span className="mt-2 block text-[#19352f]/60">選擇職位</span></div><div><span className="block text-3xl font-semibold text-[#b85c38]">02</span><span className="mt-2 block text-[#19352f]/60">回答政策偏好</span></div></div></aside>
        </div>
        <footer className="border-t border-[#19352f]/15 py-5 text-xs text-[#19352f]/50">政策符合度與資料可信度分開呈現 · 不以政黨作為評分依據</footer>
      </div>
    </main>
  );
}
