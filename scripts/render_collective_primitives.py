#!/usr/bin/env python3
"""Render the four full-mesh collectives with Pillow; no external assets.

Requires Pillow >= 10. Run: python3 scripts/render_collective_primitives.py
S is the complete logical tensor size, including for AllToAll. Traffic is
bytes sent per rank; receives are equal and are not added a second time.
The destination-by-destination schedule is for exposition, not timing.
"""

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content" / "img"
W, H, SCALE = 1500, 1150, 2
BG = "#f3f5f9"
INK = "#172640"
MUTED = "#5c6b80"
LINE = "#dce3ec"
ROW = ["#3476cf", "#ba6827", "#198271", "#8a55bd"]
PALE = ["#e7effb", "#fff0df", "#e0f3ee", "#f1e9f9"]
FONT_DIR = Path("/System/Library/Fonts/Supplemental")
FONT_REG = FONT_DIR / "Arial.ttf"
FONT_BOLD = FONT_DIR / "Arial Bold.ttf"
if not FONT_REG.exists():
    FONT_REG = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
    FONT_BOLD = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")

FONTS = {}
PANELS = [(24, 90), (762, 90), (24, 618), (762, 618)]
PW, PH = 714, 508
CENTERS = [105, 273, 441, 609]
CW, CH = 26, 18
GRID_TOP, GRID_BOTTOM = 150, 332
NAMES = ["AllGather", "ReduceScatter", "AllReduce", "AllToAll"]
DESCRIPTIONS = [
    "Copy each row shard to every GPU.",
    "Sum matching rows; each GPU keeps one result row.",
    "ReduceScatter, then AllGather the reduced rows.",
    "Split each row; route each tile to its column owner.",
]
SHAPES = [
    "A[Bₓ, D]  →  A[B, D]",
    "A[B, D]{Uₓ}  →  A[Bₓ, D]",
    "A[B, D]{Uₓ}  →  A[B, D]",
    "A[Bₓ, D]  →  A[B, Dₓ]",
]
COSTS = [
    "Sent / GPU:  (S/P)(P − 1) = 3S/4",
    "Sent / GPU:  (S/P)(P − 1) = 3S/4",
    "Sent / GPU:  2(S/P)(P − 1) = 3S/2",
    "Sent / GPU:  (S/P²)(P − 1) = 3S/16",
]


def font(size, bold=False):
    key = (size, bold)
    if key not in FONTS:
        FONTS[key] = ImageFont.truetype(str(FONT_BOLD if bold else FONT_REG), size * SCALE)
    return FONTS[key]


def box(d, xy, fill, outline=None, radius=0, width=1):
    xy = tuple(int(v * SCALE) for v in xy)
    if radius:
        d.rounded_rectangle(xy, radius=radius * SCALE, fill=fill,
                            outline=outline, width=width * SCALE)
    else:
        d.rectangle(xy, fill=fill, outline=outline, width=width * SCALE)


def text(d, xy, value, size=18, color=INK, bold=False, center=False):
    x, y = xy
    f = font(size, bold)
    if center:
        x -= d.textlength(value, font=f) / (2 * SCALE)
    d.text((round(x * SCALE), round(y * SCALE)), value, font=f, fill=color)


def line(d, points, color=LINE, width=1):
    d.line([(round(x * SCALE), round(y * SCALE)) for x, y in points],
           fill=color, width=width * SCALE)


def cell(d, x, y, row, value, strong=False):
    box(d, (x, y, x + CW - 1, y + CH - 1), ROW[row] if strong else PALE[row],
        ROW[row], radius=2)
    text(d, (x + CW / 2 - .5, y + 1), str(value), 12,
         "#ffffff" if strong else ROW[row], bold=True, center=True)


def grid(d, x, y, cells):
    for r in range(4):
        for c in range(4):
            if (r, c) in cells:
                value, strong = cells[r, c]
                cell(d, x + c * CW, y + r * CH, r, value, strong)
            else:
                box(d, (x + c * CW, y + r * CH,
                        x + (c + 1) * CW - 1, y + (r + 1) * CH - 1),
                    "#f4f6f9", "#e4e9f0", radius=2)


def values(r):
    return ["ABCD"[r] + str(c) for c in range(4)]


def input_cells(op, gpu, phase):
    if op in (1, 2) and phase == 1:
        return {(r, c): (gpu + 1, False) for r in range(4) for c in range(4)}
    if op == 2:
        return {(gpu, c): (10, True) for c in range(4)}
    return {(gpu, c): (v, False) for c, v in enumerate(values(gpu))}


def output_cells(op, gpu, phase, completed):
    if op == 3:
        return {(r, gpu): (values(r)[gpu], False)
                for r in range(4) if r == gpu or gpu in completed}
    if op in (1, 2) and phase == 1:
        return {(gpu, c): (10 if gpu in completed else gpu + 1, gpu in completed)
                for c in range(4)}
    return {(r, c): (10 if op == 2 else values(r)[c], op == 2)
            for r in range(4) for c in range(4) if r == gpu or gpu in completed}


def arrow(d, start, end, color):
    line(d, [start, end], color, 2)
    dx, dy = end[0] - start[0], end[1] - start[1]
    length = math.hypot(dx, dy)
    ux, uy = dx / length, dy / length
    base = (end[0] - 9 * ux, end[1] - 9 * uy)
    p1 = (base[0] + 4 * uy, base[1] - 4 * ux)
    p2 = (base[0] - 4 * uy, base[1] + 4 * ux)
    d.polygon([(round(x * SCALE), round(y * SCALE)) for x, y in [end, p1, p2]], fill=color)


def state(t):
    # Four destination rounds, then a pause, then AllReduce's AllGather.
    if t < 1.8:
        return 1, -1, 0.0, set()
    if t < 7.8:
        u = (t - 1.8) / 1.5
        dest, frac = min(3, int(u)), u % 1
        return 1, dest, frac, set(range(dest + (1 if frac >= .84 else 0)))
    if t < 9.0:
        return 1, 4, 1.0, set(range(4))
    if t < 15.0:
        u = (t - 9.0) / 1.5
        dest, frac = min(3, int(u)), u % 1
        return 2, dest, frac, set(range(dest + (1 if frac >= .84 else 0)))
    return 2, 4, 1.0, set(range(4))


def transfer(d, px, py, op, phase, source, dest, progress):
    row = dest if op in (1, 2) and phase == 1 else source
    col = dest if op == 3 else 0
    width = CW if op == 3 else CW * 4
    sx = px + CENTERS[source] - CW * 2 + col * CW + width / 2
    sy = py + GRID_TOP + row * CH + CH / 2
    ex = px + CENTERS[dest] - CW * 2 + col * CW + width / 2
    ey = py + GRID_BOTTOM + row * CH + CH / 2
    arrow(d, (sx, sy), (ex, ey), ROW[row])
    # Hold briefly at the source and destination so the payload is readable.
    u = max(0, min(1, (progress - .10) / .68))
    u = u * u * (3 - 2 * u)
    x, y = sx + (ex - sx) * u - width / 2, sy + (ey - sy) * u - CH / 2
    box(d, (x - 3, y - 3, x + width + 2, y + CH + 2), "#ffffff", radius=4)
    for c in range(1 if op == 3 else 4):
        value = (source + 1 if op in (1, 2) and phase == 1 else
                 10 if op == 2 else values(row)[col + c])
        cell(d, x + c * CW, y, row, value, True)


def panel(d, op, t):
    px, py = PANELS[op]
    global_phase, dest, frac, completed = state(t)
    phase = global_phase if op == 2 else 1
    done = global_phase == 2 and op != 2 or dest == 4
    if global_phase == 2 and op != 2:
        completed = set(range(4))
    box(d, (px, py, px + PW, py + PH), "#ffffff", LINE, radius=18)
    text(d, (px + 22, py + 16), NAMES[op], 30, bold=True)
    text(d, (px + 22, py + 57), DESCRIPTIONS[op], 19)
    if t < 1.8:
        status = ["START  ·  one row per GPU", "START  ·  four full, unreduced tensors",
                  "START  ·  four full, unreduced tensors", "START  ·  one row per GPU"][op]
    elif done:
        status = ["DONE  ·  everyone has all rows", "DONE  ·  one summed row per GPU",
                  "DONE  ·  everyone has the full sum", "DONE  ·  one column per GPU"][op]
        if op == 2 and global_phase == 1:
            status = "1/2 COMPLETE  ·  reduced rows are ready to share"
    elif op == 2:
        status = ("1/2  REDUCESCATTER" if phase == 1 else "2/2  ALLGATHER") + "  ·  GPU " + str(dest) + " receives"
    else:
        status = "EXCHANGE  ·  GPU " + str(dest) + " receives from the other three"
    text(d, (px + 22, py + 90), status, 16, MUTED, bold=True)
    for g, cx in enumerate(CENTERS):
        active = not done and dest == g
        box(d, (px + cx - 67, py + 119, px + cx + 67, py + 412),
            "#fbfcfe", "#a5b7cf" if active else "#edf0f5", radius=9, width=2 if active else 1)
        text(d, (px + cx, py + 124), "GPU " + str(g), 16, bold=True, center=True)
        grid(d, px + cx - CW * 2, py + GRID_TOP, input_cells(op, g, phase))
        grid(d, px + cx - CW * 2, py + GRID_BOTTOM, output_cells(op, g, phase, completed))
    text(d, (px + 7, py + 176), "IN", 11, MUTED, bold=True)
    text(d, (px + 5, py + 358), "OUT", 11, MUTED, bold=True)
    moving = 0 <= dest < 4 and not done
    if moving:
        for s in range(4):
            if s != dest and frac < .84:
                transfer(d, px, py, op, phase, s, dest, frac)
        if frac >= .84:
            text(d, (px + CENTERS[dest], py + 267),
                 "1 + 2 + 3 + 4 = 10" if op in (1, 2) and phase == 1 else "received",
                 17, ROW[dest], bold=True, center=True)
    elif done:
        text(d, (px + PW / 2, py + 266),
             "1 + 2 + 3 + 4 = 10  (elementwise sum)" if op in (1, 2) else
             "Rows replicated; values unchanged" if op == 0 else
             "Tiles regrouped; values unchanged", 18, MUTED, center=True)
    else:
        text(d, (px + PW / 2, py + 266),
             "Local tiles stay on their GPU; only remote data travel.", 17, MUTED, center=True)
    text(d, (px + 22, py + 424), SHAPES[op], 20, bold=True)
    text(d, (px + 22, py + 463), COSTS[op], 21, bold=True)


def frame(t):
    im = Image.new("RGB", (W * SCALE, H * SCALE), BG)
    d = ImageDraw.Draw(im)
    text(d, (26, 19), "Four GPU collectives", 40, bold=True)
    for op in range(4):
        panel(d, op, t)
    return im.resize((W, H), Image.Resampling.LANCZOS)


def check_semantics():
    # Each source sends to exactly three peers. A row = S/4; a tile = S/16.
    assert len([(s, d) for s in range(4) for d in range(4) if s != d]) == 12
    for g in range(4):
        assert len(output_cells(0, g, 1, set(range(4)))) == 16
        assert len(output_cells(1, g, 1, set(range(4)))) == 4
        assert len(output_cells(2, g, 2, set(range(4)))) == 16
        assert len(output_cells(3, g, 1, set(range(4)))) == 4
        assert all(v == 10 for v, _ in output_cells(1, g, 1, set(range(4))).values())


def main():
    check_semantics()
    OUT.mkdir(exist_ok=True)
    # Shared palette avoids flicker; the static poster supplies every major color.
    poster = frame(16)
    poster.save(str(OUT / "collective-primitives.png"))
    palette = poster.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    schedule = [(0, 1800)]
    for begin in (1.8, 9.0):
        schedule.extend((begin + i / 12.0, 80 if i % 3 else 90) for i in range(72))
        if begin == 1.8:
            schedule.append((7.81, 1200))
    schedule.append((16, 3200))
    frames, durations = [], []
    for i, (t, duration) in enumerate(schedule):
        im = frame(t).quantize(palette=palette, dither=Image.Dither.NONE)
        frames.append(im)
        durations.append(duration)
        if i % 24 == 0:
            print("Rendered {}/{} frames".format(i + 1, len(schedule)), flush=True)
    target = OUT / "collective-primitives.gif"
    frames[0].save(str(target), save_all=True, append_images=frames[1:],
                   duration=durations, loop=0, optimize=True, disposal=1)
    # A contact sheet exposes key intermediate states for visual review.
    times = [0, 2.5, 5.5, 8, 11, 16]
    thumb_w, thumb_h = W // 3, H // 3
    contact = Image.new("RGB", (W, 2 * thumb_h), BG)
    for i, t in enumerate(times):
        small = frame(t).resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        contact.paste(small, ((i % 3) * thumb_w, (i // 3) * thumb_h))
    contact.save("/tmp/collective-primitives-contact.png")
    print("Saved {} ({:.2f} MB)".format(target, target.stat().st_size / 1e6))
    print("Duration: {:.2f} seconds".format(sum(durations) / 1000))


if __name__ == "__main__":
    main()
