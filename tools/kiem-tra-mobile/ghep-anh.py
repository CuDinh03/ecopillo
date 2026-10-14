"""Ghép ảnh chụp khung-390-*.png thành tấm 3 ảnh/tấm để xem nhanh.

    python3 tools/kiem-tra-mobile/ghep-anh.py /duong/dan/thu-muc-ra

Cần Pillow (máy đã có). Ra: tam-00.jpg, tam-01.jpg… trong cùng thư mục.
"""
import glob
import os
import sys

from PIL import Image

out_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
WIDTH = 520
files = sorted(glob.glob(os.path.join(out_dir, 'khung-390-*.png')))
thumbs = []
for path in files:
    im = Image.open(path).convert('RGB')
    thumbs.append(im.resize((WIDTH, int(im.height * WIDTH / im.width)), Image.LANCZOS))

for start in range(0, len(thumbs), 3):
    group = thumbs[start:start + 3]
    sheet = Image.new('RGB', (WIDTH * 3 + 40, max(t.height for t in group)), 'white')
    for i, thumb in enumerate(group):
        sheet.paste(thumb, (i * (WIDTH + 20), 0))
    sheet.save(os.path.join(out_dir, f'tam-{start // 3:02d}.jpg'), quality=82)

print(f'{len(files)} ảnh → {(len(files) + 2) // 3} tấm trong {out_dir}')
