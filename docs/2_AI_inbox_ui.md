Có — và thay đổi **đáng kể nhưng theo hướng “an toàn hơn, đáng tin hơn, bán được hơn”**. Điểm mấu chốt là bạn chuyển từ **auto-save** sang **AI Inbox (suggestion-first)**. Dưới đây là các thay đổi UI/flow cụ thể (mình viết theo kiểu bạn có thể đưa thẳng cho UI/FE implement).

## 1) Flow tổng thể: trước vs sau

**Trước (auto-save)**: User bấm “Extract” → hệ thống tạo Todo thật ngay → user phải đi sửa/xoá nếu sai.
**Sau (AI Inbox)**: User bấm “Extract” → hệ thống tạo **Suggestions (pending)** → user **Review (Accept/Edit/Reject)** → Accept mới thành Todo thật.
Tác động: giảm “todo rác”, tăng trust, có feedback loop để AI ngày càng đúng.

## 2) UI thay đổi gì?

### 2.1 Thêm 1 khu vực mới: “AI Inbox”

Bạn cần thêm một entry rõ ràng trong UI (sidebar/tab) kiểu:

* **Inbox (AI)** / **AI Suggestions** / **Review**
* Badge số lượng pending (ví dụ “12”)

Trong Inbox, mỗi item hiển thị tối thiểu:

* Title, due date, priority, assignee, context (nếu có)
* Confidence (ẩn/hiện tuỳ bạn, thường để dạng “High / Medium / Low” thay vì %)
* Nút: **Accept**, **Edit**, **Reject**
* “Evidence” (Xem đoạn chat nguồn) → click mở panel highlight message gốc

### 2.2 Todo List hiện tại vẫn giữ, nhưng “nguồn tạo” rõ hơn

Trong Todo list (đã commit), nếu todo có nguồn AI:

* Tag nhỏ “AI” hoặc icon
* Link “View source” (mở chat/thread hoặc show snippet)

### 2.3 Thêm quick edit inline ở Inbox

Khi user bấm “Accept”, thường UX tốt là:

* Một mini form inline (due date, assignee, context, priority) để chỉnh nhanh rồi accept
* Nếu thiếu thông tin (quality flags), hiển thị câu hỏi gợi ý (follow-up question) dạng chip/button:

  * “Giao cho ai?” → dropdown assignee
  * “Deadline khi nào?” → date picker

### 2.4 Bulk actions (rất nên có)

Inbox thường sẽ có nhiều items, bạn nên có:

* Select nhiều → **Accept selected** / **Reject selected**
* Filter: Pending / Accepted / Rejected
* Search (title, assignee, tag)
* Sort: confidence, due date, created time

## 3) Các màn hình/điểm chạm UI bị ảnh hưởng

### 3.1 Nút “Extract” ở Google Chat integration

Bạn sẽ đổi CTA và messaging:

* Trước: “Extract & Save”
* Sau: “Extract to Inbox” hoặc “Generate suggestions”
  Và sau khi chạy xong:
* Show toast/redirect: “Đã tạo 7 gợi ý trong Inbox” + nút “Open Inbox”

### 3.2 Trạng thái progress

Nếu bạn đang dùng Celery + poll Redis:

* Vẫn giữ progress như cũ, nhưng kết quả cuối là “suggestions created” chứ không phải “todos saved”.

### 3.3 Quyền kiểm soát cho user (settings)

Nên thêm 1 setting (tùy chọn):

* “Auto-accept high confidence suggestions” (default OFF)
* Threshold (vd 0.85)
  Nếu bật, UI sẽ:
* Auto-commit một phần, phần còn lại vẫn vào Inbox.

## 4) Có thay đổi API contract/FE data flow không?

Có, nhưng theo hướng rõ ràng hơn:

* FE sẽ gọi endpoint extract → nhận `run + suggestions`
* FE sẽ render suggestions ở Inbox
* FE gọi accept/reject/edit → server cập nhật suggestion status + (accept) tạo todo thật
* FE sync Todo list sau khi accept

Tối ưu UX:

* Accept xong: remove item khỏi Pending list + tăng item trong Todo list ngay (optimistic update)

## 5) “Tối thiểu phải làm” vs “Nên làm thêm” (để bạn scope nhanh)

### Tối thiểu (để chạy được)

* Thêm AI Inbox view (list pending suggestions)
* Accept/Reject actions
* Link “View source/evidence” (có thể chỉ là snippet trước)

### Nên làm thêm (tạo cảm giác AI xịn)

* Inline edit khi accept
* Bulk accept/reject
* Follow-up questions UI (chip + quick input)
* Confidence hiển thị dạng mức (High/Med/Low)
* Settings: auto-accept high confidence

---

Nếu bạn muốn, mình có thể viết luôn **spec UI chi tiết** theo từng màn (Inbox list, detail side panel, extract completion modal) với components + states + empty/loading/error states để FE làm không bị thiếu.
