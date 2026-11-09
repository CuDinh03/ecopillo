# -*- coding: utf-8 -*-
"""Rút và nén ảnh sản phẩm từ bảng giá Ecopillo 2026 (PDF khách gửi 09/11/2026, thư mục "thông tin/", không lên git).
Chạy từ gốc project:
  python3 -I tools/nen-anh-bang-gia-2026-11-09.py "thông tin/Ecopillo 2026  Bảng giá in.pdf" public/images/products
Cần PyMuPDF (fitz) và Pillow. Số bên trái là mã ảnh (xref) trong PDF; ảnh có lớp trong suốt thì ghép lên nền trắng."""
import io
import os
import sys

import fitz
from PIL import Image

PDF, OUT = sys.argv[1], sys.argv[2]

# Mã ảnh trong PDF -> tên file web (không đuôi), theo mã sản phẩm trong src/data/products.ts
PHOTOS = {
    # Trang 3, đệm bông ép Mix Latex: cảnh phòng ngủ, chính diện, gập 2, cận mặt chần
    2226: 'dem-bong-ep-cao-cap-mix-latex',
    1250: 'dem-bong-ep-cao-cap-mix-latex-2',
    1248: 'dem-bong-ep-cao-cap-mix-latex-3',
    1249: 'dem-bong-ep-cao-cap-mix-latex-4',
    # Trang 21: tấm bảo vệ đệm chống thấm (dây thun 4 góc). Ảnh 1498 là topper, đã có ảnh từ web cũ
    1500: 'bao-ve-dem-chong-tham',
    # Trang 22, 23: ruột gối tựa, ruột gối ôm, ruột chăn Micro Plus
    1510: 'ruot-goi-tua',
    1523: 'ruot-goi-om',
    1524: 'ruot-chan-micro-plus',
}

# Khoảng trắng chừa quanh ảnh đã cắt sát (ảnh nền trong suốt), tính theo cạnh dài
PADDING = 0.06


def load(doc: fitz.Document, xref: int) -> Image.Image:
    """Ảnh RGB; có lớp trong suốt (smask) thì ghép lên nền trắng rồi cắt sát, chừa lề."""
    smask = next((im[1] for page in doc for im in page.get_images(full=True) if im[0] == xref), 0)
    im = Image.open(io.BytesIO(doc.extract_image(xref)['image'])).convert('RGB')
    if not smask:
        return im
    mask = Image.open(io.BytesIO(doc.extract_image(smask)['image'])).convert('L').resize(im.size)
    white = Image.new('RGB', im.size, 'white')
    white.paste(im, (0, 0), mask)
    left, top, right, bottom = mask.point(lambda v: 255 if v > 8 else 0).getbbox()
    pad = round(max(right - left, bottom - top) * PADDING)
    box = (max(left - pad, 0), max(top - pad, 0), min(right + pad, im.width), min(bottom + pad, im.height))
    return white.crop(box)


def save(im: Image.Image, name: str, width: int) -> None:
    scale = width / max(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    dst = os.path.join(OUT, name)
    im.save(dst, 'WEBP', quality=78, method=6)
    print(f'{name:44s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst) // 1024} KB')


doc = fitz.open(PDF)
for xref, name in PHOTOS.items():
    im = load(doc, xref)
    save(im, f'{name}.webp', 1600)
    save(im, f'{name}-sm.webp', 640)
