# ZeroManual — website giới thiệu LeaniZ_Flow Studio

Website tĩnh (HTML/CSS/JS thuần, không cần build) giới thiệu sản phẩm **LeaniZ_Flow Studio**, song ngữ Việt/Anh, giao diện tối theo tông màu "color-grading" cam–ngọc lam (đúng vibe dân dựng phim/DIT — đối tượng dùng chính của sản phẩm).

## Cấu trúc

```
index.html              # toàn bộ nội dung trang (song ngữ, gắn cờ data-lang="vi"/"en")
assets/css/style.css     # design tokens + toàn bộ style
assets/js/main.js        # chuyển ngôn ngữ, animation hero, scroll reveal, form liên hệ
assets/js/db.js          # lớp "database" cục bộ (IndexedDB)
```

## Chạy thử ở máy

Mở thẳng `index.html` bằng trình duyệt, hoặc chạy một server tĩnh đơn giản:

```bash
cd zeromanual-site
python3 -m http.server 8080
# rồi mở http://localhost:8080
```

## Triển khai lên GitHub Pages (giống repo gốc uTnarT/zeromanual-app)

1. Đẩy toàn bộ thư mục này vào một repo GitHub (nhánh `main`, hoặc thư mục `/docs`).
2. Vào **Settings → Pages**, chọn nhánh/thư mục vừa đẩy làm nguồn.
3. Trang sẽ có địa chỉ dạng `https://<username>.github.io/<repo>/`.

## Về phần "database"

Trang này **không có máy chủ** — mọi nội dung là file tĩnh. Phần "database" hiện tại (`assets/js/db.js`) dùng **IndexedDB ngay trên trình duyệt của từng khách truy cập** để:

- Lưu tạm tin nhắn từ form Liên hệ (để không mất khi họ lỡ tải lại trang).
- Đếm số lượt bấm nút Tải về (chỉ tính trên trình duyệt đó, không phải số liệu toàn cục).

**Vì sao form Liên hệ vẫn mở ứng dụng email?** Vì không có máy chủ để nhận và lưu tin nhắn từ tất cả người dùng vào một chỗ — IndexedDB chỉ nằm trên máy người gửi, bạn (chủ trang) sẽ không tự thấy được. Nút "Mở ứng dụng email" là bước gửi thật sự, đảm bảo bạn nhận được tin nhắn.

**Nếu muốn có database dùng chung thật sự** (tin nhắn liên hệ tự động về hộp mail bạn, hoặc bộ đếm lượt tải dùng chung cho mọi khách) — cần một backend, ví dụ:
- [Formspree](https://formspree.io) hoặc [Web3Forms](https://web3forms.com) — chỉ cần đổi `action` của form, dễ nhất cho việc nhận email liên hệ.
- [Supabase](https://supabase.com) hoặc [Firebase](https://firebase.google.com) — nếu muốn một database thật (bảng `messages`, bảng `stats`) mà bạn tự truy vấn được. Toàn bộ hàm trong `db.js` (`saveMessage`, `bumpStat`, ...) đã được viết dạng `async` sẵn, chỉ cần thay phần thân hàm bằng lệnh gọi API tương ứng — phần còn lại của trang không cần sửa gì thêm.

## Nội dung cần bạn kiểm tra lại

- **Link tải app**: đang trỏ tới link release cũ (`v1.0.0`) trên GitHub của `uTnarT`. Cập nhật lại `href` ở 3 chỗ (`#nav-download`, `#hero-download`, nút "Tải miễn phí" trong bảng giá) nếu bạn build lại bản `.exe` mới.
- **Email liên hệ / mua PRO**: `thanhtuhaibabon@gmail.com` — lấy từ trang gốc, đổi lại nếu bạn dùng email khác.
- **Tên người sáng lập**: "Nguyễn Minh Tristan" — phần bio ở mục Đội ngũ đang viết chung chung; sửa lại `index.html` (mục `#team`) nếu bạn muốn kể chi tiết hơn về hành trình làm sản phẩm.
- **Link showcase & video demo**: lấy nguyên từ file bạn cung cấp, kiểm tra lại quyền truy cập công khai trước khi đăng.

## Font

Trang dùng Google Fonts (Space Grotesk, Inter, IBM Plex Mono) qua CDN — cần Internet để hiển thị đúng font khi mở lần đầu. Nếu muốn trang chạy hoàn toàn offline, tải file font về và trỏ `@font-face` cục bộ trong `style.css` thay vì link Google Fonts.
