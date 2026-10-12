"""SPEC-010 CF palette, SPEC-011 cell appearance."""
from openpyxl.utils import range_boundaries

from conftest import COLS, ROWS, upstream_palette

TRACES = ["SPEC-010", "SPEC-011"]


def _rules(ws):
    out = []
    for rng, rules in ws.conditional_formatting._cf_rules.items():
        for r in rules:
            out.append((str(rng.sqref), r))
    return out


def _rgb(rule):
    f = rule.dxf.fill
    cols = {str(c.rgb)[-6:].upper() for c in (f.fgColor, f.bgColor)
            if c is not None and isinstance(c.rgb, str) and c.rgb != "00000000"}
    return cols


def test_spec010_exactly_37_equality_rules_with_palette(wb):
    palette = upstream_palette()
    rules = _rules(wb["Fire"])
    assert len(rules) == 37
    seen = {}
    for sq, r in rules:
        assert r.type == "cellIs" and r.operator == "equal"
        assert len(r.formula) == 1
        k = int(r.formula[0])
        assert k not in seen
        seen[k] = r
        want = "%02X%02X%02X" % palette[k]
        assert want in _rgb(r), (k, want, _rgb(r))
    assert sorted(seen) == list(range(37))


def test_spec010_rules_cover_whole_grid(wb):
    covered = set()
    for sq, _ in _rules(wb["Fire"]):
        for part in sq.split():
            c1, r1, c2, r2 = range_boundaries(part)
            covered |= {(r, c) for r in range(r1, r2 + 1) for c in range(c1, c2 + 1)}
    grid = {(r, c) for r in range(1, ROWS + 1) for c in range(1, COLS + 1)}
    assert grid <= covered


def test_spec011_digits_hidden_by_number_format(wb):
    ws = wb["Fire"]
    for r in range(1, ROWS + 1):
        for c in range(1, COLS + 1):
            assert ws.cell(r, c).number_format == ";;;", (r, c)


def test_spec011_gridlines_off(wb):
    assert wb["Fire"].sheet_view.showGridLines is False


def _col_px(ws, idx):
    from openpyxl.utils import get_column_letter as L
    w = None
    for key, d in ws.column_dimensions.items():
        lo, hi = d.min or 0, d.max or 0
        if lo <= idx <= hi and d.width:
            w = d.width
    if w is None:
        return None
    return w * 7 + 5


def test_spec011_cells_square_ish(wb):
    ws = wb["Fire"]
    for c in range(1, COLS + 1):
        wpx = _col_px(ws, c)
        assert wpx, f"column {c} width must be explicit"
        hpt = ws.row_dimensions[1].height
        assert hpt, "row height must be explicit"
        ratio = wpx / (hpt * 96 / 72)
        assert 0.8 <= ratio <= 1.25, (c, ratio)
    for r in range(1, ROWS + 1):
        assert ws.row_dimensions[r].height == ws.row_dimensions[1].height
