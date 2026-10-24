"""Nén lại ảnh bìa trang Giới thiệu (chị Phương tại VTV3) cho nhẹ hơn: LCP điện thoại đo 2,56s, ảnh này là phần tử LCP.
Chạy từ gốc project: python3 -I tools/nen-anh-bia-gioi-thieu-2026-10-24.py images/chi-phuong.jpg public/images/about
Giữ nguyên khung và kích thước cũ (1309×1250 và 800×764), chỉ hạ chất lượng nén 80 → 68 (so mắt thường không thấy khác)."""
import os
import sys

from PIL import Image, ImageOps

SRC, OUT = sys.argv[1], sys.argv[2]
src = ImageOps.exif_transpose(Image.open(SRC)).convert('RGB')
for name, width in (('chi-phuong', 1309), ('chi-phuong-sm', 800)):
    im = src.resize((width, round(src.height * width / src.width)), Image.LANCZOS) if src.width != width else src
    dst = os.path.join(OUT, f'{name}.webp')
    im.save(dst, 'WEBP', quality=68, method=6)
    print(f'{name}.webp {im.size[0]}x{im.size[1]} {os.path.getsize(dst) // 1024} KB')
