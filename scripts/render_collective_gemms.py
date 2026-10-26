#!/usr/bin/env python3
"""Animate four distinct tensor dataflows; requires Pillow >= 10.

Weight-column gather, output-tile ring reduction, input-row fan-in, and
receiver-pulled batch/sequence routing. Steps explain dependencies, not
hardware timing. The article is intentionally not modified.
"""
from pathlib import Path
import math
from PIL import Image, ImageDraw
from render_collective_primitives import BG, INK, LINE, MUTED, PALE, ROW, SCALE, arrow, box, line, text

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content" / "img"
W, H = 1440, 850
HEADER_SHIFT = 32
TITLES = ["AllGather → GEMM", "GEMM → ReduceScatter", "ReduceScatter → GEMM", "AllToAll → GEMM"]
DURATIONS = [4.0, 5.0, 5.0, 4.0]


def clamp(x):
    return min(1, max(0, x))


def label(d, xy, value, color=INK, size=18, center=False):
    text(d, xy, value, size, color, bold=True, center=center)


def tile(d, x, y, w, h, color, value, active=False, faint=False):
    fill = "#f3f5f8" if faint else color if active else PALE[ROW.index(color)]
    box(d, (x, y, x + w - 2, y + h - 2), fill, LINE if faint else color, radius=3)
    text(d, (x + w / 2 - 1, y + (h - 17) / 2 - 1), value, 14,
         "#99a4b3" if faint else "#ffffff" if active else color, bold=True, center=True)


def matrix(d, x, y, rows, cols, values, color_axis="row", highlight=None, cw=36, ch=29):
    for r in range(rows):
        for c in range(cols):
            color = ROW[(r if color_axis == "row" else c) % 4]
            value = values.get((r, c))
            tile(d, x + c * cw, y + r * ch, cw, ch, color,
                 "" if value is None else str(value),
                 active=highlight is not None and (r if color_axis == "row" else c) == highlight and value is not None,
                 faint=value is None)


def fixed_matrix(d, x, y, rows, cols, value, cw=36, ch=29):
    for r in range(rows):
        for c in range(cols):
            left, top = x + c * cw, y + r * ch
            box(d, (left, top, left + cw - 2, top + ch - 2), "#e9edf3", "#bac5d3", radius=3)
            text(d, (left + cw / 2 - 1, top + (ch - 17) / 2 - 1), value, 14, MUTED, bold=True, center=True)


def dashed_arrow(d, start, end, color):
    dx, dy = end[0] - start[0], end[1] - start[1]
    length = math.hypot(dx, dy)
    for s in range(0, int(length) - 10, 16):
        a, b = s / length, min(s + 8, length - 10) / length
        line(d, [(start[0] + dx * a, start[1] + dy * a),
                 (start[0] + dx * b, start[1] + dy * b)], color, 2)
    arrow(d, (end[0] - dx * 12 / length, end[1] - dy * 12 / length), end, color)


def packet(d, start, end, progress, value, color, w=112, h=27):
    u = clamp(progress)
    u = u * u * (3 - 2 * u)
    x = start[0] + (end[0] - start[0]) * u
    y = start[1] + (end[1] - start[1]) * u
    box(d, (x - w / 2 - 3, y - h / 2 - 3, x + w / 2 + 3, y + h / 2 + 3), "#ffffff", radius=5)
    box(d, (x - w / 2, y - h / 2, x + w / 2, y + h / 2), color, radius=4)
    text(d, (x, y - 10), value, 15, "#ffffff", bold=True, center=True)


def status(d, first):
    box(d, (48, 784, 1392, 840), "#edf2f9", radius=10)
    label(d, (67, 795), first, size=21)


def gemm_badge(d, x, y, message, progress):
    box(d, (x, y, x + 196, y + 61), "#fff4e8", ROW[1], radius=8)
    label(d, (x + 98, y + 8), message, ROW[1], 18, True)
    box(d, (x + 12, y + 44, x + 184, y + 49), "#ecd8c0", radius=2)
    if progress > 0:
        box(d, (x + 12, y + 44, x + 12 + 172 * clamp(progress), y + 49), ROW[1], radius=2)


def allgather_gemm(d, t):
    j = min(3, int(t))
    frac = t % 1 if t < 4 else 1
    for g, sx in enumerate([540, 865, 1190], 1):
        box(d, (sx - 104, 282, sx + 104, 391), "#fbfcfe", LINE, radius=8)
        label(d, (sx, 292), "GPU {} owns B{}".format(g, g), center=True)
        for r in range(4):
            tile(d, sx - 50, 325 + r * 12, 100, 12, ROW[g], "")
    box(d, (50, 440, 1390, 752), "#fbfcfe", LINE, radius=12)
    label(d, (72, 453), "GPU 0", size=20)
    label(d, (177, 504), "A local", center=True)
    fixed_matrix(d, 105, 541, 2, 4, "a", cw=36, ch=43)
    label(d, (293, 566), "×", size=32)
    label(d, (503, 497), "B cache", center=True)
    matrix(d, 431, 530, 4, 4, {(r, c): "b" + str(c) for r in range(4) for c in range(4) if c <= min(3, int(t))},
           color_axis="col", highlight=j if t < 4 else None)
    label(d, (177, 647), "[B_0, D]", center=True)
    label(d, (503, 668), "[D, F] — growing by columns", center=True)
    arrow(d, (615, 581), (702, 581), MUTED)
    gemm_badge(d, 710, 551, "GEMM C" + str(j) if t < 4 else "GEMM finished", frac)
    arrow(d, (918, 581), (998, 581), MUTED)
    label(d, (1134, 504), "C local", center=True)
    matrix(d, 1034, 541, 2, 4, {(r, c): "c" + str(c) for r in range(2) for c in range(4) if c < int(t)},
           color_axis="col", cw=50, ch=43)
    if t < 4:
        for r in range(2):
            box(d, (1034 + j * 50, 541 + r * 43, 1082 + j * 50, 582 + r * 43), None, ROW[j], radius=3, width=3)
    label(d, (1134, 647), "[B_0, F] — new columns", center=True)
    if j < 3 and t < 4:
        g = j + 1
        start, end = ([540, 865, 1190][g - 1], 390), (431 + g * 36 + 18, 522)
        arrow(d, start, end, ROW[g])
        packet(d, start, end, frac, "B{}: D × F{}".format(g, g), ROW[g])
    status(d, "Compute C{} from B{}{}".format(j, j, " while B{} arrives.".format(j + 1) if j < 3 and t < 4 else "."))


RING_POS = [(95, 295), (1010, 295), (1010, 584), (95, 584)]
RING_PATHS = [((426, 375), (1004, 375)), ((1173, 471), (1173, 578)),
              ((1004, 664), (426, 664)), ((258, 578), (258, 471))]


def ring_value(gpu, hop):
    return sum((gpu - k) % 4 + 1 for k in range(hop + 1))


def gemm_reducescatter(d, t):
    col = min(3, int(t))
    for g, (x, y) in enumerate(RING_POS):
        box(d, (x, y, x + 326, y + 176), "#fbfcfe", LINE, radius=10)
        label(d, (x + 15, y + 10), "GPU {}: D-shard {}".format(g, g), size=18)
        text(d, (x + 16, y + 40), "local partial C", 15, MUTED)
        matrix(d, x + 16, y + 64, 4, 4,
               {(r, c): g + 1 for r in range(4) for c in range(4) if t >= c + 1}, cw=30, ch=20)
        text(d, (x + 171, y + 40), "summed row r" + str(g), 15, MUTED)
        for c in range(4):
            done = t >= c + 1.9
            tile(d, x + 170 + c * 34, y + 88, 34, 29, ROW[g], "10" if done else "", active=done, faint=not done)
        text(d, (x + 16, y + 150), "GEMM col {}{}".format(col, " running" if t < 4 else " finished"), 15, ROW[1], bold=True)
    for start, end in RING_PATHS:
        arrow(d, start, end, "#b5c2d4")
    active = 1 <= t < 4.9 and (t - 1) % 1 < .9
    if active:
        sent_col = min(3, int(t - 1))
        phase = (t - 1) % 1
        hop = min(2, int(phase / .3))
        p = (phase % .3) / .3
        for g, (start, end) in enumerate(RING_PATHS):
            owner = (g - hop - 1) % 4
            packet(d, start, end, p, "r{},t{}: {}".format(owner, sent_col, ring_value(g, hop)), ROW[owner], w=132)
        label(d, (720, 435), "Column {}: ring hop {}/3".format(sent_col, hop + 1), size=23, center=True)
        text(d, (720, 477), "Each receiver adds its own partial.", 20, MUTED, center=True)
        text(d, (720, 514), "1 + 2 + 3 + 4 = 10", 23, INK, bold=True, center=True)
    else:
        label(d, (720, 435), "Compute first, then launch each tile", size=22, center=True)
        text(d, (720, 483), "Finished rows stay with their owner.", 19, MUTED, center=True)
    status(d, "Stream partial outputs while GEMM computes the next column of tiles.")


def reducescatter_gemm(d, t):
    row = min(3, int(t))
    frac = t % 1 if t < 4 else 1
    for g in range(4):
        x = 63 + 340 * g
        box(d, (x, 284, x + 260, 389), "#fbfcfe", LINE, radius=8)
        label(d, (x + 130, 294), "GPU {}{}".format(g, " (local)" if g == 0 else ""), center=True)
        for c in range(4):
            tile(d, x + 40 + c * 45, 338, 45, 30, ROW[row], str(g + 1))
    label(d, (65, 418), "GPU 0 input T{}: peer contributions".format(row), size=19)
    well = (383, 548)
    count = 1 + int(frac >= .25) + int(frac >= .45) + int(frac >= .65)
    if t >= 4:
        count = 4
    partial = sum(range(1, count + 1))
    box(d, (267, 503, 499, 618), "#f0f5fc", ROW[row], radius=10)
    label(d, (well[0], 514), "REDUCE T" + str(row), ROW[row], 21, True)
    label(d, (well[0], 550), " + ".join(str(g) for g in range(1, count + 1)) + " = " + str(partial), size=22, center=True)
    text(d, (well[0], 586), "elementwise across D", 16, MUTED, center=True)
    if t < 4:
        for g in range(1, 4):
            start, end = (193 + 340 * g, 391), (well[0], 497)
            arrow(d, start, end, ROW[row])
            p = (frac - (g - 1) * .20) / .25
            if 0 <= p < 1:
                packet(d, start, end, p, "{} {} {} {}".format(g + 1, g + 1, g + 1, g + 1), ROW[row])
    arrow(d, (509, 558), (665, 558), ROW[row])
    label(d, (749, 456), "A reduced", center=True)
    matrix(d, 679, 495, 4, 4, {(r, c): 10 for r in range(4) for c in range(4) if t >= r + .8},
           highlight=int(t) - 1 if 1 <= t < 5 else None, cw=35, ch=33)
    label(d, (868, 543), "×", size=30)
    label(d, (960, 456), "B replicated", center=True)
    fixed_matrix(d, 924, 495, 4, 2, "b", cw=36, ch=33)
    arrow(d, (1013, 558), (1123, 558), MUTED)
    label(d, (1210, 456), "C local rows", center=True)
    matrix(d, 1164, 495, 4, 2, {(r, c): "c" + str(r) for r in range(4) for c in range(2) if t >= r + 2}, cw=46, ch=33)
    compute_row = int(t) - 1
    if 0 <= compute_row < 4:
        gemm_badge(d, 840, 675, "GEMM T" + str(compute_row), t % 1)
    label(d, (1050, 751), "Only GPU 0's batch shard is expanded here.", size=17, color=MUTED, center=True)
    status(d, "Reduce input T{}{}".format(row, " while GEMM consumes already-reduced T{}.".format(compute_row) if 0 <= compute_row < 4 and t < 4 else " before GEMM uses it."))


def alltoall_gemm(d, t):
    j = min(3, int(t))
    frac = t % 1 if t < 4 else 1
    for g in range(4):
        x = 63 + 340 * g
        box(d, (x, 282, x + 260, 457), "#fbfcfe", LINE, radius=8)
        label(d, (x + 130, 291), "GPU {} owns S{}".format(g, g), center=True)
        for b in range(4):
            tile(d, x + 54, 326 + b * 28, 152, 28, ROW[g], "B{}, S{}".format(b, g), active=b == 0, faint=b != 0)
    box(d, (50, 532, 1390, 747), "#fbfcfe", LINE, radius=10)
    label(d, (69, 543), "GPU 0 · B_0 owner", size=20)
    label(d, (235, 582), "A[B_0, S, D]", center=True)
    for s in range(4):
        ready = s <= int(t)
        tile(d, 154, 615 + s * 26, 162, 26, ROW[s], "B0, S" + str(s) if ready else "", active=s == j and t < 4, faint=not ready)
    arrow(d, (335, 665), (459, 665), MUTED)
    gemm_badge(d, 470, 630, "GEMM S" + str(j) if t < 4 else "GEMM finished", frac)
    label(d, (733, 647), "×", size=30)
    label(d, (848, 582), "B[D, F]", center=True)
    fixed_matrix(d, 812, 615, 4, 2, "b", cw=36, ch=26)
    arrow(d, (916, 665), (1052, 665), MUTED)
    label(d, (1190, 582), "C[B_0, S, F]", center=True)
    matrix(d, 1144, 615, 4, 2, {(r, c): "S" + str(r) for r in range(4) for c in range(2) if r < int(t)}, cw=46, ch=26)
    if j < 3 and t < 4:
        g = j + 1
        start, end = (193 + g * 340, 458), (335, 606)
        dashed_arrow(d, end, start, MUTED)
        if frac < .22:
            packet(d, end, start, frac / .22, "pull B0,S" + str(g), MUTED, w=126)
        else:
            arrow(d, start, end, ROW[g])
            packet(d, start, end, (frac - .22) / .78, "A[B0,S{},D]".format(g), ROW[g], w=140)
        label(d, (193, 478), "prefetch S{}".format(g), ROW[g], 18, True)
        label(d, (193, 502), "compute S{}".format(j), ROW[j], 18, True)
    status(d, "Receiver-led: compute one S chunk while pulling the next into a free buffer.")


def frame(scene, t):
    im = Image.new("RGB", (W * SCALE, (H + HEADER_SHIFT) * SCALE), BG)
    d = ImageDraw.Draw(im)
    label(d, (26, 18), "Collective GEMMs", size=34)
    for i, tab in enumerate(["1  Gather weights", "2  Stream outputs", "3  Reduce inputs", "4  Pull routed inputs"]):
        x = 25 + i * 353
        box(d, (x, 111, x + 335, 151), INK if scene == i else "#e5eaf2", radius=7)
        text(d, (x + 167, 120), tab, 18, "#ffffff" if scene == i else MUTED, bold=True, center=True)
    box(d, (24, 168, 1416, 857), "#ffffff", LINE, radius=15)
    label(d, (47, 182), TITLES[scene], size=31)
    [allgather_gemm, gemm_reducescatter, reducescatter_gemm, alltoall_gemm][scene](d, t)
    # Close unused header space while keeping the tensor diagrams together.
    tabs_top = 111 - HEADER_SHIFT
    compact = Image.new("RGB", (W * SCALE, H * SCALE), BG)
    compact.paste(im.crop((0, 0, W * SCALE, tabs_top * SCALE)), (0, 0))
    compact.paste(im.crop((0, 111 * SCALE, W * SCALE, (H + HEADER_SHIFT) * SCALE)), (0, tabs_top * SCALE))
    return compact.resize((W, H), Image.Resampling.LANCZOS)


def check_dataflow():
    for receiver in range(4):
        source = (receiver - 1) % 4
        assert (source - 2 - 1) % 4 == receiver
        assert ring_value(source, 2) + receiver + 1 == 10
    assert all(r + .8 < r + 1 for r in range(4))


def main():
    check_dataflow()
    OUT.mkdir(exist_ok=True)
    posters = [frame(s, 1.5 if s != 1 else 2.45) for s in range(4)]
    contact = Image.new("RGB", (W, H), BG)
    for s, im in enumerate(posters):
        contact.paste(im.resize((W // 2, H // 2), Image.Resampling.LANCZOS), ((s % 2) * (W // 2), (s // 2) * (H // 2)))
    contact.save(OUT / "collective-gemms.png")
    palette = contact.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    frames, durations = [], []
    for s, duration in enumerate(DURATIONS):
        times = [(0, 1000)]
        times.extend((i / 15, 100) for i in range(1, int(duration * 15) + 1))
        times.append((duration, 1600))
        for t, hold in times:
            frames.append(frame(s, t).quantize(palette=palette, dither=Image.Dither.NONE))
            durations.append(hold)
        print("Rendered chapter {}/4".format(s + 1), flush=True)
    path = OUT / "collective-gemms.gif"
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=durations, loop=0, optimize=True, disposal=1)
    print("Saved {} ({:.2f} MB, {:.1f} s)".format(path, path.stat().st_size / 1e6, sum(durations) / 1000))


if __name__ == "__main__":
    main()
