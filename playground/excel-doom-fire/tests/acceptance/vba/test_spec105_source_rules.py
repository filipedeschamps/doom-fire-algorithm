"""SPEC-105 faithful-port source rules, SPEC-106 test hooks (static checks on vba/src/*.bas)."""
import re

from conftest import PUBLIC_MACROS

TRACES = ["SPEC-105", "SPEC-106"]


def _code(text):
    """Source with comments and string literals blanked (so rules can't be gamed by them)."""
    out = []
    for line in text.splitlines():
        line = re.sub(r'"[^"]*"', '""', line)
        line = re.sub(r"'.*$", "", line)
        out.append(line)
    return "\n".join(out)


def _has_public_sub(code, name, params=r""):
    pat = r"^\s*Public\s+Sub\s+%s\s*\(\s*%s\s*\)" % (name, params)
    return re.search(pat, code, flags=re.I | re.M) is not None


def test_spec105_public_macro_per_button(all_vba_source):
    code = _code(all_vba_source)
    for name in PUBLIC_MACROS:
        assert _has_public_sub(code, name), f"Public Sub {name}() missing"


def test_spec105_constants_from_upstream(all_vba_source):
    code = _code(all_vba_source)
    assert re.search(r"\b60\b", code) and re.search(r"\b40\b", code)
    assert re.search(r"\b36\b", code), "source intensity 36 (fire.js L82-98)"
    assert re.search(r"\b14\b", code), "increase/decrease random range Int(Rnd*14) (L100-130)"
    assert re.search(r"\b50\b", code), "50 ms frame interval (L12)"


def test_spec105_state_is_1d_long_array(all_vba_source):
    code = _code(all_vba_source)
    decls = re.findall(r"^\s*(?:Dim|Private|Public|Static)\s+\w+\s*\(([^)]*)\)\s*As\s+Long\b",
                       code, flags=re.I | re.M)
    assert decls, "1-D Long array for the pixel state (D-11) not declared"
    assert any("," not in d for d in decls), "pixel state must be 1-D (single index)"


def test_spec105_loop_is_doevents_timer_not_ontime(all_vba_source):
    code = _code(all_vba_source)
    assert re.search(r"\bDoEvents\b", code, flags=re.I)
    assert re.search(r"\bTimer\b", code, flags=re.I)
    assert not re.search(r"\bOnTime\b", code, flags=re.I), "Mac OnTime is 1 s granular (D-13)"


def test_spec105_render_is_array_write_not_interior_loop(all_vba_source):
    code = _code(all_vba_source)
    assert not re.search(r"\.Interior\b", code, flags=re.I), "colors come from CF rules (D-12)"
    assert not re.search(r"\.FormatConditions\b", code, flags=re.I), "CF rules are build-time (D-12)"
    assert re.search(r"\.Value2?\s*=", code), "grid written back to the sheet as a value block"


def test_spec105_no_windows_only_apis(all_vba_source):
    code = _code(all_vba_source)
    for bad in (r"\bDeclare\b", r"\bCreateObject\b", r"\bGetObject\b", r"\bWScript\b",
                r"\bSendKeys\b", r"\bScripting\.", r"\bShell\b"):
        assert not re.search(bad, code, flags=re.I), bad


def test_spec106_test_hooks_present(all_vba_source):
    code = _code(all_vba_source)
    assert _has_public_sub(code, "SeedRng", r"(ByVal\s+|ByRef\s+)?seed\s+As\s+Long")
    assert _has_public_sub(code, "StepFrames", r"(ByVal\s+|ByRef\s+)?n\s+As\s+Long")
    assert _has_public_sub(code, "ResetFire")


def test_spec106_seedrng_is_rnd_negative_randomize(all_vba_source):
    code = _code(all_vba_source)
    m = re.search(r"Public\s+Sub\s+SeedRng.*?End\s+Sub", code, flags=re.I | re.S)
    assert m, "SeedRng body not found"
    body = m.group(0)
    assert re.search(r"\bRnd\s*\(?\s*-\s*1\s*\)?", body, flags=re.I)
    assert re.search(r"\bRandomize\s+seed\b", body, flags=re.I)
