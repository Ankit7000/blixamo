#!/usr/bin/env python3
"""
Blixamo OG Image Processor
- Input:  /tmp/og_inbox/{slug}.png.jpeg  (raw Ideogram exports)
- Output: /var/www/blixamo/public/images/posts/{slug}/featured.png
- Steps:  1) Resize to 1200x630  2) Composite circular author avatar
          3) Compress to ~150KB PNG  4) Save to correct path
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

INBOX     = "/tmp/og_inbox"
OUT_BASE  = "/var/www/blixamo/public/images/posts"
AVATAR    = "/var/www/blixamo/public/images/ankit-avatar.jpg"
OG_W, OG_H = 1200, 630
AVATAR_SIZE = 36   # px diameter of circular avatar in final image
AVATAR_X  = 32     # distance from left bottom
AVATAR_Y  = OG_H - 22 - AVATAR_SIZE  # ~22px from bottom

def make_circle_avatar(avatar_path, size):
    """Crop center-square from avatar, resize, apply circular mask."""
    av = Image.open(avatar_path).convert("RGBA")
    w, h = av.size
    sq = min(w, h)
    left = (w - sq) // 2
    top  = (h - sq) // 2
    av = av.crop((left, top, left + sq, top + sq))
    av = av.resize((size, size), Image.LANCZOS)
    # circular mask
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    av.putalpha(mask)
    return av

def process_image(src_path, slug):
    img = Image.open(src_path).convert("RGB")
    # 1) resize to exact OG dimensions
    img = img.resize((OG_W, OG_H), Image.LANCZOS)
    # 2) composite circular avatar
    av = make_circle_avatar(AVATAR, AVATAR_SIZE)
    img_rgba = img.convert("RGBA")
    img_rgba.paste(av, (AVATAR_X, AVATAR_Y), av)
    img = img_rgba.convert("RGB")
    # 3) save compressed PNG
    out_dir = os.path.join(OUT_BASE, slug)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "featured.png")
    img.save(out_path, "PNG", optimize=True, compress_level=7)
    size_kb = os.path.getsize(out_path) // 1024
    print(f"  ✓ {slug} → {out_path} ({size_kb}KB)")
    return out_path

def main():
    files = sorted(f for f in os.listdir(INBOX) if f.endswith(".jpeg") or f.endswith(".jpg") or f.endswith(".png"))
    if not files:
        print("No files in inbox. Upload images to /tmp/og_inbox/ first.")
        sys.exit(1)
    print(f"Processing {len(files)} images...\n")
    ok, fail = 0, 0
    for f in files:
        # slug = filename minus extension(s) e.g. "build-telegram-bot.png.jpeg" -> "build-telegram-bot"
        slug = f.replace(".png.jpeg", "").replace(".jpeg", "").replace(".png", "")
        src = os.path.join(INBOX, f)
        try:
            process_image(src, slug)
            ok += 1
        except Exception as e:
            print(f"  ✗ {slug}: {e}")
            fail += 1
    print(f"\nDone: {ok} OK, {fail} failed")

if __name__ == "__main__":
    main()
