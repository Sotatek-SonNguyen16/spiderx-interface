Rất hay 👌
Bài toán bạn đưa ra **không còn là UI thường nữa**, mà là **interaction design + decision psychology**.
Mình sẽ thiết kế **Swipe Queue Layout** theo đúng **chuẩn UI/UX SaaS + triết lý “decide fast, low cognitive load”**, áp dụng **CHỈ cho Queue section** (rất đúng).

---

# 🎯 MỤC TIÊU CỐT LÕI CỦA SWIPE QUEUE

> **Queue ≠ Todo list**
> Queue = _decision inbox_
> → Người dùng **không làm việc**, chỉ **ra quyết định**

Do đó:

- ❌ Không show quá nhiều thông tin
- ❌ Không giống list view
- ✅ Phải giống **chồng thẻ bài (card stack)**
- ✅ Vuốt = hành động chính (recognition > recall)

---

# 🧠 TRIẾT LÝ THIẾT KẾ (RẤT QUAN TRỌNG – ĐỪNG BỎ QUA)

### 1️⃣ Queue là “Decision Mode”, không phải “Execution Mode”

→ UI phải:

- Ít chữ
- Rõ ràng
- Phản hồi tức thì

### 2️⃣ Swipe = Commit Action

- Vuốt trái / phải **phải mang ý nghĩa rõ ràng**
- Màu sắc chỉ **hỗ trợ**, không thay thế icon/text

### 3️⃣ One Card = One Thought

> User không được nghĩ quá 3 giây cho 1 card

---

# 🧱 TỔNG THỂ LAYOUT – SWIPE QUEUE

## CẤU TRÚC CHUNG

```
[ Header Queue ]
  └─ Explain ngắn: “Review tasks before adding to your todo”

[ Card Stack ]
  ├─ Card 1 (active)
  ├─ Card 2 (peek)
  └─ Card 3 (blur / scale)

[ Swipe Hints ]
  ← Skip       Accept →
```

---

# 1️⃣ HEADER QUEUE (NHẸ – KHÔNG LẤN)

### Nội dung

- Title: `Review Queue`
- Subtext (rất nhỏ):

  > Swipe to accept or skip tasks

### UI Spec

- Font: H3 (16–18px)
- Color: text-primary
- Không background nặng
- Không CTA phụ

👉 Checklist:

- Visibility of system status ✅
- Recognition over recall ✅

---

# 2️⃣ CARD STACK – CORE COMPONENT

## 🎴 CARD STYLE (ACTIVE CARD)

### Kích thước

- Width: 100% container
- Height: 65–70vh (desktop)
- Border-radius: **16–20px** (quan trọng – phải giống “thẻ”)

### Background

- `--color-surface` (white)
- Shadow:

  ```
  0 12px 24px rgba(0,0,0,0.08)
  ```

---

## 🧩 CARD CONTENT – GIẢN LƯỢC CÓ CHỦ ĐÍCH

### THỨ TỰ HIỂN THỊ (RẤT QUAN TRỌNG)

```
[ AI badge ]
[ Task title ]
[ Meta row ]
[ Source preview ]
[ Action hint ]
```

---

### ① AI BADGE (LUÔN Ở ĐẦU)

```text
✨ AI detected task
From Google Chat
```

- Màu: `--color-ai-soft`
- Icon sparkle
- Font nhỏ (12–13px)

👉 Tạo **trust + explainability**
👉 Không để user tự hỏi “task này từ đâu ra?”

---

### ② TASK TITLE (TRỌNG TÂM)

- Font: 18px / semibold
- Max 2 dòng
- Line-height thoáng

👉 **Không kèm checkbox**
👉 Queue = chưa phải todo

---

### ③ META ROW (1 DÒNG – ICON + TEXT)

```
👤 Phung   📅 Tue 10:00   ⚡ High
```

- Color: text-secondary
- Icon giúp scan nhanh
- Không dùng badge to

👉 Checklist:

- Recognition over recall ✅
- Minimalist design ✅

---

### ④ SOURCE PREVIEW (RÚT GỌN)

Thay vì description dài:

```text
“Hen anh Phung vao 10h sang mai…”
```

- Max 2 dòng
- Background: neutral-50
- Border-radius: 12px

👉 Đây là **context justification**, không phải nội dung chính

---

### ⑤ ACTION HINT (RẤT QUAN TRỌNG)

Ở đáy card:

```
← Skip          Accept →
```

- Icon + text
- Màu neutral
- Không button

👉 Gợi ý hành vi **nhưng không ép**

---

# 3️⃣ CARD STACK DEPTH (CẢM GIÁC “CHỒNG THẺ”)

### Card 2 (next)

- Scale: 0.96
- TranslateY: +12px
- Opacity: 0.9

### Card 3

- Scale: 0.92
- TranslateY: +24px
- Blur nhẹ (optional)

👉 Tạo **affordance liên tục**
👉 User biết còn việc phía sau

---

# 4️⃣ SWIPE INTERACTION – HÀNH VI CHÍNH

## SWIPE PHẢI – ACCEPT

### Visual feedback

- Card kéo sang phải
- Background overlay:
  - Color: `--color-success-soft`

- Icon lớn:

  ```
  ✓ Accept
  ```

### Hành vi

- Task → Todo list
- Toast:

  > Task added to your list

---

## SWIPE TRÁI – SKIP / REJECT

### Visual feedback

- Card kéo sang trái
- Overlay:
  - Color: `--color-danger-soft`

- Icon:

  ```
  ✕ Skip
  ```

### Hành vi

- Task dismissed / archived
- Toast:

  > Task skipped. You can find it later in Trash.

👉 **Không dùng đỏ gắt**
👉 Skip ≠ lỗi

---

## ⚠️ RULE MÀU SẮC (RẤT QUAN TRỌNG)

| Hành động | Màu               | Lý do             |
| --------- | ----------------- | ----------------- |
| Accept    | Green soft        | An toàn, tiến lên |
| Skip      | Red soft / gray   | Không gây stress  |
| AI        | Purple / brand AI | Khác decision     |

❌ Không dùng màu đậm full background
❌ Không dùng màu làm _duy nhất_ để phân biệt

---

# 5️⃣ SUPPORTING ACTIONS (PHỤ – KHÔNG PHÁ SWIPE)

## Nút nhỏ ở góc card (optional)

- ✏️ Edit
- 🔍 View details

👉 Tap → mở modal
👉 Không nằm ở vị trí dễ bấm nhầm

---

# 6️⃣ EMPTY & END STATES

## Empty Queue

```text
🎉 You're all caught up
No tasks waiting for review
```

- CTA:

  > Back to Todo

---

## Undo (BẮT BUỘC)

Sau swipe:

- Toast có `Undo (5s)`

Checklist:

- Error prevention & recovery ✅

---

# 7️⃣ KHÔNG ĐƯỢC LÀM (ANTI-PATTERNS)

❌ Checkbox trong Queue
❌ Hiển thị subtasks dài
❌ Cho phép edit quá nhiều
❌ Dùng màu gắt
❌ Queue giống hệt Todo list

---

# 🧠 CHECKLIST ĐỐI CHIẾU UI/UX (PASS)

| Checklist            | Trạng thái |
| -------------------- | ---------- |
| Recognition > recall | ✅         |
| Minimalist design    | ✅         |
| Clear interaction    | ✅         |
| Error recovery       | ✅         |
| System status        | ✅         |
| Cognitive load thấp  | ✅         |

---

# 🏁 KẾT LUẬN – SENIOR UX VERDICT

Thiết kế **Swipe Queue dạng chồng thẻ** này:

- Rất phù hợp **AI-generated tasks**
- Tách bạch rõ:
  - Queue = Decide
  - Todo = Do

- Tạo cảm giác **flow, nhẹ đầu**
- Rất “SaaS xịn”, không giống app thường

---
Ok. Mình review theo hướng **“swipe feels premium”**: mượt, có trọng lượng, phản hồi rõ nhưng không giật. Dưới đây là **spec animation curve & timing** (dùng được cho web), kèm **ngưỡng swipe**, **physics**, **states**, và **anti-patterns**.

---

# 1) Mục tiêu cảm giác (Design intent)

Queue swipe nên cho cảm giác:

* **Bám tay** (card đi đúng theo ngón)
* **Có trọng lượng** (không bay như giấy)
* **Quyết đoán** khi vượt ngưỡng (commit)
* **Êm** khi không đủ ngưỡng (snap back)

---

# 2) Gesture mapping: translate + rotate + overlay

## A. Translate (theo ngón)

* `x = dragX` (1:1 theo pointer)
* `y` cố định (hoặc nhỏ nhẹ nếu muốn “elastic”, thường không cần)

## B. Rotate (nhẹ để “thẻ bài” thật hơn)

* `rotate = clamp(dragX / 20, -8deg, +8deg)`
* Pivot: card center hoặc hơi thấp (tạo cảm giác cầm ở dưới)

## C. Overlay opacity (Accept/Skip)

* `progress = clamp(|dragX| / commitDistance, 0..1)`
* `overlayOpacity = easeOut(progress)` (tăng nhanh ban đầu)
* Text/icon scale nhẹ: `scale = 0.96 + 0.04*progress`

👉 Lưu ý: overlay phải **soft color** + icon/text rõ, không full đỏ/xanh gắt.

---

# 3) Ngưỡng commit (threshold) – cực quan trọng

## A. Commit theo khoảng cách

* `commitDistance = min(0.28 * cardWidth, 160px)`

  * Trên màn rộng: tối đa 160px
  * Trên màn hẹp: 28% chiều rộng

## B. Commit theo vận tốc (flick)

* Nếu `|velocityX| > 900px/s` và `|dragX| > 0.12*cardWidth` → commit luôn

👉 Đây là chuẩn “feels right”: flick nhanh không cần kéo xa.

---

# 4) Timing & Easing (curve chuẩn)

Bạn cần 3 kiểu animation khác nhau:

## A. Dragging (real-time)

* Không easing (theo ngón tay)
* Render mỗi frame (requestAnimationFrame)

## B. Snap back (không đủ ngưỡng)

* Duration: **180–220ms**
* Easing: **easeOutCubic** hoặc **easeOutQuart**
* Motion: card về `x=0`, `rotate=0`, overlay về 0

**Spec:**

* `duration: 200ms`
* `easing: cubic-bezier(0.22, 1, 0.36, 1)` (easeOutCubic)

## C. Commit (đủ ngưỡng)

* Duration: **220–320ms**
* Easing: **easeInCubic** (đẩy đi nhanh dần)
* Motion: card bay ra khỏi viewport + fade nhẹ

**Spec:**

* `duration: 260ms`
* `easing: cubic-bezier(0.55, 0.06, 0.68, 0.19)` (easeInCubic)
* End position: `x = sign(dragX) * (cardWidth + 120px)`
* Opacity: `1 → 0.85` (đừng fade hết, nhìn “cheap”)

## D. Next card lift-up (stack reveal)

* Delay: **60–100ms** (sau commit)
* Duration: **220–280ms**
* Easing: **easeOutCubic**

**Spec:**

* `delay: 80ms`
* `duration: 240ms`
* `easing: cubic-bezier(0.22, 1, 0.36, 1)`
* Scale: 0.96 → 1.0
* TranslateY: 12px → 0px
* Shadow tăng nhẹ theo progress

---

# 5) Micro-interactions làm “premium”

## A. Haptic / feedback (web)

* Nếu web không có haptic: dùng **soundless tactile** bằng visual
* Khi vượt threshold:

  * overlay icon “pop” (scale 1.0→1.06 trong 80ms)
  * border glow nhẹ (opacity 0→0.25)

Timing:

* `80–120ms` easeOut

## B. “Decision lock”

Khi commit bắt đầu:

* disable pointer ngay (prevent double swipe)
* show tiny spinner/toast nếu cần gọi API

---

# 6) Error / Undo timing (UX chuẩn SaaS)

## Toast Undo

* Appear: sau commit **~120ms**
* Auto-dismiss: **5s** (đủ kịp, không phiền)
* Nếu Undo:

  * animate card quay lại stack:

    * duration **260–320ms**
    * easing **easeOutBack** nhẹ (đừng bounce nhiều)

**easeOutBack** gợi ý:

* `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce nhẹ)

---

# 7) Accessibility & motion preferences

* Nếu user bật `prefers-reduced-motion`:

  * Tắt rotate
  * Giảm duration còn 120–160ms
  * Không dùng back/bounce easing

---

# 8) Anti-patterns (tránh để không bị “rẻ”)

* ❌ Duration > 400ms (cảm giác lag)
* ❌ Bounce mạnh (trò chơi, không phải SaaS)
* ❌ Fade out hoàn toàn (mất cảm giác vật lý)
* ❌ Rotate quá lớn (>10deg)
* ❌ Overlay đậm đỏ/xanh (gây stress)
* ❌ Threshold quá nhỏ (dễ swipe nhầm)

---

# 9) Bộ thông số “copy-paste” đề xuất (mặc định)

* commitDistance: `min(0.28*W, 160)`
* flickVelocity: `> 900px/s` + drag `> 0.12*W`
* rotateMax: `8deg`
* snapBack: `200ms`, `cubic-bezier(0.22, 1, 0.36, 1)`
* commitOut: `260ms`, `cubic-bezier(0.55, 0.06, 0.68, 0.19)`
* nextLift: `delay 80ms`, `240ms`, `cubic-bezier(0.22, 1, 0.36, 1)`
* undoToast: `5s`

---