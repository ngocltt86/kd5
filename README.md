
# 🚀 FPT Sales Hub - Hướng dẫn triển khai GitHub Pages

Chào Anh/Chị, đây là phiên bản Web App hoàn chỉnh có khả năng lưu trữ dữ liệu trực tiếp trên trình duyệt. Anh/Chị có thể triển khai lên GitHub Pages để nhân viên truy cập qua link (VD: `https://ten-cua-anh.github.io/fpt-manager`) chỉ trong vài bước đơn giản.

## 📌 Cách đưa lên GitHub (Dành cho người mới)

1. **Tạo tài khoản GitHub**: Nếu chưa có, hãy đăng ký tại [github.com](https://github.com).
2. **Tạo Repository mới**:
   - Nhấn nút **New** (hoặc dấu cộng góc phải).
   - Đặt tên Repository là `fpt-sales-hub` (hoặc tên tùy chọn).
   - Chọn **Public**.
   - Nhấn **Create repository**.
3. **Tải mã nguồn lên**:
   - Chọn dòng "uploading an existing file".
   - Kéo tất cả các file trong thư mục này (bao gồm `index.html`, `App.tsx`, `constants.tsx`, `types.ts`, `metadata.json`) thả vào trình duyệt.
   - Nhấn **Commit changes**.
4. **Kích hoạt Website (GitHub Pages)**:
   - Vào mục **Settings** của Repository đó.
   - Chọn menu **Pages** ở cột bên trái.
   - Ở mục **Build and deployment** > **Branch**, chọn `main` và nhấn **Save**.
   - Đợi khoảng 1-2 phút, GitHub sẽ cung cấp một đường link màu xanh. Đó chính là link công cụ của Anh/Chị!

## 🛠 Cách sử dụng & Quản trị

- **Lưu trữ**: Dữ liệu Anh nhập vào được lưu tại trình duyệt máy tính đó. 
- **Đồng bộ & Backup**: Vì đây là app không cần database trung tâm (để miễn phí và bảo mật), Anh nên dùng nút **"Sao lưu dữ liệu"** mỗi cuối tuần. File JSON tải về có thể dùng nút **"Khôi phục dữ liệu"** để đẩy sang máy tính khác hoặc điện thoại khác.
- **Dùng trên điện thoại**: Gửi link GitHub Pages cho nhân viên. Họ có thể mở bằng Chrome/Safari và chọn "Add to Home Screen" để dùng như một App cài đặt.

## 🎯 Ưu điểm cho FPT Telecom
- **Tốc độ**: Truy cập cực nhanh, không phụ thuộc vào tốc độ load của Google Sheets.
- **Chuyên nghiệp**: Giao diện chuẩn Brand FPT, dễ dùng hơn bảng tính thông thường.
- **Bảo mật**: Dữ liệu nằm ở thiết bị của Anh, GitHub chỉ lưu trữ bộ khung mã nguồn.

---
*Phát triển bởi Trưởng phòng Kinh doanh FPT - Tối ưu cho Internet/TV/Camera.*
