"""Meta-test: SPEC.md <-> tests <-> D-NN traceability."""
import ast
import re

from conftest import PROJECT

TRACES = []  # meta: verifies all the others

SPEC = (PROJECT / "SPEC.md").read_text()
TESTDIR = PROJECT / "tests" / "acceptance" / "vanilla"


def _specs():
    parts = re.split(r"^## (SPEC-\d{3}): .*$", SPEC, flags=re.M)
    return {parts[i]: parts[i + 1] for i in range(1, len(parts), 2)}


def _decisions():
    parts = re.split(r"^### (D-\d{2}): .*$", SPEC.split("\n## SPEC-")[0], flags=re.M)
    return {parts[i]: parts[i + 1] for i in range(1, len(parts), 2)}


def _traces():
    out = {}
    for f in TESTDIR.glob("test_*.py"):
        for node in ast.parse(f.read_text()).body:
            if isinstance(node, ast.Assign) and node.targets[0].id == "TRACES":
                out[f.name] = ast.literal_eval(node.value)
    return out


def test_traceability_every_spec_has_decision_provenance_and_test():
    specs, decs, traces = _specs(), _decisions(), _traces()
    assert len(specs) == 12 and decs
    traced = {t for ts in traces.values() for t in ts}
    for sid, body in specs.items():
        back = re.findall(r"\[(D-\d{2})\]", body)
        assert back and all(b in decs for b in back), sid
        assert "[P:" in body, sid
        assert sid in traced, f"{sid} has no test"
        for b in back:
            assert sid in decs[b], f"{b} missing forward link to {sid}"


def test_traceability_trace_ids_exist_and_decisions_link_back():
    specs, decs, traces = _specs(), _decisions(), _traces()
    for f, ts in traces.items():
        assert all(t in specs for t in ts), f
    for did, body in decs.items():
        fwd = re.findall(r"SPEC-\d{3}", body)
        assert fwd, did
        for s in fwd:
            assert s in specs and f"[{did}]" in specs[s], (did, s)


def test_traceability_every_test_file_declares_traces():
    traces = _traces()
    for f in TESTDIR.glob("test_*.py"):
        assert f.name in traces, f"{f.name} lacks TRACES"
