import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_fire/color_pallete.dart';
import 'package:flutter_fire/fire_painter.dart';

class DoomFire extends StatefulWidget {
  final Size size;
  final int pixelSize, millisecsToUpdate;

  DoomFire({
    this.size,
    this.pixelSize,
    this.millisecsToUpdate = 50,
  });
  @override
  _DoomFireState createState() {
    int columns = size.width ~/ pixelSize;
    int rows = size.height ~/ pixelSize;
    return _DoomFireState(
      columns: columns,
      rows: rows,
      fireStateSize: columns * rows,
      pixelSize: pixelSize,
      millisecsToUpdate: millisecsToUpdate,
    );
  }
}

class _DoomFireState extends State<DoomFire> {
  final _random = new Random();
  final int pixelSize, millisecsToUpdate;
  final int fireStateSize, columns, rows;
  List<int> fireState;

  _DoomFireState({
    this.fireStateSize,
    this.columns,
    this.rows,
    this.pixelSize,
    this.millisecsToUpdate,
  });

  @override
  void initState() {
    super.initState();
    createFireSource();
    scheduleUpdateState();
  }

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: DoomFirePainter(
        fireData: fireState,
        pixelSize: pixelSize,
      ),
    );
  }

  void createFireSource() {
    List<int> state = List.filled(fireStateSize, 0);

    for (var column = 0; column < columns; column++) {
      int index = column + (columns * (rows - 1));
      state[index] = ColorPallete.colors.length - 1;
    }

    fireState = state;
  }

  void scheduleUpdateState() {
    Timer.periodic(Duration(milliseconds: millisecsToUpdate), (_) {
      setState(() {
        fireState = getUpdatedFireState();
      });
    });
  }

  List<int> getUpdatedFireState() {
    List<int> _newState = fireState;

    for (var row = 0; row < rows - 1; row++) {
      for (var col = 0; col < columns; col++) {
        var currentPixelIndex = col + columns * row;
        var belowPixelIndex = col + columns * (row + 1);

        var intensity = _newState[belowPixelIndex];
        var decay = _random.nextInt(2);

        var newIntensity = intensity - decay;
        newIntensity =
            newIntensity < 0 ? 0 : newIntensity > 36 ? 36 : newIntensity;

        if (currentPixelIndex - decay > 0 &&
            currentPixelIndex < fireStateSize) {
          _newState[currentPixelIndex - decay] = newIntensity;
        } else {
          _newState[currentPixelIndex] = newIntensity;
        }
      }
    }
    return _newState;
  }
}
