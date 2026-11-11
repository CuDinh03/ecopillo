# -*- coding: utf-8 -*-
"""Nén ảnh Chăn hè E-Cool Ecopillo, tải từ trang sản phẩm web cũ
(/san-pham/chan-he-e-cool-ecopillo/, uploads 2026/08) qua Chrome vì web cũ chặn curl.
Chị Phương (Zalo 11/11/2026): "C đang thấy thiếu chăn Ecool".
Chạy từ gốc project: python3 -I tools/nen-anh-chan-he-e-cool-2026-11-11.py <thư-mục-ảnh-gốc> public/images/products
Ảnh gốc không lên git. Tên file web theo mã sản phẩm trong src/data/products.ts."""
import os
import sys

from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]

# Tên file gốc trên web cũ -> tên file web (không đuôi)
PHOTOS = {
    # Ảnh chính: chăn xanh nhạt trải trên giường, nhìn thẳng
    'Chan-he-E-Cool-Ecopillo-scaled.jpg': 'chan-he-e-cool',
    # Góc nghiêng, phòng có cửa sổ
    'Chan-he-E-Cool-Ecopillo-2-scaled.jpg': 'chan-he-e-cool-2',
    # Người mẫu giũ chăn
    'Chan-he-E-Cool-Ecopillo-3-scaled.jpg': 'chan-he-e-cool-3',
    # Chăn gấp, thấy điểm chần
    'Chan-he-E-Cool-Ecopillo-4-scaled.jpg': 'chan-he-e-cool-4',
    # Chăn gấp cạnh túi đựng Ecopillo
    'Chan-he-E-Cool-Ecopillo-5-scaled.jpg': 'chan-he-e-cool-5',
}


def save(im: Image.Image, name: str, width: int) -> None:
    scale = width / max(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    dst = os.path.join(OUT, name)
    im.save(dst, 'WEBP', quality=78, method=6)
    print(f'{name:44s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst) // 1024} KB')


for source, name in PHOTOS.items():
    path = os.path.join(SRC, source)
    if not os.path.isfile(path):
        sys.exit(f'Không thấy {path}')
    im = Image.open(path).convert('RGB')
    save(im, f'{name}.webp', 1600)
    save(im, f'{name}-sm.webp', 640)
