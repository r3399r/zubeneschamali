# 2026 台灣地方選舉政策匹配平台

## 1. 專案目的

建立一個面向台灣 2026 地方選舉的公民科技網站。

使用者回答一系列「政策偏好」問題後，系統分析：

1. 使用者重視哪些政策議題
2. 使用者對各政策的立場
3. 候選人對相同政策的立場
4. 候選人政策的可行性
5. 候選人過去的履約／執行紀錄
6. 資料與證據的完整度

最後提供：

> 「哪些候選人的政策與你的偏好比較接近，以及為什麼。」

**不是告訴使用者應該投誰。**

核心理念：

> 不先看政黨，先看政策。
> 不只看候選人說了什麼，也看政策是否可行，以及過去做了什麼。
> 不把「沒有資料」當成「表現不好」。

---

# 2. 產品定位

## 2.1 不做什麼

不要做：

* 「最適合你的候選人就是 X」
* 「你應該投 X」
* 政黨推薦器
* 政治光譜分類器
* 候選人支持度預測
* 「候選人說謊機率 82%」
* 「跳票率 73%」這類過度簡化的政治評價
* 依照敏感個人資料進行政治微定向或政治說服

尤其不要直接使用：

```text
候選人 +10
某政黨 +5
某政黨 -5
```

這種硬編碼。

---

# 3. 核心產品概念

結果頁應該回答四個問題：

### Q1. 你的政策偏好是什麼？

例如：

```text
住房        91
交通        87
教育        72
環境        61
財政        45
```

### Q2. 哪些候選人的政策比較接近？

例如：

```text
候選人 A    87%
候選人 B    82%
候選人 C    76%
```

### Q3. 為什麼？

例如：

```text
你：支持增加公共住宅

候選人 A：
明確支持增加公共住宅
→ 高度一致

候選人 B：
支持青年住宅，但沒有提出具體數量
→ 部分一致

候選人 C：
主張以租屋補助為主要政策
→ 方向不同
```

### Q4. 這個排名有多可信？

例如：

```text
政策符合度：87
政策可行性：78
過去履約：82
資料完整度：91
```

資料不足時：

```text
過去履約：N/A

候選人缺乏相關執政紀錄，
因此此項不納入計算。
```

---

# 4. 重要原則：Match Score 與 Confidence 分開

這是整個系統非常重要的設計。

## Match Score

代表：

> 候選人的已知政策與使用者偏好的符合程度。

## Confidence / Data Completeness

代表：

> 我們有多少可靠資料可以支持這個判斷。

兩者不能混在一起。

例如：

```text
候選人 A
Match：89
Confidence：95
```

代表：

> 很符合，而且有很多資料支持。

另一個候選人：

```text
候選人 B
Match：90
Confidence：48
```

代表：

> 已知資料看起來很符合，但資料不足，因此不能與 A 視為同等確定。

**資料不足不能直接等於低分。**

---

# 5. 選舉範圍

第一階段：

> 2026 台灣地方選舉

使用者首先選擇：

```text
選舉
↓
縣市
↓
行政區／選區
↓
職位
```

例如：

```text
2026 地方選舉
→ 台中市
→ 第 X 選區
→ 市議員
```

系統之後才能載入該選區候選人。

---

# 6. UX 流程

## Step 1：首頁

主標：

> 找到與你政策偏好最接近的候選人

副標：

> 不先看政黨，先看政策。

說明：

> 花約 5～8 分鐘回答問題，了解你的政策偏好，以及不同候選人與你的政策距離。

---

## Step 2：選擇選舉

```text
你要參加哪一場選舉？

2026 地方選舉
```

接著選：

```text
縣市
行政區／選區
職位
```

---

# 7. Step 3：選擇最重視的政策

先讓使用者選擇 Top 3～5。

例如：

```text
請選出你最重視的政策議題：

□ 住房
□ 交通
□ 教育
□ 社會福利
□ 環境
□ 財政
□ 都市發展
□ 治安
□ 長照
□ 產業
```

然後排序：

```text
1. 住房
2. 交通
3. 教育
4. 環境
5. 財政
```

這會直接影響後面的權重。

---

# 8. 問卷設計

MVP 建議：

* 15～20 個核心問題
* 再依照使用者的答案／重視議題追加 5～8 個 adaptive questions

不要一開始就問 50～100 題。

---

# 9. 問題類型

不要所有問題都使用同一種「同意／不同意」。

可以混合：

## 9.1 五點量表

```text
非常支持
支持
中立
反對
非常反對
```

轉成：

```text
+2
+1
 0
-1
-2
```

---

## 9.2 二選一

例如：

> 如果預算只能選一個，你比較支持？

```text
A. 增加公共住宅
B. 增加租屋補助
```

這種問題可以測量真正的政策取捨。

---

## 9.3 預算分配

例如：

> 如果市政府多了 100 億元預算，你希望如何分配？

```text
交通      30
教育      25
住房      25
環境      10
治安      10
```

這種方式比單純問「你支不支持交通」更能了解使用者優先順序。

---

## 9.4 情境題

政治政策通常存在 trade-off。

例如：

> 如果增加公共住宅需要減少其他建設預算，你是否仍然支持？

可以藉此確認使用者是真正支持，還是只有在「不用付出成本」的情況下支持。

---

# 10. Adaptive Questionnaire

可以採用類似推薦／學習系統的動態選題。

例如：

使用者表示：

```text
住房 = 非常重要
```

系統就追加：

```text
你比較支持：

A. 增加公共住宅
B. 增加租屋補助
C. 提供購屋補助
```

如果使用者已經非常明確：

```text
住房偏好 = 明確
```

就不需要再問很多類似問題。

如果：

```text
住房偏好 = 模糊
```

再增加相關問題。

---

# 11. Candidate Data

核心資料：

```text
candidate
```

候選人基本資料：

* id
* election_id
* district_id
* name
* photo
* gender
* birth
* birthplace
* party
* education
* experience
* official_website
* created_at
* updated_at

````

政黨可以顯示為「事實資料」，但：

**政黨不可直接作為推薦分數。**

---

# 12. Issue

政策議題：

```text
issue
````

例如：

```text
住房
交通
教育
環境
社會福利
財政
都市發展
治安
長照
產業
```

建議每個 issue 可以再有：

```text
parent_issue
```

或 category。

但 MVP 不需要建立太複雜的政策知識圖譜。

---

# 13. Candidate Position

候選人在某政策上的立場：

```text
candidate_position
```

例如：

```text
candidate_id
issue_id
position
statement
confidence
source_id
created_at
updated_at
```

position 可以使用：

```text
-2 = 強烈反對
-1 = 反對
 0 = 中立／未明確
+1 = 支持
+2 = 強烈支持
```

但要注意：

**「沒有資料」不要直接等於 0。**

最好區分：

```text
position = NULL
```

代表：

> 尚無足夠資料判斷。

---

# 14. Claim

建議額外建立：

```text
claim
```

保存候選人的具體主張。

例如：

```text
candidate_id
issue_id
statement
statement_type
source_id
published_at
confidence
```

statement 例如：

> 候選人主張在任期內增加公共住宅數量。

這樣未來可以進行：

```text
候選人說了什麼
↓
來源在哪裡
↓
當時什麼時間說的
↓
後來做了什麼
```

---

# 15. Source

所有政治資訊都應該有來源。

```text
source
```

欄位：

```text
id
source_type
title
url
publisher
published_at
created_at
```

source_type：

```text
OFFICIAL_MANIFESTO
OFFICIAL_CEC
OFFICIAL_VIDEO
PUBLIC_DEBATE
PRESS_CONFERENCE
INTERVIEW
GOVERNMENT_DATA
GOVERNMENT_DOCUMENT
NEWS
FACT_CHECK
SOCIAL_MEDIA
OTHER
```

---

# 16. 證據優先順序

優先使用：

### Level 1：官方／第一手資料

* 中選會資料
* 候選人正式政見
* 候選人官方網站
* 政府資料
* 法律
* 預算
* 議會紀錄
* 官方會議資料

### Level 2：候選人公開發言

* 公開辯論
* 政見發表會
* 記者會
* 完整訪談
* 官方影片
* 官方社群

### Level 3：新聞

新聞可以作為資料來源，但：

**不要直接把媒體的解讀當成候選人立場。**

最好追溯：

```text
新聞
↓
原始影片／逐字稿／官方聲明
↓
candidate_position
```

### Level 4：事實查核

Fact Check 可以用來補充：

* 是否與事實相符
* 是否缺少重要背景
* 是否錯誤推論
* 是否缺乏證據

但不要簡單變成：

```text
被查核 = 扣 10 分
```

---

# 17. Evidence Confidence

每一個 candidate_position 都可以有：

```text
HIGH
MEDIUM
LOW
UNCONFIRMED
```

定義：

### HIGH

候選人正式政見或明確公開表態。

### MEDIUM

可靠公開訪談、辯論或新聞中可以確認候選人立場。

### LOW

第三方報導或需要較多推論。

### UNCONFIRMED

沒有足夠可靠證據。

---

# 18. Policy Matching

核心演算法可以完全使用普通程式完成。

**MVP 不需要 AI 參與推薦。**

假設：

```text
user_position = +2
candidate_position = +1
```

距離：

```text
distance = abs(user_position - candidate_position)
```

最大距離：

```text
max_distance = 4
```

相似度：

```text
similarity = 1 - distance / 4
```

因此：

```text
完全相同 = 1.0
差 1     = 0.75
差 2     = 0.50
差 3     = 0.25
完全相反 = 0
```

最後轉成：

```text
0～100
```

---

# 19. Issue Weight

使用者的重要議題要有較高權重。

例如：

```text
住房       30%
交通       25%
教育       20%
環境       15%
財政       10%
```

候選人政策符合度：

```text
policy_match =
Σ(issue_similarity × issue_weight)
```

---

# 20. 不建議把權重寫死

不要：

```typescript
score =
  housing * 0.3 +
  transport * 0.25 +
  education * 0.2;
```

應該讓資料決定。

例如：

```typescript
issues = [
  {
    id: 1,
    weight: 0.30
  },
  {
    id: 2,
    weight: 0.25
  }
]
```

這樣未來可以調整，不需要修改程式。

---

# 21. Feasibility Score

政策可行性與政策符合度必須分開。

候選人的政策可能：

```text
非常符合使用者
```

但：

```text
實際上很難執行
```

因此要另外評估。

---

## 可行性因素

### 21.1 Funding

資金來源：

```text
明確             +20
部分說明         +10
沒有說明          0
```

### 21.2 Authority

是否屬於地方政府權限：

```text
地方政府可直接處理       +20
需要中央政府合作          +10
需要修改法律               +5
主要不屬於地方權限          0
```

### 21.3 Timeline

時間是否合理：

```text
合理              +20
偏樂觀            +10
明顯不合理          0
```

### 21.4 Cost / Scale

政策規模與成本是否合理：

```text
成本有估算且合理      +20
有概略估算            +10
完全沒有說明            0
```

### 21.5 Execution Complexity

行政執行難度：

```text
低                  +20
中                  +10
高                   0
```

---

# 22. Feasibility 不要假裝是客觀真理

這些分數是：

> 系統根據公開方法論所做的評估。

不是：

> 真理。

網站必須公開：

```text
我們如何判斷政策可行性？
```

讓使用者知道：

```text
為什麼這個政策得到 70 分？
```

---

# 23. Fulfillment / Track Record

過去履約紀錄可以使用：

```text
completed = 1
partial = 0.5
not_completed = 0
```

例如：

```text
政策 A
承諾：增加 20,000 戶
結果：完成 20,000
→ 1.0

政策 B
承諾：10,000 戶
結果：完成 5,000
→ 0.5

政策 C
承諾：100 km
結果：20 km
→ 0.2
```

但不能只看數字。

必須保存：

```text
promise
result
status
reason
evidence
```

---

# 24. 「跳票」不要過度簡化

政策沒有完成，不一定代表候選人故意欺騙。

可能原因：

* 預算未通過
* 議會阻擋
* 中央政府權限
* 法律限制
* 天災
* 政策環境改變
* 預算不足
* 執行能力問題
* 原本政策本身就不合理

因此 UI 建議使用：

> 履約紀錄

或：

> 過去政策執行紀錄

而不是：

> 說謊率

或：

> 跳票率

---

# 25. 政治新人的處理

非常重要。

如果候選人：

```text
沒有相關執政經驗
```

不要：

```text
履約 = 0
```

應該：

```text
履約紀錄 = N/A
```

例如：

> 候選人缺乏相關執政紀錄，因此無法評估過去履約情況。此項不納入排名。

但是：

**政策可行性仍然可以評估。**

也就是：

```text
新人：

Policy Match       90
Feasibility        75
Fulfillment        N/A
Confidence         60
```

---

# 26. Final Score

可以先採用：

```text
Policy Match       50%
Feasibility        30%
Fulfillment        20%
```

例如：

```text
final_score =
  policy_match * 0.5 +
  feasibility * 0.3 +
  fulfillment * 0.2
```

但：

**50/30/20 只是 MVP 預設值，不是政治真理。**

未來可以讓使用者調整：

```text
政策符合度      50%
政策可行性      30%
過去履約        20%
```

使用者可以修改：

```text
政策符合度      70%
政策可行性      20%
過去履約        10%
```

排名即時重新計算。

---

# 27. Missing Data 的計算

不能因為某候選人沒有履約資料就直接給 0。

假設：

```text
Policy = 90
Feasibility = 80
Fulfillment = N/A
```

應該重新正規化：

```text
available_weight =
  policy_weight + feasibility_weight
```

例如：

```text
final =
(90 × 0.5 + 80 × 0.3)
/
(0.5 + 0.3)
```

而不是：

```text
90 × 0.5 +
80 × 0.3 +
0 × 0.2
```

---

# 28. Confidence

另外計算：

```text
confidence
```

例如依照：

* 有多少政策有資料
* 有多少資料來自第一手來源
* source confidence
* 是否有相互矛盾的公開說法
* 是否有歷史紀錄

最後顯示：

```text
Match       87
Confidence  92
```

或：

```text
Match       89
Confidence  51
```

---

# 29. Candidate Result UI

結果頁：

```text
你的政策偏好
────────────────

住房       █████████ 91
交通       ████████  87
教育       ███████   72
環境       ██████    61
財政       ████      45
```

接著：

```text
與你政策最接近

#1 候選人 A
政策符合度       91
政策可行性       82
履約紀錄         88
資料完整度       94

#2 候選人 B
政策符合度       87
政策可行性       76
履約紀錄         N/A
資料完整度       62
```

---

# 30. 「為什麼？」功能

每個候選人都要可以展開：

```text
為什麼候選人 A 排第一？
```

顯示：

```text
住房
你的立場：
非常支持增加公共住宅

候選人 A：
支持增加公共住宅，並提出具體數量與時間表

→ 高度一致
```

再顯示：

```text
證據
[官方政見]
[政見發表會影片]
```

---

# 31. Biggest Differences

除了告訴使用者：

> 最符合你的地方

也應該告訴：

> 你和候選人最大的差異。

例如：

```text
你非常支持增加公共住宅

候選人 A：
支持

候選人 B：
主要支持租屋補助

候選人 C：
未提出明確政策
```

這比單純給一個百分比更有價值。

---

# 32. Candidate Comparison

提供候選人比較：

| 議題 | 你的立場 |  A |  B |  C |
| -- | ---: | -: | -: | -: |
| 住房 |   +2 | +2 | +1 |  0 |
| 交通 |   +1 | +1 | +2 | -1 |
| 教育 |   +2 | +2 | +1 | +2 |
| 環境 |   +1 | +2 |  0 | +1 |

點擊後可以查看：

```text
候選人立場
↓
原始聲明
↓
資料來源
↓
發布日期
```

---

# 33. Timeline

未來非常重要的功能：

```text
2022
承諾 X
↓
2023
開始執行
↓
2024
完成 60%
↓
2026
再次提出相關政策
```

讓使用者看到：

> 過去承諾 → 實際執行 → 現在再次承諾

---

# 34. Data Model

MVP 建議：

```text
election
district
candidate
issue
candidate_position
claim
source
fulfillment_record
user_response
user_issue_weight
```

未來可增加：

```text
feasibility_assessment
candidate_event
candidate_statement
policy_version
```

---

# 35. Suggested Schema

## election

```text
id
name
year
type
start_date
election_date
status
```

## district

```text
id
election_id
name
city
district_code
```

## candidate

```text
id
election_id
district_id
name
photo
party
education
experience
official_website
```

## issue

```text
id
name
description
parent_id
sort_order
```

## candidate_position

```text
id
candidate_id
issue_id
position
statement
confidence
source_id
published_at
```

## claim

```text
id
candidate_id
issue_id
statement
statement_type
source_id
confidence
published_at
```

## source

```text
id
source_type
title
url
publisher
published_at
```

## fulfillment_record

```text
id
candidate_id
claim_id
status
progress
result
reason
source_id
```

status：

```text
COMPLETED
PARTIAL
NOT_COMPLETED
UNKNOWN
NOT_APPLICABLE
```

---

# 36. User Data

## user_response

```text
id
session_id
question_id
issue_id
answer
position
created_at
```

## user_issue_weight

```text
session_id
issue_id
weight
```

MVP 可以甚至不用登入。

使用：

```text
anonymous session
```

先完成配對。

---

# 37. API

建議：

```http
GET /elections
GET /elections/:id/districts
GET /districts/:id/candidates
GET /issues
GET /questions

POST /match

GET /candidates/:id
GET /candidates/:id/positions
GET /candidates/:id/claims
GET /candidates/:id/fulfillment

GET /sources/:id
```

POST：

```http
POST /match
```

Request：

```json
{
  "districtId": 1,
  "responses": [],
  "issueWeights": []
}
```

Response：

```json
{
  "results": [
    {
      "candidateId": 1,
      "policyMatch": 91,
      "feasibility": 82,
      "fulfillment": 88,
      "finalScore": 88,
      "confidence": 94
    }
  ]
}
```

---

# 38. Frontend Routes

React Router：

```text
/
```

首頁

```text
/start
```

開始

```text
/location
```

選擇選舉／地區

```text
/survey
```

問卷

```text
/result
```

結果

```text
/candidate/:id
```

候選人詳細資料

```text
/compare
```

候選人比較

---

# 39. 技術架構

現有技術可以直接沿用：

### Frontend

```text
React
Vite
TypeScript
Redux
React Router
Tailwind CSS
MUI
CSS
```

### Backend

可以：

```text
Node.js + TypeScript
```

或：

```text
Spring Boot
```

### Database

```text
MySQL
```

### Deployment

```text
AWS S3
CloudFront
Route53
```

---

# 40. MVP 原則：不要一開始使用 AI 做推薦

整個推薦核心可以：

**100% 使用 deterministic code。**

流程：

```text
使用者回答
↓
轉換成 position
↓
取得 issue weight
↓
取得 candidate position
↓
計算 similarity
↓
計算 policy match
↓
計算 feasibility
↓
計算 fulfillment
↓
計算 final score
↓
排序
```

同樣輸入：

```text
一定得到同樣結果
```

---

# 41. 可以純 if/else 完成

MVP 的核心完全可以用：

```typescript
if / else
```

以及：

```typescript
for
map
reduce
sort
Math.abs
```

完成。

不需要 AI。

例如：

```typescript
const distance = Math.abs(
  userPosition - candidatePosition
);

const similarity =
  1 - distance / 4;
```

---

# 42. 但不要把候選人寫死

禁止：

```typescript
if (candidate.name === "候選人A") {
  score += 10;
}
```

也禁止：

```typescript
if (candidate.party === "某政黨") {
  score += 5;
}
```

應該：

```typescript
scoreCandidate(candidate, userProfile, rules)
```

程式只知道：

```text
規則
```

不知道：

```text
誰是好人
誰是壞人
誰應該得分
```

---

# 43. Data-driven Architecture

推薦架構：

```text
Database
    ↓
Candidate data
Issue data
Position data
Source data
Fulfillment data
    ↓
Scoring Engine
    ↓
Result
```

而不是：

```text
大量 if/else 判斷候選人
```

---

# 44. AI 的正確用途

AI 未來可以使用，但主要負責：

### 資料整理

例如：

```text
候選人政見 PDF
↓
AI
↓
找出政策主張
↓
分類 issue
↓
產生 candidate_position 草稿
↓
人工確認
↓
寫入 DB
```

也可以：

```text
辯論影片
↓
逐字稿
↓
AI
↓
找出候選人政策聲明
↓
人工審核
```

AI 不應該直接決定：

```text
「這個候選人比較適合你」
```

---

# 45. Human Review

AI 產生資料後：

```text
AI extraction
↓
Human review
↓
Approved
↓
Database
```

必須保留：

```text
原始來源
AI extraction
審核狀態
審核時間
```

---

# 46. 為什麼推薦演算法不要交給 AI

如果使用 LLM 直接：

```text
User preferences
+
Candidate information
↓
GPT
↓
Candidate ranking
```

會產生問題：

* 結果不一定 deterministic
* 難以測試
* 難以解釋
* prompt 改變可能導致結果改變
* 容易產生政治偏差
* 很難知道排名到底是因為什麼產生

因此：

> AI 做 NLP，程式做 scoring。

這是本專案的主要技術原則。

---

# 47. 政治中立原則

網站必須把：

```text
事實
候選人主張
系統評估
使用者偏好
```

清楚分開。

例如：

### Fact

> 某候選人曾任 X 職務。

### Candidate Statement

> 候選人主張增加公共住宅。

### System Assessment

> 根據資金來源、地方權限與時間表，本系統評估政策可行性為 75。

### User Preference

> 使用者非常支持增加公共住宅。

這四者不能混在一起。

---

# 48. 方法論透明

網站必須公開：

```text
我們如何計算政策符合度？
我們如何判斷政策可行性？
我們如何判斷履約？
資料來源是什麼？
什麼情況會顯示 N/A？
資料多久更新？
如果資料錯誤如何回報？
```

最好建立：

```text
/methodology
```

頁面。

---

# 49. 使用者應該可以檢查排名

結果頁提供：

```text
為什麼是這個排名？
```

使用者點擊後可以看到：

```text
你的答案
+
候選人立場
+
來源
+
計算方式
```

例如：

```text
住房
你的立場：+2
候選人 A：+2

相似度：100%

來源：
候選人 2026 正式政見
```

這比單純：

```text
A = 91%
```

更重要。

---

# 50. 允許使用者調整權重

結果頁提供：

```text
你比較重視什麼？

政策符合度       50%
政策可行性       30%
過去履約         20%
```

可以拖拉：

```text
政策符合度       70%
政策可行性       20%
過去履約         10%
```

排名即時更新。

這可以讓系統避免替使用者決定：

> 什麼才是「最好候選人」。

而是：

> 使用者自己決定什麼最重要。

---

# 51. 不要使用政治光譜

不建議結果顯示：

```text
左派
右派
藍
綠
白
```

也不要：

```text
候選人 A = 72% 某政治光譜
```

除非未來有非常嚴謹、獨立的方法論。

第一版應該專注：

```text
政策 A
政策 B
政策 C
```

---

# 52. Candidate Party

政黨資訊可以顯示：

```text
候選人 A
XXX 黨
```

但只作為：

> 候選人背景資訊。

不要：

```text
party → scoring
```

---

# 53. Data Completeness

候選人頁可以顯示：

```text
資料完整度

政策資料       95%
公開發言       80%
履約資料       90%
財務／可行性   70%
```

如果資料不足：

```text
資料不足
```

而不是：

```text
候選人表現不好
```

---

# 54. 新候選人的公平處理

新人可能：

```text
沒有過去執政紀錄
```

因此：

```text
履約 = N/A
```

但：

```text
政策分析
可行性分析
公開政見
```

仍然可以正常進行。

這可以避免系統天然偏向現任者。

---

# 55. 重要的資料時間軸

候選人的資料要保存：

```text
published_at
```

因為政治人物的立場可能改變。

未來可以顯示：

```text
2022
政策 A

2024
政策 B

2026
政策 C
```

避免把不同時間的言論混在一起。

---

# 56. Versioning

如果候選人的政策後來有更新：

不要直接覆蓋舊資料。

應保存：

```text
policy version
```

例如：

```text
Candidate A
Issue: Housing

2026-08-01
Version 1

2026-09-05
Version 2
```

這樣才能追蹤政策變化。

---

# 57. Legal / Editorial Considerations

這是一個政治／選舉資訊網站，因此正式上線前需要確認：

* 選舉罷免相關法規
* 政治廣告規範
* 網路政治廣告揭露義務
* 候選人資料使用
* 著作權
* 肖像權
* 商標
* 個資法
* 來源引用
* 事實查核與評論的界線

網站應避免使用：

> 「我們認定某候選人是騙子」

這種主觀、可能產生法律風險的表述。

比較適合：

> 「根據公開資料，目前可確認……」

> 「本系統無法找到足夠資料確認……」

> 「此項政策的可行性評估為……」

---

# 58. MVP 開發順序

## Phase 1：最小可行產品

先不要做 AI。

完成：

```text
選舉
↓
選區
↓
候選人
↓
政策議題
↓
問卷
↓
candidate_position
↓
policy matching
↓
結果頁
```

候選人資料先人工建立。

---

## Phase 2：加入可行性

加入：

```text
funding
authority
timeline
cost
execution complexity
```

---

## Phase 3：加入履約

加入：

```text
candidate promises
↓
actual result
↓
fulfillment
```

---

## Phase 4：加入證據系統

加入：

```text
source
claim
confidence
```

並讓使用者查看原始資料。

---

## Phase 5：AI 輔助資料建立

加入：

```text
PDF
新聞
影片逐字稿
候選人網站
↓
AI extraction
↓
Human review
↓
DB
```

---

## Phase 6：Adaptive Questionnaire

根據使用者答案動態決定下一題。

例如：

```text
使用者對住房很重視
↓
問住房 trade-off
↓
如果答案不明確
↓
再問一題
```

---

# 59. MVP 最重要的原則

不要一開始做：

```text
AI
爬蟲
推薦模型
複雜知識圖譜
政治光譜
社群
登入
```

先證明：

> 使用者願意回答問題，並且認為結果「有道理」。

最重要的是：

```text
問卷 UX
+
政策資料
+
透明 scoring
+
結果解釋
```

---

# 60. 核心 Scoring Engine

建議最終做成獨立 module：

```text
/scoring
```

例如：

```typescript
type UserIssuePreference = {
  issueId: number;
  position: number;
  weight: number;
};

type CandidateIssuePosition = {
  issueId: number;
  position: number | null;
};

type CandidateScore = {
  policyMatch: number;
  feasibility: number | null;
  fulfillment: number | null;
  finalScore: number;
  confidence: number;
};
```

核心：

```typescript
function calculatePolicySimilarity(
  userPosition: number,
  candidatePosition: number
): number {
  const distance = Math.abs(
    userPosition - candidatePosition
  );

  return 1 - distance / 4;
}
```

---

# 61. 最終 Ranking

概念：

```typescript
function rankCandidates(
  candidates,
  userProfile,
  rules
) {
  return candidates
    .map(candidate => {
      const score = calculateCandidateScore(
        candidate,
        userProfile,
        rules
      );

      return {
        candidate,
        score
      };
    })
    .sort(
      (a, b) =>
        b.score.finalScore -
        a.score.finalScore
    );
}
```

注意：

**ranking engine 不知道候選人的政治身份，只處理資料與規則。**

---

# 62. Unit Tests

因為核心是 deterministic，因此可以大量測試。

例如：

```text
user = +2
candidate = +2
expect similarity = 1
```

```text
user = +2
candidate = -2
expect similarity = 0
```

```text
fulfillment = N/A
expect final score excludes fulfillment weight
```

```text
candidate has no historical record
expect fulfillment = N/A
```

```text
same user input + same candidate data
expect same result
```

---

# 63. 成功標準

第一版不是追求：

> 「我們的排名一定正確。」

而是：

> 使用者看完結果後，可以理解「為什麼這個候選人排在這裡」。

因此核心 KPI 可以是：

```text
問卷完成率
結果頁完成率
候選人詳細頁點擊率
「為什麼」展開率
來源查看率
使用者重新調整權重的比例
```

---

# 64. 最終產品定位

整個產品可以用一句話描述：

> **一個根據你的政策偏好，透明比較候選人政見、政策可行性與過去執行紀錄的選舉資訊工具。**

而不是：

> AI 幫你選總統／市長／議員。

---

# 65. Agent 開發原則

Agent 在開發本專案時，優先遵守以下原則：

1. **先做 deterministic MVP**
2. scoring 不使用 LLM
3. 不寫 candidate-specific hardcode
4. 不使用 party-specific score
5. 不把缺資料當成 0 分
6. Match Score 與 Confidence 分離
7. 政策符合度、可行性、履約紀錄分開
8. 所有候選人政策資料盡可能保存 source
9. 優先使用第一手資料
10. AI 僅作資料抽取／分類／整理輔助
11. AI 產生資料必須可人工審核
12. 每個分數都應能解釋
13. Scoring rules 必須可測試
14. 使用者可以調整 scoring weights
15. 不建立政治光譜或政黨推薦分數
16. 新人沒有履約紀錄時使用 N/A
17. 不因媒體曝光量少而懲罰候選人
18. 不以「說謊率」「騙票率」等過度簡化指標評價候選人
19. 所有重要方法論公開
20. 優先建立「可理解、可驗證、可追溯」的結果

---

# 66. 第一個開發任務

Agent 第一階段不要直接做完整網站。

先建立：

```text
1. Database schema
2. Seed data
3. Questionnaire data structure
4. Scoring Engine
5. Unit Tests
6. /match API
7. 最基本 Result Page
```

先用假資料驗證：

```text
3 個候選人
5 個 issue
10～20 題問卷
```

確定：

```text
使用者回答
↓
政策權重
↓
候選人政策
↓
Match Score
↓
Final Ranking
```

全部正確後，再加入：

```text
Feasibility
Fulfillment
Source
Confidence
AI extraction
```

---

# 67. 開發時的核心問題

每開發一個功能，都先問：

> 這個功能是在幫使用者「理解候選人的政策」，還是在偷偷「影響使用者支持某候選人」？

如果是後者，應重新設計。

本專案的目標不是：

> 替使用者做政治決定。

而是：

> **讓使用者更容易自己做出政治決定。**

---

# 68. 已決定的 MVP 實作範圍

## 使用者流程

MVP 的流程固定為：

```text
選擇職位
↓
載入該職位的政策議題與問卷
↓
回答政策偏好並排序重要議題
↓
選擇縣市／選區
↓
只比較該地區的候選人
↓
顯示排名與可理解的原因
```

職位必須先選，因為市長與議員的權責、政策範圍與應關注的問題不同。地區則延後到問卷完成後選擇；地區選擇只決定候選人集合，不改變使用者已建立的政策偏好。

## MVP 技術選擇

第一階段採用：

```text
Next.js App Router
TypeScript
Tailwind CSS
Client-side seed data
Anonymous session state
```

Scoring engine 必須是獨立的純 TypeScript module，不放在 React component 中，也不使用 LLM 直接產生候選人排名。MVP 暫不建立獨立 backend、資料庫或登入系統。

## MVP 資料與功能

先以少量人工建立的 seed data 驗證多地區流程：

```text
至少 2 個地區
每個地區 2～3 位候選人
每個職位一組問題
至少 5 個政策議題
每組問卷約 10～20 題
```

第一版先完成：

1. 職位選擇與職位專屬問卷
2. 政策偏好與議題權重
3. 地區與候選人篩選
4. Policy Match 與 Confidence 計算
5. 候選人排名與主要一致／差異議題
6. 缺資料顯示為 `N/A`，不直接當成 0 分
7. Scoring unit tests

第一版暫不做：

```text
AI 推薦或 AI 直接排名
爬蟲與完整候選人資料匯入
登入與社群功能
政治光譜
政黨加減分
Adaptive questionnaire
政策可行性評分
履約／執行紀錄評分
完整資料編輯後台
```

完成上述流程並確認結果可解釋後，再逐步加入 source、feasibility、fulfillment、API、資料庫與 AI 輔助資料整理。
