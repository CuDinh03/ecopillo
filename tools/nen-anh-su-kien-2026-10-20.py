"""Nén ảnh sự kiện Ecopillo đồng hành (mục 35, ảnh khách gửi 16/10/2026) sang webp cho web.
Chạy từ gốc project: python3 -I tools/nen-anh-su-kien-2026-10-20.py images public/images
Ảnh gốc trong images/ không lên git; tên file ảnh gốc bắt đầu bằng dấu thời gian Zalo."""
import sys, os, glob
from PIL import Image, ImageOps

SRC, OUT = sys.argv[1], sys.argv[2]

def load(key):
    path = glob.glob(os.path.join(SRC, key + '*'))
    assert len(path) == 1, (key, path)
    return ImageOps.exif_transpose(Image.open(path[0])).convert('RGB')

def crop_ratio(im, ratio, focus_y=0.5):
    """Cắt về tỉ lệ rộng/cao `ratio`, giữ giữa theo chiều ngang, theo `focus_y` theo chiều dọc."""
    w, h = im.size
    if w / h > ratio:
        nw = round(h * ratio)
        left = (w - nw) // 2
        return im.crop((left, 0, left + nw, h))
    nh = round(w / ratio)
    top = round((h - nh) * focus_y)
    return im.crop((0, top, w, top + nh))

def save(im, rel, width, quality=78):
    im = im.copy()
    scale = width / im.width
    if scale < 1:
        im = im.resize((width, round(im.height * scale)), Image.LANCZOS)
    dst = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, 'WEBP', quality=quality, method=6)
    print(f'{rel:36s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst)//1024} KB')

# Mỗi ảnh cắt khung 4:5 (thẻ dọc); focus_y chọn để giữ mặt người và chữ trên băng rôn.
# Owner chỉ đưa sự kiện đọc được tên (20/10/2026). Ảnh sự kiện chưa rõ tên, chờ Ecopillo đặt tên rồi mới thêm:
#   trẻ em vùng cao nhận quà '1792136159954' (0.55); gian hàng hội nghị thảm đỏ '1792136159879' (0.6);
#   gian hàng áo polo trắng '1792136348499' (0.6, kèm tin nhắn mục 34).
EVENTS = {
    'vtv3-pickleball': ('1792136159989', 0.0),   # băng rôn "VTV3 Pickleball 30 Years of Excellence"
    'vtv3-sinh-nhat': ('1792136160026', 0.55),   # phông "VTV3 Multi-platform", hoa chúc mừng
    'esg-dan-tri': ('1792136159900', 0.3),       # hội thảo "Thực thi ESG bằng AI", TP.HCM 14/08/2025
}
for name, (key, fy) in EVENTS.items():
    im = crop_ratio(load(key), 4 / 5, fy)
    save(im, f'events/{name}.webp', 960)
    save(im, f'events/{name}-sm.webp', 480, 74)

# Ảnh ngang cho khối nổi bật (16:10)
WIDE = {
    'chan-am-yeu-thuong-ngang': ('1792121601059', 0.5),
    'vtv3-pickleball-ngang': ('1792136159989', 0.2),
}
for name, (key, fy) in WIDE.items():
    im = crop_ratio(load(key), 16 / 10, fy)
    save(im, f'events/{name}.webp', 1200)
    save(im, f'events/{name}-sm.webp', 640, 74)
