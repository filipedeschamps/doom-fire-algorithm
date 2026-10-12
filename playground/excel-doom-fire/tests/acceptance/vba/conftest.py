import hashlib
import re
import sys
from pathlib import Path

import pytest

PROJECT = Path(__file__).resolve().parents[3]
REPO = PROJECT.parents[1]
sys.path.insert(0, str(PROJECT / "tests"))

XLSM = PROJECT / "vba" / "doom-fire.xlsm"
SRC = PROJECT / "vba" / "src"
BUILDER = PROJECT / "vba" / "build_vba.py"
FIREJS = REPO / "playground" / "1st-implementation-with-tables" / "fire.js"

ROWS, COLS = 40, 60
GRID_FIRST_ROW = 4  # FireGrid = Fire!$A$4:$BH$43 (SPEC-103)

PUBLIC_MACROS = ["StartFire", "StopFire", "CreateFireSource", "DestroyFireSource",
                 "IncreaseFireSource", "DecreaseFireSource"]


def pytest_configure(config):
    config.addinivalue_line("filterwarnings", "ignore::DeprecationWarning")  # oletools/pyparsing
    config.addinivalue_line(
        "markers",
        "excel: drives real Microsoft Excel via osascript (startup-folder recipe, D-16). "
        "Deselect with -m 'not excel' for the hermetic lane only.")


def upstream_palette():
    """37 (r,g,b) tuples parsed from upstream fire.js L5 @854c39f."""
    line = FIREJS.read_text().splitlines()[4]
    return [(int(r), int(g), int(b))
            for r, g, b in re.findall(r'"r":(\d+),"g":(\d+),"b":(\d+)', line)]


def norm_eol(text):
    return text.replace("\r\n", "\n").replace("\r", "\n")


def src_modules():
    """{module name: normalized text} for the committed vba/src/*.bas."""
    return {p.stem: norm_eol(p.read_text(encoding="cp1252")) for p in sorted(SRC.glob("*.bas"))}


def olevba_modules(path):
    """{module name: normalized text} for standard (.bas) modules inside an xlsm."""
    from oletools.olevba import VBA_Parser
    vp = VBA_Parser(str(path))
    try:
        out = {}
        for _f, _stream, fname, code in vp.extract_macros():
            if fname.endswith(".bas"):
                if isinstance(code, bytes):
                    code = code.decode("cp1252")
                out[fname[:-4]] = norm_eol(code)
        return out
    finally:
        vp.close()


@pytest.fixture(scope="session")
def xlsm_path():
    assert XLSM.is_file(), f"missing artifact: {XLSM}"
    return XLSM


@pytest.fixture(scope="session")
def modules_src():
    assert SRC.is_dir() and list(SRC.glob("*.bas")), f"no .bas files in {SRC}"
    return src_modules()


@pytest.fixture(scope="session")
def all_vba_source(modules_src):
    return "\n".join(modules_src.values())


@pytest.fixture(scope="session")
def wb(xlsm_path):
    import openpyxl
    return openpyxl.load_workbook(xlsm_path, keep_vba=True)


# ------------------------------------------------------------------ excel lane (D-16)

@pytest.fixture(scope="session")
def excel(xlsm_path):
    """One Excel launch for the whole lane. Fails (not skips) if Excel is already
    running, so a user's session is never touched; always restores the startup folder."""
    import sys as _s
    if _s.platform != "darwin":
        pytest.skip("excel lane needs macOS")
    from support import excel_driver as ed
    if not ed.EXCEL_APP.exists():
        pytest.skip("Microsoft Excel.app not installed")
    digest = hashlib.sha256(xlsm_path.read_bytes()).hexdigest()
    session = ed.ExcelSession(xlsm_path)
    session.start()
    try:
        yield session
    finally:
        session.stop()  # raises if the startup folder is not restored
        assert hashlib.sha256(xlsm_path.read_bytes()).hexdigest() == digest, \
            "committed xlsm was modified (workbook must be closed without saving)"


@pytest.fixture
def fire(excel):
    """Fresh state per test: all-zero grid."""
    excel.run("ResetFire")
    return excel
