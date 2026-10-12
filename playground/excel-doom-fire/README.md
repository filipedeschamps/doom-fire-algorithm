# excel-doom-fire

The Doom fire algorithm in plain Excel — formulas and conditional formatting, no macros.

## Vanilla (M1)

Open `vanilla/doom-fire.xlsx` in Excel. Hold **F9** to animate — each recalculation is one frame.

The fire is driven entirely by volatile formulas (`RANDBETWEEN` re-rolls on every recalc) and 37 conditional-formatting rules (one per palette colour). No VBA, no macros, no LET, no dynamic arrays.

### How it works

- **Fire** sheet (`A1:BH40`, 60×40): bottom row = `=Source` (default 36). Each cell above pulls `MAX(0, below − decay)` with a random left/right wind shift.
- **Decay** sheet (`A1:BH39`): `=RANDBETWEEN(0,2)` per cell — the random decay + wind that propagates upward each frame.
- **Source** cell (`A42`): whole-number validation 0..36. Set to 36 for full fire, 0 to extinguish.

### Regenerate

```
python vanilla/build_vanilla.py --out vanilla/doom-fire.xlsx
```

## VBA (M2)

Open `vba/doom-fire.xlsm` in Excel. Enable macros, then press **Start** to animate the fire — a VBA `DoEvents`/`Timer` loop runs at about 50 ms per frame (fire.js L12). Press **Stop** to halt it.

Six buttons on the Fire sheet control the fire: Start, Stop, Create source (bottom row = 36), Destroy source (bottom row = 0), Increase source (+random 0..13), and Decrease source (-random 0..13). The fire state is a 1-D `Long` array propagated in place with the push-form wind shift from fire.js L23-49, and each frame is written to `FireGrid` as a single 2-D `Variant` array. Colours come from 37 conditional-format rules (one per palette entry), not per-cell `Interior` loops.

### Regenerate

```
python vba/build_vba.py --out vba/doom-fire.xlsm
```

The build is offline: `vba/src/*.bas` is the source of truth, `vba/ovba_writer.py` turns it into a `vbaProject.bin`, and XlsxWriter assembles the workbook, buttons, conditional formats, and embedded VBA project. No Excel is needed to build; Excel compiles the VBA source on load.
