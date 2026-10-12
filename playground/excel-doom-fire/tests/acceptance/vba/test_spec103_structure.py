"""SPEC-103 controls + grid placement, SPEC-104 palette conditional formats (structure only)."""
import re
import zipfile

from openpyxl.utils import range_boundaries

from conftest import COLS, GRID_FIRST_ROW, PUBLIC_MACROS, ROWS, upstream_palette

TRACES = ["SPEC-103", "SPEC-104"]

BUTTONS = {  # caption -> macro (D-13)
    "Start": "StartFire",
    "Stop": "StopFire",
    "Create source": "CreateFireSource",
    "Destroy source": "DestroyFireSource",
    "Increase source": "IncreaseFireSource",
    "Decrease source": "DecreaseFireSource",
}


def _fire_drawing_xml(path):
    """Drawing XML attached to sheet `Fire`, found through workbook.xml + rels."""
    with zipfile.ZipFile(path) as z:
        wbx = z.read("xl/workbook.xml").decode()
        rels = z.read("xl/_rels/workbook.xml.rels").decode()
        m = re.search(r'<sheet [^>]*name="Fire"[^>]*r:id="([^"]+)"', wbx) or \
            re.search(r'<sheet [^>]*r:id="([^"]+)"[^>]*name="Fire"', wbx)
        assert m, "no sheet named Fire"
        rid = m.group(1)
        target = re.search(r'<Relationship [^>]*Id="%s"[^>]*Target="([^"]+)"' % rid, rels) or \
            re.search(r'<Relationship [^>]*Target="([^"]+)"[^>]*Id="%s"' % rid, rels)
        sheet = target.group(1).lstrip("/")
        sheet = sheet if sheet.startswith("xl/") else "xl/" + sheet
        relp = sheet.replace("worksheets/", "worksheets/_rels/") + ".rels"
        assert relp in z.namelist(), "Fire sheet has no drawing (no buttons)"
        drel = z.read(relp).decode()
        parts = []
        for tgt in re.findall(r'Target="([^"]*drawings/[^"]+\.(?:xml|vml))"', drel):
            parts.append(z.read("xl/" + tgt.split("../")[-1]).decode())
        assert parts, "Fire sheet has no drawing part"
        return "\n".join(parts)


def _anchors(xml):
    """(macro, caption, top row, bottom row) per button; rows 0-based.
    Handles legacy VML form-control Buttons (XlsxWriter insert_button) and DrawingML shapes."""
    out = []
    for blk in re.findall(r"<v:shape .*?</v:shape>", xml, flags=re.S):
        if 'ObjectType="Button"' not in blk:
            continue
        macro = re.search(r"<x:FmlaMacro>([^<]*)</x:FmlaMacro>", blk)
        text = re.sub(r"<[^>]+>", "", " ".join(re.findall(r"<font[^>]*>.*?</font>", blk, flags=re.S)))
        a = [int(v) for v in re.search(r"<x:Anchor>([^<]*)</x:Anchor>", blk).group(1).split(",")]
        out.append((macro.group(1) if macro else None, text.strip(), a[2], a[6]))
    for blk in re.findall(r"<xdr:twoCellAnchor.*?</xdr:twoCellAnchor>", xml, flags=re.S):
        macro = re.search(r'<xdr:sp[^>]*\smacro="([^"]*)"', blk)
        text = "".join(re.findall(r"<a:t>([^<]*)</a:t>", blk))
        row = int(re.search(r"<xdr:from>.*?<xdr:row>(\d+)</xdr:row>", blk, flags=re.S).group(1))
        to_row = int(re.search(r"<xdr:to>.*?<xdr:row>(\d+)</xdr:row>", blk, flags=re.S).group(1))
        out.append((macro.group(1) if macro else None, text.strip(), row, to_row))
    return out


def test_spec103_fire_is_first_sheet(wb):
    assert wb.sheetnames[0] == "Fire"


def test_spec103_fire_grid_defined_name(wb):
    dn = wb.defined_names.get("FireGrid") if hasattr(wb.defined_names, "get") else None
    assert dn is not None, "defined name FireGrid missing"
    dest = list(dn.destinations)
    assert dest == [("Fire", "$A$%d:$BH$%d" % (GRID_FIRST_ROW, GRID_FIRST_ROW + ROWS - 1))], dest
    c1, r1, c2, r2 = range_boundaries(dest[0][1].replace("$", ""))
    assert (c2 - c1 + 1, r2 - r1 + 1) == (COLS, ROWS)


def test_spec103_six_buttons_wired_to_macros(xlsm_path):
    shapes = [a for a in _anchors(_fire_drawing_xml(xlsm_path)) if a[0]]
    got = {text: macro.split("!")[-1] for macro, text, _r, _t in shapes}
    assert got == BUTTONS, got
    assert set(got.values()) == set(PUBLIC_MACROS)


def test_spec103_buttons_sit_above_the_grid(xlsm_path):
    for macro, text, row, to_row in _anchors(_fire_drawing_xml(xlsm_path)):
        if macro:
            # anchors are 0-based: the grid starts at 0-based row GRID_FIRST_ROW-1
            assert to_row <= GRID_FIRST_ROW - 1, (text, row, to_row)


def test_spec104_exactly_37_equality_rules_with_palette(wb):
    palette = upstream_palette()
    assert len(palette) == 37
    rules = []
    for rng, rs in wb["Fire"].conditional_formatting._cf_rules.items():
        rules += [(str(rng.sqref), r) for r in rs]
    assert len(rules) == 37
    seen = {}
    for _sq, r in rules:
        assert r.type == "cellIs" and r.operator == "equal" and len(r.formula) == 1
        k = int(r.formula[0])
        assert k not in seen
        seen[k] = r
        f = r.dxf.fill
        cols = {str(c.rgb)[-6:].upper() for c in (f.fgColor, f.bgColor)
                if c is not None and isinstance(c.rgb, str) and c.rgb != "00000000"}
        assert "%02X%02X%02X" % palette[k] in cols, (k, cols)
    assert sorted(seen) == list(range(37))


def test_spec104_rules_cover_fire_grid(wb):
    covered = set()
    for rng in wb["Fire"].conditional_formatting._cf_rules:
        for part in str(rng.sqref).split():
            c1, r1, c2, r2 = range_boundaries(part)
            covered |= {(r, c) for r in range(r1, r2 + 1) for c in range(c1, c2 + 1)}
    grid = {(r, c) for r in range(GRID_FIRST_ROW, GRID_FIRST_ROW + ROWS)
            for c in range(1, COLS + 1)}
    assert grid <= covered


def test_spec104_digits_hidden(wb):
    ws = wb["Fire"]
    for r in range(GRID_FIRST_ROW, GRID_FIRST_ROW + ROWS):
        for c in range(1, COLS + 1):
            assert ws.cell(r, c).number_format == ";;;", (r, c)
