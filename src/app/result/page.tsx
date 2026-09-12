"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { candidates, getArea } from "@/data/candidates";
import { getPosition, type PositionId } from "@/data/questionnaire";
import { rankCandidates, type UserProfile } from "@/lib/scoring";

const storageKey = "zubeneschamali-questionnaire";

export default function ResultPage() {
  const [areaId, setAreaId] = useState("");
  const [profile, setProfile] = useState<UserProfile>({ answers: {}, priorities: [] });
  const [positionId, setPositionId] = useState<PositionId>("councilor");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const restoreState = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setAreaId(params.get("area") ?? "");
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as UserProfile & { positionId?: PositionId };
          setProfile({ answers: parsed.answers ?? {}, priorities: parsed.priorities ?? [] });
          if (parsed.positionId) setPositionId(parsed.positionId);
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(restoreState);
  }, []);

  const area = getArea(areaId);
  const position = getPosition(positionId);
  const ranked = useMemo(
    () => rankCandidates(candidates.filter((candidate) => candidate.areaId === areaId && candidate.positionId === positionId), profile),
    [areaId, positionId, profile],
  );

  if (!loaded) return null;

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#19352f]">
      <div className="mx-auto min-h-screen w-full max-w-6xl px-6 py-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-[#19352f]/15 pb-5"><Link href="/" className="text-sm font-bold tracking-[0.18em] uppercase">公民選擇</Link><Link href="/location" className="text-sm font-semibold underline underline-offset-4">更換地區</Link></header>
        <section className="py-12"><p className="text-sm font-semibold tracking-[0.16em] text-[#b85c38] uppercase">政策比較結果</p><h1 className="mt-4 text-5xl leading-[0.98] font-semibold tracking-[-0.04em] sm:text-7xl">{area ? `${area.city} ${area.district}` : "尚未選擇地區"}</h1><p className="mt-5 text-base text-[#19352f]/65">{position.label} · 依你的政策偏好排序</p></section>
        {ranked.length === 0 ? <div className="border-t-2 border-[#19352f] py-8"><p className="text-xl font-semibold">目前沒有符合此職位的 seed data。</p><Link href="/survey" className="mt-5 inline-block font-semibold underline underline-offset-4">重新選擇職位</Link></div> : <div className="grid gap-5 border-t-2 border-[#19352f] pt-6 lg:grid-cols-3">{ranked.map((result, index) => <article key={result.candidate.id} className="flex flex-col border border-[#19352f]/20 p-5"><div className="flex items-start justify-between"><span className="text-4xl font-light text-[#b85c38]">0{index + 1}</span><span className="text-xs font-semibold tracking-[0.12em] uppercase opacity-60">{result.candidate.party}</span></div><h2 className="mt-10 text-2xl font-semibold">{result.candidate.name}</h2><p className="mt-2 text-sm leading-6 text-[#19352f]/60">{result.candidate.description}</p><div className="mt-8 grid grid-cols-2 gap-3 border-y border-[#19352f]/15 py-4"><div><span className="block text-xs opacity-55">政策符合度</span><strong className="mt-1 block text-3xl">{result.policyMatch}</strong></div><div><span className="block text-xs opacity-55">資料可信度</span><strong className="mt-1 block text-3xl">{result.confidence}</strong></div></div><details className="mt-5"><summary className="cursor-pointer text-sm font-semibold">為什麼？</summary><div className="mt-4 space-y-3">{result.breakdown.map((item) => <div key={item.issueId} className="border-t border-[#19352f]/10 pt-3 text-sm"><div className="flex justify-between"><span className="font-semibold">{position.issues.find((issue) => issue.id === item.issueId)?.label ?? item.issueId}</span><span className="opacity-60">{item.similarity === null ? "N/A" : `${Math.round(item.similarity * 100)}%`}</span></div><p className="mt-1 leading-5 opacity-65">你的立場 {item.userPosition > 0 ? `+${item.userPosition}` : item.userPosition} · 候選人 {item.candidatePosition === null ? "N/A" : item.candidatePosition > 0 ? `+${item.candidatePosition}` : item.candidatePosition}</p><p className="mt-1 leading-5 opacity-65">{item.statement}</p></div>)}</div></details></article>)}</div>}
        <p className="mt-10 max-w-2xl text-xs leading-5 text-[#19352f]/50">這是根據目前 seed data 與固定計算規則產生的比較。政策符合度與資料可信度分開計算，缺少資料的議題不會直接算成低分。</p>
      </div>
    </main>
  );
}