# -*- coding: utf-8 -*-
"""Nén 3 ảnh tấm bảo vệ đệm chống thấm chị Phương gửi Zalo 17/11/2026 (thay ảnh rút từ bảng giá PDF, bị kéo dãn ngang).
Ảnh gốc (PNG giải từ bộ nhớ đệm Zalo) ở images/bao-ve-dem-zalo-17-11/, không lên git.
Chạy từ gốc project:
  python3 -I tools/nen-anh-bao-ve-dem-2026-11-17.py images/bao-ve-dem-zalo-17-11 public/images/products
Cần Pillow. Giữ đúng tỉ lệ ảnh gốc, chỉ thu nhỏ."""
import os
import sys

from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]

# Ảnh gốc -> tên file web (không đuôi), theo src/data/products.ts (BAO_VE_DEM)
PHOTOS = {
    '1-tren-giuong.png': 'bao-ve-dem-chong-tham',
    '3-lat-tam.png': 'bao-ve-dem-chong-tham-2',
    '2-goc-thun.png': 'bao-ve-dem-chong-tham-3',
}

def save(im: Image.Image, name: str, width: int) -> None:
    scale = width / max(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    dst = os.path.join(OUT, name)
    im.save(dst, 'WEBP', quality=80, method=6)
    print(f'{name:36s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst) // 1024} KB')

for src, name in PHOTOS.items():
    im = Image.open(os.path.join(SRC, src)).convert('RGB')
    save(im, f'{name}.webp', 1600)
    save(im, f'{name}-sm.webp', 640)
