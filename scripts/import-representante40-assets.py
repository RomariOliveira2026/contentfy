"""Import official Representante 4.0 assets into ContentFy as responsive WebP."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC_ROOT = Path(r"C:\Grupo O Especialista\representante-40-vendas")
OUT_DIR = Path(__file__).resolve().parents[1] / "client" / "public" / "products" / "representante40"

# Official raster assets only — skip SVG placeholders.
ASSETS = [
    (SRC_ROOT / "Mockup.png", "mockup-kit", 86, [640, 960, 1280, 1920]),
    (SRC_ROOT / "Capa do Manual Oficial.png", "cover-premium", 88, [400, 800, 1200]),
    (SRC_ROOT / "Capa do Manual.png", "cover-alt", 86, [400, 800]),
    (SRC_ROOT / "CRM.png", "livro-crm", 86, [640, 960, 1280]),
    (SRC_ROOT / "public" / "images" / "kit-hero.png", "kit-hero", 85, [480, 800]),
    (SRC_ROOT / "public" / "images" / "logo-representante-40.png", "logo", 90, [256, 512]),
]


def resolve_source(src: Path) -> Path | None:
    if src.exists():
        return src
    alt = SRC_ROOT / "public" / "images" / src.name
    if alt.exists():
        return alt
    return None


def to_rgb(im: Image.Image, keep_alpha: bool) -> Image.Image:
    if keep_alpha:
        return im.convert("RGBA") if im.mode != "RGBA" else im
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        rgba = im.convert("RGBA")
        bg = Image.new("RGB", rgba.size, (7, 11, 18))
        bg.paste(rgba, mask=rgba.split()[-1])
        return bg
    return im.convert("RGB")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for src, base, quality, widths in ASSETS:
        resolved = resolve_source(src)
        if not resolved:
            print("MISSING", src)
            continue

        raw = Image.open(resolved)
        im = to_rgb(raw, keep_alpha=(base == "logo"))
        w0, h0 = im.size
        print(f"{base}: source {w0}x{h0} from {resolved.name}")

        max_w = max(widths)
        primary = im.copy()
        if primary.width > max_w:
            ratio = max_w / primary.width
            primary = primary.resize(
                (max_w, int(primary.height * ratio)), Image.Resampling.LANCZOS
            )
        primary_path = OUT_DIR / f"{base}.webp"
        save_kwargs = {"quality": quality, "method": 6}
        if primary.mode == "RGBA":
            save_kwargs["lossless"] = False
        primary.save(primary_path, "WEBP", **save_kwargs)
        print(
            f"  -> {primary_path.name} ({primary.width}x{primary.height}, "
            f"{primary_path.stat().st_size // 1024}KB)"
        )

        for w in widths:
            if w > w0:
                continue
            variant = im.copy()
            if variant.width > w:
                ratio = w / variant.width
                variant = variant.resize(
                    (w, int(variant.height * ratio)), Image.Resampling.LANCZOS
                )
            path = OUT_DIR / f"{base}-{w}.webp"
            variant.save(path, "WEBP", **save_kwargs)
            print(
                f"  -> {path.name} ({variant.width}x{variant.height}, "
                f"{path.stat().st_size // 1024}KB)"
            )

    print("DONE")
    for p in sorted(OUT_DIR.glob("*.webp")):
        print(f"  {p.name:28} {p.stat().st_size / 1024:8.1f} KB")


if __name__ == "__main__":
    main()
