import { describe, expect, it } from "vitest";
import type { Candidate } from "@/data/candidates";
import { rankCandidates, scoreCandidate, type UserProfile } from "@/lib/scoring";

const profile: UserProfile = {
  answers: {
    housing: 5,
    transport: 5,
  },
  priorities: ["housing", "transport"],
};

function candidate(id: string, housing: number | null, transport: number | null): Candidate {
  return {
    id,
    areaId: "test-area",
    positionId: "mayor",
    name: id,
    party: "測試資料",
    description: "測試候選人",
    positions: [
      { issueId: "housing", position: housing, statement: "住房立場", confidence: housing === null ? "LOW" : "HIGH" },
      { issueId: "transport", position: transport, statement: "交通立場", confidence: transport === null ? "LOW" : "HIGH" },
    ],
  };
}

describe("scoreCandidate", () => {
  it("returns a perfect match for identical positions", () => {
    const result = scoreCandidate(candidate("same", 2, 2), profile);

    expect(result.policyMatch).toBe(100);
    expect(result.confidence).toBe(100);
  });

  it("returns zero similarity for opposite positions", () => {
    const result = scoreCandidate(candidate("opposite", -2, -2), profile);

    expect(result.policyMatch).toBe(0);
  });

  it("excludes missing positions instead of treating them as zero", () => {
    const result = scoreCandidate(candidate("partial", 2, null), profile);

    expect(result.policyMatch).toBe(100);
    expect(result.confidence).toBe(50);
    expect(result.breakdown.find((item) => item.issueId === "transport")?.similarity).toBeNull();
  });

  it("uses higher weights for the user's prioritized issues", () => {
    const priorityMatch = scoreCandidate(candidate("priority", 2, -2), profile);
    const secondaryMatch = scoreCandidate(candidate("secondary", -2, 2), profile);

    expect(priorityMatch.policyMatch).toBeGreaterThan(secondaryMatch.policyMatch);
  });
});

describe("rankCandidates", () => {
  it("returns deterministic ranking for the same input", () => {
    const input = [candidate("lower", 1, 1), candidate("higher", 2, 2)];

    expect(rankCandidates(input, profile).map((result) => result.candidate.id)).toEqual(["higher", "lower"]);
    expect(rankCandidates(input, profile)).toEqual(rankCandidates(input, profile));
  });
});