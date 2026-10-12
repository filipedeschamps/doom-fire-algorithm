"""SPEC-101 artifact + reproducible build, SPEC-102 .bas files are the source of truth."""
import subprocess
import sys
import zipfile

from conftest import BUILDER, olevba_modules, src_modules

TRACES = ["SPEC-101", "SPEC-102"]


def test_spec101_xlsm_is_macro_enabled_ooxml(xlsm_path):
    with zipfile.ZipFile(xlsm_path) as z:
        assert z.testzip() is None
        names = set(z.namelist())
        assert "xl/vbaProject.bin" in names
        ct = z.read("[Content_Types].xml").decode()
    assert "application/vnd.ms-excel.sheet.macroEnabled.main+xml" in ct
    assert "application/vnd.ms-office.vbaProject" in ct


def test_spec101_builder_regenerates_equivalent_xlsm(tmp_path, xlsm_path):
    assert BUILDER.is_file(), f"missing build script: {BUILDER}"
    out = tmp_path / "regen.xlsm"
    r = subprocess.run([sys.executable, str(BUILDER), "--out", str(out)],
                       capture_output=True, text=True, timeout=120)
    assert r.returncode == 0, r.stderr
    assert zipfile.is_zipfile(out)
    # equivalent = same standard modules as the committed artifact and as vba/src
    assert olevba_modules(out) == olevba_modules(xlsm_path) == src_modules()
    with zipfile.ZipFile(out) as a, zipfile.ZipFile(xlsm_path) as b:
        assert sorted(a.namelist()) == sorted(b.namelist())


def test_spec102_src_dir_has_bas_modules(modules_src):
    assert modules_src
    for name, text in modules_src.items():
        assert f'Attribute VB_Name = "{name}"' in text, name


def test_spec102_xlsm_modules_equal_committed_bas(xlsm_path, modules_src):
    embedded = olevba_modules(xlsm_path)
    assert set(embedded) == set(modules_src), (sorted(embedded), sorted(modules_src))
    for name in modules_src:
        assert embedded[name].rstrip("\n") == modules_src[name].rstrip("\n"), name
