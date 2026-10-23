# -*- coding: utf-8 -*-
"""Nén ảnh phòng khách sạn lấy từ web cũ (trang /danh-muc-san-pham/du-an-khach-san-nha-nghi/), Ecopillo chỉ định 23/10/2026
(mục 39: thay ảnh "hàng gia đình" đang dùng ở khối khách sạn).
Chạy từ gốc project: python3 -I tools/nen-anh-khach-san-2026-10-23.py images/web-cu-khach-san public/images/hotel
Ảnh gốc trong images/ không lên git. Mỗi ảnh gốc có logo Ecopillo ở giữa mép trên: cắt bỏ dải đó (logo đã có ở thanh đầu trang)."""
import os
import sys

from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]

# Tên file gốc -> (tên file web, phần bỏ ở mép trên theo tỉ lệ chiều cao)
PHOTOS = {
    'Chan-ga-goi-dem-khach-san-Ecopillo.jpg': ('phong-king-cua-kinh', 0.13),
    'Chan-ga-goi-khach-san.jpg': ('phong-king-den-long', 0.13),
    'Setup-chan-ga-goi-khach-san.jpg': ('phong-twin-ho-guom', 0.10),
    'Chan-ga-goi-khach-san-Ecopillo.jpg': ('phong-hai-giuong', 0.11),
}


def save(im: Image.Image, name: str, width: int) -> None:
    scale = width / im.width
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    dst = os.path.join(OUT, name)
    im.save(dst, 'WEBP', quality=78, method=6)
    print(f'{name:36s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst) // 1024} KB')


os.makedirs(OUT, exist_ok=True)
for src, (name, top) in PHOTOS.items():
    im = Image.open(os.path.join(SRC, src)).convert('RGB')
    im = im.crop((0, round(im.height * top), im.width, im.height))
    save(im, f'{name}.webp', 1600)
    save(im, f'{name}-sm.webp', 640)
