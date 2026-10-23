# -*- coding: utf-8 -*-
"""Nén ảnh hai đệm lấy từ web cũ (mục 42, Ecopillo trả lời 23/10/2026: giá, thông số, ảnh theo web cũ).
Chạy từ gốc project: python3 -I tools/nen-anh-dem-2026-10-23.py images/web-cu-dem public/images/products
Ảnh gốc trong images/ không lên git. Tên file web theo mã sản phẩm trong src/data/products.ts."""
import os
import sys

from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]

# Tên file gốc -> tên file web (không đuôi)
PHOTOS = {
    'Dem-lo-xo-tui-cao-cap-Eco-Luxe-scaled.jpg': 'dem-lo-xo-tui-cao-cap-eco-luxe',
    'Eco-Luxe-scaled.jpg': 'dem-lo-xo-tui-cao-cap-eco-luxe-2',
    'Dem-bong-nano-chan-foam-Ecopillo.jpg': 'dem-bong-nano-chan-foam',
    'Dem-bong-nano-chan-foam.jpg': 'dem-bong-nano-chan-foam-2',
}


def save(im: Image.Image, name: str, width: int) -> None:
    scale = width / max(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    dst = os.path.join(OUT, name)
    im.save(dst, 'WEBP', quality=78, method=6)
    print(f'{name:44s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst) // 1024} KB')


for src, name in PHOTOS.items():
    im = Image.open(os.path.join(SRC, src)).convert('RGB')
    save(im, f'{name}.webp', 1600)
    save(im, f'{name}-sm.webp', 640)
