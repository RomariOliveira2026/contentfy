"""Regenerate ContentFy favicons: transparent bg + enlarged owl mark."""

from __future__ import annotations

import io
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1] / "client" / "public"
REPO = ROOT.parents[1]


def load_source() -> Image.Image:
    """Prefer git HEAD original so re-runs stay consistent."""
    try:
        raw = subprocess.check_output(
            ["git", "-C", str(REPO), "show", "HEAD:client/public/favicon.png"]
        )
        return Image.open(io.BytesIO(raw)).convert("RGBA")
    except Exception:
        return Image.open(ROOT / "favicon.png").convert("RGBA")


def remove_dark_background(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.int16)
    alpha = arr[:, :, 3].astype(np.int16)
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)

    # Flat dark plate behind the owl (keeps metallic body + orange accents)
    is_bg_color = (lum <= 22) & (sat <= 14)

    visited = np.zeros((h, w), dtype=bool)
    stack: list[tuple[int, int]] = []
    for x in range(w):
        stack.append((0, x))
        stack.append((h - 1, x))
    for y in range(h):
        stack.append((y, 0))
        stack.append((y, w - 1))

    while stack:
        y, x = stack.pop()
        if y < 0 or y >= h or x < 0 or x >= w or visited[y, x]:
            continue
        if not is_bg_color[y, x] and alpha[y, x] > 40:
            continue
        visited[y, x] = True
        arr[y, x, 3] = 0
        stack.extend([(y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)])

    return Image.fromarray(arr, "RGBA")


def content_bbox(im: Image.Image, pad: int = 1) -> tuple[int, int, int, int]:
    arr = np.array(im)
    ys, xs = np.where(arr[:, :, 3] > 16)
    if len(xs) == 0:
        raise RuntimeError("No content found after background removal")
    h, w = arr.shape[:2]
    x0 = max(0, int(xs.min()) - pad)
    x1 = min(w - 1, int(xs.max()) + pad)
    y0 = max(0, int(ys.min()) - pad)
    y1 = min(h - 1, int(ys.max()) + pad)
    return x0, y0, x1 + 1, y1 + 1


def square_crop_head(im: Image.Image) -> Image.Image:
    """
    Crop a tight square around the upper body/head so the owl fills favicon space.
    Favicons read better with the face than the full tall silhouette.
    """
    x0, y0, x1, y1 = content_bbox(im)
    content = im.crop((x0, y0, x1, y1))
    cw, ch = content.size

    # Prefer upper ~78% of the silhouette (head + eyes + upper chest)
    head_h = max(1, int(ch * 0.78))
    head = content.crop((0, 0, cw, head_h))
    hw, hh = head.size

    side = max(hw, hh)
    # Minimal breathing room so edges don't clip anti-alias
    side = int(side * 1.02)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ox = (side - hw) // 2
    oy = (side - hh) // 2
    canvas.paste(head, (ox, oy), head)
    return canvas


def fit_square(img: Image.Image, size: int, fill_ratio: float = 0.98) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    max_side = max(1, int(size * fill_ratio))
    cw, ch = img.size
    scale = min(max_side / cw, max_side / ch)
    nw = max(1, int(round(cw * scale)))
    nh = max(1, int(round(ch * scale)))
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    if size <= 48:
        resized = resized.filter(
            ImageFilter.UnsharpMask(radius=0.55, percent=140, threshold=2)
        )
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def main() -> None:
    source = load_source()
    cleaned = remove_dark_background(source)
    mark = square_crop_head(cleaned)
    print(f"mark size={mark.size}")

    targets = {
        "favicon.png": (512, 0.98, False),
        "favicon-192.png": (192, 0.98, False),
        "favicon-48.png": (48, 0.99, False),
        "favicon-32.png": (32, 0.99, False),
        "apple-touch-icon.png": (180, 0.90, True),
    }

    for name, (size, fill, opaque) in targets.items():
        icon = fit_square(mark, size, fill_ratio=fill)
        out_path = ROOT / name
        if opaque:
            bg = Image.new("RGBA", (size, size), (7, 11, 18, 255))
            bg.paste(icon, (0, 0), icon)
            bg.save(out_path, format="PNG", optimize=True)
        else:
            icon.save(out_path, format="PNG", optimize=True)
        print(f"wrote {name}")

    ico16 = fit_square(mark, 16, 0.99)
    ico32 = fit_square(mark, 32, 0.99)
    ico48 = fit_square(mark, 48, 0.99)
    ico16.save(
        ROOT / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[ico32, ico48],
    )
    print("wrote favicon.ico")

    # Magenta proof (dev only — deleted after inspect if desired)
    proof = Image.new("RGBA", (256, 256), (255, 0, 255, 255))
    p = fit_square(mark, 256, 0.98)
    proof.paste(p, (0, 0), p)
    proof.save(ROOT / "__favicon-preview-256.png")

    for name in ("favicon-32.png", "favicon-48.png", "favicon.png"):
        v = np.array(Image.open(ROOT / name).convert("RGBA"))
        print(
            name,
            "transparent%",
            round(100 * (v[:, :, 3] < 10).mean(), 1),
            "corner",
            tuple(int(x) for x in v[0, 0]),
        )


if __name__ == "__main__":
    main()
