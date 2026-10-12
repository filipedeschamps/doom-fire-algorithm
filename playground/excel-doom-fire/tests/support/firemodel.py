"""Reference model of upstream fire.js L23-49 (PUSH form, in place) + frame invariant.

Pure Python, no Excel. Used (a) to prove the spec's numbers (SPEC-110 100-frame bound)
and (b) to guard the invariant checker the Excel lane applies to real frames (SPEC-111).

Upstream @854c39f iterates column-outer / row-inner; a pixel at (r, c) reads the pixel
below and writes `index - decay` (the wind shift) *in place*. Row 0 / col 0 can make
`index - decay` negative: JS silently writes an object property, the model skips it.
"""
import random

W, H = 60, 40
LAST = W * H


def new_grid():
    return [0] * LAST


def set_source(grid, value):
    for c in range(W):
        grid[(H - 1) * W + c] = value


def step(grid, rng):
    """One fire.js calculateFirePropagation() frame, in place. rng() -> int 0..2."""
    for c in range(W):
        for r in range(H):
            i = c + W * r
            below = i + W
            if below >= LAST:
                continue
            decay = rng()
            v = grid[below] - decay
            if i - decay >= 0:
                grid[i - decay] = v if v >= 0 else 0


def rows(grid):
    return [grid[r * W:(r + 1) * W] for r in range(H)]


# ------------------------------------------------------------------ invariant (SPEC-111)

# Columns whose below-neighbour can be rewritten by a wrap-around write (row-0 wrap
# of column 0 lands on cols 58/59 of the previous row) are excluded from the exact
# check; they still get the range check.
EXACT_COLS = 56


def frame_violations(old, new):
    """old/new: 40x60 lists. Returns list of human-readable violations for ONE frame.

    - every value is an int in 0..36
    - bottom row (row 39, 0-based) is unchanged by a frame
    - for r in 0..38 and c < EXACT_COLS: new[r][c] is either unchanged (nobody wrote it)
      or max(0, old[r+1][c+d] - d) for some d in 0..2 (c+d < 60) -- hence never above
      the max of its below-row wind window old[r+1][c..c+2].
    """
    bad = []
    for r in range(H):
        for c in range(W):
            v = new[r][c]
            if not (isinstance(v, int) and 0 <= v <= 36):
                bad.append(("range", r, c, v))
    if new[H - 1] != old[H - 1]:
        bad.append(("bottom-row-changed", H - 1, None, None))
    for r in range(H - 1):
        for c in range(EXACT_COLS):
            allowed = {old[r][c]}
            for d in range(3):
                if c + d < W:
                    allowed.add(max(0, old[r + 1][c + d] - d))
            if new[r][c] not in allowed:
                bad.append(("window", r, c, new[r][c]))
    return bad


def frames_to_zero(seed, max_frames=400):
    """Frames needed for an all-36 source to burn out after destroy (source row -> 0)."""
    rnd = random.Random(seed)
    g = new_grid()
    set_source(g, 36)
    for _ in range(120):  # saturate
        step(g, lambda: rnd.randrange(3))
    set_source(g, 0)
    for n in range(1, max_frames + 1):
        step(g, lambda: rnd.randrange(3))
        if not any(g):
            return n
    return None
