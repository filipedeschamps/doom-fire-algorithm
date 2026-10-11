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
