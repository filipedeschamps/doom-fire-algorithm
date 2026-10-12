"""SPEC-009 README, SPEC-012 top-level README entry."""
import re

from conftest import PROJECT, REPO

TRACES = ["SPEC-009", "SPEC-012"]


def test_spec009_project_readme_explains_f9_animation():
    p = PROJECT / "README.md"
    assert p.is_file()
    t = p.read_text()
    assert "F9" in t
    assert re.search(r"\bframe\b", t, re.I)
    assert re.search(r"hold", t, re.I)


def test_spec012_top_level_readme_lists_experiment():
    lines = (REPO / "README.md").read_text().splitlines()
    hits = [l for l in lines if "playground/excel-doom-fire" in l]
    assert len(hits) == 1
    assert re.match(r"^- \[.+\]\(https://github\.com/.+/playground/excel-doom-fire\S*\) \(\[@[\w-]+\]\(https://github\.com/[\w-]+\)\)$", hits[0]), hits[0]
    # lives inside the Experiments list, before the Author section
    assert lines.index(hits[0]) < next(i for i, l in enumerate(lines) if l.startswith("## Author"))
