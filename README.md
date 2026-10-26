# Ứng Dụng Quản Lý Học Tập (BTTH4: API & Offline Mode)

- **Sinh viên:** Đinh Hoàng Long
- **Mã sinh viên:** B23DCCC102
- **Lớp:** D23CQCN01-B
- **Ngành:** Công nghệ Thông tin - UDU
- **Khoa:** Viện Khoa học Kĩ thuật Bưu điện

---

## 1. Kiến Trúc & Luồng Dữ Liệu

Ứng dụng tuân thủ nghiêm ngặt mô hình phân tầng (Layered Architecture):
```
[ Màn hình (Screens) ]
       ↓
[ Custom Hooks (useCachedQuery, useNetworkStatus, useOutboxSync) & Context (AppDataContext, SyncContext) ]
       ↓
[ Services (studentService, courseService, sessionService, assignmentService, gradeService) ]
       ↓
┌───────────────────────┬───────────────────────┐
│ Cache (AsyncStorage)  │  Outbox (AsyncStorage)│
│  "Cache-First"        │   Hàng đợi Offline    │
└───────────────────────┴───────────────────────┘
       ↓                           ↓
[ API Client (fetch với Timeout 10s & Chuẩn hóa lỗi) ]
       ↓
[ REST API (json-server 0.17.4 trên port 3000) ]
```

### Quy tắc phân tầng:
1. **`screens/`**: Chỉ sử dụng `components/`, `hooks/`, `context/`, `navigation/routes.js`. Tuyệt đối không gọi `fetch` hay `AsyncStorage` trực tiếp.
2. **`components/`**: Chỉ nhận props trình bày và callback `onXxx`. Sử dụng `theme/` và `utils/`. Không gọi API hay đọc Context.
3. **`hooks/` & `context/`**: Gọi `api/`, `storage/`, `utils/`.
4. **`api/`**: Gọi `client.js` và `config.js`. Không dùng React hay AsyncStorage.
5. **`storage/`**: Đọc ghi cache và hàng đợi outbox qua `keys.js`.

---

## 2. Cơ Chế Xử Lý Xung Đột (Conflict Resolution - Yêu cầu B5)

Khi ứng dụng hoạt động ở chế độ Offline:
1. Mọi thao tác ghi (đổi trạng thái bài tập, thêm bài tập, sửa thông tin sinh viên) được lưu ngay vào hàng đợi `Outbox` trong `AsyncStorage` kèm nhãn thời gian `createdAt`:
   ```json
   {
     "id": "1730000000_abc123",
     "method": "PATCH",
     "url": "/students/1",
     "body": { "fullName": "Đinh Hoàng Long", "updatedAt": "2026-10-26T08:30:00Z" },
     "createdAt": "2026-10-26T08:30:00Z"
   }
   ```
2. Khi có mạng trở lại, hook `useOutboxSync` tự động duyệt qua các tác vụ trong hàng đợi theo đúng thứ tự FIFO.
3. Đối với mỗi thao tác `PATCH`:
   - Ứng dụng thực hiện `GET` dữ liệu mới nhất hiện tại từ máy chủ để kiểm tra trường `updatedAt`.
   - **So sánh `server.updatedAt` và `action.createdAt`**:
     - Nếu `new Date(server.updatedAt) > new Date(action.createdAt)`: Nghĩa là dữ liệu trên máy chủ đã được chỉnh sửa mới hơn sau thời điểm người dùng thao tác offline. 
     - **Giải pháp:** Ứng dụng kích hoạt thông báo cảnh báo xung đột (Conflict Alert), ưu tiên giữ nguyên dữ liệu mới nhất từ máy chủ, và hủy bỏ thao tác offline cũ để tránh ghi đè sai lệch dữ liệu.
     - Nếu không có xung đột: Ứng dụng gửi `PATCH` lên server và xóa tác vụ khỏi outbox.

---

## 3. Hướng Dẫn Cài Đặt & Khởi Chạy

### Bước 1: Khởi động Mock Server (json-server)
Chạy server trên máy tính:
```bash
# Sử dụng script tích hợp sẵn trong package.json (json-server 0.17.4)
npm run server
```
Hoặc chạy lệnh trực tiếp:
```bash
npx json-server --watch db.json --host 0.0.0.0 --port 3000 --delay 800
```
- Máy ảo Android kết nối qua: `http://10.0.2.2:3000` (đã được cấu hình tự động trong `src/config.js`).
- Máy thật kết nối qua: `http://<IP-LAN-may-tinh>:3000`.

### Bước 2: Khởi động Ứng dụng React Native
Mở một cửa sổ Terminal khác tại thư mục dự án:
```bash
# Cài đặt thư viện (nếu clone mới)
npm install --legacy-peer-deps

# Khởi động Metro Bundler
npm start

# Chạy trên máy ảo Android
npm run android
```

---

## 4. Hướng Dẫn Thực Hiện 7 Kịch Bản Kiểm Thử

| # | Kịch bản | Cách thực hiện & Kết quả mong đợi |
|---|---|---|
| **1** | **Tắt json-server rồi mở ứng dụng lần đầu** | Tắt `npm run server` (hoặc Ctrl+C). Mở ứng dụng. Màn hình hiển thị `ErrorView` với thông báo lỗi rõ ràng và nút "Thử lại", ứng dụng không bị crash. Khi bật lại server và nhấn "Thử lại", dữ liệu tải về bình thường. |
| **2** | **Mở app có mạng, sau đó bật Chế độ máy bay và mở lại** | Dữ liệu được đọc tức thì từ bộ nhớ đệm `AsyncStorage`. Banner đỏ `⚠️ Bạn đang offline` xuất hiện trên đầu màn hình, đi kèm dòng thời gian `Cập nhật lần cuối: HH:mm, dd/MM/yyyy`. |
| **3** | **Khi offline: đổi trạng thái 2 bài tập & thêm 1 bài mới** | Tắt mạng. Nhấn toggle chuyển trạng thái bài tập: giao diện đổi ngay lập tức (Optimistic update) và xuất hiện nhãn `🔄 Chưa đồng bộ`. Vào "Thêm bài", nhập thông tin và nhấn Lưu: bài tập mới được đưa vào danh sách với nhãn `🔄 Chưa đồng bộ`. Banner thông báo có thay đổi chưa đồng bộ hiển thị ở Trang chủ. |
| **4** | **Tắt chế độ máy bay (có mạng lại)** | Bật lại mạng. Hook `useOutboxSync` tự động phát hiện mạng và gửi các thao tác theo thứ tự lên server. Hiển thị thông báo `Đã đồng bộ X thay đổi.`, các nhãn `🔄 Chưa đồng bộ` biến mất, file `db.json` được cập nhật chính xác. |
| **5** | **Xử lý xung đột (Conflict resolution)** | Khi offline: sửa họ tên sinh viên. Trước khi bật mạng: mở file `db.json` sửa họ tên và tăng `updatedAt` mới hơn thời điểm sửa offline. Bật mạng lại: app phát hiện xung đột, hiển thị Alert thông báo ưu tiên giữ dữ liệu server, không ghi đè dữ liệu cũ. |
| **6** | **Tìm kiếm không tồn tại & lọc rỗng** | Vào tab "Môn học", gõ từ khóa ngẫu nhiên (ví dụ: `xyz123`): hiển thị `EmptyState` thân thiện kèm nút xóa bộ lọc. Vào "Thời khóa biểu", chọn ngày Chủ nhật (hoặc ngày không có lịch): hiển thị thông báo rỗng. |
| **7** | **Kéo để làm mới (Pull-to-refresh)** | Tại bất kỳ màn hình danh sách nào, vuốt từ trên xuống: vòng xoay làm mới xuất hiện, dữ liệu được cập nhật lại từ API và làm mới timestamp `lastUpdated`. |
