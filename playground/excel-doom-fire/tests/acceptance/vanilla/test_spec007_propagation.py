"""SPEC-007 propagation invariant over recalculated values."""
import pytest

from conftest import COLS, ROWS, fire_decay
from support.invariant import propagation_violations

TRACES = ["SPEC-007"]


@pytest.mark.parametrize("src,n", [(36, 0), (36, 1), (36, 2), (18, 0), (0, 0)])
def test_spec007_pull_invariant_exact(recalcs, src, n):
    fire, decay = fire_decay(recalcs(src, n))
    assert propagation_violations(fire, decay) == []


def test_spec007_fire_cells_reference_decay_sheet(wb):
    ws = wb["Fire"]
    for r in range(1, ROWS):
        for c in range(1, COLS + 1):
            assert "Decay!" in ws.cell(r, c).value, (r, c)


def test_spec007_values_are_integers_in_palette_range(recalcs):
    fire, _ = fire_decay(recalcs(36))
    for row in fire:
        for v in row:
            assert isinstance(v, (int, float)) and float(v).is_integer()
            assert 0 <= v <= 36


def test_spec007_right_edge_pulls_zero(recalcs):
    """c+d beyond last column reads 0: with d>0 at column 60 result is 0."""
    fire, decay = fire_decay(recalcs(36))
    hits = [(r, COLS - 1) for r in range(ROWS - 1) if decay[r][COLS - 1] > 0]
    assert hits, "expected some right-edge decay>0 in 39 rows"
    for r, c in hits:
        assert fire[r][c] == 0, (r, c)
