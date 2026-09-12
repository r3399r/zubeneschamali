import type { PositionId } from "@/data/questionnaire";

export type Area = {
  id: string;
  city: string;
  district: string;
};

export type CandidatePosition = {
  issueId: string;
  position: number | null;
  statement: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
};

export type Candidate = {
  id: string;
  areaId: string;
  positionId: PositionId;
  name: string;
  party: string;
  description: string;
  positions: CandidatePosition[];
};

export const areas: Area[] = [
  { id: "taichung-xitun", city: "台中市", district: "西屯區" },
  { id: "kaohsiung-lingya", city: "高雄市", district: "苓雅區" },
];

export const candidates: Candidate[] = [
  {
    id: "taichung-mayor-a",
    areaId: "taichung-xitun",
    positionId: "mayor",
    name: "王思遠",
    party: "無黨籍",
    description: "提出公共住宅、交通轉型與財政透明的城市治理主張。",
    positions: [
      { issueId: "housing", position: 2, statement: "支持增加公共住宅，並提出分期供給規劃。", confidence: "HIGH" },
      { issueId: "transport", position: 1, statement: "支持優先改善大眾運輸與轉乘系統。", confidence: "MEDIUM" },
      { issueId: "environment", position: 2, statement: "主張設定城市減碳目標。", confidence: "HIGH" },
      { issueId: "welfare", position: 1, statement: "支持擴大長照與托育服務。", confidence: "MEDIUM" },
      { issueId: "finance", position: 2, statement: "承諾公開重大政策的預算估算。", confidence: "HIGH" },
    ],
  },
  {
    id: "taichung-mayor-b",
    areaId: "taichung-xitun",
    positionId: "mayor",
    name: "周明哲",
    party: "地方政團",
    description: "主張以道路建設、產業投資與行政效率帶動城市發展。",
    positions: [
      { issueId: "housing", position: 1, statement: "支持以租屋補助搭配住宅政策。", confidence: "MEDIUM" },
      { issueId: "transport", position: 2, statement: "支持擴充道路與大眾運輸並行。", confidence: "HIGH" },
      { issueId: "environment", position: null, statement: "目前沒有足夠公開資料。", confidence: "LOW" },
      { issueId: "welfare", position: 1, statement: "支持維持現有社會福利服務。", confidence: "MEDIUM" },
      { issueId: "finance", position: 0, statement: "主張先完成財政盤點，再提出新計畫。", confidence: "HIGH" },
    ],
  },
  {
    id: "taichung-alice",
    areaId: "taichung-xitun",
    positionId: "councilor",
    name: "林予安",
    party: "無黨籍",
    description: "關注居住、交通與公共預算的地方治理。",
    positions: [
      { issueId: "oversight", position: 2, statement: "支持公開重大建設的預算與進度。", confidence: "HIGH" },
      { issueId: "neighborhood", position: 1, statement: "主張以長期社區需求安排建設。", confidence: "MEDIUM" },
      { issueId: "education", position: 2, statement: "支持改善校園與社區文化空間。", confidence: "HIGH" },
      { issueId: "safety", position: null, statement: "目前沒有足夠公開資料。", confidence: "LOW" },
      { issueId: "care", position: 1, statement: "支持增加社區照顧據點。", confidence: "MEDIUM" },
    ],
  },
  {
    id: "taichung-ben",
    areaId: "taichung-xitun",
    positionId: "councilor",
    name: "陳柏勳",
    party: "地方政團",
    description: "主張基礎建設與公共安全優先。",
    positions: [
      { issueId: "oversight", position: 1, statement: "支持強化預算審查與資訊公開。", confidence: "MEDIUM" },
      { issueId: "neighborhood", position: 2, statement: "主張加速選區道路與公共空間改善。", confidence: "HIGH" },
      { issueId: "education", position: null, statement: "目前沒有足夠公開資料。", confidence: "LOW" },
      { issueId: "safety", position: 2, statement: "把防災工程列為地方建設重點。", confidence: "HIGH" },
      { issueId: "care", position: -1, statement: "主張維持現有照顧服務規模。", confidence: "MEDIUM" },
    ],
  },
  {
    id: "kaohsiung-cindy",
    areaId: "kaohsiung-lingya",
    positionId: "councilor",
    name: "許宜庭",
    party: "無黨籍",
    description: "關注照顧支持、教育文化與行政透明。",
    positions: [
      { issueId: "oversight", position: 2, statement: "支持以公開資料追蹤政府預算執行。", confidence: "HIGH" },
      { issueId: "neighborhood", position: null, statement: "目前沒有足夠公開資料。", confidence: "LOW" },
      { issueId: "education", position: 2, statement: "支持擴充社區文化與學習資源。", confidence: "HIGH" },
      { issueId: "safety", position: 1, statement: "支持逐年改善老舊公共設施。", confidence: "MEDIUM" },
      { issueId: "care", position: 2, statement: "主張擴大社區照顧服務。", confidence: "HIGH" },
    ],
  },
  {
    id: "kaohsiung-mayor-a",
    areaId: "kaohsiung-lingya",
    positionId: "mayor",
    name: "蘇怡君",
    party: "無黨籍",
    description: "關注公共服務、城市韌性與長期財政規劃。",
    positions: [
      { issueId: "housing", position: 1, statement: "支持增加社會住宅與租屋支持。", confidence: "MEDIUM" },
      { issueId: "transport", position: 1, statement: "支持優先投資公共運輸。", confidence: "HIGH" },
      { issueId: "environment", position: 2, statement: "支持以城市韌性與減碳同步規劃。", confidence: "HIGH" },
      { issueId: "welfare", position: 2, statement: "主張擴大社區照顧與育兒支持。", confidence: "HIGH" },
      { issueId: "finance", position: null, statement: "目前沒有足夠公開資料。", confidence: "LOW" },
    ],
  },
];

export function getArea(areaId: string) {
  return areas.find((area) => area.id === areaId);
}