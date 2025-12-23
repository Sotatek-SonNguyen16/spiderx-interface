Dưới đây là **spec trang Pricing cho SpiderX** (AI capture tasks đa nền tảng), thiết kế theo chuẩn SaaS hiện đại: rõ “giá trị → gói → so sánh → tin tưởng → mua”, màu sắc/visual đồng bộ với landing bạn đang dùng (primary xanh + AI accent tím, neutral sạch, ít màu gắt).

* **1) Mục tiêu & nguyên tắc (để pricing “bán được”)**: pricing không phải nơi kể feature dàn trải; nó là nơi người dùng tự trả lời 3 câu: “gói nào hợp mình?”, “mình sẽ nhận được gì ngay?”, “có rủi ro gì khi trả tiền?”. Vì product bạn là AI + integrations, pricing phải xoay quanh **giá trị theo usage** (AI extraction quota, số integrations/workspace, lịch sử sync, team seats), tránh liệt kê kỹ thuật.
* **2) Header & định vị trang**: top nav giữ y như landing (logo trái, CTA phải). Trang pricing dùng title rõ: “Pricing that scales with your workflow” + sub: “Capture tasks from email & chat, then review in Queue.” (nhắc “Queue/Decision mode” là khác biệt). Thêm anchor tabs nhỏ (sticky khi scroll): `Plans` · `Compare` · `FAQ` · `Security`.
* **3) Hero pricing block (phải có toggle & trust)**: bên dưới title đặt **Billing toggle**: `Monthly / Yearly (Save 20%)` + microcopy “Cancel anytime”. Bên phải hero có thể đặt 1 hình nhỏ (không quá nặng): **mini product mock** (ảnh sidebar + queue) kèm 2 callout nhỏ “AI extracted tasks” + “Review in Queue”. Nền hero dùng neutral + gradient rất nhẹ (giống landing), tránh ảnh lớn làm phân tâm.
* **4) Plan cards (core section) – bố cục chuẩn**: dùng 3 cột là tối ưu (Free/Pro/Team) + 1 option Enterprise dạng “Contact sales” ở dưới; card layout thống nhất: `Plan name` → `Price` → `Best for` → `Key limits` → `Primary CTA` → `Top features (5–7)`; luôn có 1 gói nổi bật (Recommended) ở giữa (thường là Pro). Card cao bằng nhau, spacing theo 8pt, radius 16, shadow rất soft.
* **5) Đề xuất gói đúng với SpiderX (để user hiểu “mình trả tiền cho cái gì”)**:

  * **Free (Early access / Personal)**: $0 (hoặc “Free during early access”) – Best for: “Try capturing tasks from one account”; Limits gợi ý: 1 integration (Gmail hoặc Google Chat), 1 workspace, lịch sử 7 ngày, AI extraction quota thấp/tháng, Queue swipe cơ bản. CTA: “Start free”. Features: AI task detection (basic), Queue review, tags basic, manual sync, export basic.
  * **Pro (Recommended)**: $X / user / month – Best for: “Professionals managing multiple projects”; Limits: 2–3 integrations, lịch sử 90 ngày, AI quota cao hơn, sync tự động theo lịch, smart priority/duedate extraction, rules nhẹ. CTA: “Get Pro”. Features: Auto-sync, AI deadline & assignee, project/context grouping, advanced filters, duplicate prevention, priority support.
  * **Team (For teams)**: $Y / user / month – Best for: “Teams who need shared visibility”; Limits: nhiều integrations, shared spaces, roles/permissions, team check-ins, shared templates, admin. CTA: “Start Team trial” hoặc “Upgrade to Team”. Features: shared workspaces, admin controls, audit log (nếu có), team analytics, SLA support.
  * **Enterprise (optional)**: “SSO/SAML, SCIM, dedicated support, data retention, DPA” → CTA “Contact sales”.
    (Giá cụ thể bạn tự set; quan trọng là **value metric** phải đúng: integrations + history + AI quota + team controls.)
* **6) “What you get” strip (ngay dưới plan cards để tăng conversion)**: 1 hàng ngang 3–4 item với icon tối giản: “Works with Gmail & Google Chat” · “AI extracts deadlines & owners” · “Queue review to prevent noise” · “Cancel anytime”. Đây là đoạn giúp user chốt niềm tin trước khi kéo xuống.
* **7) Compare table (bắt buộc cho SaaS B2B)**: 1 bảng so sánh theo nhóm, không dài dằng dặc: nhóm 1 `Capture & Sync`, nhóm 2 `AI Extraction`, nhóm 3 `Organization`, nhóm 4 `Team & Admin`, nhóm 5 `Security`. Mỗi nhóm 4–6 dòng max. Dùng check icon + “limit label” (vd “Up to 1 integration”, “90-day history”). Tránh thông số kỹ thuật như “concurrency/spaces”; thay bằng ngôn ngữ user: “Workspaces/Projects”, “Conversation sources”, “History retention”.
* **8) Add-ons / Usage-based (rất hợp AI SaaS)**: nếu bạn muốn tối ưu doanh thu, thêm block “Add-ons” (card nhỏ): “Extra AI extraction credits”, “Additional integrations”, “Extended history retention”. Giúp bạn không phải nhồi quá nhiều tier và vẫn kiếm thêm từ power users.
* **9) FAQ (giảm rào cản mua)**: 6–8 câu là đủ, accordion style (gọn). Các câu nên đúng pain của bạn: “What counts as an AI extraction?”, “Will it create duplicate tasks?”, “Can I stop sync anytime?”, “Does SpiderX post to my accounts?”, “How does billing work per seat?”, “Can I switch plans later?”; câu trả lời ngắn 2–3 dòng, có link docs nếu cần.
* **10) Trust & Security (đúng với sản phẩm đọc email/chat)**: section nhỏ nhưng “nặng ký”: icon lock + “Permissions-based access”, “OAuth (coming soon)”, “We never send messages without your action”, “Data encrypted in transit/at rest” (chỉ ghi cái bạn làm thật). Nếu chưa có OAuth thì ghi “Google OAuth coming soon; currently email/password” nhưng tránh làm người trả tiền lo: có thể đặt ở FAQ thay vì highlight chính.
* **11) Final CTA (kết trang)**: headline: “Start capturing tasks in minutes” + 2 CTA: `Start free` (primary) và `See integrations` (secondary). Dưới CTA có microcopy: “No credit card for Free / Cancel anytime / Upgrade later.”
* **12) Màu sắc & style (đồng bộ landing + trend SaaS hiện đại)**: giữ base **neutral sạch** (white/gray rất nhạt), primary **blue** (giống nút “Start here”), accent **purple** cho AI (badge/callout), success xanh chỉ dùng nhẹ; tuyệt đối tránh quá nhiều màu như priority orange lấn át pricing (orange chỉ dùng cho highlight nhỏ hoặc “Save 20%”). Card “Recommended” dùng border primary + glow nhẹ, không cần nền màu đậm. Typography: H1 đậm, body thoáng, line-height 1.4–1.6; icon nét mảnh đồng bộ.
* **13) Interaction details (để “xịn”)**: toggle monthly/yearly animate 150–200ms easeOut; hover card nâng nhẹ + shadow; CTA loading state; anchor tabs scroll spy; trên mobile: plan cards thành stacked + “Recommended” pin lên đầu; compare table chuyển thành accordion theo nhóm.
* **14) Copy template sẵn để bạn triển khai nhanh**: Plan card mỗi gói nên có “Best for” 1 câu + “Includes” 5 bullet; ví dụ Pro bullets: “Auto-sync from Gmail/Chat” · “AI extracts due dates & owners” · “Queue swipe review” · “Project & context grouping” · “90-day history”.

Nếu bạn muốn, mình có thể chốt luôn **1 bản “Pricing content matrix” dạng bảng** (từng feature nằm ở gói nào + limit cụ thể + copy hiển thị trên UI) để bạn đưa dev triển khai không phải nghĩ thêm. Bạn đang định pricing theo **per user** hay **per workspace**? (mình sẽ tự chọn hướng tối ưu cho SpiderX nếu bạn chưa chắc: đa phần B2B nên per user, còn B2C/solo có thể theo workspace + quota).

* **Pricing model đề xuất (phù hợp SpiderX, dễ bán)**: dùng hybrid để vừa B2C vừa B2B: (1) **Pro/Team tính theo seat** (per user/month) vì “task + project” thường gắn người; (2) kèm **AI credits/quota** theo gói (giới hạn số lần AI “extract/create/update”); (3) Integrations & History retention là “value levers” để phân tầng; Free dùng để thử luồng “Sync → Queue → Accept” chứ không phải để làm việc thật.

* **Thông số “đo lường” nên dùng (người dùng hiểu, không kỹ thuật)**: AI credits/tháng; số integrations kết nối; số workspaces/projects; lịch sử sync (7/90/365 ngày); auto-sync frequency; team seats; admin/roles; export/webhook (nếu có). Tránh thuật ngữ như concurrency/spaces trong UI pricing.

* **Bảng Pricing Content Matrix (copy-ready để bạn triển khai UI)**:

  * **Free (Early Access)**: Price `$0`; Best for: “Try SpiderX on one account”; Limits: `1 integration` · `1 workspace` · `7-day history` · `AI credits: 200/mo` · `Manual sync only`; Includes: AI task detection (basic), Queue review (swipe/list), basic tags, duplicate safety (basic), email support (standard). CTA: `Start free`.
  * **Pro (Recommended)**: Price `$12/user/mo` (ví dụ) hoặc `$10` yearly; Best for: “Individuals managing multiple projects”; Limits: `Up to 3 integrations` · `3 workspaces` · `90-day history` · `AI credits: 2,000/mo` · `Auto-sync hourly`; Includes: AI extracts due date/assignee/priority, context grouping, advanced filters, smart suggestions, duplicate prevention (enhanced), export CSV, priority support. CTA: `Get Pro`. Badge: `Recommended`.
  * **Team**: Price `$20/user/mo`; Best for: “Teams that share context and workload”; Limits: `Up to 8 integrations` · `Unlimited workspaces` · `365-day history` · `AI credits: 8,000/mo` · `Auto-sync every 15 min`; Includes: shared spaces, roles/permissions, team queue review, assignments & mentions, team analytics (basic), audit log (basic), shared templates/rules, priority support. CTA: `Start Team`.
  * **Enterprise**: Price `Custom`; Best for: “Security & compliance requirements”; Limits: custom; Includes: SSO/SAML, SCIM, DPA, custom retention, dedicated support, SLA, on-prem options (nếu có), security review. CTA: `Contact sales`.

* **Compare table (nhóm feature + dòng copy hiển thị)**:

  * **Capture & Sync**: Manual sync (Free/Pro/Team) ✅; Auto-sync (Pro hourly / Team 15m / Enterprise custom); Time-range sync (Pro+); Multi-account connectors (Team+).
  * **AI Extraction**: AI detect tasks (all); Extract due date & assignee (Pro+); Priority scoring (Pro+); Bulk generate subtasks (Team+); AI credits limit hiển thị dạng “200 / 2,000 / 8,000 / Custom”.
  * **Organization**: Queue swipe review (all); Project/context grouping (Pro+); Advanced filters & saved views (Pro+); Dedup enhanced (Pro+); Export (Pro+).
  * **Team & Admin**: Shared workspaces (Team+); Roles/permissions (Team+); Audit log (Team+); Admin dashboard (Team+).
  * **Security**: Standard encryption (all); OAuth connectors (Pro+ khi bạn ra mắt); SSO/SAML (Enterprise).

* **UI bố cục trang Pricing (section-by-section, triển khai được ngay)**:

  * **Hero**: H1 “Pricing that scales with your workflow”; Sub “Capture tasks from email & chat, review in Queue, keep projects in sync.”; Toggle `Monthly / Yearly (Save 20%)`; Microcopy “Cancel anytime”.
  * **Plan cards (3 cột + enterprise strip)**: card Pro nổi bật (border primary + glow nhẹ). Mỗi card có 5–7 bullet (đúng những thứ user trả tiền). CTA solid primary cho Pro, secondary cho Free/Team (tuỳ chiến lược).
  * **Value strip**: 4 icon bullets “Works with Gmail & Google Chat” · “AI extracts deadlines & owners” · “Queue prevents noise” · “Upgrade anytime”.
  * **Compare**: bảng theo nhóm (không dài), có sticky header “Free / Pro / Team”.
  * **Add-ons**: 3 mini cards “Extra AI credits”, “Extra integrations”, “Extended history”.
  * **FAQ**: 6–8 câu (AI credits là gì, trùng task, cancel, billing, privacy).
  * **Trust**: “We never send messages without your action” + “Permissions-based access” (chỉ ghi cái thật).
  * **Final CTA**: “Start free, upgrade when it fits” + CTA.

* **Màu sắc & style (đúng landing bạn, đúng trend SaaS)**: nền neutral sáng; primary xanh cho CTA; accent tím cho AI badges; “Save 20%” dùng orange nhẹ (không dùng đỏ); card radius 16, shadow soft; typography lớn, thoáng; không nhồi màu priority trong pricing (priority màu chỉ xuất hiện trong app).

* **Microcopy chuẩn để tăng conversion (dán vào UI luôn)**: “Cancel anytime” / “No credit card on Free” / “Upgrade in one click” / “AI credits reset monthly” / “Already created tasks are kept” (liên kết với trust của hệ thống).

* **Logic hiển thị quota (rất quan trọng)**: trong card hiển thị 1 dòng “AI credits: X/mo” + tooltip “1 credit = 1 task extracted/updated”; trong FAQ giải thích rõ để tránh hiểu nhầm.

Nếu bạn muốn mình “đóng gói” thêm cho dev: mình sẽ viết luôn **JSON cấu hình pricing** (plans, features, limits, copy) để bạn render UI dễ dàng và sau này đổi giá không phải sửa code nhiều. hiển thị giá theo **USD**
