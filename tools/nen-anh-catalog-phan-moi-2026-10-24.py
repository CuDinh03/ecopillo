"""Đưa ảnh 5 phần mới lấy từ catalog Ecopillo 22.07.2026 lên web (owner chọn 1A, 2A, 3B, 4B, 5B ngày 24/10/2026).
Chạy từ gốc project, sau khi đã có ảnh trích cho mẫu:
  python3 tools/trich-anh-catalog-mau-2026-10-24.py      # trích từ PDF vào docs/de-xuat-phan-moi-catalog/anh/
  python3 -I tools/nen-anh-catalog-phan-moi-2026-10-24.py docs/de-xuat-phan-moi-catalog/anh public/images
Ảnh báo "Doanh nghiệp & Cộng đồng" bản đầy đủ in chữ chất liệu cũ: web chỉ dùng logo tờ báo, không dùng ảnh chụp bài."""
import os
import sys

from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]

# (ảnh trích, thư mục/tên trên web, cạnh dài các bản cần có: '' = bản lớn, '-sm' = bản nhỏ)
JOBS = [
    # Giấy chứng nhận: bản nhỏ cho thẻ, bản lớn khi bấm xem
    *[(name, f'certificates/{name}', {'': 900, '-sm': 420}) for name in (
        'chung-nhan-iso-9001-2015',
        'chung-nhan-tqc-qcvn-01-2017-bct',
        'chung-nhan-top-10-thuong-hieu-2025',
        'ghi-nhan-tam-long-vang-chu-thap-do-ha-tinh',
        'ghi-nhan-tam-long-vang-chu-a-gia-lai',
        'ky-niem-chuong-tinh-hoa-dat-viet',
        'chung-nhan-ket-noi-doanh-nhan-tam-tai',
    )],
    # Logo đối tác (nền trong suốt) và logo tờ báo
    *[(f'logo-{name}', f'partners/{name}', {'': 400}) for name in (
        'may-10', 'flc-biscom', 'flamingo-resorts', 'dbv-insurance',
        'hacinco-hotel', 'cherry-hotel', 'dao-thuy-harry-hotel', 'doson-resort-hotel',
    )],
    *[(f'logo-{name}', f'press/{name}', {'': 500}) for name in (
        'hoi-chu-thap-do', 'doanh-nghiep-cong-dong', 'vedsu', 'bao-chi-viet', 'tin-nong-showbiz',
    )],
    ('ban-do-phan-phoi', 'distribution/ban-do-phan-phoi', {'': 900}),
    ('do-vai-khan-cotton', 'hotel/khan-cotton', {'': 800, '-sm': 480}),
]

for src_name, dst_name, sizes in JOBS:
    im = Image.open(os.path.join(SRC, f'{src_name}.webp'))
    for suffix, longest in sizes.items():
        out = im.copy()
        out.thumbnail((longest, longest), Image.LANCZOS)
        dst = os.path.join(OUT, f'{dst_name}{suffix}.webp')
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        out.save(dst, 'WEBP', quality=82, method=6)
        print(f'{dst_name}{suffix}.webp {out.size[0]}x{out.size[1]} {os.path.getsize(dst) // 1024} KB')
