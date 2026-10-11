"""SPEC-001: macro-free artifact vanilla/doom-fire.xlsx."""
import zipfile

from conftest import PROJECT, XLSX

TRACES = ["SPEC-001"]


def test_spec001_xlsx_exists_and_is_zip(xlsx_path):
    assert zipfile.is_zipfile(xlsx_path)


def test_spec001_no_macro_parts(xlsx_path):
    with zipfile.ZipFile(xlsx_path) as z:
        names = [n.lower() for n in z.namelist()]
        assert not any("vbaproject" in n for n in names)
        ct = z.read("[Content_Types].xml").decode()
    assert "macroEnabled" not in ct
    assert "vbaProject" not in ct


def test_spec001_no_xlsm_in_vanilla():
    assert XLSX.is_file()
    assert list((PROJECT / "vanilla").glob("*.xlsm")) == []
