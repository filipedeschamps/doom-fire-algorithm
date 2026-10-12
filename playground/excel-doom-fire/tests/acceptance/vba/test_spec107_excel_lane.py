"""Excel lane (needs macOS + Microsoft Excel; deselect with -m 'not excel').

SPEC-107 harness hygiene, SPEC-108 grid shape/range, SPEC-109 create source,
SPEC-110 destroy source (100 frames), SPEC-111 per-frame propagation invariant,
SPEC-112 seeded determinism, SPEC-113 increase/decrease bounds, SPEC-114 wrap guard.

Every macro call goes through `run VB macro` with a hard timeout; the RNG is seeded
through the D-14 hook so runs are repeatable.
"""
import pytest

from support import excel_driver as ed
from support import firemodel as m

TRACES = ["SPEC-107", "SPEC-108", "SPEC-109", "SPEC-110", "SPEC-111", "SPEC-112",
          "SPEC-113", "SPEC-114"]

pytestmark = pytest.mark.excel


def _bottom(g):
    return g[39]


def _flat(g):
    return [v for row in g for v in row]


def _lit(x, seed=1, frames=60):
    x.run("SeedRng", seed)
    x.run("CreateFireSource")
    if frames:
        x.run("StepFrames", frames, timeout=120)


# ---------------------------------------------------------------- SPEC-107

def test_spec107_workbook_loaded_from_startup_copy(excel):
    staged = ed.STARTUP / ed.STAGED_NAME
    assert staged.is_file() and not staged.is_symlink()
    assert staged.read_bytes() == excel.xlsm.read_bytes()
    names = ed.parse_list(ed._tell("get name of every workbook", 15))
    assert names == [ed.STAGED_NAME] or names == ed.STAGED_NAME, names
    assert ed.snapshot() != excel.before  # our copy (only) is there during the session
    assert set(ed.snapshot()) - set(excel.before) <= {ed.STAGED_NAME, "~$" + ed.STAGED_NAME}


# ---------------------------------------------------------------- SPEC-108

def test_spec108_reset_gives_all_zero_40x60_grid(fire):
    g = fire.grid()
    assert len(g) == 40 and all(len(r) == 60 for r in g)
    assert set(_flat(g)) == {0}


@pytest.mark.parametrize("frames", [1, 5, 40])
def test_spec108_values_stay_in_0_36(fire, frames):
    _lit(fire, seed=11, frames=frames)
    g = fire.grid()
    assert all(isinstance(v, int) and 0 <= v <= 36 for v in _flat(g))
    assert max(_flat(g)) > 0


# ---------------------------------------------------------------- SPEC-109

def test_spec109_create_source_sets_bottom_row_to_36(fire):
    fire.run("CreateFireSource")
    g = fire.grid()
    assert _bottom(g) == [36] * 60
    assert set(_flat(g[:39])) == {0}  # nothing above until frames run


def test_spec109_bottom_row_stays_36_while_burning_and_fire_rises(fire):
    _lit(fire, seed=3, frames=1)
    assert _bottom(fire.grid()) == [36] * 60
    assert max(fire.grid()[38]) >= 34  # row above the source: 36 - decay (0..2)
    fire.run("StepFrames", 60, timeout=120)
    g = fire.grid()
    assert _bottom(g) == [36] * 60
    assert sum(1 for v in g[30] if v > 0) > 30  # flame has climbed 10 rows


# ---------------------------------------------------------------- SPEC-110

def test_spec110_destroy_source_zeroes_bottom_row_immediately(fire):
    _lit(fire, seed=5, frames=30)
    fire.run("DestroyFireSource")
    assert _bottom(fire.grid()) == [0] * 60


def test_spec110_grid_is_all_zero_100_frames_after_destroy(fire):
    _lit(fire, seed=5, frames=80)
    assert max(_flat(fire.grid())) > 30
    fire.run("DestroyFireSource")
    fire.run("StepFrames", 100, timeout=180)
    assert set(_flat(fire.grid())) == {0}


# ---------------------------------------------------------------- SPEC-111

def test_spec111_every_frame_obeys_wind_window_invariant(fire):
    fire.run("SeedRng", 7)
    fire.run("CreateFireSource")
    old = fire.grid()
    for frame in range(1, 46):
        fire.run("StepFrames", 1)
        new = fire.grid()
        bad = m.frame_violations(old, new)
        assert bad == [], f"frame {frame}: {bad[:5]}"
        old = new
    assert max(_flat(old)) > 0


def test_spec111_invariant_holds_through_burnout(fire):
    _lit(fire, seed=9, frames=50)
    fire.run("DestroyFireSource")
    old = fire.grid()
    for frame in range(1, 31):
        fire.run("StepFrames", 1)
        new = fire.grid()
        assert m.frame_violations(old, new) == [], f"burn-out frame {frame}"
        old = new


# ---------------------------------------------------------------- SPEC-112

def _run_seeded(x, seed):
    x.run("ResetFire")
    x.run("SeedRng", seed)
    x.run("CreateFireSource")
    x.run("StepFrames", 30, timeout=120)
    return x.grid()


def test_spec112_same_seed_same_grid_other_seed_differs(fire):
    a = _run_seeded(fire, 123)
    b = _run_seeded(fire, 123)
    c = _run_seeded(fire, 4567891)  # nearby seeds can alias in VBA Randomize
    assert a == b
    assert a != c


# ---------------------------------------------------------------- SPEC-113

def test_spec113_decrease_stays_within_bounds(fire):
    fire.run("SeedRng", 21)
    fire.run("CreateFireSource")
    prev = _bottom(fire.grid())
    spread = False
    for call in range(40):
        fire.run("DecreaseFireSource")
        cur = _bottom(fire.grid())
        for p, c in zip(prev, cur):
            assert 0 <= c <= p, (call, p, c)
            assert c >= p - 13, (call, p, c)  # Math.floor(rand*14) -> 0..13
        spread = spread or len(set(cur)) > 1
        prev = cur
        if set(cur) == {0}:
            break
    assert spread, "each column draws its own random decrease (fire.js L118-127)"
    assert set(prev) == {0}, "repeated decrease must reach 0"


def test_spec113_increase_stays_within_bounds(fire):
    fire.run("SeedRng", 22)
    fire.run("DestroyFireSource")
    prev = _bottom(fire.grid())
    assert prev == [0] * 60
    spread = False
    for call in range(40):
        fire.run("IncreaseFireSource")
        cur = _bottom(fire.grid())
        for p, c in zip(prev, cur):
            assert p <= c <= 36, (call, p, c)
            assert c <= p + 13, (call, p, c)  # Math.floor(rand*14) -> 0..13
            if p == 36:
                assert c == 36
        spread = spread or len(set(cur)) > 1
        prev = cur
        if set(cur) == {36}:
            break
    assert spread, "each column draws its own random increase (fire.js L100-114)"
    assert set(prev) == {36}, "repeated increase must reach 36"


def test_spec113_increase_decrease_do_not_touch_rows_above(fire):
    _lit(fire, seed=4, frames=20)
    before = fire.grid()[:39]
    fire.run("DecreaseFireSource")
    fire.run("IncreaseFireSource")
    assert fire.grid()[:39] == before


# ---------------------------------------------------------------- SPEC-114

def test_spec114_long_run_never_errors_or_leaves_range(fire):
    """Row-0/col-0 wind writes go to index-decay < 0: JS ignores it, VBA must not raise."""
    _lit(fire, seed=2, frames=0)
    fire.run("StepFrames", 300, timeout=240)
    g = fire.grid()
    assert all(0 <= v <= 36 for v in _flat(g))
    assert _bottom(g) == [36] * 60
