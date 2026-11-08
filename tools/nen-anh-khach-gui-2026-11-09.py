# -*- coding: utf-8 -*-
"""Nén ảnh Ecopillo gửi qua Zalo 08/11/2026 (owner lưu ở images/, tên file số 17941…).
Chạy từ gốc project: python3 -I tools/nen-anh-khach-gui-2026-11-09.py images public/images/products
Ảnh gốc trong images/ không lên git. Tên file web theo mã sản phẩm trong src/data/products.ts.
Không dùng: 1794130977956 (bảng giá Eco Fresh), 1794135637118 (bảng giá 2026),
1794130808395 (trùng cảnh với 1794131013374, đã làm ảnh chính divan)."""
import os
import sys

from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]

# Tiền tố số của file gốc -> tên file web (không đuôi)
PHOTOS = {
    # Đệm lò xo Eco Fresh: trong phòng, góc có logo, cận mặt chần, cận viền
    '1794130844383': 'dem-lo-xo-eco-fresh',
    '1794130850691': 'dem-lo-xo-eco-fresh-2',
    '1794130850687': 'dem-lo-xo-eco-fresh-3',
    '1794130850693': 'dem-lo-xo-eco-fresh-4',
    # Divan: cảnh phòng màu xám, rồi góc bọc đồng, bánh xe, mép, mặt vải
    '1794131013374': 'divan-ecopillo',
    '1794131013388': 'divan-ecopillo-2',
    '1794131013393': 'divan-ecopillo-3',
    '1794131013397': 'divan-ecopillo-4',
    '1794131013402': 'divan-ecopillo-5',
    # Divan 17 màu vải (Ecopillo chưa gửi tên màu)
    **{prefix: f'divan-ecopillo-mau-{i:02d}' for i, prefix in enumerate([
        '1794130808420', '1794130808437', '1794130808449', '1794130808460', '1794130808470', '1794130808480',
        '1794130808488', '1794130808495', '1794130808501', '1794130808507', '1794130808514', '1794130808520',
        '1794130808526', '1794130808533', '1794130808539', '1794130808545', '1794130808552',
    ], start=1)},
    # Chăn đông kiểu Hàn: mỗi mẫu một ảnh, mã in sẵn ở góc ảnh
    '1794135428748': 'chan-dong-kieu-han-ef18',
    '1794135428752': 'chan-dong-kieu-han-ev05',
    '1794135428756': 'chan-dong-kieu-han-ev06',
    '1794135428723': 'chan-dong-kieu-han-ef10',
    '1794135428738': 'chan-dong-kieu-han-er09',
    '1794135428744': 'chan-dong-kieu-han-er42',
    # Ruột gối bông PE
    '1794135382982': 'ruot-goi-bong-pe',
}


# Ảnh chụp màn hình còn dải tối mép phải: cắt (trái, trên, phải, dưới) trước khi nén
CROPS = {
    '1794130844383': (0, 0, 1136, 746),
}


def save(im: Image.Image, name: str, width: int) -> None:
    scale = width / max(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    dst = os.path.join(OUT, name)
    im.save(dst, 'WEBP', quality=78, method=6)
    print(f'{name:44s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst) // 1024} KB')


files = os.listdir(SRC)
for prefix, name in PHOTOS.items():
    matches = [f for f in files if f.startswith(prefix) and f.endswith('.jpg')]
    if len(matches) != 1:
        sys.exit(f'Không thấy đúng một file {prefix}*.jpg trong {SRC} (thấy {len(matches)})')
    im = Image.open(os.path.join(SRC, matches[0])).convert('RGB')
    if prefix in CROPS:
        im = im.crop(CROPS[prefix])
    save(im, f'{name}.webp', 1600)
    save(im, f'{name}-sm.webp', 640)
