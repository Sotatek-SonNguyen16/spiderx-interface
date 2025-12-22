# Sync Dropdown & Dialog Theme Updates

## Tổng quan
Cập nhật màu sắc của dropdown menu và TimeRangePicker dialog thành theme sáng, giữ nguyên màu terracotta của button chính và tăng z-index để hiển thị đúng trên todo list.

## Thay đổi thực hiện

### 1. SyncTodoButton - Giữ nguyên màu button
**Button chính**: Vẫn giữ màu terracotta (#EA916E) như thiết kế gốc
**Chỉ thay đổi**: Dropdown menu và các panel

#### Dropdown Menu - Chuyển sang Light Theme
**Trước**: Dark mode support với `dark:bg-gray-800`
**Sau**: Chỉ light theme
- Background: `bg-white` (loại bỏ dark mode)
- Border: `border-gray-200` (loại bỏ dark variants)
- Hover: `hover:bg-gray-50` (thay vì `hover:bg-gray-100`)
- Text: `text-gray-900` (loại bỏ `dark:text-white`)

### 2. TimeRangePicker - Complete Light Theme
**Trước**: Dual theme support (light + dark)
**Sau**: Chỉ light theme

#### Modal Container
- Background: `bg-white` (loại bỏ `dark:bg-gray-800`)
- Text: `text-gray-900` (loại bỏ `dark:text-white`)

#### Warning Panel
- Background: `bg-accent-50` (loại bỏ `dark:bg-accent-900/20`)
- Border: `border-accent-200` (loại bỏ dark variants)
- Text: `text-accent-700` (loại bỏ `dark:text-accent-300`)

#### Quick Preset Buttons
- Background: `bg-gray-100` (loại bỏ `dark:bg-gray-700`)
- Hover: `hover:bg-gray-200` (loại bỏ dark variants)
- Text: `text-gray-700` (loại bỏ `dark:text-gray-300`)

#### Form Inputs
- Background: `bg-white` (loại bỏ `dark:bg-gray-700`)
- Border: `border-gray-300` (loại bỏ `dark:border-gray-600`)
- Text: `text-gray-900` (loại bỏ `dark:text-white`)
- Focus ring: `focus:ring-brand/40` (giữ nguyên brand color)

#### Error Messages
- Background: `bg-red-50` (loại bỏ `dark:bg-red-900/20`)
- Border: `border-red-200` (loại bỏ dark variants)
- Text: `text-red-600` (loại bỏ `dark:text-red-400`)

#### Action Buttons
- Cancel: `text-gray-700` với `hover:bg-gray-50`
- Confirm: Giữ nguyên `bg-brand` với `hover:bg-brand-700`

## Z-Index Updates (Giữ nguyên)

### Hierarchy:
1. **TimeRangePicker Modal**: `z-[60]` (cao nhất)
2. **SyncTodoButton Dropdown**: `z-50`
3. **Backdrop overlay**: `z-40`

## Kết quả

### Visual Consistency ✅
- Button giữ nguyên màu terracotta theo thiết kế gốc
- Dropdown và dialog có theme sáng, clean, professional
- Loại bỏ dark mode complexity không cần thiết

### User Experience ✅
- Dropdown sáng dễ đọc hơn trên nền sáng của app
- TimeRangePicker có appearance nhất quán với app theme
- Không có visual conflict với todo list

### Technical Benefits ✅
- Giảm CSS complexity (không cần maintain dark variants)
- Consistent với light theme của app
- Better performance (ít CSS classes hơn)

## Theme Colors Sử dụng

### Light Theme Only:
- **Backgrounds**: `bg-white`, `bg-gray-50`, `bg-gray-100`
- **Borders**: `border-gray-200`, `border-gray-300`
- **Text**: `text-gray-900`, `text-gray-700`, `text-gray-500`
- **Accent**: `bg-accent-50`, `text-accent-700` (Lightning Yellow)
- **Brand**: `bg-brand`, `focus:ring-brand/40` (Electric Blue)
- **Error**: `bg-red-50`, `text-red-600`

### Removed Dark Mode Classes:
- `dark:bg-*`, `dark:text-*`, `dark:border-*`
- `dark:hover:*` variants
- Dark mode color combinations

## Summary

Đã thành công chuyển dropdown menu và TimeRangePicker dialog sang light theme trong khi giữ nguyên màu terracotta của button chính. Kết quả là UI nhất quán, sạch sẽ và phù hợp với theme sáng của ứng dụng.