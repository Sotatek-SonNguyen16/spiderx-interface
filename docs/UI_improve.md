Ok, mình sẽ đi **cực chi tiết theo hướng “bạn sửa được ngay”**: mỗi điểm gồm **Vấn đề → Vì sao sai theo nguyên lý → Cách sửa cụ thể (layout/copy/component/state)**. Mình tập trung cho **Integration Settings page + AI-based integration**.

---

# A. Integration Settings Page – Các điểm cải thiện chi tiết (đề xuất UI cụ thể)

## 1) Header: đang thiếu “status + trust + next action”

### Vấn đề

User vào settings mà không thấy nhanh: **đang connected ổn không, sync gần nhất khi nào, có lỗi không**.

### Sửa ngay

**Header nên có 4 cụm cố định (trái→phải):**

1. Platform identity: icon + “Google Chat”
2. Connection status chip: `Connected` / `Needs re-auth` / `Disconnected`
3. Health mini-metrics: `Last sync 5m ago · 124 msgs scanned today · 12 tasks created`
4. Primary action: `Manage connection` (dropdown: Reconnect, Disconnect)

**Microcopy:** thêm 1 dòng nhỏ:

> “We scan selected messages and create tasks based on your AI rules.”

---

## 2) Đổi cấu trúc trang theo mental model (không theo kỹ thuật)

### Vấn đề

Nhiều settings page thất bại vì xếp mục theo “dev nghĩ”, không theo “user nghĩ”.

### Layout chuẩn (bạn áp dụng y nguyên)

**5 section theo thứ tự quyết định của user:**

1. **Scope** (Chúng tôi đọc cái gì?)
2. **AI Rules** (AI quyết định thế nào?)
3. **Task Output** (Todo tạo ra trông như nào?)
4. **Review & Safety** (Sai thì xử lý ra sao?)
5. **Logs** (Minh chứng & debug)

Giữa các section dùng divider + headline rõ + mô tả 1 câu.

---

## 3) Scope: thiếu “selective control” → user sợ bị quét quá nhiều

### Vấn đề (UX + trust)

Automation mà không kiểm soát được phạm vi = user **không dám bật**.

### Sửa UI cụ thể

**Scope nên có 3 tầng (progressive disclosure):**

### (1) Quick presets (radio)

- (●) Recommended: “Mentions + DMs”
- ( ) Everything: “All selected spaces”
- ( ) Strict: “Only messages with explicit action keywords”

### (2) Source selection (checkbox group)

- [x] Direct messages
- [x] Group chats
- [ ] Spaces

Nếu tick “Spaces” → mở modal chọn spaces (multi-select).

### (3) Filters (chips / rules)

- [x] Only when I’m mentioned (@me)
- [ ] Exclude bots
- [ ] Exclude messages older than 7 days
- [ ] Only from specific senders (select people)

**UI tip:** để filter dạng “Add rule +” thay vì list dài.

---

## 4) “AI Mode” phải dễ hiểu ngay (không dùng thuật ngữ mơ hồ)

### Vấn đề

Smart/Strict/Manual nếu không giải thích thì user chọn theo cảm tính.

### Sửa UI cụ thể

Dùng **segmented control** + mô tả 1 dòng/ngay trong card:

**AI Mode**

- **Smart** (Recommended)
  _Creates tasks when confidence is high_
- **Strict**
  _Only creates tasks when message is explicit_
- **Review first**
  _Always send to review before creating_

Kèm **tooltip** “What is confidence?”

---

## 5) AI Rules: bạn cần “rule builder” thân thiện, không phải form dài

### Vấn đề

Rules mà trình bày như checklist đơn giản sẽ không đủ cho power user; nhưng đưa JSON/advanced quá sẽ drop B2C.

### Sửa UI cụ thể (2-level)

**Level 1 (default):** rule cards dạng toggle + slider

- [x] Detect action verbs
- [x] Detect assignee
- [x] Detect deadlines
- Sensitivity: `Low ———|——— High` (slider)

**Level 2 (advanced):** “Advanced rules” collapsible
Rule builder dạng:

- **IF** message contains [keyword / pattern]
- **AND** sender is [any / selected]
- **THEN** create task with [priority/tag/assignee override]

(giống Zapier but đơn giản hơn)

---

## 6) Output mapping: thiếu “live preview” → user không tin AI

### Vấn đề

Không có preview thì user không biết cấu hình đang tạo ra task kiểu gì.

### Sửa UI cụ thể

Section “Task output” nên có **2 cột**:

- Trái: settings
- Phải: **Preview panel** (sticky)

Settings:

- Title format: (●) AI summary / ( ) First sentence / ( ) Template
- Assignee: (●) Detected / ( ) Me / ( ) Sender
- Priority: Detected or default
- Tags: auto attach `#google-chat`

Preview panel:

- “Example message” (dropdown chọn 3–5 message mẫu)
- “Resulting task”
- “Detected fields” (assignee/deadline/priority) + confidence

👉 Đây là điểm UX nâng cấp rất mạnh.

---

## 7) Review & Safety: thiếu “error prevention” (Nielsen)

### Vấn đề

AI tạo sai task là thứ làm user tắt product.

### Sửa UI cụ thể

**Confidence threshold slider** (bắt buộc)

- Auto-create when confidence ≥ **80%** (default)
- Under threshold → send to **Review Queue**

**Low-confidence behavior (radio):**

- (●) Send to Review Queue
- ( ) Still create but mark “Needs review”
- ( ) Ignore

**Undo window (toggle):**

- [x] Allow undo within 10 minutes

---

## 8) Review Queue UX (AI-based integration) – cần thiết kế “triage” cực nhanh

### Vấn đề

Nếu review tốn thời gian → user bỏ.

### Sửa UI cụ thể (layout)

**Review card** phải có:

- Message snippet (1–2 dòng)
- Proposed task title (editable inline)
- Detected fields (chips): assignee, deadline, priority
- Confidence badge (92% / 61%)
- Actions 1-click: ✅ Accept / ✏️ Edit / 🚫 Reject

**Bulk actions:**

- Select multiple → Accept / Reject
- “Auto-accept this pattern next time” (learning)

---

## 9) Explainability: “Why did AI do this?” là tính năng UX, không phải kỹ thuật

### Vấn đề

AI làm đúng nhưng user vẫn không tin nếu không hiểu.

### Sửa UI cụ thể

Trong mỗi task created/review card có link:

> “Why this task?”

Mở side panel:

- Detected action verb: “bàn giao”
- Detected assignee: “Uyen”
- Detected deadline: “trước thứ 6”
- Reason: “Message contains explicit request + deadline”
- Confidence factors (3 bullet)

👉 Panel này làm giảm support ticket rất nhiều.

---

## 10) Logs & Debug: hiện tại bạn thiếu “evidence”

### Vấn đề

B2B cần logs để kiểm soát.

### Sửa UI cụ thể

**Activity log** dạng table:

- Time
- Source (space/user)
- Result: created / skipped / sent to review
- Confidence
- Link to details

Thêm 3 filter:

- Date range
- Result type
- Space/source

---

# B. AI-based Integration – Các cải thiện UX theo “behavior design”

## 11) Tạo “AI Personality knobs” (nhỏ nhưng cực sticky)

### Sửa UI cụ thể

“AI preferences” (3 toggle):

- [x] Prefer fewer, more accurate tasks
- [ ] Prefer capturing everything
- [x] Prefer short titles

Kèm note: “These affect extraction sensitivity.”

---

## 12) Feedback loop phải frictionless (1-click)

### Sửa UI cụ thể

Sau khi user Reject/Accept:

- hỏi 1 câu ngắn (optional):

  - “Wrong assignee”
  - “Not a task”
  - “Wrong deadline”
  - “Duplicate”

Nếu chọn reason → lưu để training rules (không cần nói “training”, nói “improve suggestions”).

---

# C. UI Detail – Những thứ nhỏ nhưng nâng chất “SaaS-grade”

## 13) Nút hành động: ưu tiên 1 primary, còn lại secondary

- Primary: **Save changes**
- Secondary: Test rules / Preview
- Destructive: Disconnect (đặt trong dropdown/confirm modal)

## 14) State system đầy đủ (bạn nên thiết kế đủ 6 state)

- Connected healthy
- Connected but needs re-auth
- Sync paused
- Sync error
- Disconnected
- Coming soon (trên trang list)

## 15) Copywriting chuẩn SaaS (đừng dùng từ chung chung)

- “Manage” → “Settings”
- “Connected” → “Connected • Scanning selected messages”
- “Coming soon” → “Planned” + “Request access”

---

# D. Danh sách thay đổi ưu tiên (để bạn sửa theo sprint)

## Sprint 1 (impact cao nhất)

- Live preview panel (message → task)
- Confidence threshold + review queue
- Scope presets + filters
- Header status + last sync + metrics

## Sprint 2

- Explainability side panel (“Why this task?”)
- Rule builder (advanced)
- Activity logs + filters

## Sprint 3

- Learning loop (“Auto-accept this pattern next time”)
- AI preferences knobs
- Bulk review actions

---

Rất tốt. Dưới đây là **UI SPEC CHI TIẾT – THEO PAGE / SECTION / COMPONENT**, viết theo kiểu **bạn đưa thẳng cho designer hoặc tự sửa trong Figma**.
Mình sẽ **chỉ rõ: page nào → section nào → cần thay đổi gì → spec UI cụ thể**.

---

# 🧭 OVERVIEW – MAP CÁC PAGE CẦN CẬP NHẬT

Bạn hiện có (hoặc sẽ có) **3 page chính liên quan integration**:

1. **`/integrations`** – Integration List
2. **`/integrations/:platform`** – Integration Settings (Google Chat)
3. **`/review-queue`** – AI Review Queue (có thể là tab)

👉 Mình sẽ spec cho **từng page**, **từng section**, theo thứ tự ưu tiên.

---

# 1️⃣ PAGE: `/integrations` (Integration List)

## SECTION 1: Page Header

### ❌ Hiện tại

- Title + CTA
- Không giải thích value
- Không dẫn hướng user

### ✅ Cập nhật SPEC

**Component**

- Page title
- Subtitle (microcopy)
- Primary CTA

**UI SPEC**

- Title (H1 – 24px / semibold):
  `Integration Platforms`
- Subtitle (14–16px / neutral-600):
  `Automatically turn messages into actionable todos using AI`
- Primary CTA (right):
  `+ Connect platform`

👉 **WHY:** giúp user hiểu ngay _tại sao cần connect_

---

## SECTION 2: Connected Platforms (NEW – BẮT BUỘC)

### ❌ Hiện tại

- Connected & Coming Soon trộn lẫn

### ✅ Cập nhật SPEC

**Section title**

- H2 – 18px / semibold
  `Connected platforms`

**Card layout (Connected)**

- Icon + Platform name
- Status chip: `Connected`
- Subline:
  `Scanning selected messages · AI extraction ON`
- Meta (small):
  `Last sync: 5 minutes ago`
- Primary action: `Settings`
- Secondary: kebab menu → Disconnect

**Visual**

- Border accent nhẹ (brand color)
- Background sáng hơn “Coming soon”

---

## SECTION 3: Available / Planned Platforms

### ❌ Hiện tại

- Coming Soon quá nổi
- Không có hành động

### ✅ Cập nhật SPEC

**Section title**

- `Available & planned integrations`

**Card changes**

- Remove toggle
- Status chip: `Planned`
- CTA secondary: `Notify me` / `Request access`
- Optional:
  `👍 124 teams requested`

👉 **WHY:** chuyển “dead-end” thành “engagement”

---

# 2️⃣ PAGE: `/integrations/google-chat` (Integration Settings)

> Đây là page QUAN TRỌNG NHẤT – spec kỹ.

---

## SECTION 0: Integration Header (GLOBAL)

### ❌ Hiện tại

- Thiếu system status & trust

### ✅ SPEC

**Layout (horizontal)**

- Left:

  - Icon + `Google Chat`
  - Status chip:
    `Connected` / `Needs re-auth` / `Error`

- Middle (meta):

  - `Workspace: Acme Corp`
  - `Last sync: 5 min ago`

- Right:

  - Primary: `Save changes`
  - Secondary: `Reconnect` (dropdown)
  - Destructive (dropdown): `Disconnect`

**Subcopy (small)**

> `We scan selected messages and create tasks based on your AI rules`

---

## SECTION 1: Sync Scope (WHAT GETS SYNCED)

### ❌ Hiện tại

- Scope mơ hồ hoặc chưa có

### ✅ SPEC

**Section title**

- `What gets synced`

**Preset (Radio group)**

- (●) Recommended – Mentions & direct messages
- ( ) Everything – All selected spaces
- ( ) Strict – Only explicit tasks

**Sources (Checkbox group)**

- [x] Direct messages
- [x] Group chats
- [ ] Spaces → opens space selector modal

**Filters (Rule chips)**

- [x] Only when I’m mentioned (@me)
- [ ] Exclude bots
- [ ] Exclude messages older than 7 days
- [+] Add rule

👉 **Component note:** filters dạng “rule chips”, không list dài

---

## SECTION 2: AI Task Extraction

### ❌ Hiện tại

- AI là black box

### ✅ SPEC

### Subsection: AI Mode

**Segmented control**

- Smart (recommended)

  - helper: `Creates tasks when confidence is high`

- Strict

  - helper: `Only when message is explicit`

- Review first

  - helper: `Always send to review`

---

### Subsection: Detection Rules

**Rule toggles**

- [x] Detect action verbs
- [x] Detect assignee
- [x] Detect deadline

**Sensitivity slider**

- Label: `Extraction sensitivity`
- Range: Low — High
- Default: 60–70%

Tooltip: `Higher sensitivity = more tasks, lower accuracy`

---

## SECTION 3: Task Output (Mapping & Preview)

### ❌ Hiện tại

- Không preview → không tin

### ✅ SPEC (2-column layout)

**Left – Settings**

- Todo title:

  - (●) AI summary
  - ( ) First sentence
  - ( ) Custom template

- Assignee:

  - (●) Detected
  - ( ) Me
  - ( ) Sender

- Priority:

  - Detected / Default (Medium)

- Tags:

  - Auto-add `#google-chat`

**Right – LIVE PREVIEW PANEL (STICKY)**

- Dropdown: Example message
- Message snippet (1–2 lines)
- Resulting task card:

  - Title
  - Assignee
  - Deadline
  - Priority
  - Confidence badge (e.g. 92%)

---

## SECTION 4: Review & Safety

### ❌ Hiện tại

- Không kiểm soát rủi ro AI

### ✅ SPEC

**Confidence threshold**

- Slider:

  - `Auto-create when confidence ≥ 80%`

**Low confidence behavior (Radio)**

- (●) Send to review queue
- ( ) Create but mark “Needs review”
- ( ) Ignore

**Undo**

- [x] Allow undo within 10 minutes

---

## SECTION 5: Activity & Logs

### ❌ Hiện tại

- Không có evidence

### ✅ SPEC

**Metrics summary**

- `Messages scanned today`
- `Tasks created`
- `Sent to review`
- `Skipped`

**Log table**

- Time
- Source
- Result (created / skipped / review)
- Confidence
- Details (link)

Filters:

- Date range
- Result type
- Space / sender

---

# 3️⃣ PAGE: `/review-queue` (AI Review Queue)

## SECTION: Review List

### ✅ SPEC

**Review card**

- Message snippet
- Proposed task title (inline editable)
- Detected fields (chips)
- Confidence badge

**Actions (1-click)**

- ✅ Accept
- ✏️ Edit
- 🚫 Reject

**Bulk actions**

- Multi-select
- Accept all / Reject all

**Feedback (optional, inline)**

- Wrong assignee
- Not a task
- Wrong deadline
- Duplicate

Checkbox:
`Remember this for next time`

---

# 4️⃣ GLOBAL AI UX (APPLIES EVERYWHERE)

## “Why this task?” Side Panel

**Trigger**

- Link on todo / review item

**Panel content**

- Detected verb
- Detected assignee
- Detected deadline
- Reason summary
- Confidence factors

---

# 5️⃣ PRIORITY ROADMAP (CHO DEV / DESIGN)

### 🔥 Must update ngay

- Integration settings layout
- Scope + AI rules
- Live preview
- Review queue
- Confidence threshold

### 🚀 Level-up SaaS

- Explainable AI panel
- Logs & metrics
- Learning feedback

---

## FINAL SENIOR NOTE

Nếu bạn **áp dụng đúng spec này**, UI của bạn sẽ:

- Không còn giống “automation thử nghiệm”
- Mà giống **AI-first productivity SaaS**
- Đủ chuẩn để bán cho **team / company / power user**
