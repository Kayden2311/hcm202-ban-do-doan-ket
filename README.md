# BẢN ĐỒ ĐOÀN KẾT LỊCH SỬ — TƯ TƯỞNG HỒ CHÍ MINH (HCM202)
> **Sản phẩm sáng tạo đồ án:** Tư tưởng Hồ Chí Minh (HCM202) — Đại học FPT  
> **Chủ đề:** Đại đoàn kết toàn dân tộc & Đoàn kết quốc tế trong Tư tưởng Hồ Chí Minh  
> **Công nghệ (Tech Stack):** MapLibre GL JS (Vector Map 100% Offline, 3D Elevation), GSAP Animation, Tailwind CSS, Web Audio API.

---

## 🌟 1. Giới thiệu sản phẩm
**"Bản Đồ Đoàn Kết Lịch Sử"** là ứng dụng web tương tác không gian số đa chiều, tái hiện sống động triết lý:
> *"Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công!"*

Ứng dụng sở hữu 2 góc nhìn chiến lược:
1. **🇻🇳 Nước non một nhà:** Bản đồ dải đất hình chữ S với đầy đủ chủ quyền biển đảo (Hoàng Sa & Trường Sa). Khi người dùng chọn từng câu chuyện lịch sử, khối không gian 3D của khu vực được đề cập (Tây Bắc, Tây Nguyên, Việt Bắc, Nam Bộ...) sẽ nổi lên khỏi bề mặt bản đồ trong ánh vàng kim rực rỡ. Tại mốc lịch sử Ba Đình (1945), toàn thể 65 tỉnh thành non sông thống nhất đồng loạt nâng khối 3D và tỏa sáng.
2. **🌍 Bạn bè năm châu:** Mạng lưới các tuyến đoàn kết (*Solidarity Arcs*) xuất phát từ Hà Nội vươn ra 5 châu lục (Mỹ, Pháp, Anh, Thụy Điển, Cuba, Senegal, Indonesia, Argentina, Liên Xô). Việt Nam giữ vai trò trái tim phát sáng toàn vẹn, trong khi từng quốc gia đối tác được nâng khối 3D màu ngọc Cyan khi mở câu chuyện.

---

## 🚀 2. Hướng dẫn khởi chạy Local

### Cách 1: Sử dụng Node.js (Khuyên dùng)
```bash
# Cài đặt hoặc chạy server tĩnh nhanh
npm start
# Hoặc:
npx serve -l 3000 .
```
Mở trình duyệt tại: `http://localhost:3000`

### Cách 2: Sử dụng Python HTTP Server
```bash
python -m http.server 8080
```
Mở trình duyệt tại: `http://localhost:8080`

---

## 📁 3. Cấu trúc thư mục dự án
```
HCM202/
├── index.html                 # Giao diện chính toàn màn hình
├── css/
│   └── style.css              # Glassmorphism, hiệu ứng Pulse Ruby Red, Equalizer
├── js/
│   ├── app.js                 # Điều khiển bản đồ MapLibre, khối 3D, camera animation
│   └── data.js                # Bộ dữ liệu 22 câu chuyện lịch sử và trích dẫn chuẩn hóa
├── assets/
│   ├── audio/                 # Bản ghi âm lịch sử thật (Ba Đình 1945, Tiến quân ca)
│   ├── geo/                   # Dữ liệu vector offline (Việt Nam, Thế giới, Arcs)
│   └── images/                # Ảnh tư liệu lịch sử tối ưu chuẩn Web Full HD
├── vercel.json                # Cấu hình cache và routing tối ưu cho Vercel CDN
├── package.json               # Cấu hình project & scripts
├── PROJECT_PLANNING.md        # Tài liệu PRD đặc tả dự án
└── README.md
```

---

## 🌐 4. Hướng dẫn Triển khai (Deploy to Vercel & GitHub)

### Bước 1: Khởi tạo và đẩy mã nguồn lên GitHub
```bash
git init
git branch -M main
git add .
git commit -m "feat: Bản Đồ Đoàn Kết Lịch Sử - HCM202"
git remote add origin https://github.com/<username>/<ten-repo>.git
git push -u origin main
```

### Bước 2: Triển khai tự động trên Vercel
1. Đăng nhập [vercel.com](https://vercel.com) bằng tài khoản GitHub.
2. Bấm **Add New...** ➔ **Project** ➔ Chọn repository GitHub vừa tạo.
3. Phần **Framework Preset** chọn **Other**.
4. Bấm **Deploy**.
5. Sau ~15 giây, website sẽ hoạt động trực tiếp tại địa chỉ `https://<ten-repo>.vercel.app`.
