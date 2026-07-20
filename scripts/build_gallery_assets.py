#!/usr/bin/env python3
"""Build lightweight WebP gallery derivatives and a deterministic manifest."""

from __future__ import annotations

import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageOps


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_ROOT = PROJECT_ROOT / "assets" / "gallery-optimized"
SOURCE_ROOTS = {
    "freshman": Path("/Users/etornam/Desktop/Freshman Year"),
    "sophomore": Path("/Users/etornam/Desktop/Sophomore Year"),
    "junior": Path("/Users/etornam/Desktop/Junior Year"),
}
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".jfif", ".heic"}
PREVIEW_MAX = 800
LARGE_MAX = 1920


def file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def unique_sources(root: Path) -> list[tuple[Path, str]]:
    seen: set[str] = set()
    results: list[tuple[Path, str]] = []
    for path in sorted(root.rglob("*"), key=lambda item: item.as_posix().lower()):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        digest = file_hash(path)
        if digest in seen:
            continue
        seen.add(digest)
        results.append((path, digest))
    return results


def load_oriented_rgb(path: Path) -> Image.Image:
    if path.suffix.lower() == ".heic":
        with tempfile.TemporaryDirectory(prefix="gallery-heic-") as temporary_dir:
            subprocess.run(
                ["qlmanage", "-t", "-s", str(LARGE_MAX), "-o", temporary_dir, str(path)],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            converted_path = next(Path(temporary_dir).glob("*.png"))
            with Image.open(converted_path) as opened:
                oriented = ImageOps.exif_transpose(opened)
                background = Image.new("RGB", oriented.size, "white")
                if "A" in oriented.getbands():
                    background.paste(oriented, mask=oriented.getchannel("A"))
                    return background
                return oriented.convert("RGB")

    with Image.open(path) as opened:
        oriented = ImageOps.exif_transpose(opened)
        if oriented.mode in {"RGBA", "LA"}:
            background = Image.new("RGB", oriented.size, "white")
            background.paste(oriented, mask=oriented.getchannel("A"))
            return background
        return oriented.convert("RGB")


def derivative(image: Image.Image, max_edge: int) -> Image.Image:
    resized = image.copy()
    resized.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    return resized


def build() -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, list[dict[str, object]]] = {}
    completed = 0

    for year, source_root in SOURCE_ROOTS.items():
        preview_dir = OUTPUT_ROOT / year / "preview"
        large_dir = OUTPUT_ROOT / year / "large"
        preview_dir.mkdir(parents=True, exist_ok=True)
        large_dir.mkdir(parents=True, exist_ok=True)
        entries: list[dict[str, object]] = []

        for index, (source_path, digest) in enumerate(unique_sources(source_root), 1):
            asset_id = f"{year}-{index:03d}"
            preview_path = preview_dir / f"{asset_id}.webp"
            large_path = large_dir / f"{asset_id}.webp"

            image = load_oriented_rgb(source_path)
            preview = derivative(image, PREVIEW_MAX)
            large = derivative(image, LARGE_MAX)
            preview.save(preview_path, "WEBP", quality=80, method=6)
            large.save(large_path, "WEBP", quality=84, method=6)

            entries.append(
                {
                    "id": asset_id,
                    "source_name": source_path.name,
                    "sha256": digest,
                    "preview": preview_path.relative_to(PROJECT_ROOT).as_posix(),
                    "large": large_path.relative_to(PROJECT_ROOT).as_posix(),
                    "preview_width": preview.width,
                    "preview_height": preview.height,
                    "large_width": large.width,
                    "large_height": large.height,
                }
            )
            completed += 1
            if completed % 10 == 0:
                print(f"Optimized {completed} photos...", flush=True)

        manifest[year] = entries

    manifest_path = OUTPUT_ROOT / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Built {completed} photos at {OUTPUT_ROOT}", flush=True)


if __name__ == "__main__":
    build()
