"""SPEC-005 decay sheet, SPEC-008 volatility."""
import re

from conftest import COLS, ROWS, fire_decay

TRACES = ["SPEC-005", "SPEC-008"]


def test_spec005_every_decay_cell_is_randbetween_0_2(wb):
    ws = wb["Decay"]
    pat = re.compile(r"^=RANDBETWEEN\(0,2\)$", re.I)
    for r in range(1, ROWS):
        for c in range(1, COLS + 1):
            assert pat.match(str(ws.cell(r, c).value).replace(" ", "")), (r, c)


def test_spec005_decay_values_in_0_1_2_all_present(recalcs):
    _, decay = fire_decay(recalcs(36))
    vals = {v for row in decay for v in row}
    assert vals == {0, 1, 2}


def test_spec008_recalc_changes_decay_and_fire(recalcs):
    f1, d1 = fire_decay(recalcs(36, 0))
    f2, d2 = fire_decay(recalcs(36, 1))
    assert d1 != d2, "Decay must be volatile (each recalc = one frame)"
    assert f1 != f2, "Fire must change between recalcs"
