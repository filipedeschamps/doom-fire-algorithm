#!/usr/bin/env python3
"""Generate vba/doom-fire.xlsm - Doom fire in Excel + VBA macros.

Builds the macro-enabled workbook from .bas source files using the
offline MS-OVBA writer (ovba_writer.py) + XlsxWriter. Excel compiles
the VBA source on load; no Excel is needed to build.

Upstream: playground/1st-implementation-with-tables/fire.js @854c39f

Layout (SPEC-103):
  Fire (first sheet)  FireGrid = Fire!$A$4:$BH$43 (60 cols x 40 rows)
  Rows 1-3 hold the six buttons.
"""
import argparse
import re
import sys
from pathlib import Path

import xlsxwriter  # type: ignore

HERE = Path(__file__).resolve().parent
SRC = HERE / "src"
REPO = HERE.parents[2]
FIREJS = REPO / "playground" / "1st-implementation-with-tables" / "fire.js"

ROWS, COLS = 40, 60
GRID_FIRST_ROW = 4  # FireGrid starts at row 4 (SPEC-103)


def upstream_palette():
    """37 (r, g, b) tuples parsed from fire.js L5 @854c39f."""
    line = FIREJS.read_text().splitlines()[4]
    return [
        (int(r), int(g), int(b))
        for r, g, b in re.findall(r'"r":(\d+),"g":(\d+),"b":(\d+)', line)
    ]


def read_bas_modules():
    """Read all .bas files from src/ as {name: source_text_with_Attribute_line}."""
    modules = {}
    for p in sorted(SRC.glob("*.bas")):
        modules[p.stem] = p.read_text(encoding="cp1252")
    return modules


def build(out_path: str) -> None:
    from ovba_writer import build_vba_project

    palette = upstream_palette()
    assert len(palette) == 37, f"expected 37 palette entries, got {len(palette)}"

    modules = read_bas_modules()
    assert modules, "no .bas modules found in src/"

    # Build the vbaProject.bin from the .bas source
    vba_bin = build_vba_project(modules)

    # Write the vbaProject.bin to a temp file for XlsxWriter
    import tempfile
    vba_tmp = tempfile.NamedTemporaryFile(
        suffix=".bin", delete=False, dir=HERE
    )
    vba_tmp.write(vba_bin)
    vba_tmp.close()

    try:
        wb = xlsxwriter.Workbook(out_path)
        ws = wb.add_worksheet("Fire")

        # --- Cell format: number format ;;; (digits hidden, SPEC-104) ---
        cell_fmt = wb.add_format({"num_format": ";;;"})

        # --- Conditional formats: 37 cellIs/equal rules (SPEC-104) ---
        cf_range = f"A{GRID_FIRST_ROW}:BH{GRID_FIRST_ROW + ROWS - 1}"
        for k, (r, g, b) in enumerate(palette):
            fmt = wb.add_format(
                {
                    "num_format": ";;;",
                    "bg_color": f"#{r:02X}{g:02X}{b:02X}",
                }
            )
            ws.conditional_format(
                cf_range,
                {
                    "type": "cell",
                    "criteria": "equal to",
                    "value": str(k),
                    "format": fmt,
                },
            )

        # --- Grid cells: write 0 to each cell with ;;; format (digits hidden) ---
        # Writing each cell individually ensures openpyxl sees the number_format
        # at the cell level, not just column level.
        for r in range(ROWS):
            for c in range(COLS):
                ws.write_number(GRID_FIRST_ROW - 1 + r, c, 0, cell_fmt)

        # --- Column widths and row heights ---
        for c in range(COLS):
            ws.set_column(c, c, 3)
        for r in range(GRID_FIRST_ROW, GRID_FIRST_ROW + ROWS):
            ws.set_row(r - 1, 20)

        # --- Defined name FireGrid (SPEC-103) ---
        wb.define_name(
            "FireGrid",
            f"='Fire'!$A${GRID_FIRST_ROW}:$BH${GRID_FIRST_ROW + ROWS - 1}",
        )

        # --- Buttons (SPEC-103, D-13) ---
        # Six buttons above the grid, in rows 1-3
        button_specs = [
            ("Start", "StartFire"),
            ("Stop", "StopFire"),
            ("Create source", "CreateFireSource"),
            ("Destroy source", "DestroyFireSource"),
            ("Increase source", "IncreaseFireSource"),
            ("Decrease source", "DecreaseFireSource"),
        ]

        # Place buttons in rows 1-3, two per row, anchored above row 4
        for i, (caption, macro) in enumerate(button_specs):
            row = i // 2       # 0, 0, 1, 1, 2, 2
            col = (i % 2) * 8  # 0, 8, 0, 8, 0, 8
            ws.insert_button(
                row, col,
                {
                    "caption": caption,
                    "macro": macro,
                },
            )

        # --- Embed the VBA project ---
        wb.add_vba_project(vba_tmp.name)

        wb.close()
    finally:
        import os
        os.unlink(vba_tmp.name)

    print(f"Wrote {out_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate vba/doom-fire.xlsm (macro-enabled Doom fire)."
    )
    parser.add_argument(
        "--out", required=True, help="Output .xlsm path"
    )
    args = parser.parse_args()

    # Ensure src dir exists
    assert SRC.is_dir(), f"src directory not found: {SRC}"

    build(args.out)


if __name__ == "__main__":
    main()
