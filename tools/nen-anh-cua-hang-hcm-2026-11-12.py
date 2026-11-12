"""Nén ảnh khai trương chi nhánh TP. HCM (chị Phương gửi Zalo 12/11/2026: "Chổ hcm cho ảnh này cho đẹp") sang webp
cho thẻ cửa hàng trang chủ, trang Liên hệ và danh sách Hệ thống phân phối.
Chạy từ gốc project: python3 -I tools/nen-anh-cua-hang-hcm-2026-11-12.py "thông tin" public/images
Ảnh gốc trong "thông tin/" không lên git; tên file gốc bắt đầu bằng dấu thời gian Zalo."""
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

# Cùng cỡ với ảnh Hà Nội (1200w + 640w) để hai thẻ văn phòng nét như nhau
im = load('1794448952039')
save(im, 'stores/tp-hcm-1.webp', 1200, 70)
save(im, 'stores/tp-hcm-1-sm.webp', 640, 74)
