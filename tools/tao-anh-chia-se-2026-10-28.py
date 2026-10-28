"""Tạo ảnh chia sẻ (og:image) 1200x630 JPEG cho trang phối màu, sản phẩm lẻ, bài viết (SSG giai đoạn 2, 28/10/2026).
Chạy từ gốc project: python3 -I tools/tao-anh-chia-se-2026-10-28.py public/images
Đọc ảnh webp đang dùng trên web (patterns/, products/), ghi vào chia-se/<tên>.jpg cùng tên gốc.
JPEG vì Zalo, Facebook đọc chắc chắn; khung 1200x630 là khổ Facebook khuyên dùng, ảnh không bị cắt méo khi hiện.
Chạy lại sau khi thêm ảnh phối màu hoặc ảnh sản phẩm mới; bước dựng HTML báo lỗi nếu trang trỏ tới ảnh chưa có."""
import sys, os, glob
from PIL import Image

ROOT = sys.argv[1]
OUT = os.path.join(ROOT, 'chia-se')
W, H = 1200, 630
# Ảnh vuông (topper) mà cắt đầy khung thì mất gần nửa ảnh: đặt trọn ảnh lên nền xanh nhạt của web
MIN_COVER_RATIO = 1.4
BACKGROUND = (233, 248, 255)  # #E9F8FF
# Ảnh đang ẩn trên web (in sẵn chữ chất liệu cũ, chờ Ecopillo gửi ảnh mới): không tạo ảnh chia sẻ
SKIP = {'chan-he-ER12'}


def fit(im):
    ratio = im.width / im.height
    if ratio >= MIN_COVER_RATIO:
        # Cắt đầy khung, giữ phần giữa
        scale = max(W / im.width, H / im.height)
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
        left, top = (im.width - W) // 2, (im.height - H) // 2
        return im.crop((left, top, left + W, top + H))
    scale = H / im.height
    im = im.resize((round(im.width * scale), H), Image.LANCZOS)
    canvas = Image.new('RGB', (W, H), BACKGROUND)
    canvas.paste(im, ((W - im.width) // 2, 0))
    return canvas


os.makedirs(OUT, exist_ok=True)
total = 0
for folder in ('patterns', 'products'):
    for path in sorted(glob.glob(os.path.join(ROOT, folder, '*.webp'))):
        name = os.path.basename(path)[:-5]
        # Bản nhỏ (-sm) và ảnh phụ (-2) không dùng làm ảnh chia sẻ
        if name.endswith('-sm') or name.endswith('-2') or name in SKIP:
            continue
        dst = os.path.join(OUT, name + '.jpg')
        fit(Image.open(path).convert('RGB')).save(dst, 'JPEG', quality=74, optimize=True, progressive=True)
        total += os.path.getsize(dst)
        print(f'{folder}/{name:36s} {os.path.getsize(dst) // 1024} KB')
print(f'Tổng {total / 1024 / 1024:.1f} MB → {OUT}')
