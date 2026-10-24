# Trích ảnh từ catalog Ecopillo 22.07.2026 cho mẫu "phần mới" (chứng chỉ, báo chí, đối tác, phân phối, đồ vải khách sạn).
# Chỉ đọc PDF, ghi vào docs/de-xuat-phan-moi-catalog/anh/ (không lên git). Chạy:
#   python3 tools/trich-anh-catalog-mau-2026-10-24.py
# Số xref lấy bằng cách dò từng trang 3, 4, 5, 6, 65 (PyMuPDF get_image_info). PDF đổi thì phải dò lại.
# Ảnh báo "Doanh nghiệp & Cộng đồng" (xref 2564) in sẵn chữ chất liệu cũ nên KHÔNG trích; chỉ dùng ảnh 2563 (lời chị Phương).
import io
import os

import fitz
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(ROOT, 'images', 'Ecopillo 22.07.2026.pdf')
OUT = os.path.join(ROOT, 'docs', 'de-xuat-phan-moi-catalog', 'anh')

# (xref, tên file, cạnh dài tối đa)
IMAGES = [
    # Trang 4: bảy giấy chứng nhận và cúp
    (2742, 'chung-nhan-top-10-thuong-hieu-2025', 900),
    (2736, 'chung-nhan-tqc-qcvn-01-2017-bct', 900),
    (2739, 'chung-nhan-iso-9001-2015', 900),
    (2741, 'ghi-nhan-tam-long-vang-chu-thap-do-ha-tinh', 900),
    (2743, 'ky-niem-chuong-tinh-hoa-dat-viet', 900),
    (2738, 'chung-nhan-ket-noi-doanh-nhan-tam-tai', 900),
    (2740, 'ghi-nhan-tam-long-vang-chu-a-gia-lai', 900),
    (2735, 'cup-top-10-thuong-hieu', 500),
    # Trang 5: tám logo đối tác (có lớp trong suốt)
    (2642, 'logo-may-10', 500),
    (2638, 'logo-flc-biscom', 500),
    (2640, 'logo-flamingo-resorts', 500),
    (2643, 'logo-dbv-insurance', 500),
    (2639, 'logo-hacinco-hotel', 500),
    (2641, 'logo-cherry-hotel', 500),
    (2644, 'logo-dao-thuy-harry-hotel', 500),
    (2637, 'logo-doson-resort-hotel', 500),
    # Trang 6: trích báo (ảnh chụp màn hình bài báo)
    (2547, 'bao-tin-nong-showbiz', 1400),
    (2548, 'bao-vedsu-top-10', 1400),
    (2546, 'bao-bao-chi-viet-1', 1400),
    (2549, 'bao-bao-chi-viet-2', 1400),
    (2563, 'bao-doanh-nghiep-cong-dong', 1400),
    (2545, 'bao-hoi-chu-thap-do', 1400),
    # Trang 65: đồ vải khách sạn
    (573, 'do-vai-phong-khach-san', 1400),
    (572, 'do-vai-khan-cotton', 800),
]


def load(doc: fitz.Document, xref: int) -> Image.Image:
    """Ảnh gốc kèm lớp trong suốt (SMask) nếu có"""
    base = fitz.Pixmap(doc, xref)
    if base.n - base.alpha > 3:
        base = fitz.Pixmap(fitz.csRGB, base)
    smask = doc.xref_get_key(xref, 'SMask')
    if smask[0] == 'xref':
        mask = fitz.Pixmap(doc, int(smask[1].split()[0]))
        base = fitz.Pixmap(base, mask)
    return Image.open(io.BytesIO(base.tobytes('png')))


def blur_region(im: Image.Image, page: fitz.Page, rect: fitz.Rect) -> Image.Image:
    """Làm nhoè một vùng (toạ độ PDF) trên ảnh chụp cả trang"""
    from PIL import ImageFilter

    scale = im.width / page.rect.width
    box = tuple(int(v * scale) for v in (rect.x0, rect.y0, rect.x1, rect.y1))
    out = im.copy()
    out.paste(im.crop(box).filter(ImageFilter.GaussianBlur(6)), box[:2])
    return out


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    doc = fitz.open(PDF)
    for xref, name, longest in IMAGES:
        im = load(doc, xref)
        im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
        if im.mode == 'RGBA':
            # Logo có viền trong suốt rộng: cắt sát để các logo cao bằng nhau khi xếp hàng
            box = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
            if box:
                im = im.crop(box)
        im.thumbnail((longest, longest), Image.LANCZOS)
        path = os.path.join(OUT, f'{name}.webp')
        im.save(path, 'WEBP', quality=82, method=6)
        print(f'{name}.webp {im.size[0]}x{im.size[1]} {os.path.getsize(path) // 1024} KB')
    # Trang 3: bản đồ phân phối là hình vẽ (không phải ảnh), chụp vùng bản đồ của trang
    page = doc[2]
    pix = page.get_pixmap(clip=fitz.Rect(348, 125, 595, 520), dpi=220)
    im = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
    im.thumbnail((900, 900), Image.LANCZOS)
    im.save(os.path.join(OUT, 'ban-do-phan-phoi.webp'), 'WEBP', quality=82, method=6)
    print('ban-do-phan-phoi.webp', im.size)
    # Ảnh nhỏ cả trang catalog để đặt cạnh mẫu (trang 6 có ảnh in chữ chất liệu cũ nên làm mờ vùng đó)
    for number in (3, 4, 5, 6, 65):
        pix = doc[number - 1].get_pixmap(dpi=80)
        im = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
        if number == 6:
            im = blur_region(im, doc[5], fitz.Rect(310, 280, 590, 360))
        im.save(os.path.join(ROOT, 'docs', 'de-xuat-phan-moi-catalog', f'catalog-trang-{number}.webp'), 'WEBP', quality=80)
    # Logo tờ báo: cắt từ góc ảnh chụp bài báo (toạ độ theo ảnh gốc)
    for xref, name, box in [
        (2546, 'logo-bao-chi-viet', (700, 20, 1257, 210)),
        (2547, 'logo-tin-nong-showbiz', (10, 15, 215, 110)),
        (2548, 'logo-vedsu', (25, 20, 280, 150)),
        (2563, 'logo-doanh-nghiep-cong-dong', (5, 15, 240, 80)),
        (2545, 'logo-hoi-chu-thap-do', (0, 15, 495, 130)),
    ]:
        im = load(doc, xref).convert('RGB').crop(box)
        im.save(os.path.join(OUT, f'{name}.webp'), 'WEBP', quality=88, method=6)
        print(f'{name}.webp', im.size)


if __name__ == '__main__':
    main()
