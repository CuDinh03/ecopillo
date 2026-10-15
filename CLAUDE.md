# Ecopillo: web chăn ga gối đệm (giao diện mới)

Đọc file này trước khi sửa bất cứ thứ gì. Bản đồ chi tiết từng trang, từng phần: [`docs/ban-do-du-an.md`](docs/ban-do-du-an.md).
Việc đã giao, đang chờ làm: [`docs/viec-can-lam/`](docs/viec-can-lam/). Owner bảo "làm tiếp" thì xem ở đây trước,
bắt đầu từ [`00-phien-sau-doc-truoc.md`](docs/viec-can-lam/00-phien-sau-doc-truoc.md): trạng thái, việc đang chờ ai, và phải phân tích gì trước khi làm tiếp từng việc.

## Dự án là gì

- Web mới cho **Công ty TNHH Ecopillo Eternal Việt Nam** (ecopillo.com.vn), thay giao diện web WordPress cũ.
- Khách đã chốt **Gói 1** (biên bản chốt 12/10/2026, file PDF trong `chot hop dong/`):
  WordPress giữ vai trò quản trị (bài viết, form, Yoast), còn giao diện mới này chạy phía trước.
- Code ghi "biên bản mục NN" là trỏ tới mục đó trong biên bản chốt. Muốn đổi một quyết định có ghi mục thì hỏi owner trước.
- **Chưa có backend.** Form liên hệ và đơn đặt hàng chỉ hiện màn hình cảm ơn, chưa gửi đi đâu.
  Danh sách đại lý có thể lấy từ WordPress qua `VITE_DEALERS_URL` (xem `src/hooks/useDealers.ts`).
- Chưa đưa lên tên miền thật. Cách đưa lên và giữ SEO: `docs/de-xuat-seo-trien-khai.html` (đề xuất chuyển sang SSG, giữ link cũ, 301).
- **Đường link giữ đúng như web cũ** (owner chốt 15/10/2026), chỉ đổi chữ chất liệu cũ trong link thành `lyocell` và 301 link cũ sang.
  Mọi đường link nằm ở `src/data/links.ts`; không viết link cứng trong component.

## Quy tắc làm việc

- **Project chỉ nằm ở `/Volumes/KINGSTON/ecopillo`** (ổ rời). Xem `LAM-VIEC-TREN-O-KINGSTON.md`.
  Lệnh báo "No such file" thì kiểm `df -h /Volumes/KINGSTON` trước: gần như chắc là ổ chưa cắm.
- **Có git từ 14/10/2026** (repo riêng tư `github.com/CuDinh03/ecopillo`, nhánh `main`). `.gitignore` **chặn hết, chỉ cho phép** phần cần để build:
  biên bản, hợp đồng, `docs/`, `images/`, `_sao-luu/` **không bao giờ** lên GitHub. Thêm file mới ngoài các thư mục được phép thì sửa `.gitignore` và xem `git status` trước khi commit.
  Đẩy lên `main` là GitHub Actions tự đưa **bản xem thử** lên Cloudflare Pages: xem `docs/phuong-an-dua-ban-xem-thu.md`.
  Tài liệu trong `docs/` không có lịch sử git: trước khi sửa lớn ở đó vẫn nén vào `_sao-luu/<mo-ta>-<ngay>.tgz`.
- **Luôn nhớ link của web cũ.** Web cũ `https://ecopillo.com.vn/` có 221 đường link Google đang biết (kiểm kê 14/10/2026).
  Không link nào được ra trang lỗi sau khi đưa lên: giữ nguyên, hoặc 301 ở máy chủ tới trang gần nghĩa nhất.
  Trước khi đặt hoặc đổi bất cứ đường link nào (`src/data/links.ts`, `id` bộ sưu tập, tên trang sản phẩm, bài viết, trang chính sách)
  thì tra [`docs/giu-link-web-cu.md`](docs/giu-link-web-cu.md), và chạy `node tools/kiem-tra-link-cu.mjs` sau khi đổi.
  Thêm phối màu, bộ mới thì phải khai link trong `links.ts` (`PATTERN_SLUGS`, `COLLECTION_PATHS`). Bảng 301 cho máy chủ: `node tools/xuat-bang-chuyen-huong.mjs`.
- Mọi chữ trên web và trong tài liệu: **tiếng Việt, xưng "Quý khách"**. Comment trong code cũng viết tiếng Việt.
- Chỗ còn chờ Ecopillo gửi hoặc duyệt thì đánh dấu `[ĐIỀN …]`, `[XÁC NHẬN …]` hoặc `[ECOPILLO …]`.
  Với JSX dùng `<FillIn>` (`src/components/ui/primitives.tsx`), với chữ dài dùng `RichText`.
  Đừng tự bịa số liệu, giá, địa chỉ, chính sách.
- Màu: chỉ dùng bộ nhận diện trong `src/index.css` (`@theme`): chàm `#2D2E8D`, chàm sáng `#333DBA`,
  xanh nhạt `#D3EFFF`/`#E9F8FF`, trắng, vàng `#FFC271` (chỉ cho quà tặng, ưu đãi).
  Tên token cũ (`deep-*`, `mist-*`, `cream-*`, `ivory`) vẫn giữ và đã trỏ về các màu này.
- Font: Be Vietnam Pro (chữ thường) + Noto Serif Display (tiêu đề, lớp `font-display`).
- Dữ liệu (chữ, giá, ảnh, liên hệ) nằm trong `src/data/`, không viết cứng trong component.
- **Không dùng chữ "Tencel" và "60s"** ở bất cứ đâu: chữ trên web, alt ảnh, tên file ảnh, comment, tài liệu gửi khách.
  Chất liệu gọi là **Lyocell** (owner yêu cầu bỏ hoàn toàn ngày 14/10/2026, tiếp theo biên bản mục 32).
  Web cũ còn hai chữ đó (cả trong đường link): giao diện mới đổi **hết** thành Lyocell, kể cả link (owner chốt 15/10/2026).
  Chỗ được giữ có chủ ý (link cũ trong bảng chuyển hướng…): xem "Chữ chất liệu cũ" trong `docs/ban-do-du-an.md` mục 12. Rà lại: `grep -rIniE "tencel|60 ?s\b" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=_sao-luu .`

## Lệnh

```bash
pnpm dev        # http://localhost:5173 (cấu hình "ecopillo-dev" trong .claude/launch.json)
pnpm build      # tsc -b rồi vite build ra dist/ (dist/ bị .gitignore, build lại khi cần)
pnpm preview    # xem bản build: http://localhost:4173 ("ecopillo-build")
pnpm lint       # đang có 4 cảnh báo cũ react-refresh, không phải lỗi
```

- Sau khi sửa: `npx tsc -b` và `npx eslint <file>` phải sạch.
- Thử bằng Playwright thì dùng Chrome có sẵn: `chromium.launch({ channel: 'chrome' })`.
  Bản Chromium mà Playwright đòi chưa tải, và ổ trong gần đầy nên đừng tải.
- Kiểm một trang trên điện thoại (390, 360, 320px): `node tools/kiem-tra-mobile/kiem-tra-trang.mjs <đường-link> <thư-mục-ra>`.
  Ghép ảnh xem nhanh: `python3 tools/kiem-tra-mobile/ghep-anh.py <thư-mục-ra>`.
  Nút lên đầu trang có đè nút nào không: `node tools/kiem-tra-mobile/nut-len-dau-trang.mjs`.
  Phần tử nào gây xô lệch (CLS): `TRE_FONT=1200 TRE_TRANG=400 node tools/kiem-tra-mobile/do-cls.mjs <đường-link>`.
  CLS ở đây lúc có lúc không, phải ép font và gói trang về muộn thì lỗi mới hiện mọi lần. Báo cáo: `docs/bao-cao-cls-trang-con-2026-10-14.md`.
  Thư mục ra để ngoài project (thư mục tạm của phiên).

## Muốn sửa X thì mở đâu

| Muốn sửa | Mở |
|---|---|
| Hotline, Zalo, email, mạng xã hội, địa chỉ + toạ độ văn phòng HN / chi nhánh HCM | `src/data/brand.ts` |
| Sản phẩm, bộ sưu tập, mẫu, giá, kích thước | `src/data/catalog.ts` (gốc), `src/data/products.ts` (gom nhóm cho /san-pham) |
| Đại lý, 34 tỉnh, khoảng cách, giờ mở cửa | `src/data/dealers.ts` |
| Chính sách giao hàng, phí ship, COD | `src/lib/shipping.ts`, chữ chính sách ở `src/data/policies.ts` |
| Câu chuyện phối màu, gam màu, tập (bản nháp chờ Ecopillo duyệt) | `src/data/stories.ts`; xuất bản gửi duyệt: `node tools/xuat-nhap-cau-chuyen.mjs` |
| Thêm bộ sưu tập mới, thêm phối màu mới | Làm theo `docs/huong-dan-them-bo-suu-tap.md` |
| Trang bộ sưu tập (bìa, chương, hàng chương, cùng gam màu) | `src/components/collection/` |
| Bài viết | `src/data/posts.ts` |
| Đánh giá, nội dung mẫu trang chủ | `src/data/content.ts` |
| Menu, chân trang, thanh liên hệ, nút lên đầu trang | `src/components/layout/` |
| Đường link, chuyển hướng link cũ | `src/data/links.ts` (bộ định tuyến `src/App.tsx` dựng từ đó); quy tắc và bảng 221 link web cũ: `docs/giu-link-web-cu.md` |
| Danh mục nhỏ của web cũ (đệm lò xo, ruột chăn gối…) | `LISTINGS` trong `src/data/links.ts`, trang `src/pages/CategoryPage.tsx` |
| Hiệu ứng hiện dần, cuộn trôi (Lenis), ảnh trôi | `public/hieu-ung/` + `HIEU-UNG-GHI-CHU.md` |
| Phần đầu trang chủ (ảnh Bảng EC) | `src/components/home/Hero.tsx`, yêu cầu gốc ở `docs/hero-bang-ec-prompt.md` |
| Tiêu đề tab, mô tả SEO, canonical, ảnh chia sẻ | `usePageMeta` ở từng trang, `index.html` |

## Bẫy đã gặp (đọc trước khi debug)

- **Heredoc trong lệnh shell phải bọc nháy:** viết `<<'EOF'`, không viết `<<EOF`. Không bọc thì shell chạy luôn chữ nằm trong dấu backtick của nội dung (đã xảy ra 14/10/2026 khi ghi tài liệu).
- **`position: sticky` trong ô lưới** không bị giữ trong ô đó, nó trôi theo cả khung lưới và đè lên phần bên dưới. Bọc phần dính vào một khối riêng (xem `src/components/collection/CollectionDetail.tsx`).
- **Đo bằng Playwright:** `locator.click()` tự cuộn trang, nên muốn biết "bấm xong trang có nhảy không" thì bấm bằng `el.click()` trong `evaluate`. Bài thử cho kết quả lạ thì kiểm chính bài thử trước (chuột có nằm trong màn hình không).
- **Hai phiên có thể cùng sửa thư mục này:** đọc lại file ngay trước khi sửa, xem `git status` trước khi commit (có thể có thay đổi của phiên khác). Máy chủ dev cổng 5173 có thể thuộc phiên khác; đo bằng Playwright trên cổng đó vẫn đúng.
- **Máy chủ web cũ chặn `curl`** (LiteSpeed trả 403). Lấy sơ đồ trang, kiểm link web cũ thì mở bằng Chrome qua Playwright rồi gọi `fetch` ngay trong trang.
  Mở nhanh liên tục thì web cũ trả 502: chậm lại rồi mở lại trước khi kết luận link hỏng.
- **Cuộn trang bằng code:** dùng `scrollToElement()` trong `src/lib/scroll.ts`, nó đi qua Lenis khi Lenis đang chạy.
  Muốn chừa chỗ cho thanh đầu trang thì đặt `scroll-mt-[5.5rem]` trên phần tử đích. Thanh đầu trang cao `4.5rem`.
- **Khung trình duyệt của Claude bị ẩn** thì `requestAnimationFrame`, IntersectionObserver và hoạt ảnh đều đứng.
  Kiểm `document.hidden`: nếu `true` thì đừng kết luận là có lỗi. Đo bằng Playwright, hoặc nhờ owner mở khung ra.
- **Owner có thể chạy `pnpm dev` riêng.** Khi cổng 5173 đã bận thì Vite tự sang 5174.
  Owner gửi ảnh từ cổng khác 5173 thì đó là một máy chủ khác, có thể đã tắt hoặc đang chạy code cũ.
- **Toạ độ** của điểm bán lấy từ ghim Google Maps (cặp số sau `!3d` và `!4d` trong link).
  Nút "Chỉ đường" đi theo **địa chỉ chữ**, không theo toạ độ. Ghim trên bản đồ thì dùng toạ độ.
- Bản đồ dùng Leaflet đặt sẵn ở `public/vendor/leaflet/`, tải lười khi cuộn tới. Không cần khoá API.
- Ổ KINGSTON **chưa mã hoá** mà chứa biên bản và hợp đồng của khách. Không đẩy file nào lên dịch vụ ngoài khi owner chưa đồng ý.
