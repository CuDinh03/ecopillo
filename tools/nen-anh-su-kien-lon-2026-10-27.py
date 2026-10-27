"""Nén ảnh "sự kiện lớn" cho trang Quà tặng và sự kiện (Ecopillo 27/10/2026: "Phần đồng hành thêm các sự kiện lớn").
Ảnh lấy từ bài viết trên web cũ ecopillo.com.vn (tải 27/10/2026 qua Chrome, máy chủ chặn curl), để trong images/web-cu-su-kien/.
Chạy từ gốc project: python3 -I tools/nen-anh-su-kien-lon-2026-10-27.py images/web-cu-su-kien public/images
Ảnh bìa bài khai trương Đà Nẵng có in chữ chất liệu cũ nên không dùng."""
import sys, os
from PIL import Image, ImageOps

SRC, OUT = sys.argv[1], sys.argv[2]

def crop_ratio(im, ratio, focus_y=0.5):
    """Cắt về tỉ lệ rộng/cao `ratio`, giữ giữa theo chiều ngang, theo `focus_y` theo chiều dọc."""
    w, h = im.size
    if w / h > ratio:
        nw = round(h * ratio)
        left = (w - nw) // 2
        return im.crop((left, 0, left + nw, h))
    nh = round(w / ratio)
    top = round((h - nh) * focus_y)
    return im.crop((0, top, w, top + nh))

def save(im, rel, width, quality=78):
    im = im.copy()
    scale = width / im.width
    if scale < 1:
        im = im.resize((width, round(im.height * scale)), Image.LANCZOS)
    dst = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, 'WEBP', quality=quality, method=6)
    print(f'{rel:44s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst)//1024} KB')

# Ảnh ngang 16:10 cho thẻ lớn; focus_y giữ băng rôn và người trên sân khấu
WIDE = {
    'thuong-hieu-dan-dau-2025-ngang': ('thuong-hieu-dan-dau-2025-trao-giai.jpg', 0.35),  # web cũ, bài 21/04/2025
    'khai-truong-hcm-ngang': ('khai-truong-hcm-cat-bang.jpg', 0.6),                       # web cũ, bài 29/09/2025
}
for name, (file, fy) in WIDE.items():
    im = crop_ratio(ImageOps.exif_transpose(Image.open(os.path.join(SRC, file))).convert('RGB'), 16 / 10, fy)
    save(im, f'events/{name}.webp', 1200)
    save(im, f'events/{name}-sm.webp', 640, 74)
