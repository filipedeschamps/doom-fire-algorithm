import 'package:flutter/material.dart';
import 'package:flutter_fire/fire_widget.dart';

void main() => runApp(App());

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter DoomFire Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
        Size screenSize = MediaQuery.of(context).size;
        return DoomFire(
          size: screenSize,
          pixelSize: 4,
          millisecsToUpdate: 25,
        );
      }),
    );
  }
}
