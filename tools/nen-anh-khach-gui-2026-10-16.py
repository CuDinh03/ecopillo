"""Nén ảnh khách gửi (16/10/2026) sang webp cho web.
Chạy từ gốc project: python3 -I tools/nen-anh-khach-gui-2026-10-16.py images public/images
Ảnh gốc trong images/ không lên git; tên file ảnh gốc bắt đầu bằng dấu thời gian Zalo."""
import sys, os, glob
from PIL import Image, ImageOps

SRC, OUT = sys.argv[1], sys.argv[2]

def load(key):
    path = glob.glob(os.path.join(SRC, key + '*'))
    assert len(path) == 1, (key, path)
    return ImageOps.exif_transpose(Image.open(path[0])).convert('RGB')

def save(im, rel, width, quality=78):
    im = im.copy()
    # Giới hạn theo cạnh dài: ảnh dọc chụp điện thoại không được cao quá cỡ ảnh ngang
    scale = width / max(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    dst = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, 'WEBP', quality=quality, method=6)
    print(f'{rel:42s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst)//1024} KB')

def crop_frac(im, l, t, r, b):
    w, h = im.size
    return im.crop((round(w * l), round(h * t), round(w * r), round(h * b)))

# Ô "Đường may 4 mũi/cm" (mục 7): mép chăn ED25, cắt bỏ logo góc trên trái và nhãn "ED25" góc dưới phải
dm = crop_frac(load('1792126765039'), 0.20, 0.13, 0.86, 0.80)
save(dm, 'details/duong-may-ed25.webp', 900)

# Ô "Dệt Jacquard" (mục 8): ga phủ ES06, cắt bỏ nhãn tròn "ES 06" góc dưới trái
jq = crop_frac(Image.open(glob.glob(os.path.join(SRC, '*Eco Sweet ES06*'))[0]).convert('RGB'), 0.18, 0.10, 0.98, 0.78)
save(jq, 'details/jacquard-es06.webp', 900)

# Văn phòng, chi nhánh, đại lý (mục 14–23). Ảnh đầu là ảnh đại diện.
# Thẻ đại lý chỉ cần bản 640px; bản 1200px chỉ cho thẻ văn phòng, chi nhánh ở trang chủ (ảnh rộng nửa trang).
STORES = {
    'ha-noi': ['1792123816367'],
    'tp-hcm': ['1792121434579'],
    'phu-ly': ['1792122792313', '1792122792293'],
    'quoc-oai': ['1792122815012', '1792122833477'],
    'nguyen-hue': ['1792122970851', '1792122970829'],
    'da-nang': ['1792123323412', '1792123278728', '1792123278703'],
    'quy-nhon': ['1792123497791'],
    'quyet-huong': ['1792123697330'],
    'thu-vu': ['1792122685042'],
}
WIDE = {'ha-noi', 'tp-hcm'}
for sid, keys in STORES.items():
    for i, k in enumerate(keys, 1):
        im = load(k)
        if sid in WIDE:
            save(im, f'stores/{sid}-{i}.webp', 1200)
        save(im, f'stores/{sid}-{i}-sm.webp', 640, 74)
