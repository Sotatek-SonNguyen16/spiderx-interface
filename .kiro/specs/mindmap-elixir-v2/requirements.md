# Requirements Document

## Introduction

Mindmap Elixir v2 mở rộng hệ thống mind map hiện tại (dựa trên `mind-elixir ^5.11.0`) với ba nhóm cải tiến cốt lõi:

1. **Fishbone Layout thực sự** — layout dạng xương cá (Ishikawa) sử dụng CSS transform approach, không fork mind-elixir
2. **Line style tùy chỉnh** — hỗ trợ `strokeDasharray`, `strokeWidth`, `strokeLinecap`, `opacity` per-connector thông qua CSS injection
3. **Connection point fix** — đường kết nối nối vào cạnh bên (side) của node thay vì bottom

Ngoài ra, feature bổ sung các preset mới (dashed-flow, dotted-light, thick-solid, fishbone layout), hai module mới (`fishbone-layout.ts`, `useMindmapLineStyle` hook), và bộ test đầy đủ (unit tests + property-based tests với fast-check).

---

## Glossary

- **FishboneLayout**: Layout dạng xương cá (Ishikawa diagram) với trục ngang (spine) và các nhánh nghiêng lên/xuống theo góc cố định
- **Spine**: Trục ngang chính của fishbone layout, đi từ root node sang phải
- **MainBranch**: Node cấp 1 — con trực tiếp của root node
- **SubBranch**: Node cấp 2+ — con của MainBranch
- **LineStyleConfig**: Cấu hình visual cho đường kết nối SVG, bao gồm `strokeDasharray`, `strokeWidth`, `strokeLinecap`, `opacity`
- **ConnectorPreset**: Preset định nghĩa toàn bộ visual style cho đường kết nối, bao gồm `mainLinkStyle` và `lineStyle`
- **LayoutPreset**: Preset định nghĩa cấu hình layout (direction, engine, fishbone config)
- **FishboneLayout_Module**: Module `lib/mindmap-elixir/fishbone-layout.ts` — xử lý transform data cho fishbone
- **LineStyle_Hook**: Hook `useMindmapLineStyle` — inject CSS vào SVG của mind-elixir
- **MindMap_Component**: Component `components/ui/mindmap.tsx` — wrapper chính của mind-elixir
- **TemplatePresets_Module**: Module `lib/mindmap-elixir/template-presets.ts` — quản lý tất cả presets
- **CSS_Layer**: File `app/css/style.css` — chứa CSS class `.mindmap-fishbone`
- **MindmapPage**: Component `components/mindmap-elixir/markdown-mindmap-page.tsx` — UI state và preset bar
- **NodeObj**: Kiểu dữ liệu node của mind-elixir, có các field `id`, `topic`, `children`, `style`
- **MindElixirData**: Kiểu dữ liệu toàn bộ mind map, bao gồm `nodeData` (root NodeObj) và `theme`
- **CSS_Injection**: Kỹ thuật inject `<style>` tag vào DOM container của mind-elixir để override SVG stroke properties
- **ContainerId**: ID duy nhất của container DOM element, dùng làm CSS selector scope

---

## Requirements

### Requirement 1: Fishbone Layout Module

**User Story:** Là một developer, tôi muốn có module `fishbone-layout.ts` xử lý transform data cho fishbone layout, để có thể tạo visual fishbone effect mà không cần fork mind-elixir.

#### Acceptance Criteria

1. THE `FishboneLayout_Module` SHALL export hàm `applyFishboneLayout(data: MindElixirData, config?: Partial<FishboneConfig>): MindElixirData`
2. WHEN `applyFishboneLayout` được gọi với bất kỳ `MindElixirData` hợp lệ nào, THE `FishboneLayout_Module` SHALL trả về `MindElixirData` mới mà không mutation data gốc
3. WHEN `applyFishboneLayout` được gọi, THE `FishboneLayout_Module` SHALL đảm bảo tổng số nodes trong kết quả bằng tổng số nodes trong data gốc
4. WHEN `applyFishboneLayout` được gọi với `config` không được cung cấp, THE `FishboneLayout_Module` SHALL sử dụng giá trị mặc định `spineAngle: 45` và `alternating: true`
5. WHEN `applyFishboneLayout` được gọi với `config` tùy chỉnh, THE `FishboneLayout_Module` SHALL áp dụng đúng các giá trị `spineAngle` và `alternating` từ config đó
6. WHEN `applyFishboneLayout` được gọi, THE `FishboneLayout_Module` SHALL thêm CSS custom properties vào `style` của mỗi `MainBranch` để CSS có thể target chính xác từng nhánh
7. THE `FishboneLayout_Module` SHALL export hàm `isFishboneLayout(layoutId: string): boolean` trả về `true` khi và chỉ khi `layoutId` tương ứng với fishbone layout
8. THE `FishboneLayout_Module` SHALL export kiểu `FishboneConfig` với các field `spineAngle: number`, `alternating: boolean`, và `spineNodeId?: string`

---

### Yêu cầu 2: Fishbone CSS Rendering

**User Story:** Là một người dùng, tôi muốn mind map hiển thị dạng xương cá khi chọn fishbone layout, để trực quan hóa quan hệ nhân quả theo chuẩn Ishikawa.

#### Acceptance Criteria

1. WHEN `MindMap_Component` nhận prop `fishbone: true`, THE `CSS_Layer` SHALL áp dụng class `.mindmap-fishbone` lên container element
2. WHEN class `.mindmap-fishbone` được áp dụng, THE `CSS_Layer` SHALL rotate các `me-wrapper` của `MainBranch` ở vị trí lẻ (odd) theo góc âm (nghiêng lên) quanh `transform-origin: left center`
3. WHEN class `.mindmap-fishbone` được áp dụng, THE `CSS_Layer` SHALL rotate các `me-wrapper` của `MainBranch` ở vị trí chẵn (even) theo góc dương (nghiêng xuống) quanh `transform-origin: left center`
4. WHEN class `.mindmap-fishbone` được áp dụng, THE `CSS_Layer` SHALL rotate các `me-wrapper` của `SubBranch` theo hướng ngược lại với `MainBranch` cha để các sub-branch song song với spine
5. WHEN `fishbone: true` được set, THE `MindMap_Component` SHALL disable drag (`draggable: false`) để tránh conflict giữa CSS transform và mind-elixir drag logic
6. WHEN `fishbone: true` được set và drag bị disable, THE `MindMap_Component` SHALL sử dụng `direction: 1` (horizontal tree) làm base layout cho mind-elixir

---

### Yêu cầu 3: Line Style Tùy Chỉnh — Hook

**User Story:** Là một developer, tôi muốn có hook `useMindmapLineStyle` inject CSS vào SVG của mind-elixir, để có thể tùy chỉnh visual style của đường kết nối mà không cần sửa source code mind-elixir.

#### Acceptance Criteria

1. THE `LineStyle_Hook` SHALL accept các tham số `containerRef: React.RefObject<HTMLDivElement>`, `lineStyle: LineStyleConfig | undefined`, và `isLoaded: boolean`
2. WHEN `isLoaded` là `true` và `lineStyle` được cung cấp, THE `LineStyle_Hook` SHALL inject một `<style>` tag với `id="me-line-style-override"` vào container element
3. WHEN `lineStyle` thay đổi, THE `LineStyle_Hook` SHALL update nội dung `<style>` tag hiện có thay vì tạo tag mới (không duplicate)
4. WHEN `lineStyle` là `undefined` hoặc không có property nào được set, THE `LineStyle_Hook` SHALL không inject bất kỳ `<style>` tag nào
5. WHEN component unmount, THE `LineStyle_Hook` SHALL remove `<style>` tag đã inject khỏi DOM
6. WHEN `lineStyle.strokeDasharray` được cung cấp, THE `LineStyle_Hook` SHALL inject CSS `stroke-dasharray` áp dụng lên selectors `me-main svg path`, `me-main svg polyline`, `me-children svg path`, `me-children svg polyline` trong scope của `ContainerId`
7. WHEN `lineStyle.strokeWidth` được cung cấp, THE `LineStyle_Hook` SHALL inject CSS `stroke-width` (đơn vị px) lên các selectors tương tự
8. WHEN `lineStyle.strokeLinecap` được cung cấp, THE `LineStyle_Hook` SHALL inject CSS `stroke-linecap` lên các selectors tương tự
9. WHEN `lineStyle.opacity` được cung cấp, THE `LineStyle_Hook` SHALL inject CSS `opacity` lên các selectors tương tự

---

### Yêu cầu 4: Bảo mật CSS Injection

**User Story:** Là một developer, tôi muốn CSS injection được sanitize đúng cách, để tránh CSS injection attacks và XSS vulnerabilities.

#### Acceptance Criteria

1. THE `LineStyle_Hook` SHALL sanitize `ContainerId` chỉ cho phép ký tự `[a-zA-Z0-9_-]` trước khi dùng làm CSS selector
2. WHEN `lineStyle.strokeDasharray` được cung cấp, THE `LineStyle_Hook` SHALL chỉ chấp nhận chuỗi khớp với pattern `^[\d\s.]+$` (chỉ số, dấu cách, dấu chấm)
3. IF `lineStyle.strokeDasharray` chứa ký tự không hợp lệ, THEN THE `LineStyle_Hook` SHALL bỏ qua giá trị đó và không inject property `stroke-dasharray`
4. THE `LineStyle_Hook` SHALL đảm bảo CSS được inject không chứa chuỗi `</style>` hoặc `<script`
5. WHEN `lineStyle.strokeWidth` được cung cấp, THE `LineStyle_Hook` SHALL chỉ chấp nhận giá trị số trong khoảng 0.5–8

---

### Yêu cầu 5: Mở rộng ConnectorPreset với LineStyle

**User Story:** Là một người dùng, tôi muốn chọn các preset connector có style dashed, dotted, hoặc thick, để tùy chỉnh visual appearance của mind map theo nhu cầu.

#### Acceptance Criteria

1. THE `TemplatePresets_Module` SHALL định nghĩa kiểu `MindmapConnectorPreset` với field tùy chọn `lineStyle?: LineStyleConfig`
2. THE `TemplatePresets_Module` SHALL export preset `dashed-flow` với `strokeDasharray: "8 4"`, `strokeWidth: 2`, `strokeLinecap: "round"`
3. THE `TemplatePresets_Module` SHALL export preset `dotted-light` với `strokeDasharray: "2 5"`, `strokeWidth: 1.5`, `strokeLinecap: "round"`, `opacity: 0.7`
4. THE `TemplatePresets_Module` SHALL export preset `thick-solid` với `strokeWidth: 3.5`, `strokeLinecap: "round"` (không có `strokeDasharray`)
5. WHEN `getConnectorPreset(id)` được gọi với id của preset mới, THE `TemplatePresets_Module` SHALL trả về đúng preset object tương ứng
6. THE `TemplatePresets_Module` SHALL đảm bảo tất cả preset hiện có (không có `lineStyle`) vẫn hoạt động đúng sau khi thêm field mới

---

### Yêu cầu 6: Mở rộng LayoutPreset với Fishbone Engine

**User Story:** Là một người dùng, tôi muốn chọn fishbone layout từ preset bar, để áp dụng fishbone rendering cho mind map hiện tại.

#### Acceptance Criteria

1. THE `TemplatePresets_Module` SHALL định nghĩa kiểu `MindmapLayoutPreset` với các field tùy chọn `layoutEngine?: "default" | "fishbone"` và `fishboneConfig?: FishboneConfig`
2. THE `TemplatePresets_Module` SHALL export ít nhất một layout preset có `layoutEngine: "fishbone"` trong danh sách `layoutPresets`
3. WHEN `applyLayout` được gọi với một layout preset có `layoutEngine: "fishbone"`, THE `MindmapPage` SHALL gọi `applyFishboneLayout` để transform data trước khi truyền vào `MindMap_Component`
4. WHEN `applyLayout` được gọi với một layout preset có `layoutEngine: "fishbone"`, THE `MindmapPage` SHALL truyền prop `fishbone: true` vào `MindMap_Component`
5. WHEN `applyLayout` được gọi với một layout preset có `layoutEngine: "default"` hoặc không có `layoutEngine`, THE `MindmapPage` SHALL không gọi `applyFishboneLayout` và không truyền `fishbone: true`

---

### Yêu cầu 7: Mở rộng MindMap Component Props

**User Story:** Là một developer, tôi muốn `MindMap_Component` hỗ trợ prop `lineStyle` và `fishbone`, để tích hợp các tính năng mới mà không phá vỡ API hiện tại.

#### Acceptance Criteria

1. THE `MindMap_Component` SHALL accept prop tùy chọn `lineStyle?: LineStyleConfig`
2. THE `MindMap_Component` SHALL accept prop tùy chọn `fishbone?: boolean`
3. WHEN `lineStyle` prop được cung cấp và `isLoaded` là `true`, THE `MindMap_Component` SHALL gọi `LineStyle_Hook` với `containerRef`, `lineStyle`, và `isLoaded`
4. WHEN `lineStyle` prop thay đổi, THE `MindMap_Component` SHALL cập nhật CSS injection tương ứng thông qua `LineStyle_Hook`
5. WHEN `fishbone` prop là `true`, THE `MindMap_Component` SHALL thêm class `mindmap-fishbone` vào container element
6. WHEN `fishbone` prop là `false` hoặc không được cung cấp, THE `MindMap_Component` SHALL không thêm class `mindmap-fishbone`
7. THE `MindMap_Component` SHALL duy trì backward compatibility — tất cả props hiện có vẫn hoạt động đúng khi không truyền `lineStyle` và `fishbone`

---

### Yêu cầu 8: Connection Point Fix

**User Story:** Là một người dùng, tôi muốn đường kết nối nối vào cạnh bên (left/right) của node thay vì bottom, để mind map trông chuyên nghiệp và dễ đọc hơn.

#### Acceptance Criteria

1. WHEN `fishbone: true` được set, THE `CSS_Layer` SHALL áp dụng CSS đảm bảo `me-tpc` trong fishbone mode sử dụng `display: flex` và `align-items: center` để connection point ở giữa node theo chiều dọc
2. WHEN fishbone layout preset được áp dụng, THE `MindmapPage` SHALL sử dụng `mainLinkStyle: 1` (straight line) thay vì curved để đường kết nối trông thẳng và rõ ràng
3. THE `MindMap_Component` SHALL duy trì `alignment: "nodes"` (đã có) để đảm bảo connection point ở cạnh bên của node cho tất cả layouts

---

### Yêu cầu 9: Tích hợp LineStyle vào MindmapPage

**User Story:** Là một người dùng, tôi muốn khi chọn connector preset có `lineStyle`, mind map tự động cập nhật visual style của đường kết nối, để thấy ngay kết quả khi thay đổi preset.

#### Acceptance Criteria

1. WHEN `selectedConnectorId` thay đổi, THE `MindmapPage` SHALL đọc `lineStyle` từ connector preset tương ứng thông qua `getConnectorPreset`
2. WHEN connector preset có `lineStyle`, THE `MindmapPage` SHALL truyền `lineStyle` đó xuống `MindMap_Component` qua prop
3. WHEN connector preset không có `lineStyle`, THE `MindmapPage` SHALL truyền `lineStyle={undefined}` xuống `MindMap_Component`
4. WHEN `lineStyle` được truyền xuống `MindMap_Component`, THE `MindMap_Component` SHALL phản ánh thay đổi visual ngay lập tức (không cần reload)

---

### Yêu cầu 10: Xử lý lỗi — Fishbone Drag Conflict

**User Story:** Là một người dùng, tôi muốn được thông báo khi tính năng drag bị disable trong fishbone mode, để không bị nhầm lẫn khi không thể kéo node.

#### Acceptance Criteria

1. WHEN `fishbone: true` được set, THE `MindMap_Component` SHALL set `draggable: false` cho mind-elixir instance
2. WHEN `fishbone: true` được set và user cố gắng drag một node, THE `MindMap_Component` SHALL không thực hiện drag operation (behavior được ngăn bởi `draggable: false`)

---

### Yêu cầu 11: Xử lý lỗi — Line Style Injection Race Condition

**User Story:** Là một developer, tôi muốn `useMindmapLineStyle` xử lý race condition khi SVG chưa render, để style được inject đúng thời điểm và không bị mất.

#### Acceptance Criteria

1. WHEN `isLoaded` là `false`, THE `LineStyle_Hook` SHALL không inject style tag
2. WHEN `isLoaded` chuyển từ `false` sang `true`, THE `LineStyle_Hook` SHALL inject style tag nếu `lineStyle` được cung cấp
3. IF SVG element chưa xuất hiện trong DOM khi `isLoaded` là `true`, THEN THE `LineStyle_Hook` SHALL retry inject sau khoảng thời gian ngắn (tối đa 100ms) cho đến khi SVG xuất hiện

---

### Yêu cầu 12: Unit Tests — Fishbone Layout

**User Story:** Là một developer, tôi muốn có unit tests đầy đủ cho `fishbone-layout.ts`, để đảm bảo module hoạt động đúng và dễ refactor.

#### Acceptance Criteria

1. THE test suite `__tests__/mindmap-elixir/fishbone-layout.test.ts` SHALL kiểm tra rằng `applyFishboneLayout` không mutation data gốc
2. THE test suite SHALL kiểm tra rằng `applyFishboneLayout` trả về `MindElixirData` hợp lệ (có `nodeData` với `id` và `topic`)
3. THE test suite SHALL kiểm tra rằng `MainBranch` nodes có `style` metadata sau khi `applyFishboneLayout`
4. THE test suite SHALL kiểm tra rằng config mặc định (`spineAngle: 45`, `alternating: true`) được áp dụng khi không truyền config
5. THE test suite SHALL kiểm tra rằng config tùy chỉnh được áp dụng đúng khi được truyền vào

---

### Yêu cầu 13: Unit Tests — Line Style

**User Story:** Là một developer, tôi muốn có unit tests đầy đủ cho `buildLineStyleCSS`, để đảm bảo CSS được tạo đúng và an toàn.

#### Acceptance Criteria

1. THE test suite `__tests__/mindmap-elixir/line-style.test.ts` SHALL kiểm tra rằng `buildLineStyleCSS` trả về empty string khi `lineStyle` không có property nào
2. THE test suite SHALL kiểm tra rằng `buildLineStyleCSS` tạo CSS đúng cho `strokeDasharray`
3. THE test suite SHALL kiểm tra rằng `buildLineStyleCSS` tạo CSS đúng cho `strokeWidth`
4. THE test suite SHALL kiểm tra rằng `buildLineStyleCSS` kết hợp đúng nhiều properties trong một CSS rule
5. THE test suite SHALL kiểm tra rằng `buildLineStyleCSS` sanitize `containerId` để tránh CSS injection

---

### Yêu cầu 14: Property-Based Tests — Fishbone Layout

**User Story:** Là một developer, tôi muốn có property-based tests cho fishbone layout sử dụng fast-check, để phát hiện edge cases mà unit tests thông thường bỏ sót.

#### Acceptance Criteria

1. THE test suite `__tests__/mindmap-elixir/fishbone-layout.property.test.ts` SHALL sử dụng `fast-check` để generate arbitrary `MindElixirData`
2. THE property test SHALL kiểm tra rằng với bất kỳ `MindElixirData` hợp lệ nào, `applyFishboneLayout` không bao giờ làm mất nodes (node count được bảo toàn)
3. THE property test SHALL kiểm tra rằng với bất kỳ `LineStyleConfig` nào, CSS được tạo bởi `buildLineStyleCSS` không chứa chuỗi `</style>` hoặc `<script`
4. THE property test SHALL kiểm tra rằng với bất kỳ `strokeDasharray` string hợp lệ nào (chỉ số và space), CSS được inject là valid (không có ký tự nguy hiểm)
5. THE property test SHALL chạy tối thiểu 100 iterations cho mỗi property
