"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getPosition, positions, type PositionId } from "@/data/questionnaire";

const storageKey = "zubeneschamali-questionnaire";
const answerLabels = ["非常反對", "反對", "中立", "支持", "非常支持"];

type SavedState = {
  positionId: PositionId;
  answers: Record<string, number>;
  priorities: string[];
};

export default function SurveyPage() {
  const [positionId, setPositionId] = useState<PositionId>("mayor");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [priorities, setPriorities] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stage, setStage] = useState<"position" | "questions" | "priorities" | "complete">("position");
  const [hasLoaded, setHasLoaded] = useState(false);

  const position = useMemo(() => getPosition(positionId), [positionId]);
  const currentQuestion = position.questions[questionIndex];
  const answeredCount = Object.keys(answers).filter((questionId) =>
    position.questions.some((question) => question.id === questionId),
  ).length;

  useEffect(() => {
    const restoreState = window.setTimeout(() => {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as SavedState;
          if (parsed.positionId && positions.some((item) => item.id === parsed.positionId)) {
            setPositionId(parsed.positionId);
            setAnswers(parsed.answers ?? {});
            setPriorities(parsed.priorities ?? []);
          }
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }
      setHasLoaded(true);
    }, 0);

    return () => window.clearTimeout(restoreState);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify({ positionId, answers, priorities } satisfies SavedState));
    }
  }, [answers, hasLoaded, positionId, priorities]);

  function choosePosition(nextPositionId: PositionId) {
    setPositionId(nextPositionId);
    setAnswers({});
    setPriorities([]);
    setQuestionIndex(0);
  }

  function startQuestions() {
    setStage("questions");
    setQuestionIndex(0);
  }

  function answerQuestion(value: number) {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }));
  }

  function goNext() {
    if (questionIndex < position.questions.length - 1) {
      setQuestionIndex((current) => current + 1);
    } else {
      setStage("priorities");
    }
  }

  function togglePriority(issueId: string) {
    setPriorities((current) => {
      if (current.includes(issueId)) return current.filter((id) => id !== issueId);
      if (current.length >= 3) return current;
      return [...current, issueId];
    });
  }

  const selectedIssueLabels = priorities
    .map((issueId) => position.issues.find((issue) => issue.id === issueId)?.label)
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#19352f]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-[#19352f]/15 pb-5">
          <Link href="/" className="text-sm font-bold tracking-[0.18em] uppercase">公民選擇</Link>
          <span className="text-xs font-semibold tracking-[0.16em] text-[#b85c38] uppercase">政策偏好問卷</span>
        </header>

        <div className="grid flex-1 gap-12 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <section>
            <p className="mb-5 text-sm font-semibold tracking-[0.16em] text-[#b85c38] uppercase">先理解你的優先順序</p>
            <h1 className="max-w-xl text-5xl leading-[0.98] font-semibold tracking-[-0.04em] sm:text-7xl">
              政策，<br />從你在乎的事開始。
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-[#19352f]/70">
              這份問卷不會替你決定支持誰。它只整理你重視的政策，讓之後的比較有清楚的起點。
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm text-[#19352f]/60">
              <span className="h-2 w-2 rounded-full bg-[#b85c38]" />
              約 3 分鐘 · {position.questions.length} 題
            </div>
          </section>

          <section className="border-t-2 border-[#19352f] pt-6">
            {stage === "position" && (
              <div>
                <div className="mb-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-[#19352f]/50 uppercase">01 / 選擇職位</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">你想比較哪一類選舉？</h2>
                  </div>
                  <span className="text-4xl font-light text-[#19352f]/20">01</span>
                </div>
                <div className="space-y-3">
                  {positions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => choosePosition(item.id)}
                      className={`w-full border p-5 text-left transition ${positionId === item.id ? "border-[#19352f] bg-[#19352f] text-[#f4f0e8]" : "border-[#19352f]/20 bg-transparent hover:border-[#19352f]"}`}
                    >
                      <span className="text-xs font-bold tracking-[0.14em] uppercase opacity-60">{item.eyebrow}</span>
                      <span className="mt-2 block text-xl font-semibold">{item.label}</span>
                      <span className="mt-2 block text-sm leading-6 opacity-70">{item.description}</span>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={startQuestions} className="mt-8 flex w-full items-center justify-between bg-[#b85c38] px-5 py-4 font-semibold text-white transition hover:bg-[#96482d]">
                  開始回答 <span aria-hidden="true">→</span>
                </button>
              </div>
            )}

            {stage === "questions" && currentQuestion && (
              <div>
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-[#b85c38] uppercase">02 / 政策偏好</p>
                    <p className="mt-3 text-sm text-[#19352f]/55">{answeredCount} / {position.questions.length} 題已完成</p>
                  </div>
                  <span className="text-4xl font-light text-[#19352f]/20">{String(questionIndex + 1).padStart(2, "0")}</span>
                </div>
                <div className="mb-8 h-1 bg-[#19352f]/10"><div className="h-full bg-[#b85c38] transition-all" style={{ width: `${((questionIndex + 1) / position.questions.length) * 100}%` }} /></div>
                <h2 className="text-3xl leading-tight font-semibold tracking-[-0.03em]">{currentQuestion.prompt}</h2>
                <p className="mt-4 text-sm leading-6 text-[#19352f]/60">{currentQuestion.description}</p>
                <div className="mt-8 grid grid-cols-5 gap-2">
                  {answerLabels.map((label, index) => {
                    const value = index + 1;
                    const selected = answers[currentQuestion.id] === value;
                    return <button key={label} type="button" onClick={() => answerQuestion(value)} className={`min-h-24 border p-2 text-center text-xs leading-4 transition sm:min-h-28 ${selected ? "border-[#19352f] bg-[#19352f] text-[#f4f0e8]" : "border-[#19352f]/20 hover:border-[#19352f]"}`}><span className="mb-2 block text-lg font-semibold">{value - 3 > 0 ? `+${value - 3}` : value - 3}</span>{label}</button>;
                  })}
                </div>
                <button type="button" disabled={answers[currentQuestion.id] === undefined} onClick={goNext} className="mt-8 flex w-full items-center justify-between bg-[#b85c38] px-5 py-4 font-semibold text-white transition enabled:hover:bg-[#96482d] disabled:cursor-not-allowed disabled:opacity-35">{questionIndex === position.questions.length - 1 ? "選擇重要議題" : "下一題"}<span aria-hidden="true">→</span></button>
              </div>
            )}

            {stage === "priorities" && (
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-[#b85c38] uppercase">03 / 重要議題</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">哪三件事最重要？</h2>
                <p className="mt-4 text-sm leading-6 text-[#19352f]/60">選出最多三項。它們會在之後的政策比較中佔有更高權重。</p>
                <div className="mt-8 space-y-3">
                  {position.issues.map((issue, index) => {
                    const selected = priorities.includes(issue.id);
                    return <button key={issue.id} type="button" onClick={() => togglePriority(issue.id)} className={`flex w-full items-center gap-4 border p-4 text-left transition ${selected ? "border-[#19352f] bg-[#19352f] text-[#f4f0e8]" : "border-[#19352f]/20 hover:border-[#19352f]"}`}><span className="flex h-8 w-8 shrink-0 items-center justify-center border border-current text-sm font-semibold opacity-70">{selected ? priorities.indexOf(issue.id) + 1 : index + 1}</span><span><span className="block font-semibold">{issue.label}</span><span className="mt-1 block text-xs opacity-60">{issue.description}</span></span></button>;
                  })}
                </div>
                <button type="button" disabled={priorities.length === 0} onClick={() => setStage("complete")} className="mt-8 flex w-full items-center justify-between bg-[#b85c38] px-5 py-4 font-semibold text-white transition enabled:hover:bg-[#96482d] disabled:cursor-not-allowed disabled:opacity-35">完成問卷 <span aria-hidden="true">→</span></button>
              </div>
            )}

            {stage === "complete" && (
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-[#b85c38] uppercase">已完成</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em]">你的政策起點已整理好。</h2>
                <p className="mt-5 text-base leading-7 text-[#19352f]/65">接下來選擇地區，就能比較該範圍候選人的政策立場。</p>
                <div className="mt-8 border-y border-[#19352f]/20 py-5"><p className="text-xs font-bold tracking-[0.14em] text-[#19352f]/50 uppercase">你最重視</p><p className="mt-3 text-xl font-semibold">{selectedIssueLabels.join(" · ")}</p></div>
                <Link href="/location" className="mt-8 flex w-full items-center justify-between bg-[#b85c38] px-5 py-4 font-semibold text-white transition hover:bg-[#96482d]">選擇地區 <span aria-hidden="true">→</span></Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}