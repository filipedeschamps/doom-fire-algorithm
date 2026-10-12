"""SPEC-007 propagation invariant (D-04), pure functions."""


def propagation_violations(fire, decay):
    """fire: 40x60 values, decay: 39x60 values (0-based lists).

    For r in 0..38, c in 0..59, d = decay[r][c]:
      expected = max(0, fire[r+1][c+d] - d), or 0 when c+d > 59.
    Returns list of (r, c, expected, actual) for every mismatch.
    """
    bad = []
    width = len(fire[0])
    for r in range(len(fire) - 1):
        for c in range(width):
            d = decay[r][c]
            below = fire[r + 1][c + d] if c + d < width else 0
            exp = max(0, below - d)
            if fire[r][c] != exp:
                bad.append((r, c, exp, fire[r][c]))
    return bad
