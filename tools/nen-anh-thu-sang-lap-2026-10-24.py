"""Trích và nén 2 ảnh của thư "Chia sẻ từ người sáng lập" (trang 2 catalog Ecopillo 22.07.2026) sang webp.
Chạy từ gốc project: python3 -I tools/nen-anh-thu-sang-lap-2026-10-24.py "images/Ecopillo 22.07.2026.pdf" public/images/about
Owner chọn đặt 2 ảnh trong thư ở trang Về chúng tôi (24/10/2026). Cả hai là chương trình "Chăn ấm yêu thương", Cẩm Xuyên, 3/2025."""
import io, os, sys
import fitz
from PIL import Image

PDF, OUT = sys.argv[1], sys.argv[2]
# Thứ tự ảnh trên trang 2 của PDF → tên file trên web
NAMES = {0: 'thu-trao-qua-tan-nha', 1: 'thu-nhan-thu-cam-on'}
WIDTHS = {'': 1200, '-sm': 700}

page = fitz.open(PDF)[1]
images = page.get_images(full=True)
assert len(images) == 2, len(images)
for i, info in enumerate(images):
    raw = page.parent.extract_image(info[0])['image']
    im = Image.open(io.BytesIO(raw)).convert('RGB')
    for suffix, width in WIDTHS.items():
        out = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS) if im.width > width else im
        dst = os.path.join(OUT, f'{NAMES[i]}{suffix}.webp')
        out.save(dst, 'WEBP', quality=78, method=6)
        print(f'{dst} {out.size[0]}x{out.size[1]} {os.path.getsize(dst) // 1024} KB')
