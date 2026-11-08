"""Nén ảnh dãy chi tiết từ web cũ sang public/images/patterns/<MÃ>-<n>.webp (+ -sm).

Nguồn: images/web-cu-anh-mau/<MÃ>/NN.<đuôi> (đã tải bằng Playwright, không lên git).
Ảnh trùng ảnh chính <MÃ>.webp đã có trên web mới (thường là 01) → bỏ qua.
Tên file ra chỉ gồm mã + số thứ tự (nguồn đặt tên NN.jpg), không mang chữ chất liệu cũ.
In ra _gallery-counts.json trong thư mục ra: chuyển file đó ra ngoài public/ rồi chép số vào
PATTERN_GALLERY_COUNTS (src/data/catalog.ts). Xem lại ảnh bằng mắt: web cũ có trang gắn nhầm dãy ảnh mẫu khác
(trang EF12 mang ảnh EF16, 05/11/2026).

Chạy từ gốc project:
  python3 -I tools/nen-anh-mau-chi-tiet-2026-11-05.py images/web-cu-anh-mau public/images/patterns
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else 'images/web-cu-anh-mau')
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else 'public/images/patterns')
# So sánh ảnh 01 với ảnh chính: nếu gần giống thì bỏ 01
MAIN_DIR = OUT
# Mã mẫu (ER08) hoặc khoá ảnh chăn hè (chan-he-ER09), khớp imageKey trong catalog.ts
CODE_RE = re.compile(r'^(?:chan-he-)?[A-Z]{2}\d+$')


def perceptual_hash(im: Image.Image, size: int = 16) -> list[bool]:
    """dHash 16×16 = 256 bit: so độ sáng từng điểm với điểm bên phải."""
    g = im.convert('L').resize((size + 1, size), Image.LANCZOS)
    px = list(g.getdata())
    return [px[r * (size + 1) + c] > px[r * (size + 1) + c + 1] for r in range(size) for c in range(size)]


def hamming(a: list[bool], b: list[bool]) -> int:
    return sum(x != y for x, y in zip(a, b))


# Ảnh khác hẳn nhau lệch ~100–140/256 bit; ảnh trùng ảnh chính (chỉ khác cỡ, nén) lệch dưới 10.
# Ngưỡng 70 bắt cả bản cắt lệch nhẹ hoặc đổi nền (đo 05/11/2026: ED25 18, ER49 52, EV01 61; ảnh khác thấp nhất 92).
DUPLICATE_BITS = 70


def load_rgb(path: Path) -> Image.Image:
    return ImageOps.exif_transpose(Image.open(path)).convert('RGB')


def save_webp(im: Image.Image, rel: str, width: int, quality: int = 78) -> int:
    im = im.copy()
    if im.width > width:
        scale = width / im.width
        im = im.resize((width, round(im.height * scale)), Image.LANCZOS)
    dst = OUT / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, 'WEBP', quality=quality, method=6)
    return dst.stat().st_size


def main() -> None:
    summary: dict[str, list[str]] = {}
    total_bytes = 0
    for code_dir in sorted(p for p in SRC.iterdir() if p.is_dir() and CODE_RE.match(p.name)):
        code = code_dir.name
        files = sorted(
            f for f in code_dir.iterdir() if f.is_file() and f.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'}
        )
        if len(files) < 2:
            continue

        main_path = MAIN_DIR / f'{code}.webp'
        main_hash = perceptual_hash(load_rgb(main_path)) if main_path.exists() else None

        # Ảnh phụ: bỏ ảnh trùng ảnh chính (thường là 01)
        kept: list[Path] = []
        for f in files:
            im = load_rgb(f)
            if main_hash and hamming(perceptual_hash(im), main_hash) <= DUPLICATE_BITS:
                continue
            kept.append(f)

        if not kept:
            continue

        # Đánh số lại từ 2 (1 = ảnh chính đã có). Giữ tối đa 8 ảnh phụ để khỏi phình ổ.
        out_names: list[str] = []
        for i, f in enumerate(kept[:8], start=2):
            im = load_rgb(f)
            name = f'{code}-{i}.webp'
            name_sm = f'{code}-{i}-sm.webp'
            total_bytes += save_webp(im, name, 1600, 78)
            total_bytes += save_webp(im, name_sm, 640, 74)
            out_names.append(name)
            print(f'{name:20s} từ {f.name}')

        summary[code] = out_names

    meta = OUT / '_gallery-counts.json'
    # Ghi số ảnh phụ theo mã (để catalog đọc hoặc đối chiếu)
    counts = {code: len(names) for code, names in summary.items()}
    meta.write_text(json.dumps(counts, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'--- {len(summary)} mẫu, {sum(counts.values())} ảnh phụ, {total_bytes // 1024} KB')


if __name__ == '__main__':
    main()
