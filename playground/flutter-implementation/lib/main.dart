import 'package:flutter/material.dart';
import 'dart:math' as Math;
import 'dart:async';

void main() => runApp(DoomFireApp());

class DoomFireApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fire Implementation',
      home: DoomFire(),
    );
  }
}

class DoomFire extends StatefulWidget {
  DoomFire({Key key}) : super(key: key);
  @override
  _DoomFireState createState() => _DoomFireState();
}

class _DoomFireState extends State<DoomFire> {

  bool isRunning = false;
  bool debug = false;
  double pixelSize = 5;
  int fireWidth = 60;
  int fireHeight = 60;

  var firePixelArray = <int>[];
  var fireColorsPalette = [{'r': 7, 'g': 7, 'b': 7},{'r': 31, 'g': 7, 'b': 7},{'r': 47, 'g': 15, 'b': 7},{'r': 71, 'g': 15, 'b': 7},{'r': 87, 'g': 23, 'b': 7},{'r': 103, 'g': 31, 'b': 7},{'r': 119, 'g': 31, 'b': 7},{'r': 143, 'g': 39, 'b': 7},{'r': 159, 'g': 47, 'b': 7},{'r': 175, 'g': 63, 'b': 7},{'r': 191, 'g': 71, 'b': 7},{'r': 199, 'g': 71, 'b': 7},{'r': 223, 'g': 79, 'b': 7},{'r': 223, 'g': 87, 'b': 7},{'r': 223, 'g': 87, 'b': 7},{'r': 215, 'g': 95, 'b': 7},{'r': 215, 'g': 95, 'b': 7},{'r': 215, 'g': 103, 'b': 15},{'r': 207, 'g': 111, 'b': 15},{'r': 207, 'g': 119, 'b': 15},{'r': 207, 'g': 127, 'b': 15},{'r': 207, 'g': 135, 'b': 23},{'r': 199, 'g': 135, 'b': 23},{'r': 199, 'g': 143, 'b': 23},{'r': 199, 'g': 151, 'b': 31},{'r': 191, 'g': 159, 'b': 31},{'r': 191, 'g': 159, 'b': 31},{'r': 191, 'g': 167, 'b': 39},{'r': 191, 'g': 167, 'b': 39},{'r': 191, 'g': 175, 'b': 47},{'r': 183, 'g': 175, 'b': 47},{'r': 183, 'g': 183, 'b': 47},{'r': 183, 'g': 183, 'b': 55},{'r': 207, 'g': 207, 'b': 111},{'r': 223, 'g': 223, 'b': 159},{'r': 239, 'g': 239, 'b': 199},{'r': 255, 'g': 255, 'b': 255},];

  void createFireDataStructure() {
    var numberOfPixels = fireHeight * fireWidth;

    firePixelArray = [];
    for (int i = 0; i < numberOfPixels; i++) {
        firePixelArray.add(0);
    }
  }

  void createFireSource() {
    for (int column = 0; column < fireWidth; column++) {
      var overflowPixelIndex = fireWidth * fireHeight;
      var pixelIndex = (overflowPixelIndex - fireWidth) + column;

      firePixelArray[pixelIndex] = 36;
    }
  }

  void calculateFirePropagation() {
      for (int column = 0; column < fireWidth; column++) {
        for (int row = 0; row < fireHeight; row++) {
          var pixelIndex = column + (fireWidth * row);
          updateFireIntensityPerPixel(pixelIndex);
        }
      }

      setState(() {
        firePixelArray = firePixelArray;
      });
  }

  void updateFireIntensityPerPixel(int currentPixelIndex) {
    var belowPixelIndex = currentPixelIndex + fireWidth;

    if (belowPixelIndex >= (fireWidth * fireHeight)) {
      return;
    }

    var decay = Math.Random().nextInt(3);
    var belowPixelFireIntensity = firePixelArray[belowPixelIndex];
    var newFireIntensity = belowPixelFireIntensity - decay;
    if (newFireIntensity < 0) {
      newFireIntensity = 0;
    }

    firePixelArray[currentPixelIndex] = newFireIntensity;
  }

  @override
  Widget build(BuildContext context) {

    if (!isRunning) {
      isRunning = true;
      createFireDataStructure();
      createFireSource();
      new Timer.periodic(const Duration(milliseconds:50), (Timer t) => calculateFirePropagation());
    }

    return Scaffold(
      backgroundColor: Color.fromRGBO(7, 7, 7, 1),
      body: Center(
              child: Container(
                width: fireWidth * pixelSize,
                height: fireHeight * pixelSize,
                child: Wrap(
                  children: firePixelArray.map((intensity) => Container(
                    child: debug ? Text(intensity.toString(), style: TextStyle(color: Colors.white),) : Container(),
                    width: pixelSize,
                    height: pixelSize,
                    color: Color.fromRGBO(fireColorsPalette[intensity]['r'], fireColorsPalette[intensity]['g'], fireColorsPalette[intensity]['b'], 1)
                  )).toList()
                ),
              ),
            ),
    );
  }
}