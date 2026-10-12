"""Meta-test: M2 section of SPEC.md <-> tests <-> D-NN traceability (bidirectional)."""
import ast
import re

from conftest import PROJECT

TRACES = []  # meta: verifies all the others

TESTDIR = PROJECT / "tests" / "acceptance" / "vba"
_FULL = (PROJECT / "SPEC.md").read_text()
MARK = "# excel-doom-fire — VBA (M2) SPEC"
M2 = _FULL[_FULL.index(MARK):] if MARK in _FULL else ""
M1 = _FULL[:_FULL.index(MARK)] if MARK in _FULL else _FULL


def _specs():
    parts = re.split(r"^### (SPEC-1\d{2}): .*$", M2, flags=re.M)
    return {parts[i]: parts[i + 1] for i in range(1, len(parts), 2)}


def _decisions():
    head = M2.split("\n### SPEC-1")[0]
    parts = re.split(r"^### (D-\d{2}): .*$", head, flags=re.M)
    return {parts[i]: parts[i + 1] for i in range(1, len(parts), 2)}


def _traces():
    out = {}
    for f in TESTDIR.glob("test_*.py"):
        for node in ast.parse(f.read_text()).body:
            if isinstance(node, ast.Assign) and getattr(node.targets[0], "id", "") == "TRACES":
                out[f.name] = ast.literal_eval(node.value)
    return out


def test_m2_section_exists_and_m1_ids_untouched():
    assert MARK in _FULL, "SPEC.md has no M2 section"
    assert len(re.findall(r"^## SPEC-\d{3}: ", M1, flags=re.M)) == 12
    assert [d for d in re.findall(r"^### (D-\d{2}):", M1, flags=re.M)] == \
        ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06", "D-07"]
    assert "## Human acceptance" in M2


def test_m2_decisions_d10_to_d14_present():
    decs = _decisions()
    for d in ("D-10", "D-11", "D-12", "D-13", "D-14"):
        assert d in decs, d


def test_m2_every_spec_has_decision_provenance_and_test():
    specs, decs, traces = _specs(), _decisions(), _traces()
    assert specs and decs
    traced = {t for ts in traces.values() for t in ts}
    for sid, body in specs.items():
        first = next(ln for ln in body.splitlines() if ln.strip())  # "Decisions: D-.. · [P: ..]"
        back = re.findall(r"\bD-\d{2}\b", first)
        assert back and all(b in decs for b in back), sid
        assert "[P:" in body, f"{sid} lacks a [P:] provenance tag"
        assert sid in traced, f"{sid} has no test"
        for b in back:
            assert sid in decs[b], f"{b} lacks forward link to {sid}"


def test_m2_trace_ids_exist_and_decisions_link_back():
    specs, decs, traces = _specs(), _decisions(), _traces()
    for f, ts in traces.items():
        assert all(t in specs for t in ts), f
    for did, body in decs.items():
        fwd = re.findall(r"SPEC-1\d{2}", body)
        assert fwd, did
        for s in set(fwd):
            assert s in specs, (did, s)
            assert did in specs[s], f"{s} lacks back link to {did}"


def test_m2_every_test_file_declares_traces():
    traces = _traces()
    for f in TESTDIR.glob("test_*.py"):
        assert f.name in traces, f"{f.name} lacks TRACES"
