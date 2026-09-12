import type { Candidate } from "@/data/candidates";

export type UserProfile = {
  answers: Record<string, number>;
  priorities: string[];
};

export type ScoreBreakdown = {
  issueId: string;
  userPosition: number;
  candidatePosition: number | null;
  similarity: number | null;
  statement: string;
};

export type CandidateScore = {
  candidate: Candidate;
  policyMatch: number;
  confidence: number;
  breakdown: ScoreBreakdown[];
};

const confidenceValues = { HIGH: 1, MEDIUM: 0.7, LOW: 0.35 } as const;

function answerToPosition(answer: number) {
  return answer - 3;
}

function issueWeight(issueId: string, priorities: string[]) {
  const priorityIndex = priorities.indexOf(issueId);
  return priorityIndex === -1 ? 1 : 3 - priorityIndex;
}

export function scoreCandidate(candidate: Candidate, profile: UserProfile): CandidateScore {
  const breakdown = Object.entries(profile.answers).map(([issueId, answer]) => {
    const candidatePosition = candidate.positions.find((item) => item.issueId === issueId);
    const userPosition = answerToPosition(answer);
    const similarity = candidatePosition?.position === null || candidatePosition === undefined
      ? null
      : 1 - Math.abs(userPosition - candidatePosition.position) / 4;

    return {
      issueId,
      userPosition,
      candidatePosition: candidatePosition?.position ?? null,
      similarity,
      statement: candidatePosition?.statement ?? "目前沒有足夠公開資料。",
    };
  });

  const available = breakdown.filter((item) => item.similarity !== null);
  const totalWeight = available.reduce((total, item) => total + issueWeight(item.issueId, profile.priorities), 0);
  const weightedSimilarity = available.reduce((total, item) => total + (item.similarity ?? 0) * issueWeight(item.issueId, profile.priorities), 0);
  const policyMatch = totalWeight === 0 ? 0 : Math.round((weightedSimilarity / totalWeight) * 100);
  const evidenceTotal = breakdown.reduce((total, item) => {
    const candidatePosition = candidate.positions.find((position) => position.issueId === item.issueId);
    return total + (item.similarity === null ? 0 : confidenceValues[candidatePosition?.confidence ?? "LOW"]);
  }, 0);
  const confidence = breakdown.length === 0 ? 0 : Math.round((evidenceTotal / breakdown.length) * 100);

  return { candidate, policyMatch, confidence, breakdown };
}

export function rankCandidates(candidates: Candidate[], profile: UserProfile) {
  return candidates
    .map((candidate) => scoreCandidate(candidate, profile))
    .sort((left, right) => right.policyMatch - left.policyMatch || right.confidence - left.confidence);
}