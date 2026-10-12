import re
import sys
from pathlib import Path

import openpyxl
import pytest

PROJECT = Path(__file__).resolve().parents[3]
REPO = PROJECT.parents[1]
sys.path.insert(0, str(PROJECT / "tests"))

XLSX = PROJECT / "vanilla" / "doom-fire.xlsx"
BUILDER = PROJECT / "vanilla" / "build_vanilla.py"
FIREJS = REPO / "playground" / "1st-implementation-with-tables" / "fire.js"

from support import recalc as rc  # noqa: E402

ROWS, COLS = 40, 60


def upstream_palette():
    """37 (r,g,b) tuples parsed from upstream fire.js L5 @854c39f."""
    line = FIREJS.read_text().splitlines()[4]
    return [
        (int(r), int(g), int(b))
        for r, g, b in re.findall(r'"r":(\d+),"g":(\d+),"b":(\d+)', line)
    ]


@pytest.fixture(scope="session")
def xlsx_path():
    assert XLSX.is_file(), f"missing artifact: {XLSX}"
    return XLSX


@pytest.fixture(scope="session")
def wb(xlsx_path):
    return openpyxl.load_workbook(xlsx_path)


@pytest.fixture(scope="session")
def recalcs(xlsx_path):
    """Lazy cache: recalcs(source, n) -> recalculated data_only workbook #n."""
    cache = {}

    def get(source=None, n=0):
        key = (source, n)
        if key not in cache:
            cache[key] = rc.recalc(xlsx_path, source=source)
        return cache[key]

    return get


def fire_decay(book):
    fire = rc.grid(book["Fire"], ROWS, COLS)
    decay = rc.grid(book["Decay"], ROWS - 1, COLS)
    return fire, decay
