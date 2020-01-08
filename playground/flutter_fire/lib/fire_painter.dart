import 'package:flutter/material.dart';
import 'package:flutter_fire/color_pallete.dart';

class DoomFirePainter extends CustomPainter {
  List<int> fireData;
  int pixelSize;
  int columns, rows;

  DoomFirePainter({
    this.fireData,
    this.pixelSize,
  }) {
    this.fireData = fireData;
    this.pixelSize = pixelSize;
  }

  @override
  void paint(Canvas canvas, Size size) {
    Paint paint = Paint();
    columns = size.width ~/ pixelSize;
    rows = size.height ~/ pixelSize;

    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < columns; col++) {
        paint.color = ColorPallete.colors[this.fireData[col + columns * row]];
        canvas.drawRect(
          drawPixel(col, row, pixelSize.toDouble()),
          paint,
        );
      }
    }
  }

  Rect drawPixel(column, row, pixelSize) {
    return Rect.fromPoints(
      Offset(
        column * pixelSize - 1,
        row * pixelSize - 1,
      ),
      Offset(
        (column + 1) * pixelSize + 1,
        (row + 1) * pixelSize + 1,
      ),
    );
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
