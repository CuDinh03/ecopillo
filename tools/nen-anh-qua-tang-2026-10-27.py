"""Nén ảnh quà tặng Ecopillo (ảnh khách gửi 27/10/2026, tin "Phần này là quà tặng") sang webp cho trang Quà tặng và sự kiện.
Chạy từ gốc project: python3 -I tools/nen-anh-qua-tang-2026-10-27.py images public/images
Ảnh gốc trong images/ không lên git; tên file ảnh gốc bắt đầu bằng dấu thời gian Zalo. Ảnh gốc đều vuông."""
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
    print(f'{rel:40s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst)//1024} KB')

# Giữ khung vuông như ảnh gốc; ô trên web cắt bằng object-fit
GIFTS = {
    'goi-qua-tet-doanh-nghiep': '1792907050149',  # ảnh quảng cáo "Gói quà Tết cho doanh nghiệp, giá chỉ từ 99K"
    'qua-tang-vtv3': '1792907050173',             # cầm hộp quà ở sảnh VTV, thư "đồng hành cùng VTV3"
    'tui-qua': '1792907050189',                   # túi quà xếp trong cốp xe
    'qua-tang-pickleball': '1792907050202',       # giải VTV3 Pickleball "30 Years of Excellence"
    'hop-qua-xep-chong': '1792907050213',         # hộp quà xếp chồng, có thư VTV3
    'trao-qua-showroom-1': '1792907050230',       # trao quà tại phòng trưng bày (chưa rõ đơn vị nhận)
    'trao-qua-showroom-2': '1792907050238',
}
for name, key in GIFTS.items():
    im = load(key)
    save(im, f'qua-tang/{name}.webp', 1000)
    save(im, f'qua-tang/{name}-sm.webp', 520, 74)
