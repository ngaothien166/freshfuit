# 🍎 FreshFruit – Website Thương Mại Điện Tử Bán Trái Cây Tươi Online

Website thương mại điện tử chuyên nghiệp bán trái cây tươi được xây dựng với **HTML5, Tailwind CSS, Vanilla JavaScript** và hình ảnh chất lượng cao từ **Unsplash**.

---

## 🌟 Tính Năng Nổi Bật

- **Giao diện hiện đại & tươi sáng**: Tone màu xanh lá (`#2D7A3A`) + cam tươi (`#F97316`) + trắng tinh khôi, tạo cảm giác "tươi – sạch – tự nhiên".
- **Responsive 100%**: Mobile-first, hiển thị mượt mà trên điện thoại, máy tính bảng và màn hình lớn.
- **Luồng mua hàng khép kín (End-to-End)**:
  - 🏠 **Trang chủ (`index.html`)**: Hero banner ấn tượng, 5 danh mục trực quan, tab lọc sản phẩm nổi bật, banner countdown giảm giá 30%, 4 ưu điểm cam kết, đánh giá khách hàng (Testimonials), newsletter đăng ký nhận mã giảm 20%.
  - 🛍️ **Danh sách sản phẩm (`products.html`)**: Tìm kiếm tức thì, lọc danh mục, lọc theo khoảng giá (slider + input), lọc tags (Mới, Bán chạy, Khuyến mãi), sắp xếp theo giá tăng/giảm/bán chạy/mới nhất, chuyển đổi Grid view & List view, phân trang linh hoạt.
  - 🔍 **Chi tiết sản phẩm (`product-detail.html`)**: Gallery nhiều ảnh có thumbnail chọn nhanh, đánh giá sao, chọn số lượng, nút "Thêm vào giỏ" & "Mua ngay", tabs mô tả chi tiết & dinh dưỡng/bảo quản, form gửi đánh giá khách hàng, sản phẩm liên quan.
  - 🛒 **Giỏ hàng (`cart.html`)**: Tăng/giảm số lượng real-time, xóa sản phẩm mượt mà, thanh tiến trình freeship 300k, áp dụng mã giảm giá (`FRESH10`, `WELCOME20`, `SHIP0`), tính tiền tức thì.
  - 💳 **Thanh toán (`checkout.html`)**: Luồng 3 bước chuyên nghiệp (Giao hàng → Thanh toán → Xác nhận), chọn tỉnh/quận đầy đủ tại Việt Nam, phương thức thanh toán COD / Chuyển khoản ngân hàng / Ví MoMo / ZaloPay.
  - 🎉 **Đặt hàng thành công (`order-success.html`)**: Hiệu ứng pháo hoa ăn mừng, mã đơn hàng tự động, tiến trình theo dõi đơn hàng thời gian thực, tóm tắt chi phí, gợi ý sản phẩm mua kèm.
  - ❤️ **Yêu thích (`wishlist.html`)**: Lưu trữ sản phẩm yêu thích qua `localStorage`, thêm nhanh vào giỏ hoặc xóa hàng loạt.
  - 📊 **Quản trị (`admin.html`)**: Bảng điều khiển doanh thu trực quan, biểu đồ tăng trưởng, danh sách đơn hàng gần đây với trạng thái trực quan, sản phẩm bán chạy, quản lý danh mục, khách hàng và mã khuyến mãi.

---

## 🚀 Hướng Dẫn Chạy Website

### Cách 1: Mở trực tiếp (Không cần cài đặt gì)
Nhấp đúp chuột vào file `index.html` trong thư mục:
```
C:\Users\ngaot\.gemini\antigravity\scratch\freshfruit\index.html
```

### Cách 2: Chạy qua Local Server (Khuyên dùng)
Mở terminal tại thư mục dự án và chạy:
```bash
npm start
# hoặc
node server.js
```
Sau đó mở trình duyệt và truy cập: **`http://localhost:3000`**

---

## 📁 Cấu Trúc Dự Án

```
freshfruit/
├── index.html            # Trang chủ
├── products.html         # Trang danh mục & tất cả sản phẩm
├── product-detail.html   # Trang chi tiết sản phẩm
├── cart.html             # Trang giỏ hàng
├── checkout.html         # Trang thanh toán đơn hàng
├── order-success.html    # Trang thông báo đặt hàng thành công
├── wishlist.html         # Trang danh sách yêu thích
├── admin.html            # Trang quản trị dành cho chủ shop
├── server.js             # Local server tĩnh (Node.js 0-dependency)
├── package.json          # File cấu hình dự án
└── js/
    ├── data.js           # Dữ liệu 12+ sản phẩm chuẩn, danh mục, đánh giá
    └── store.js          # Quản lý State giỏ hàng, yêu thích, Toast notification
```

---

## 🎟️ Mã Giảm Giá Dùng Thử

- `FRESH10`: Giảm 10% tổng đơn hàng
- `WELCOME20`: Giảm 20% cho khách hàng mới
- `SHIP0`: Miễn phí vận chuyển
