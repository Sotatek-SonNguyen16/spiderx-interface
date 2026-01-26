Ok — mình sẽ “đóng gói” style *Editorial Minimalism / Quiet Luxury (museum-core)* thành **design tokens + rules + component spec** để bạn triển khai ngay cho SpiderX, đồng thời tách rõ **Marketing vs App** (để không bị đẹp nhưng khó dùng).

## 0) Brand direction cho SpiderX theo style bạn chọn

* **Brand personality**: Calm, curated, premium, trustworthy, “assistant có gu” (không techy neon).
* **Core narrative**: “SpiderX giúp bạn gom task từ email/chat một cách tinh tế, giảm nhiễu, đưa về Queue để quyết định, rồi mới thực thi.”
* **Key principle**: Marketing có thể “editorial”, nhưng App phải “functional calm” (đủ tương phản, scan nhanh, không mờ).

---

## 1) Color system v1 (2 lớp: Marketing + App)

Bạn sẽ dùng **semantic tokens** (không hardcode màu vào component). Dưới đây là palette kiểu “ivory + sage/olive + ink” giống style bạn đưa.

### 1.1. Core neutrals (dùng chung)

* `bg` (page background): **Ivory** `#F7F3EA`
* `surface` (card): **Warm White** `#FFFDFA`
* `surface-2` (subtle panel): `#F2EEE6`
* `text` (primary): **Ink** `#14171F`
* `text-2` (secondary): `#4B5563`
* `text-3` (muted): `#7B8794`
* `border` (hairline): `#E7E1D7`

### 1.2. Brand primaries (Quiet Luxury)

* `primary` (CTA, link strong): **Forest Ink** `#1F3A2E`
* `primary-hover`: `#173025`
* `primary-pressed`: `#102219`
* `primary-soft` (hover bg, tag): `#E3EFE8`

### 1.3. Accent palette (rất tiết chế)

* `accent-sage` (background highlight): `#9BAF9C` (chỉ dùng 5–15% opacity)
* `accent-olive` (icon/label nhẹ): `#667A4A`
* `accent-gold` (pricing “save”, tiny highlight): `#B58B2A` (không dùng như primary)

### 1.4. AI accent (giữ “AI moment” nhưng vẫn hợp museum-core)

* `ai` (badge/icon AI): **Lavender Ink** `#6D5BD0`
* `ai-soft` (bg badge): `#EEEAFE`

### 1.5. Status colors (App ưu tiên rõ ràng)

* `success`: `#1E7A4C` | `success-soft`: `#E7F4ED`
* `warning`: `#B45309` | `warning-soft`: `#FEF3C7`
* `danger`: `#B42318` | `danger-soft`: `#FEE4E2`

**Rule màu quan trọng**: nền ivory + border hairline + primary forest = “premium calm”. AI chỉ nổi khi cần (badge/callout/progress), không rải khắp UI.

---

## 2) Typography system (Serif editorial + Sans functional)

### 2.1. Font pairing đề xuất (dễ triển khai web)

* **Headings (Serif editorial)**: `Fraunces` (đẹp, hiện đại, “museum”) hoặc `Cormorant Garamond` (cổ hơn)
* **Body/UI (Sans)**: `Inter` hoặc `DM Sans` (mượt, dễ đọc)

### 2.2. Type scale (marketing vs app)

* **Marketing H1**: 56–72px, serif, weight 600–700, line-height 1.05–1.1
* **Marketing H2**: 36–44px, serif 600
* **App title**: 20–24px, sans 600
* **Body**: 15–16px, sans 400–500, line-height 1.5–1.6
* **Meta**: 12–13px, sans 500, text-3

**Rule**: Serif chỉ dùng cho marketing headings + page titles lớn; trong app, nếu muốn “đúng brand” thì dùng serif cực hạn chế (ví dụ page heading), còn lại dùng sans để scan nhanh.

---

## 3) Layout, spacing, radius, borders, shadows (đúng style bạn gửi)

### 3.1. Grid

* Container: 1120–1200px
* Grid: 12 columns, gutter 24px
* White space lớn (đây là “quiet luxury” key)

### 3.2. Spacing scale (8pt)

* 4, 8, 12, 16, 24, 32, 40, 56, 72

### 3.3. Radius

* `sm`: 10
* `md`: 14
* `lg`: 18
* `xl`: 24 (hero cards/marketing)

### 3.4. Border & shadow

* Border hairline: 1px `border` (luôn có, shadow rất ít)
* Shadow: chỉ dùng “soft lift”, tránh shadow đậm kiểu material

  * `shadow-1`: 0 8px 20px rgba(20, 23, 31, 0.06)
  * `shadow-2`: 0 12px 28px rgba(20, 23, 31, 0.08)

**Rule**: Card = border + shadow rất nhẹ (shadow chỉ để tách lớp, không để “bay”).

---

## 4) Component rules (copy/paste spec cho dev)

### 4.1. Buttons

* **Primary**: bg `primary`, text trắng, radius md, padding 12×16, hover darken, focus ring `primary-soft`
* **Secondary**: bg `surface`, border `border`, text `primary`, hover bg `surface-2`
* **Tertiary/link**: text `primary`, underline chỉ khi hover (editorial vibe)

### 4.2. Cards

* Background `surface`, border `border`, radius lg, padding 20–24
* Header typography mạnh, meta nhỏ và muted
* Không dùng background màu đậm; nếu cần highlight thì dùng `primary-soft` hoặc `ai-soft` rất nhẹ

### 4.3. Badges / Chips

* Default badge: bg `surface-2`, text `text-2`, border hairline
* AI badge: bg `ai-soft`, text `ai`, icon sparkle
* Priority (trong app): tránh cam quá gắt; dùng warning-soft + icon, kèm text (không chỉ màu)

### 4.4. Forms

* Input bg `surface`, border `border`, focus border `primary` + ring `primary-soft`
* Placeholder `text-3`
* Error: border `danger`, helper `danger` + icon

### 4.5. Progress / Sync / AI generating (theo style “calm”)

* Indicator mặc định: **chip nhỏ** (không panel hẹp)
* Drawer chi tiết: `surface`, border hairline, progress bar màu `ai` hoặc `primary` (tuỳ là AI step hay sync step)
* Copy phải “human”, tránh log kỹ thuật.

---

## 5) Visual language (ảnh/illustrations/pattern) đúng “museum-core”

* Background: paper/linen texture rất nhẹ (2–4% opacity), hoặc watermark chữ lớn (siêu nhạt)
* Illustrations: line-art mảnh, organic shapes, diagram “message → AI → queue → todo” (curated, ít màu)
* Photos: nếu có thì tone ấm, saturation thấp; tránh stock “sci-fi portal” vì lệch style bạn chọn

---

## 6) Motion (quiet luxury = tinh tế)

* Hover: 150–200ms easeOut, lift 2–4px max
* Page reveal: fade + translate 12px, 220–280ms
* Drawer open/close: 220ms easeOut
* Avoid: bounce mạnh, neon glow, shimmer quá lộ

---

## 7) Áp dụng vào SpiderX (mapping theo màn)

* **Landing hero**: H1 serif rất lớn + sub sans; CTA primary forest; callout AI dùng lavender-soft; background ivory + paper texture nhẹ; screenshots đặt trong frame trắng có border hairline (như bạn đang làm nhưng đổi tone).
* **App (Todo/Queue)**: nền sáng nhưng tương phản đủ; list card border hairline; AI tags lavender; states/progress dùng chip + drawer; priority dùng soft status.
* **Pricing**: cards trắng, “Recommended” chỉ cần border primary + badge “Recommended” (gold-soft), không cần gradient flashy.
* **Login**: bỏ ảnh “portal” kiểu sci-fi; thay bằng illustration/pattern museum-core; form card sạch.

---

## 8) Token set dạng CSS variables (để triển khai nhanh)

```css
:root{
  --bg:#F7F3EA; --surface:#FFFDFA; --surface2:#F2EEE6;
  --text:#14171F; --text2:#4B5563; --text3:#7B8794;
  --border:#E7E1D7;

  --primary:#1F3A2E; --primaryHover:#173025; --primaryPressed:#102219;
  --primarySoft:#E3EFE8;

  --ai:#6D5BD0; --aiSoft:#EEEAFE;

  --success:#1E7A4C; --successSoft:#E7F4ED;
  --warning:#B45309; --warningSoft:#FEF3C7;
  --danger:#B42318; --dangerSoft:#FEE4E2;

  --shadow1:0 8px 20px rgba(20,23,31,.06);
  --shadow2:0 12px 28px rgba(20,23,31,.08);
  --rSm:10px; --rMd:14px; --rLg:18px; --rXl:24px;
}
```

---

## 9) Hai cảnh báo để style này không “đẹp nhưng khó dùng”

* Đừng làm contrast quá thấp (ivory + gray nhạt) trong app list—task management cần scan nhanh; giữ `text` đủ đậm và border rõ.
* Đừng dùng serif trong các vùng dày dữ liệu (list/meta/tables). Serif là “brand spice”, không phải “daily UI base”.

---

Ok, chốt **Hướng B = Forest primary (quiet luxury)**. Dưới đây là bản “ready-to-implement” theo kiểu bạn có thể đưa thẳng cho dev: token map + Tailwind theme + component variants + rules áp dụng cho SpiderX (landing/app/pricing).

* **1) Brand decision (Hướng B)**: Primary = **Forest Ink** (CTA, links mạnh, focus states), AI accent = **Lavender Ink** (chỉ xuất hiện ở “AI moments”), nền = **Ivory paper** (calm), border hairline (editorial). Mục tiêu: nhìn là thấy “curated + premium + trustworthy”, nhưng app vẫn scan nhanh.

* **2) Tailwind tokens (theme extend)**:

```js
// tailwind.config.js (extend)
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: "#F7F3EA",
        surface: "#FFFDFA",
        surface2: "#F2EEE6",
        border: "#E7E1D7",
        ink: "#14171F",
        ink2: "#4B5563",
        ink3: "#7B8794",

        primary: { DEFAULT:"#1F3A2E", hover:"#173025", pressed:"#102219", soft:"#E3EFE8" },
        ai: { DEFAULT:"#6D5BD0", soft:"#EEEAFE" },

        success:{ DEFAULT:"#1E7A4C", soft:"#E7F4ED" },
        warning:{ DEFAULT:"#B45309", soft:"#FEF3C7" },
        danger:{ DEFAULT:"#B42318", soft:"#FEE4E2" },

        gold:{ soft:"#F4E7C7", DEFAULT:"#B58B2A" },
      },
      borderRadius: { sm:"10px", md:"14px", lg:"18px", xl:"24px" },
      boxShadow: {
        s1:"0 8px 20px rgba(20,23,31,.06)",
        s2:"0 12px 28px rgba(20,23,31,.08)",
      },
      fontFamily: {
        heading: ["Fraunces","ui-serif","Georgia","serif"],
        body: ["Inter","ui-sans-serif","system-ui","sans-serif"],
      },
    },
  },
};
```

* **3) Typography rules (để không bị “đẹp mà khó dùng”)**: Landing/Pricing/Login dùng `font-heading` cho H1/H2; toàn bộ app list/table/meta dùng `font-body`. App page title có thể dùng heading (1 dòng) nhưng không dùng serif trong task list hoặc form labels.

* **4) Component variants (spec ngắn gọn, dev làm nhanh)**:

  * **Button**: Primary = bg `primary`, text `surface`, hover `primary-hover`, pressed `primary-pressed`, focus ring `primary-soft`; Secondary = bg `surface`, border `border`, text `primary`, hover bg `surface2`; Danger chỉ dùng khi destructive thật (delete), còn “Stop sync” là secondary/neutral.
  * **Card**: bg `surface`, border `border`, radius `lg`, shadow `s1` (hover lên `s2`); padding 20–24; header ink, meta ink3; không dùng shadow đậm.
  * **Input**: bg `surface`, border `border`, focus border `primary` + ring `primary-soft`; placeholder `ink3`; error border `danger`.
  * **Badge/Chip**: Default bg `surface2`, text `ink2`; AI badge bg `ai-soft`, text `ai`; “Save 20%” dùng `gold-soft` + text `gold`.
  * **Toast/Notice**: success/warning/danger dùng soft background, icon + text; không dùng nền đỏ/xanh đậm.
  * **Progress/Sync**: mặc định là **chip nhỏ** (modeless) + drawer chi tiết; progress bar dùng `ai` khi AI step, dùng `primary` khi sync step.

* **5) App-specific rules (SpiderX workflow)**:

  * **Queue = Decide mode**: cards sạch, ít màu; AI badge lavender; swipe overlay dùng success-soft/danger-soft (không gắt); nút phụ nằm góc, tránh phá swipe.
  * **Todo list = Do mode**: list card border hairline; priority không dùng orange gắt, chuyển sang warning-soft + icon; tags nền `surface2`.
  * **Sync/AI generating**: chip “Syncing · Step 1/4” ở góc; drawer 360–420px; 3 tầng info (status → progress → details collapse).

* **6) Landing/Pricing/Login mapping (đúng museum-core)**:

  * **Landing hero**: nền `bg`, H1 serif, CTA forest; screenshot trong frame `surface` + border hairline; callout AI dùng `ai-soft`; thêm texture “paper” cực nhẹ (2–4% opacity) nếu muốn.
  * **Pricing**: 3 plan cards trên nền ivory; Pro “Recommended” chỉ cần border `primary` + badge gold-soft; không dùng gradient neon.
  * **Login**: bỏ ảnh sci-fi; thay bằng panel trái dạng illustration/texture/pattern, headline serif; form card `surface`. “Google OAuth coming soon” dưới form dạng helper text (ink3).

* **7) Quick checklist consistency (để bạn review toàn product)**: Primary CTA luôn forest; link hover underline; border hairline nhất quán; radius md/lg dùng xuyên suốt; AI chỉ dùng lavender; trạng thái destructive không dùng đỏ cho close/dismiss; mọi text trong panel hẹp phải tránh wrap từng chữ (min-width).
Dưới đây là **Tailwind class recipes (copy/paste)** cho bộ component cốt lõi của SpiderX theo **Hướng B (Forest primary / Quiet Luxury / Museum-core)**. Mình viết theo kiểu “không phụ thuộc framework”: chỉ cần Tailwind + theme token bạn đã add. Bạn có thể dùng thẳng trong React/Next/Vue.

---

* **1) Base helpers (dùng lại cho mọi component)**

```txt
// Focus ring chuẩn (dùng cho button/input/link)
focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft

// Text
text-ink text-ink2 text-ink3

// Surfaces
bg-bg bg-surface bg-surface2 border border-border

// Radius + Shadow
rounded-md rounded-lg rounded-xl shadow-s1 hover:shadow-s2
```

---

* **2) Button recipes**
  **Primary (CTA / hành động chính)**

```txt
inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold
bg-primary text-surface shadow-s1
hover:bg-primary-hover active:bg-primary-pressed
transition-colors duration-200
focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft
disabled:opacity-50 disabled:cursor-not-allowed
```

**Secondary (neutral action / stop sync / cancel không destructive)**

```txt
inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold
bg-surface text-primary border border-border
hover:bg-surface2 active:bg-surface2
transition-colors duration-200
focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft
disabled:opacity-50 disabled:cursor-not-allowed
```

**Ghost (toolbar / icon button / “View details”)**

```txt
inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold
text-primary hover:bg-primary-soft
transition-colors duration-150
focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft
```

**Destructive (chỉ delete thật)**

```txt
inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold
bg-danger text-surface shadow-s1
hover:opacity-95 active:opacity-90
focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger-soft
```

---

* **3) Card recipes (list item, pricing plan, panel)**
  **Base card**

```txt
bg-surface border border-border rounded-lg shadow-s1
```

**Card padding preset**

* Small: `p-4`
* Default: `p-5`
* Large: `p-6`

**Card hover (clickable list item)**

```txt
bg-surface border border-border rounded-lg shadow-s1
hover:shadow-s2 hover:-translate-y-[1px] transition-all duration-200
```

**Recommended plan (pricing highlight)**

```txt
bg-surface border-2 border-primary rounded-lg shadow-s2
```

---

* **4) Badge / Chip recipes**
  **Default chip (tag)**

```txt
inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold
bg-surface2 text-ink2 border border-border
```

**AI chip**

```txt
inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold
bg-ai-soft text-ai border border-border
```

**Status chips**

* Success: `bg-success-soft text-success`
* Warning: `bg-warning-soft text-warning`
* Danger: `bg-danger-soft text-danger`

**Gold “Save 20%” chip (pricing)**

```txt
inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold
bg-gold-soft text-gold border border-border
```

---

* **5) Input / Form recipes**
  **Label**

```txt
text-sm font-semibold text-ink
```

**Helper**

```txt
mt-1 text-xs text-ink3
```

**Input base**

```txt
w-full rounded-md bg-surface border border-border px-4 py-3 text-sm text-ink
placeholder:text-ink3
focus:border-primary focus:ring-4 focus:ring-primary-soft focus:outline-none
transition duration-150
```

**Input error state**

```txt
border-danger focus:border-danger focus:ring-danger-soft
```

**Inline error text**

```txt
mt-1 text-xs font-semibold text-danger
```

---

* **6) Drawer (Right panel) – dùng cho Sync/AI details**
  **Overlay (modeless)**

```txt
fixed inset-0 bg-ink/20 backdrop-blur-[2px]
```

**Drawer container**

```txt
fixed right-0 top-0 h-full w-[420px] max-w-[90vw]
bg-surface border-l border-border shadow-s2
rounded-l-xl
```

**Drawer header**

```txt
flex items-start justify-between gap-4 p-6 border-b border-border
```

**Drawer title/subtitle**

```txt
// title
text-lg font-semibold text-ink
// subtitle
mt-1 text-sm text-ink2
```

**Drawer content**

```txt
p-6 space-y-5
```

---

* **7) Toast / Banner recipes (completion/error, không làm user giật mình)**
  **Toast base**

```txt
flex items-start gap-3 rounded-lg border border-border bg-surface shadow-s2 p-4
```

**Toast title/body**

```txt
// title
text-sm font-semibold text-ink
// body
mt-0.5 text-sm text-ink2
```

**Toast variants**

* Success left bar: thêm `border-l-4 border-l-success`
* Warning left bar: `border-l-4 border-l-warning`
* Danger left bar: `border-l-4 border-l-danger`

---

* **8) Progress bar + Stepper (AI generate / sync)**
  **Progress wrapper**

```txt
w-full h-2 rounded-full bg-surface2 overflow-hidden border border-border
```

**Progress fill (sync = primary)**

```txt
h-full bg-primary transition-[width] duration-200
```

**Progress fill (AI = ai)**

```txt
h-full bg-ai transition-[width] duration-200
```

**Stepper text (tầng 2)**

```txt
text-sm text-ink2
```

**Meta detail (tầng 3)**

```txt
text-xs text-ink3
```

---

* **9) Progress Chip (modeless, không vỡ UI) – dành cho Syncing/Generating**
  **Chip container**

```txt
fixed bottom-6 right-6 z-50
flex items-center gap-3 rounded-full border border-border bg-surface shadow-s2 px-4 py-3
```

**Chip text**

```txt
text-sm font-semibold text-ink
```

**Chip meta**

```txt
text-xs text-ink3
```

**Chip actions**

* View (ghost): dùng Button Ghost recipe
* Dismiss (icon):

```txt
inline-flex h-8 w-8 items-center justify-center rounded-full
text-ink2 hover:bg-surface2
focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft
```

---

* **10) Queue Swipe Card (stack) – style premium, không gắt**
  **Card**

```txt
bg-surface border border-border rounded-xl shadow-s2 p-5
```

**Title + meta**

```txt
// title
text-base font-semibold text-ink
// meta row
mt-2 flex flex-wrap items-center gap-2 text-xs text-ink3
```

**Swipe overlay (accept/skip) – soft**

* Accept: `bg-success-soft/90 text-success border border-border`
* Skip: `bg-danger-soft/90 text-danger border border-border`
  (ưu tiên icon + text, không chỉ màu)

---

* **11) Animation timing (quiet luxury)**
  Dùng thống nhất:

```txt
transition-all duration-200 ease-out
```

Drawer open/close: `duration-220` (Tailwind default không có 220 → dùng 200 hoặc custom). Tránh bounce.

---