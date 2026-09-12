export type PositionId = "mayor" | "councilor";

export type Question = {
  id: string;
  issueId: string;
  prompt: string;
  description: string;
};

export type Issue = {
  id: string;
  label: string;
  description: string;
};

export type Position = {
  id: PositionId;
  label: string;
  eyebrow: string;
  description: string;
  issues: Issue[];
  questions: Question[];
};

export const positions: Position[] = [
  {
    id: "mayor",
    label: "直轄市長／縣市長",
    eyebrow: "城市治理",
    description: "關注整體城市方向、資源分配與地方政府的執行能力。",
    issues: [
      { id: "housing", label: "居住正義", description: "住宅供給、租屋與居住負擔" },
      { id: "transport", label: "交通建設", description: "大眾運輸、道路與通勤" },
      { id: "environment", label: "環境永續", description: "能源、減碳與生活環境" },
      { id: "welfare", label: "社會福利", description: "長照、育兒與社會支持" },
      { id: "finance", label: "財政治理", description: "預算分配、財源與政府效能" },
    ],
    questions: [
      { id: "mayor-housing", issueId: "housing", prompt: "地方政府應優先增加公共住宅供給。", description: "包含公辦都更、社會住宅與閒置公共空間轉用。" },
      { id: "mayor-transport", issueId: "transport", prompt: "城市交通預算應優先投入大眾運輸，而不是擴建道路。", description: "請把長期減少通勤依賴與短期交通改善一起考量。" },
      { id: "mayor-environment", issueId: "environment", prompt: "地方政府應設定積極的減碳目標，即使初期需要增加公共支出。", description: "例如再生能源、建築節能與低碳運輸。" },
      { id: "mayor-welfare", issueId: "welfare", prompt: "地方政府應擴大長照與托育服務，即使需要重新分配其他預算。", description: "這題想了解你對公共服務優先順序的看法。" },
      { id: "mayor-finance", issueId: "finance", prompt: "候選人提出新政策時，應同時公開資金來源與預算估算。", description: "透明的成本說明有助於判斷政策是否可執行。" },
    ],
  },
  {
    id: "councilor",
    label: "市議員／縣議員",
    eyebrow: "地方監督",
    description: "關注議會監督、地方建設與居民日常生活的政策選擇。",
    issues: [
      { id: "oversight", label: "議會監督", description: "預算審查、資訊公開與行政監督" },
      { id: "neighborhood", label: "社區建設", description: "公共空間、道路與地方需求" },
      { id: "education", label: "教育文化", description: "校園、學習與文化資源" },
      { id: "safety", label: "公共安全", description: "防災、治安與基礎設施安全" },
      { id: "care", label: "照顧支持", description: "長者、身心障礙與家庭支持" },
    ],
    questions: [
      { id: "councilor-oversight", issueId: "oversight", prompt: "議員應優先要求政府公開重大建設的預算與進度。", description: "議會監督需要可被居民查證的資訊。" },
      { id: "councilor-neighborhood", issueId: "neighborhood", prompt: "地方建設應優先回應居民長期需求，而不是一次性的選區工程。", description: "請比較短期可見成果與長期公共利益。" },
      { id: "councilor-education", issueId: "education", prompt: "地方議員應把更多預算投入校園改善與公共文化資源。", description: "包含學校環境、圖書館、藝文與社區學習。" },
      { id: "councilor-safety", issueId: "safety", prompt: "地方建設應優先進行防災與老舊基礎設施改善。", description: "這類投資不一定立即可見，但能降低長期風險。" },
      { id: "councilor-care", issueId: "care", prompt: "地方政府應擴大社區照顧據點，即使需要調整既有建設預算。", description: "政策取捨可以反映你重視的公共服務。" },
    ],
  },
];

export function getPosition(positionId: PositionId) {
  return positions.find((position) => position.id === positionId) ?? positions[0];
}