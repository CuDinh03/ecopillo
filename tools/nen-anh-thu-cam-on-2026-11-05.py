"""Nén ảnh thư cảm ơn Ecopillo (khách gửi 05/11/2026) sang webp cho khối Tri ân trang chủ và trang Quà tặng.
Chạy từ gốc project: python3 -I tools/nen-anh-thu-cam-on-2026-11-05.py images public/images
Ảnh gốc trong images/ không lên git; tên file gốc bắt đầu bằng dấu thời gian Zalo."""
import sys, os, glob
from PIL import Image, ImageOps

SRC, OUT = sys.argv[1], sys.argv[2]

def load(key):
    path = glob.glob(os.path.join(SRC, key + '*'))
    assert len(path) == 1, (key, path)
    return ImageOps.exif_transpose(Image.open(path[0])).convert('RGB')

def save(im, rel, width, quality=78):
    im = im.copy()
    scale = width / im.width
    if scale < 1:
        im = im.resize((width, round(im.height * scale)), Image.LANCZOS)
    dst = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, 'WEBP', quality=quality, method=6)
    print(f'{rel:48s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst)//1024} KB')

CARDS = {
    'thu-cam-on-mat-truoc': '1793871046029',
    'thu-cam-on-mat-trong': '1793871111441',
}
for name, key in CARDS.items():
    im = load(key)
    save(im, f'thu-cam-on/{name}.webp', 1000)
    save(im, f'thu-cam-on/{name}-sm.webp', 520, 74)
