"""SPEC-002: committed generator reproduces an equivalent workbook."""
import subprocess
import sys

import openpyxl

from conftest import BUILDER, XLSX

TRACES = ["SPEC-002"]


def _cf(ws):
    out = []
    for rng, rules in ws.conditional_formatting._cf_rules.items():
        for r in rules:
            fill = r.dxf.fill if r.dxf else None
            colors = tuple(
                sorted(
                    {
                        str(c.rgb)
                        for c in (
                            (fill.fgColor, fill.bgColor) if fill else ()
                        )
                        if c is not None and isinstance(c.rgb, str)
                    }
                )
            )
            out.append((str(rng.sqref), r.type, r.operator, tuple(r.formula), colors))
    return sorted(out)


def _model(path):
    wb = openpyxl.load_workbook(path)
    m = {"names": sorted(wb.defined_names.keys()), "sheets": {}}
    for ws in wb.worksheets:
        cells = {
            c.coordinate: c.value
            for row in ws.iter_rows()
            for c in row
            if c.value is not None
        }
        m["sheets"][ws.title] = {
            "dims": ws.dimensions,
            "state": ws.sheet_state,
            "cells": cells,
            "cf": _cf(ws),
        }
    return m


def test_spec002_builder_exists():
    assert BUILDER.is_file()


def test_spec002_regeneration_equivalent(tmp_path):
    out = tmp_path / "regen.xlsx"
    r = subprocess.run(
        [sys.executable, str(BUILDER), "--out", str(out)],
        capture_output=True,
        text=True,
        timeout=120,
    )
    assert r.returncode == 0, r.stderr
    assert out.is_file()
    assert _model(out) == _model(XLSX)
