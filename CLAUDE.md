# Ecopillo: web chăn ga gối đệm (giao diện mới)

Đọc file này trước khi sửa bất cứ thứ gì. Bản đồ chi tiết từng trang, từng phần: [`docs/ban-do-du-an.md`](docs/ban-do-du-an.md).
Việc đã giao, đang chờ làm: [`docs/viec-can-lam/`](docs/viec-can-lam/). Owner bảo "làm tiếp" thì xem ở đây trước,
bắt đầu từ [`00-phien-sau-doc-truoc.md`](docs/viec-can-lam/00-phien-sau-doc-truoc.md): trạng thái, việc đang chờ ai, và phải phân tích gì trước khi làm tiếp từng việc.
**Bộ não dự án** [`docs/bo-nao/`](docs/bo-nao/README.md): sổ quyết định đã chốt (kể cả cái đã bị đè), việc đang chờ ai, ai là ai và cách viết tin cho khách, tóm tắt biên bản, từ điển, dòng thời gian.
Trước khi đổi thứ gì đã có thì tra `docs/bo-nao/quyet-dinh.md`; xong một đợt góp ý thì cập nhật bộ não (cách làm ở README của nó).
**Đưa giao diện mới lên ecopillo.com.vn**: kế hoạch `docs/ke-hoach-dua-giao-dien-moi-len-web-that.md`. **Hướng dẫn quản trị cho Ecopillo** `docs/huong-dan-quan-tri-web.html`
phải luôn khớp code: đổi cách lấy bài (`tools/lay-bai-viet-wordpress.mjs`), trang Tin tức / bài viết, form và đơn (`nhan-form.gs`, `functions/api/gui.js`), mã đo,
cái Ecopillo được tự sửa, hay xong một bước chuyển web, thì sửa mục tương ứng trong file đó, tăng số bản, thêm dòng "Nhật ký cập nhật" (danh sách file ↔ mục ghi ở đầu file).

## Dự án là gì

- Web mới cho **Công ty TNHH Ecopillo Eternal Việt Nam** (ecopillo.com.vn), thay giao diện web WordPress cũ.
- Khách đã chốt **Gói 1** (biên bản chốt 12/10/2026, file PDF trong `chot hop dong/`):
  WordPress giữ vai trò quản trị (bài viết, form, Yoast), còn giao diện mới này chạy phía trước.
- Code ghi "biên bản mục NN" là trỏ tới mục đó trong biên bản chốt. Muốn đổi một quyết định có ghi mục thì hỏi owner trước.
- **Đơn hàng và form tin nhắn** gửi qua `src/lib/sendForm.ts` → `/api/gui`. Web thật: plugin WordPress `nhan-form.php` (từ bản 1.1.0)
  lưu vào mục "Đơn web" trong wp-admin (riêng tư) + email về hộp thư Ecopillo; không gửi sang Google hay dịch vụ nào khác (owner 18/11/2026).
  Bản xem thử: hàm Cloudflare `trien-khai/xem-thu/functions/api/gui.js` → Apps Script `nhan-form.gs` (chưa nối thì ghi "chưa gửi đi").
  Gửi không được thì báo lỗi kèm hotline (không bao giờ hiện "đã nhận" khi chưa lưu được). `pnpm dev` không có `/api/gui` nên không gửi.
  Không có máy chủ riêng nào khác. Danh sách đại lý có thể lấy từ WordPress qua `VITE_DEALERS_URL` (xem `src/hooks/useDealers.ts`).
- **Đã chạy trên ecopillo.com.vn từ đêm 18/11/2026** bằng plugin WordPress "Ecopillo giao diện mới" (`trien-khai/wordpress-plugin/`), chế độ đổi ở wp-admin → Cài đặt → Giao diện mới (Tắt là về web cũ ngay).
  Đưa bản mới lên web thật: `pnpm build` → `node tools/dong-goi-plugin.mjs` → tải zip lên (thay bản cũ) → bấm Lưu chế độ (kế hoạch mục 3). Đẩy `main` chỉ cập nhật bản xem thử.
  Web thật chạy plugin **2.1.0** từ đêm 21/11 (Ecopillo tự đổi màu, bố cục, chuyển hướng link, "Hiểu kỹ trước khi chọn", ảnh chứng nhận, bộ chăn ga / chăn hè mới; banner dòng chữ mới "Chốn Yên" + dải lụa; bộ sưu tập mới, câu chuyện phối màu tạo trong Woo; tên, ảnh, mô tả sản phẩm có sẵn lấy từ Woo khi tích; chữ, ảnh mọi trang sửa ở Nội dung web → Chữ từng trang; nút liên hệ, mạng xã hội màu hãng; thanh tìm kiếm; nhận đơn; menu Sản phẩm và sản phẩm trong trang danh mục sửa ở Nội dung web; sản phẩm lẻ mới và bài viết mới / sửa từ WordPress hiện ngay; **giá Woo chưa bật**: 116 ô Woo lệch giá web, chờ Ecopillo soát): `docs/bo-nao/dang-cho.md`.
- **Đường link giữ đúng như web cũ** (owner chốt 15/10/2026), chỉ đổi chữ chất liệu cũ trong link thành `lyocell` và 301 link cũ sang.
  Mọi đường link nằm ở `src/data/links.ts`; không viết link cứng trong component.

## Quy tắc làm việc

- **Project chỉ nằm ở `/Volumes/KINGSTON/ecopillo`** (ổ rời). Xem `LAM-VIEC-TREN-O-KINGSTON.md`.
  Lệnh báo "No such file" thì kiểm `df -h /Volumes/KINGSTON` trước: gần như chắc là ổ chưa cắm.
- **Có git từ 14/10/2026** (repo `github.com/CuDinh03/ecopillo`, nhánh `main`; **công khai từ 12/11/2026**: ai cũng đọc được mọi thứ đã commit, kể cả lịch sử). `.gitignore` **chặn hết, chỉ cho phép** phần cần để build:
  biên bản, hợp đồng, `docs/`, `images/`, `_sao-luu/` **không bao giờ** lên GitHub. Thêm file mới ngoài các thư mục được phép thì sửa `.gitignore` và xem `git status` trước khi commit.
  Đẩy lên `main` là GitHub Actions tự đưa **bản xem thử** lên Cloudflare Pages: xem `docs/phuong-an-dua-ban-xem-thu.md`.
  Tài liệu trong `docs/` không có lịch sử git: trước khi sửa lớn ở đó vẫn nén vào `_sao-luu/<mo-ta>-<ngay>.tgz`.
- **Luôn nhớ link của web cũ.** Web cũ `https://ecopillo.com.vn/` có 221 đường link Google đang biết (kiểm kê 14/10/2026).
  Không link nào được ra trang lỗi sau khi đưa lên: giữ nguyên, hoặc 301 ở máy chủ tới trang gần nghĩa nhất.
  Trước khi đặt hoặc đổi bất cứ đường link nào (`src/data/links.ts`, `id` bộ sưu tập, tên trang sản phẩm, bài viết, trang chính sách)
  thì tra [`docs/giu-link-web-cu.md`](docs/giu-link-web-cu.md), và chạy `node tools/kiem-tra-link-cu.mjs` sau khi đổi.
  Thêm phối màu, bộ mới thì phải khai link trong `links.ts` (`PATTERN_SLUGS`, `COLLECTION_PATHS`). Bảng 301 cho máy chủ: `node tools/xuat-bang-chuyen-huong.mjs`.
- Mọi chữ trên web và trong tài liệu: **tiếng Việt, xưng "Quý khách"**. Comment trong code cũng viết tiếng Việt.
- **Trên web không hiện nhãn chờ** (owner 28/10/2026: "bỏ hết các nhãn chờ", 0 nhãn trên 98 trang). Chỗ còn chờ Ecopillo gửi hoặc duyệt:
  có nguồn thật (web cũ, catalog 22.07, biên bản) thì dùng chữ thật; không có thì bỏ câu đó. **Đừng tự bịa** số liệu, giá, địa chỉ, chính sách.
  Muốn ghi lại là đang chờ thì đánh dấu `[ĐIỀN …]`, `[XÁC NHẬN …]`, `[ECOPILLO …]` **trong comment code** và ghi vào `docs/bo-nao/dang-cho.md`.
  `<FillIn>` và `RichText` vẫn còn và **tô nổi mọi chữ dạng `[…]`** trong dữ liệu, nên đừng để chữ `[…]` lọt vào `src/data/`.
  Nhãn câu chuyện chờ duyệt đi theo cờ `STORIES_APPROVED` (đang bật, không hiện).
- **Ecopillo tự đổi màu, kiểu chữ, bố cục, chuyển hướng link, SEO từng trang, menu chính** ở Nội dung web → Giao diện (owner 20/11/2026 "ecopillo cần tự làm hết được"; 24/11/2026 "toàn quyền chỉnh sửa ở tất cả các chi tiết, kể cả nhỏ nhất", "thêm được thì phải sửa được và xoá được"): `src/data/theme.ts` (màu + `FONT_SET`, mau.css), `src/data/pageLayout.ts` (khối mới phải khai vào đây và vẽ qua `Blocks`), `src/data/liveRedirects.ts`, `src/data/liveSeo.ts`, `src/data/pageText/mainMenu.ts`. Màu, font dưới đây là bản gốc.
- **Không viết chữ cứng mới, kể cả nút, nhãn ô, aria, lời báo lỗi** (đợt E 24/11): thêm ô vào bộ `definePageText` cạnh khu vực đó (`src/data/pageText/*`), chỗ có số / tên dùng `chen()`. Thêm được gì thì phải sửa, xoá được: bản rà `docs/bao-cao-ra-quyen-sua-2026-11-24.md`.
- **Danh mục sản phẩm, gỡ sản phẩm / bài có sẵn** làm trong WordPress (đợt E, plugin 2.2.0): `danh-muc.php` (thêm / sửa / ẩn / xoá danh mục, SEO; web: `liveCategories` trong `links.ts`), `an-xoa.php` (nháp / thùng rác / xoá → bỏ khỏi web, 301). Tra cứu dùng `ALL_PRODUCTS` / `ALL_COLLECTIONS` / `productBySlug` (cả thứ đã gỡ, không vỡ); liệt kê dùng `PRODUCTS` / `COLLECTIONS` (chỉ thứ đang hiện); link tới trang đã gỡ kiểm bằng `hiddenPageTarget`. Trang có sẵn cần máy chủ trả khác (SEO, ẩn, 301): `trang-wp.php` + file đánh dấu `qua-wp/` trong quy tắc .htaccess.
- Màu: chỉ dùng bộ nhận diện trong `src/index.css` (`@theme`): chàm `#2D2E8D`, chàm sáng `#333DBA`,
  xanh nhạt `#D3EFFF`/`#E9F8FF`, trắng, vàng `#FFC271` (chỉ cho quà tặng, ưu đãi; ngoại lệ: dải trắng ngay dưới banner trang chủ có hai khung vàng, "Hệ sinh thái sản phẩm" (owner duyệt 17/10/2026)
  và "Tốt · Thật · Thiện" (chị Phương 09/11/2026: "làm khung cam như bên hệ sinh thái cho cân"), `BangEcBar` trong `Hero.tsx`).
  **Ngoại lệ màu hãng** (owner chọn A 20/11/2026, theo anh Quang): nút gọi xanh lá, Zalo, Messenger, vòng mạng xã hội nền màu hãng
  (`bg-call`, `bg-zalo`, `bg-messenger`, `bg-facebook`, `bg-youtube`, `bg-tiktok`, `bg-instagram`); chỉ dùng cho nút liên hệ và mạng xã hội, "Đặt hàng" vẫn chàm.
  Tên token cũ (`deep-*`, `mist-*`, `cream-*`, `ivory`) vẫn giữ và đã trỏ về các màu này.
- **Nền cả web là xanh `#D3EFFF`, khối nổi màu trắng** (owner chọn 17/10/2026, mục 33, phương án 1): `bg-page` = #D3EFFF;
  `ivory`, `cream-50`, `cream-100`, `mist-50` đều là trắng. Thẻ, ô, hộp trắng tách khỏi nền bằng `shadow-[var(--shadow-soft)]`, không dùng viền `ring-cream-200` (trùng màu nền nên không thấy).
  Dải kéo hết bề ngang không đặt nền (để nền xanh liền). Đường kẻ dùng `border-line` (chàm 14%). Ô nhỏ nằm **bên trong** khối trắng dùng `bg-mist-100` (#E9F8FF).
- Font gốc: Be Vietnam Pro (chữ thường) + Noto Serif Display (tiêu đề, lớp `font-display`; chữ đứng đậm 600, chữ nghiêng 400, owner chọn mẫu A 04/11/2026). Ecopillo đổi được ở Kiểu chữ web (chỉ font đủ dấu tiếng Việt).
  Mỗi tiêu đề chỉ một kiểu chữ (02/11/2026). Đổi font hay độ đậm thì đo lại `size-adjust` ở đầu `src/index.css`.
  Font viết tay của logo (lớp `font-slogan`, 1FTV VIP Betterlett, `public/fonts/betterlett-slogan.woff`) **từ 16/11/2026 không còn chỗ nào dùng**,
  vì đầu trang chủ đã thành banner "Chốn yên". Khai báo `@font-face` vẫn để trong `src/index.css`. File font **chỉ có chữ của câu "Nâng niu giấc mơ xanh"**:
  dùng lại cho chữ khác thì chữ thiếu sẽ hiện font khác; đổi câu thì cắt lại (lệnh ở đầu `src/index.css`).
- **Skill thiết kế trong `.claude/skills/`** (Impeccable, Taste Skill, bộ của Emil Kowalski; nguồn ở `.claude/skills/NGUON-SKILL.md`, không lên git):
  chỉ dùng để rà và chau chuốt. Chúng khuyên đổi font, màu, bố cục thì **quy tắc trong file này và quyết định owner đã chốt thắng**.
- **Không dùng `<select>` của trình duyệt** (danh sách xổ xuống màu xám của macOS, owner chê 15/10/2026): dùng `Select` trong `src/components/ui/Select.tsx`.
- Dữ liệu (chữ, giá, ảnh, liên hệ) nằm trong `src/data/`, không viết cứng trong component.
- **Giao diện là khung, Ecopillo tự sửa dữ liệu trong WordPress** (owner 18/11/2026, đè Q1): `docs/ke-hoach-khach-tu-sua-du-lieu.md`. Đừng thêm dữ liệu cứng mới mà Ecopillo sẽ cần đổi.
  Giá, hết hàng, **mẫu mới trong bộ sưu tập có sẵn** (`mau-moi.php`), **sản phẩm lẻ mới** (`san-pham-moi.php`; danh mục Woo ↔ trang: `WOO_CATEGORY_LISTINGS` trong `links.ts`), trang khung cho link mới: sửa trong WooCommerce;
  **tên, ảnh, mô tả, thông số sản phẩm có sẵn** (và ảnh, tên màu mẫu chăn ga) lấy từ Woo khi Ecopillo tích ô "Giao diện mới dùng tên, ảnh, mô tả" (`noi-dung-woo.php`, `noiDungWoo` trong `liveData.ts`, đợt B 20/11/2026);
  **bộ sưu tập mới** (danh mục Woo có tích "Hiện thành bộ sưu tập", kiểu ga phủ / ga chun) và **câu chuyện, gam màu từng mẫu** (ô Mô tả, thuộc tính "Gam màu"): `bo-suu-tap-moi.php`, `boSuuTapMoi` trong `liveData.ts` (đợt C 20/11/2026);
  **bài viết mới / sửa** trong WordPress lên web ngay (`bai-viet-moi.php` → `window.__ECO_BAI__` + `bai/<tên>.json`, `src/data/livePosts.ts`, lọc lại ở `src/lib/cleanPostHtml.ts`); liên hệ, đại lý, banner, sự kiện, báo chí, cảm nhận khách, giới thiệu, khách sạn, đối tác, quà tặng, hỏi đáp, chính sách, khối giao hàng / bảo hành trên trang sản phẩm (`src/data/productCommonInfo.ts`): ô xổ Sản phẩm (dòng 3 nhóm Đệm, Đồ ruột, Chăn: `src/data/productMenu.ts`), sản phẩm trong trang danh mục (`src/data/listingProducts.ts`): menu Nội dung web (46 bộ, gồm nhóm Chữ từng trang). Plugin ghi `du-lieu.js`, web ghép đè
  (`src/data/liveData.ts`, `src/data/liveContent.ts`); dữ liệu trong code chỉ là bản lúc dựng. Thêm bộ sửa được: khai `EditableSet` cạnh dữ liệu + thêm vào `src/data/contentFrame.ts`.
  **Dữ liệu Ecopillo không ra khỏi WordPress** (đơn, tin nhắn chỉ ở mục Đơn web + email Ecopillo): không thêm Google Sheet, GitHub hay dịch vụ ngoài nào nhận dữ liệu.
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
| Chính sách giao hàng, phí ship; thanh toán, đặt cọc, trải nghiệm tại nhà (thông báo Ecopillo từ 07/08/2026, không còn COD tiền mặt): `src/data/paymentPolicy.ts`, tài khoản nhận tiền trong `brand.ts` | `src/lib/shipping.ts`, chữ chính sách ở `src/data/policies.ts`; thẻ giao hàng, bảo hành, 4 cam kết trên trang sản phẩm ở `src/data/productCommonInfo.ts` |
| Câu chuyện phối màu, gam màu, tập (bản nháp chờ Ecopillo duyệt) | `src/data/stories.ts`; xuất bản gửi duyệt: `node tools/xuat-nhap-cau-chuyen.mjs` |
| Thêm bộ sưu tập mới, thêm phối màu mới | Làm theo `docs/huong-dan-them-bo-suu-tap.md` |
| Trang bộ sưu tập (bìa, chương, hàng chương, cùng gam màu) | `src/components/collection/` |
| Bộ sưu tập trang chủ: 4 bộ lõi + "Thêm lựa chọn" 3 bộ, cùng kiểu ô to (thêm bộ mới phải thêm vào `CORE_SOURCES` hoặc `MORE_SOURCES`, không thì không hiện) | `src/data/collectionGroups.ts`, `src/components/home/Collections.tsx` |
| Bài viết | 3 bài viết trong code: `src/data/posts.ts`. 58 bài của web cũ (17/11/2026, giữ link): `src/data/bai-viet-wp/`, **không sửa tay**, lấy lại bằng `node tools/lay-bai-viet-wordpress.mjs` (làm sạch HTML, đổi chữ chất liệu cũ, đổi link, thay ảnh có tên chữ cũ). Gộp hai nguồn: `src/data/allPosts.ts`; nhóm Tin tức / Cẩm nang 4 chủ đề: `src/data/postSections.ts` (bài mới: ô "Mục trên web" khi soạn bài); thân bài WordPress: `src/components/blog/WordPressBody.tsx`, kiểu chữ `.bai-wp` trong `src/index.css` |
| Đánh giá, nội dung mẫu trang chủ | `src/data/content.ts` |
| Sự kiện Ecopillo đồng hành (cuối phần Về chúng tôi trang chủ) | `src/data/events.ts`, khối `src/components/home/EventsStrip.tsx`; nén ảnh: `tools/nen-anh-su-kien-2026-10-20.py` |
| Chữ khối khách sạn (nhãn, giới thiệu, 4 lợi ích) dùng chung trang chủ và trang Khách sạn và dự án | `src/data/hotel.ts` |
| Menu, chân trang, thanh liên hệ, nút lên đầu trang | `src/components/layout/` |
| Thanh tìm kiếm (kính lúp trên thanh đầu trang, ô tìm đầu menu điện thoại; phương án B 19/11/2026): tìm gì, từ khoá trang, gợi ý | `src/data/searchIndex.ts` (nạp khi mở); cách khớp, bỏ dấu, từ miền Nam: `src/lib/searchText.ts`; giao diện `src/components/layout/SiteSearch.tsx` |
| Thanh quản trị cho người đăng nhập WordPress (khách không thấy, không phát sinh yêu cầu) | `src/components/layout/AdminBar.tsx` + plugin `thanh-quan-tri.php` (cookie `eco_qt`, admin-ajax `eco_thanh_qt`) |
| Đường link, chuyển hướng link cũ | `src/data/links.ts` (bộ định tuyến `src/App.tsx` dựng từ đó); quy tắc và bảng 221 link web cũ: `docs/giu-link-web-cu.md` |
| Danh mục nhỏ của web cũ (đệm lò xo, ruột chăn, ruột gối…) | `LISTINGS` trong `src/data/links.ts` (tên, link, sản phẩm gốc), Ecopillo chọn lại sản phẩm ở Nội dung web (`src/data/listingProducts.ts`); trang `src/pages/CategoryPage.tsx` |
| Ô xổ "Sản phẩm" trên thanh đầu trang | `src/data/productMenu.ts` (dòng Đệm, Đồ ruột, Chăn: `BASE_MENU_ROWS`, Ecopillo sửa ở Nội dung web), `src/components/layout/ProductMenu.tsx` |
| Hiệu ứng hiện dần, cuộn trôi (Lenis), ảnh trôi | `public/hieu-ung/` + `HIEU-UNG-GHI-CHU.md` |
| Phần đầu trang chủ (banner "Chốn yên" từ 16/11/2026, thay ảnh Bảng EC) | `src/components/home/Hero.tsx`; chữ, link, ảnh ở `src/data/heroBanner.ts`; mẫu owner chọn và lệnh xuất ảnh: `docs/de-xuat-banner-moi-16-11.html`, `docs/de-xuat-banner-moi-16-11/xuat-anh-web.py`; dòng chữ mới 20/11/2026 ("Chốn Yên" + dải lụa, `images/Banner website2.psd`): `docs/de-xuat-banner-moi-20-11/xuat-tieu-de.py`. Đổi banner thì dựng lại ảnh chia sẻ (`node tools/tao-anh-chia-se-chung.mjs a`, tăng `?v=` trong `index.html`) |
| Khối đệm trang chủ (C3: chọn theo cách nằm) | `src/data/mattressPicker.ts`, `src/components/home/MattressPicker.tsx` |
| Kệ trang Sản phẩm mục "Tất cả" (ô nhóm + 4 kệ) | `src/data/productShelves.ts`, `src/components/products/GroupTiles.tsx`, `ProductShelves.tsx` |
| Chữ, ảnh từng trang (tiêu đề, đoạn dẫn, mô tả Google, cam kết, chân trang…): Ecopillo sửa ở Nội dung web → Chữ từng trang (owner 20/11/2026). Đổi chữ gốc hay thêm ô thì sửa ở đây, **không viết chữ cứng mới trong component** | `src/data/pageText/` (khai bằng `definePageText` trong `define.ts`, đăng ký ở `src/data/contentFrame.ts`); vài bộ nằm cạnh dữ liệu: `about.ts` (`ABOUT_MORE_SET`), `hotel.ts` (`HOTEL_PAGE_SET`), `brand.ts` (phim), `links.ts` (đầu trang danh mục), `listingGuides.ts`, `mattressPicker.ts`, `collectionGroups.ts`, `thankYou.ts`. Tiêu đề dùng `\|` để xuống dòng (`Lines` trong `src/components/ui/Highlight.tsx`) |
| Màu web, bố cục (thứ tự / ẩn khối), chuyển hướng link Ecopillo tự đổi | `src/data/theme.ts`, `src/data/pageLayout.ts` + `src/components/ui/Blocks.tsx`, `src/data/liveRedirects.ts`; plugin `noi-dung.php` (mau.css, kiểm tương phản, 301) |
| Tiêu đề tab, mô tả SEO, canonical, ảnh chia sẻ, JSON-LD | `usePageMeta` ở từng trang; `src/lib/structuredData.ts` + `src/components/seo/JsonLd.tsx`; ảnh chia sẻ `public/images/chia-se/` (tạo lại: `python3 -I tools/tao-anh-chia-se-2026-10-28.py public/images`); ghi vào HTML: `tools/dung-san-html.mjs` |

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
- Bản đồ ở Liên hệ và Hệ thống phân phối đều là **Google Maps nhúng** (iframe, không cần khoá API; khách yêu cầu 15/10/2026).
  Hệ thống phân phối hiện một điểm mỗi lần (điểm khách bấm), ghim theo toạ độ (`pinEmbedUrl` trong `src/data/brand.ts`).
- Ổ KINGSTON **chưa mã hoá** mà chứa biên bản và hợp đồng của khách. Không đẩy file nào lên dịch vụ ngoài khi owner chưa đồng ý.
