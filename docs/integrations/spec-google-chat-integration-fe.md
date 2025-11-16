# Spec: Google Chat Integration (Frontend / User Flow)

**Phiên bản:** 1.0
**Owner:** FE Team (Next.js)
**Liên quan:** BE Integration Service (Google Chat), Auth (next-auth)

---

## 1. Mục tiêu

Xây dựng luồng FE cho phép người dùng:

1. Kết nối tài khoản Google để ứng dụng có quyền đọc Google Chat Space của họ.
2. Chọn (whitelist) những Space mà hệ thống được phép đọc tin nhắn.
3. Quản lý kết nối:

   * Xem trạng thái kết nối.
   * Thêm/bớt Space trong whitelist.
   * Ngắt kết nối bất kỳ lúc nào.

---

## 2. Phạm vi

**Trong phạm vi (FE):**

* UI/UX toàn bộ luồng tích hợp Google Chat.
* Gọi `next-auth` để login Google với đúng scope.
* Gọi API BE để:

  * Lưu thông tin kết nối.
  * Lấy danh sách Space.
  * Lưu whitelist.
  * Lấy trạng thái kết nối.
  * Ngắt kết nối.
* Hiển thị trạng thái, xử lý loading, error, empty state.

**Ngoài phạm vi (BE):**

* Quản lý Refresh Token, Access Token.
* Cron job đọc tin nhắn Google Chat.
* Lưu tin nhắn, xử lý nội dung.
* Quyết định schema DB.

FE chỉ coi BE là “API provider”.

---

## 3. Actor & Systems

* **User (End User)**

  * Đang đăng nhập vào ứng dụng (đã có `userId` trong hệ thống).
  * Có tài khoản Google Chat.

* **Frontend (Next.js)**

  * Giao diện web.
  * Dùng `next-auth` để login Google.
  * Gọi API BE qua HTTP (REST).

* **Backend Integration Service (BE)**

  * Cung cấp các API:

    * `POST /api/v1/integration/connect`
    * `GET /api/v1/integration/status`
    * `GET /api/v1/spaces`
    * `PUT /api/v1/spaces/whitelist`
    * `POST /api/v1/integration/disconnect`

---

## 4. Functional Requirements

### FR-1: Kết nối tài khoản Google Chat

1. FE hiển thị nút `Kết nối Google Chat` khi user **chưa kết nối**.
2. Khi user click:

   * FE trigger flow `next-auth` với provider Google + scope:

     * `chat.spaces.readonly`
     * `chat.messages.readonly`
3. Sau khi Google redirect lại:

   * Next.js server (trong callback `next-auth`) nhận được:

     * Thông tin user Google.
     * Refresh Token (nếu có).
   * FE (server-side) **ngay lập tức** gọi API BE:

     * `POST /api/v1/integration/connect`
       Body (ví dụ):

       ```json
       {
         "userId": "<appUserId>",
         "refreshToken": "<googleRefreshToken>"
       }
       ```
4. Sau khi `connect` thành công:

   * FE đánh dấu trạng thái `connected`.
   * Điều hướng user sang màn hình **Quản lý Space / Whitelist**.

---

### FR-2: Xem & chọn Google Chat Space (Whitelist – lần đầu và về sau)

1. Khi user mở màn hình “Google Chat Integration Settings”:

   * FE gọi:

     * `GET /api/v1/integration/status`
     * `GET /api/v1/spaces`
2. BE trả về:

   * **Status** kết nối hiện tại.
   * Danh sách Space:

     * Thông tin định danh (id, name, type, …).
     * Cờ cho biết Space đang nằm trong whitelist hay không.
3. FE hiển thị:

   * Danh sách Space dạng list/table với checkbox/toggle:

     * Checkbox **checked** nếu Space đang whitelist.
     * Checkbox **unchecked** nếu chưa whitelist.
4. User có thể:

   * Tick/untick từng Space.
   * Bấm `Lưu` để xác nhận.
5. Khi bấm `Lưu`:

   * FE gửi `PUT /api/v1/spaces/whitelist`
     Body (ví dụ):

     ```json
     {
       "userId": "<appUserId>",
       "spaceIds": ["spaces/AAA", "spaces/BBB"]
     }
     ```
   * Khi thành công:

     * FE hiển thị thông báo (toast/snackbar): “Cập nhật whitelist thành công”.
     * FE đồng bộ lại UI từ response mới nhất (hoặc gọi lại `GET /spaces`).

---

### FR-3: Xem trạng thái tích hợp

Khi user mở trang cài đặt tích hợp:

1. FE gọi `GET /api/v1/integration/status`.
2. BE trả về:

   * `status` (ví dụ):

     * `"connected"`
     * `"not_connected"`
     * `"error"` (token revoke, invalid, expired mà không refresh được, …).
   * (Optionally) `lastSyncAt`, `lastError`, …
3. FE hiển thị:

   * Badge hoặc text:

     * “Đã kết nối” / “Chưa kết nối” / “Có lỗi, vui lòng kết nối lại”.
   * Nếu `status = not_connected`:

     * Chỉ hiển thị UI để `Kết nối Google Chat`.
   * Nếu `status = connected`:

     * Hiển thị UI quản lý Space + nút `Ngắt kết nối`.

---

### FR-4: Ngắt kết nối Google Chat

1. Khi user bấm `Ngắt kết nối Google Chat`:

   * FE hiển thị modal xác nhận:

     * Nội dung gợi ý:

       > “Bạn có chắc muốn ngắt kết nối Google Chat? Hệ thống sẽ dừng đọc tin nhắn và xoá thông tin truy cập liên quan.”
2. Khi user xác nhận:

   * FE gọi `POST /api/v1/integration/disconnect`
     Body (ví dụ):

     ```json
     {
       "userId": "<appUserId>"
     }
     ```
3. Khi API trả về thành công:

   * FE cập nhật trạng thái:

     * `status = not_connected`.
     * Clear cache UI về danh sách Space.
   * UI:

     * Ẩn phần quản lý Space/whitelist.
     * Hiển thị lại nút `Kết nối Google Chat`.
     * Hiển thị thông báo: “Đã ngắt kết nối”.

---

## 5. UI Flow chi tiết (FE)

### 5.1. Màn hình Overview / Integration Settings

**Trạng thái 1: Chưa kết nối**

* Components:

  * Tiêu đề: “Kết nối Google Chat”
  * Mô tả ngắn: nói rõ quyền và hành vi (hệ thống chỉ đọc các Space được chọn).
  * Button: `Kết nối Google Chat`.
* Action:

  * Click button → trigger `next-auth` Google login.

---

**Trạng thái 2: Đã kết nối**

* Header:

  * “Google Chat Integration”
  * Badge trạng thái: `Đã kết nối`
  * Nút `Ngắt kết nối`
* Nội dung:

  * Section: “Space đang được theo dõi”
  * Danh sách Space dạng list:

    * Tên Space (name).
    * Mô tả ngắn (nếu có).
    * Checkbox/toggle “Cho phép đọc”.
  * Nút `Lưu` cho toàn bộ thay đổi.
* States cần cover:

  * **Loading** khi đang fetch `status` + `spaces`.
  * **Empty state** khi không có Space nào từ Google.
  * **Error state** nếu API lỗi (hiển thị message và nút `Thử lại`).

---

### 5.2. OAuth Callback Flow (FE)

1. User click `Kết nối Google Chat`.
2. `next-auth` mở Google OAuth.
3. Sau khi user accept:

   * Google redirect lại `/api/auth/callback/google`.
4. Trong callback:

   * Lấy `refreshToken` (nếu nhận được từ Google).
   * Gọi `POST /api/v1/integration/connect`.
5. Sau khi BE trả thành công:

   * Redirect user sang `/settings/integrations/google-chat` (hoặc tương đương).
   * Ở đây UI sẽ gọi `GET /status`, `GET /spaces` và hiển thị danh sách Space.

**Lưu ý:**
Nếu `refreshToken` không có (do Google không trả hoặc user đã chấp nhận trước đó), cần có xử lý fallback (phần này có thể bổ sung sau trong spec auth).

---

## 6. API Contracts (ở góc nhìn FE)

> **Lưu ý:** Đây là contract **tối thiểu** FE cần, BE có thể mở rộng response sau miễn không breaking.

### 6.1. `POST /api/v1/integration/connect`

* **Mục đích:** Lưu thông tin kết nối Google Chat cho user.
* **Request body (ví dụ):**

  ```json
  {
    "userId": "string",
    "refreshToken": "string"
  }
  ```
* **Response 200:**

  ```json
  {
    "status": "connected"
  }
  ```
* **Error case:**

  * 4xx: token invalid, user not found.
  * 5xx: lỗi hệ thống.

---

### 6.2. `GET /api/v1/integration/status`

* **Mục đích:** Lấy trạng thái kết nối hiện tại.
* **Response 200 (ví dụ):**

  ```json
  {
    "status": "connected",
    "provider": "google_chat",
    "lastSyncAt": "2025-11-16T10:00:00Z",
    "lastError": null
  }
  ```

---

### 6.3. `GET /api/v1/spaces`

* **Mục đích:** Lấy danh sách Google Chat Space + trạng thái whitelist.
* **Query (optional):**

  * `userId`
* **Response 200 (ví dụ):**

  ```json
  {
    "spaces": [
      {
        "id": "spaces/AAA",
        "name": "Team Standup",
        "description": "Daily standup room",
        "isWhitelisted": true
      },
      {
        "id": "spaces/BBB",
        "name": "Random",
        "description": null,
        "isWhitelisted": false
      }
    ]
  }
  ```

---

### 6.4. `PUT /api/v1/spaces/whitelist`

* **Mục đích:** Cập nhật danh sách space mà user cho phép hệ thống đọc.
* **Request body:**

  ```json
  {
    "userId": "string",
    "spaceIds": ["spaces/AAA", "spaces/BBB"]
  }
  ```
* **Response 200 (ví dụ):**

  ```json
  {
    "status": "ok",
    "updatedSpaces": ["spaces/AAA", "spaces/BBB"]
  }
  ```

---

### 6.5. `POST /api/v1/integration/disconnect`

* **Mục đích:** Ngắt kết nối Google Chat cho user.
* **Request body:**

  ```json
  {
    "userId": "string"
  }
  ```
* **Response 200 (ví dụ):**

  ```json
  {
    "status": "disconnected"
  }
  ```

---

## 7. Error Handling & UX

* **Timeout / Network error khi gọi BE:**

  * Hiển thị message: “Không thể kết nối tới server. Vui lòng thử lại.”
  * Cho phép user bấm `Thử lại`.

* **BE trả `status = error` trong `GET /integration/status`:**

  * FE hiển thị trạng thái: “Có lỗi với kết nối Google Chat. Vui lòng kết nối lại.”
  * Có nút `Kết nối lại` (gọi lại flow OAuth).

* **Lỗi khi cập nhật whitelist (`PUT /spaces/whitelist`):**

  * Không cập nhật UI local theo optimistic update (hoặc rollback nếu dùng optimistic).
  * Hiển thị thông báo lỗi và giữ nguyên trạng thái checkbox trước đó.

---

## 8. Non-Functional Requirements (FE)

* UI phải phản hồi rõ ràng:

  * Loading indicator khi fetch `status` và `spaces`.
  * Toast/snackbar cho các hành động: Lưu whitelist, Ngắt kết nối, Lỗi.
* Không log `refreshToken` hoặc thông tin nhạy cảm trên client.
* Tất cả request tới BE phải kèm thông tin auth của app (cookie/session/headers) để map được `userId`.