"""SPEC-110 (100-frame burn-out bound, hermetic) + guards for the SPEC-111 invariant checker.

Pure Python reference model of fire.js L23-49; no Excel, green at RED by design (it
proves the numbers the Excel lane asserts, like M1's guard tests).
"""
import random

from support import firemodel as m

TRACES = ["SPEC-110", "SPEC-111"]


def test_spec110_burnout_needs_more_than_40_frames_but_under_100():
    """[P: fire.js L23-49 simulated] The card's '40 frames' can never hold in a faithful
    in-place port; 100 frames is the bound the Excel lane uses (approved by Devin)."""
    res = [m.frames_to_zero(s) for s in range(12)]
    assert all(r is not None for r in res), res
    assert min(res) > 40, res
    assert max(res) <= 100, res


def test_guard_checker_accepts_model_frames():
    for seed in range(6):
        rnd = random.Random(seed)
        g = m.new_grid()
        m.set_source(g, 36)
        for _ in range(80):
            old = m.rows(g)
            m.step(g, lambda: rnd.randrange(3))
            assert m.frame_violations(old, m.rows(g)) == []


def _blank():
    return [[0] * m.W for _ in range(m.H)]


def test_guard_checker_rejects_pixel_raised_above_its_window():
    old, new = _blank(), _blank()
    old[6][10:13] = [3, 4, 5]
    new[5][10] = 3  # max(0, old[6][10]-0) -> legal
    assert m.frame_violations(old, new) == []
    new[5][10] = 6  # above max of the window {3,4,5}
    assert [v[0] for v in m.frame_violations(old, new)] == ["window"]


def test_guard_checker_rejects_out_of_range_and_bottom_row_change():
    old = _blank()
    oob = _blank()
    oob[0][0] = 37
    assert any(v[0] == "range" for v in m.frame_violations(old, oob))
    bottom = _blank()
    bottom[39][3] = 12
    assert any(v[0] == "bottom-row-changed" for v in m.frame_violations(old, bottom))
