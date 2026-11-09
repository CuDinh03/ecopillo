# -*- coding: utf-8 -*-
"""Nén ảnh Đệm tròn cao cấp Ecopillo, tải từ trang sản phẩm web cũ
(/san-pham/dem-tron-cao-cap-ecopillo/, uploads 2024–2025) qua Chrome vì web cũ chặn curl.
Khách yêu cầu thêm sản phẩm này qua Zalo 09/11/2026 (anh Quang).
Chạy từ gốc project: python3 -I tools/nen-anh-dem-tron-2026-11-09.py <thư-mục-ảnh-gốc> public/images/products
Ảnh gốc không lên git. Tên file web theo mã sản phẩm trong src/data/products.ts."""
import os
import sys

from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]

# Tên file gốc trên web cũ -> tên file web (không đuôi)
PHOTOS = {
    # Ảnh chính: đệm tròn trong phòng, mặt chần trắng, viền xám có logo Ecopillo và nhãn Eco Luxe
    'Dem-tron-cao-cap-Ecopillo.jpg': 'dem-tron-cao-cap-ecopillo',
    # Góc nghiêng gần, thấy rõ ba lớp viền
    'Dem-tron-Eco-Luxe.jpg': 'dem-tron-cao-cap-ecopillo-2',
    # Mặt chần hoa văn lá, phòng rèm xám
    'Dem-tron-Ecopillo.jpg': 'dem-tron-cao-cap-ecopillo-3',
    'Dem-tron.jpg': 'dem-tron-cao-cap-ecopillo-4',
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
