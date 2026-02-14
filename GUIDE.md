
# Hướng dẫn triển khai Công cụ Quản lý FPT Sales trong 1 ngày

Chào Anh/Chị Trưởng phòng, công cụ này được thiết kế để giải quyết bài toán giao việc và theo dõi KPI (NET, PAY, CAM) một cách trực quan nhất.

### Bước 1: Cấu trúc Bảng dữ liệu (Nếu dùng Google Sheets)
Nếu Anh muốn chuyển đổi logic này sang Google Sheets, hãy tạo 2 sheet:

**Sheet 1: `DATA_TASKS`**
- Cột A: ID
- Cột B: Tên công việc
- Cột C: Mục tiêu
- Cột D: Loại KPI (NET/PAY/CAM)
- Cột E: Chỉ tiêu (Số lượng)
- Cột F: Người thực hiện (Data Validation từ danh sách nhân viên)
- Cột G: Deadline
- Cột H: Mức độ ưu tiên (Thấp/Trung bình/Cao)
- Cột I: Trạng thái (Chưa làm/Đang làm/Hoàn thành/Trễ hạn)

**Sheet 2: `STAFF_KPI`**
- Chứa danh sách nhân viên và các công thức tổng hợp.

### Bước 2: Các Công thức Quan trọng (Google Sheets)
1. **Tự động tính Trạng thái Trễ hạn:**
   `=IF(AND(G2 < TODAY(), I2 <> "Hoàn thành"), "Trễ hạn", I2)`
2. **Tính % hoàn thành theo nhân viên:**
   `=COUNTIFS(DATA_TASKS!F:F, A2, DATA_TASKS!I:I, "Hoàn thành") / COUNTIF(DATA_TASKS!F:F, A2)`
3. **Phân loại A/B/C:**
   `=IFS(B2 >= 0.9, "A", B2 >= 0.7, "B", TRUE, "C")` (Trong đó B2 là cột % hoàn thành)

### Bước 3: Thiết lập Dashboard
1. Sử dụng tính năng **Pivot Table** để tổng hợp số lượng HĐ NET, PAY, CAM đã hoàn thành.
2. Sử dụng **Conditional Formatting** (Định dạng có điều kiện):
   - Quy tắc: `=AND($G2-TODAY()<=2, $I2<>"Hoàn thành")` -> Tô màu vàng (Sắp đến hạn).
   - Quy tắc: `=$I2="Trễ hạn"` -> Tô màu đỏ.

### Bước 4: Tối ưu cho Mobile (FPT Field Sales)
- Anh/Chị nên cài đặt ứng dụng **Google Sheets** trên điện thoại cho nhân viên.
- Tạo một **Google Form** để nhân viên cập nhật kết quả nhanh chóng từ ngoài thị trường, dữ liệu sẽ đổ trực tiếp vào sheet `DATA_TASKS`.

### Lịch trình triển khai 1 ngày:
- **08h00 - 10h00:** Thiết lập cấu trúc bảng Google Sheets và nhập danh sách nhân viên.
- **10h00 - 12h00:** Cài đặt công thức và Conditional Formatting.
- **13h30 - 15h00:** Tạo Dashboard biểu đồ (Insert Chart).
- **15h00 - 17h00:** Hướng dẫn nhân viên cách nhập liệu và xem Dashboard.

**Lưu ý:** Công cụ React phía trên là bản demo chức năng hoàn chỉnh. Anh/Chị có thể sử dụng trực tiếp nếu có môi trường hosting web đơn giản hoặc dùng để tham khảo cấu trúc khi xây dựng trên AppSheet.
