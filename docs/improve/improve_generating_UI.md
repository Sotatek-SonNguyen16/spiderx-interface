Dựa trên ảnh mới, UI tiến trình **đã “đúng hướng” hơn** (có step, có %), nhưng vẫn **chưa đạt chuẩn SaaS** vì: **panel quá “chiếm chỗ”, khó đọc, và làm loạn layout khi user vẫn muốn làm việc khác**.

Mình audit + đề xuất **flow + UI mới** để: **không vỡ UI, luôn dễ nhìn, modeless (không chặn thao tác), trực quan** — bám đúng các tiêu chí *visibility / minimalist / progressive disclosure / user control*.

---

## 1) Vấn đề UI hiện tại (theo ảnh)

### A. Panel progress đang “đè” nội dung và vỡ nhịp đọc

* Panel bên phải **quá hẹp** → text bị xuống dòng liên tục (“This / may / take / a / few / minutes”) → *đọc cực mệt*.
* Panel cao, chiếm thị giác hơn cả list todo → user bị kéo attention sai chỗ.

> Nguyên tắc: indicator nên **ở vị trí nhất quán, mô tả ngắn gọn, không phá layout**. ([Apple Developer][1])

### B. Mật độ thông tin chưa đúng tầng ưu tiên

Bạn đang hiển thị cùng lúc:

* trạng thái + % + lời nhắc + step + nút stop + disclaimer
  => “nhiều nhưng không rõ cái gì là chính”.

> NN/g nhấn mạnh: thông tin không cần thiết sẽ “giành spotlight” làm giảm khả năng nhìn thấy điều quan trọng. ([media.nngroup.com][2])

### C. Close “X” màu đỏ gây cảm giác lỗi/khẩn cấp

* Đỏ thường được hiểu là error/destructive. Với sync đang chạy, “X” đỏ tạo anxiety (nhất là khi user sợ bấm nhầm).

### D. Progress component dùng trong vùng quá nhỏ

* Linear progress cần không gian đủ rộng để dễ đọc/nhìn (Material cũng khuyến nghị tránh dùng trong vùng quá nhỏ). ([Material Design][3])

---

## 2) Flow đúng cho “AI generating todos” (modeless, không vỡ UI)

### Flow đề xuất (chuẩn SaaS)

1. User bấm **Sync**
2. UI chuyển sang **Syncing state** ngay tại vị trí nút (tiny, không chiếm chỗ)
3. Hiển thị **Progress chip/banner nhỏ** (modeless) → user vẫn thao tác được
4. Nếu user muốn xem chi tiết → mở **right drawer** (không quá hẹp, có thể collapse)
5. Xong → toast ngắn + CTA “Review in Queue” (vì Queue là decision mode)

> Toast nên dùng cho thông báo ngắn, không làm gián đoạn; nếu cần thông tin “persist”, dùng banner/drawer. ([Mobbin][4])

---

## 3) UI Spec mới (để không vỡ và user làm việc khác được)

### (A) Sync button state (trên toolbar)

**Thay vì tạo panel lớn ngay lập tức**, hãy làm:

* Nút `Sync` → `Syncing… 10%` (kèm spinner nhỏ)
* Click vào nút hoặc chip → mở drawer chi tiết

**Copy đề xuất**

* `Syncing… (10%)`
* tooltip: `Scanning Google Chat & Gmail`

> Apple HIG: tránh text mơ hồ kiểu “Loading…”, hãy mô tả đúng việc đang làm. ([Apple Developer][1])

---

### (B) Progress chip (modeless, không che list)

Một “pill” nhỏ cố định góc phải dưới hoặc ngay dưới toolbar:

**Chip nội dung (1 dòng)**

* `Syncing · Step 1/4 · 10%`  [View]

**Behavior**

* Chip luôn nhỏ gọn
* `View` mở drawer
* `×` chỉ là **Dismiss chip** (không dừng sync)

> Giữ trạng thái ở vị trí nhất quán + không làm rối UI là chìa khóa cho “visibility of system status”. ([The Decision Lab][5])

---

### (C) Right drawer “Sync details” (chỉ mở khi user cần)

**Quan trọng:** Drawer **không được hẹp** như ảnh hiện tại.

* Width: **360–420px** (desktop)
* Có nút `Collapse` → thu lại thành chip
* Nội dung chia tầng rõ ràng:

**Tầng 1 (primary)**

* Title: `Syncing messages…`
* Sub: `Google Chat & Gmail`
* Progress bar + `%`

**Tầng 2 (secondary)**

* `Step 1 of 4: Scanning messages`
* ETA “soft”: `May take a few minutes` (1 dòng, không wrap từng từ)

**Tầng 3 (details, collapsible)**

* `Messages scanned: 1,245`
* `Tasks created: 14`
* `Spaces processed: 1/10`

> Progressive disclosure giúp giảm cognitive load: mặc định chỉ hiển thị thứ user cần. ([media.nngroup.com][2])

---

### (D) Stop sync (destructive rõ ràng, nhưng “calm”)

Trong drawer:

* Button: `Stop sync` (neutral outline, **không đỏ**)
* Subtext nhỏ:

  * `Created tasks will be kept. Review or delete later.`

Khi click `Stop sync` → confirm mini dialog:

* Title: `Stop syncing?`
* Body: `Tasks already created will remain in Queue.`
* Actions: `Continue syncing` (primary), `Stop` (secondary)

---

### (E) Completion feedback (chốt chuyển đổi sang Queue)

Khi xong:

* Toast: `Sync complete · 18 tasks added to Queue`
* CTA: `Review now` → chuyển tab sang **Queue + Swipe mode** (decision flow)

> Toast phù hợp cho thông báo hoàn tất nhanh; nếu cần xem chi tiết thì link sang view phù hợp. ([Mobbin][4])

---

## 4) Màu sắc & style (để “chuẩn triết lý SaaS”)

* Progress: dùng **brand primary** + nền neutral (đừng dùng đỏ/xanh mạnh)
* “X” màu đỏ chỉ dùng khi **error/destructive**
* Text trong drawer: tối đa 2 cấp (primary / secondary), tránh nhiều sắc độ
* Không để câu dài trong cột hẹp (fix bằng width + line clamp)

---

## 5) Những chỉnh sửa “nhỏ nhưng rất đáng làm” cho UI hiện tại

1. **Tăng width panel** hoặc chuyển panel thành drawer đúng chuẩn (360px+)
2. `This may take a few minutes` → render 1–2 dòng, không bị wrap từng từ
3. `X` đỏ → đổi thành `Dismiss` (neutral) hoặc `Collapse`
4. `Stop sync` tách khỏi close/dismiss để tránh bấm nhầm
5. Details (spaces, số message…) chuyển vào `Details ▼`

---

### Kết luận

UI progress của bạn **đã có tiến bộ**, nhưng để “đúng chuẩn SaaS” và không vỡ trải nghiệm đa nhiệm, hãy chuyển sang mô hình:

✅ **Chip nhỏ (always visible) + Drawer chi tiết (on-demand)**
→ vừa đảm bảo *Visibility of system status*, vừa giữ UI “calm”, user vẫn làm việc khác thoải mái. ([Apple Developer][1])

Nếu bạn muốn, mình có thể viết luôn **spec states đầy đủ** (Idle / Syncing / Partial / Error / Stopped / Completed) kèm microcopy cho từng state để dev implement thống nhất toàn hệ thống async.

[1]: https://developer.apple.com/design/human-interface-guidelines/progress-indicators?utm_source=chatgpt.com "Progress indicators | Apple Developer Documentation"
[2]: https://media.nngroup.com/media/articles/attachments/Heuristic_Evaluation_Workbook_-_Nielsen_Norman_Group.pdf?utm_source=chatgpt.com "Nielsen Norman Group Heuristic Evaluation Workbook"
[3]: https://m3.material.io/components/progress-indicators/guidelines?utm_source=chatgpt.com "Progress indicators – Material Design 3"
[4]: https://mobbin.com/glossary/toast?utm_source=chatgpt.com "Toast UI Design: Best practices, Design variants & Examples - Mobbin"
[5]: https://thedecisionlab.com/reference-guide/design/nielsens-heuristics?utm_source=chatgpt.com "Nielsen's Heuristics - The Decision Lab"
