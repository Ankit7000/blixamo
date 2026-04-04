#!/usr/bin/env python3
# Usage: python3 stamp-avatar.py <input_image> <slug>
# Stamps real Ankit avatar circle over the gray placeholder at bottom-center

import sys, os
from PIL import Image, ImageDraw, ImageFilter

if len(sys.argv) < 3:
    print("Usage: stamp-avatar.py <input_image> <slug>")
    sys.exit(1)

INPUT  = sys.argv[1]
SLUG   = sys.argv[2]
AVATAR = '/var/www/blixamo/public/images/ankit-avatar.jpg'
OUTDIR = f'/var/www/blixamo/public/images/posts/{SLUG}'
OUTPUT = f'{OUTDIR}/featured.png'

os.makedirs(OUTDIR, exist_ok=True)

# Load base image
base = Image.open(INPUT).convert('RGBA')
W, H = base.size
print(f"Base image: {W}x{H}")

# Avatar circle — find position
# The AI generates a gray circle at roughly bottom-center around y=590, x=560
# We stamp a 36px radius real avatar circle there
R = 36
AX = int(W * 0.455)  # ~546px on 1200px wide — matches "Ankit Sorathiya" text start
AY = int(H * 0.935)  # ~588px on 630px tall

# Load and crop avatar to square center crop
av = Image.open(AVATAR).convert('RGBA')
aw, ah = av.size
side = min(aw, ah)
left = (aw - side) // 2
top  = (ah - side) // 2
av = av.crop((left, top, left + side, top + side))
av = av.resize((R*2, R*2), Image.LANCZOS)

# Create circular mask
mask = Image.new('L', (R*2, R*2), 0)
ImageDraw.Draw(mask).ellipse((0, 0, R*2, R*2), fill=255)

# Apply mask to avatar
av_circle = Image.new('RGBA', (R*2, R*2), (0,0,0,0))
av_circle.paste(av, (0,0), mask)

# Draw white border ring around avatar
ring = Image.new('RGBA', (R*2+4, R*2+4), (0,0,0,0))
ImageDraw.Draw(ring).ellipse((0,0,R*2+3,R*2+3), outline=(255,255,255,60), width=2)

# Cover the gray placeholder circle first (paint dark circle)
overlay = Image.new('RGBA', base.size, (0,0,0,0))
ImageDraw.Draw(overlay).ellipse(
    (AX-R-4, AY-R-4, AX+R+4, AY+R+4),
    fill=(15, 15, 18, 255)
)
base = Image.alpha_composite(base, overlay)

# Paste ring then avatar
base.paste(ring, (AX-R-2, AY-R-2), ring)
base.paste(av_circle, (AX-R, AY-R), av_circle)

# Save as PNG
base = base.convert('RGB')
base.save(OUTPUT, 'PNG', quality=95)
print(f"Saved: {OUTPUT}")
