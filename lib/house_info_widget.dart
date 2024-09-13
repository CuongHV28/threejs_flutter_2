import 'dart:convert';

import 'package:flutter/material.dart';
import 'model/house.dart';
import 'package:webview_flutter/webview_flutter.dart';

class HouseWidget extends StatefulWidget {
  final House house;
  const HouseWidget({super.key, required this.house});

  @override
  HouseWidgetState createState() => HouseWidgetState();
}

class HouseWidgetState extends State<HouseWidget> {
  late final WebViewController _controller;
  final _numberOfGroundFloorController = TextEditingController();
  final _numberOfUndergroundFloorController = TextEditingController();
  late int _numberOfGroundFloor;
  late int _numberOfUndergroundFloor;
  late bool _hasSemiBasement;

  String? _retrievedHouseSettings;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadFlutterAsset('assets/threejs-house/index.html')
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            // Update loading bar.
          },
          onPageStarted: (String url) {},
          onPageFinished: (String url) {
            _showHouse();
          },
          onWebResourceError: (WebResourceError error) {},
        ),
      );

    _numberOfGroundFloor = widget.house.soTangNoi;
    _numberOfUndergroundFloor = widget.house.soTangHam;
    _hasSemiBasement = widget.house.hasSemiBasement;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _showHouse();
    });
  }

  @override
  void dispose() {
    _numberOfGroundFloorController.dispose();
    _numberOfUndergroundFloorController.dispose();
    super.dispose();
  }

  void _showHouse() {
    final jsonString = widget.house.houseSettings;
    _controller.runJavaScript('window.showHouse($jsonString);');
  }

  String _generateHouseSettings() {
    var currentHouseSettings = jsonDecode(widget.house.houseSettings);

    // tang ban ham
    if (!_hasSemiBasement) {
      currentHouseSettings.remove("semiBasement");
    } else {
      currentHouseSettings["semiBasement"] ??= {
        "FrontWallSettings": 'LargeSideD1',
        "LeftWallSettings": 'LargeSidePlain',
        "BackWallSettings": 'LargeSidePlain',
        "RightWallSettings": 'LargeSidePlain',
        "StairSettings": 'stairSettings'
      };
    }

    // tang ham
    if (_numberOfUndergroundFloor > 0) {
      currentHouseSettings["basements"] = [];
      for (var i = 0; i < _numberOfUndergroundFloor; i++) {
        currentHouseSettings["basements"].add({
          'FrontWallSettings': 'LargeSidePlain',
          'LeftWallSettings': 'LargeSidePlain',
          'BackWallSettings': 'LargeSidePlain',
          'RightWallSettings': 'LargeSidePlain',
          'StairSettings': 'stairSettings'
        });
      }
    } else {
      currentHouseSettings.remove("basements");
    }

    // tang noi
    if (_numberOfGroundFloor == 1) {
      currentHouseSettings.remove("highFloors");
    } else if (_numberOfGroundFloor >= 2) {
      var highfloorSettings;
      if (currentHouseSettings["highFloors"] != null &&
          currentHouseSettings["highFloors"].isNotEmpty) {
        highfloorSettings = currentHouseSettings["highFloors"][0];
      }
      currentHouseSettings["highFloors"] = [];
      for (var i = 1; i < _numberOfGroundFloor; i++) {
        if (highfloorSettings != null) {
          currentHouseSettings["highFloors"].add(highfloorSettings);
        } else {
          currentHouseSettings["highFloors"].add({
            'FrontWallSettings': 'LargeSideD2B',
            'LeftWallSettings': 'LargeSidePlain',
            'BackWallSettings': 'LargeSidePlain',
            'RightWallSettings': 'LargeSideW1',
            'StairSettings': 'stairSettings'
          });
        }
      }
    } else {
      return "Số tầng nổi phải lớn hơn 0";
    }
    return jsonEncode(currentHouseSettings);
  }

  void _previewHouse() {
    var houseSettings = _generateHouseSettings();
    _controller.runJavaScript('window.showHouse($houseSettings);');
  }

  void _saveHouseSettings() async {
    final result = _generateHouseSettings();
    setState(() {
      _retrievedHouseSettings = result;
    });
  }

  void _incrementGroundFloor() {
    setState(() {
      _numberOfGroundFloor++;
    });
  }

  void _decrementGroundFloor() {
    setState(() {
      if (_numberOfGroundFloor > 0) _numberOfGroundFloor--;
    });
  }

  void _incrementUndergroundFloor() {
    setState(() {
      _numberOfUndergroundFloor++;
    });
  }

  void _decrementUndergroundFloor() {
    setState(() {
      if (_numberOfUndergroundFloor > 0) _numberOfUndergroundFloor--;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Three.js House'),
      ),
      body: Column(
        children: [
          Expanded(
            child: WebViewWidget(controller: _controller),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Số tầng nổi: '),
                          Row(
                            children: [
                              Center(
                                child: Container(
                                  width: 24.0, // Set the desired width
                                  height: 24.0, // Set the desired height
                                  decoration: BoxDecoration(
                                    color: Colors
                                        .white54, // Customize the background color
                                    borderRadius: BorderRadius.circular(12.0),
                                    border: Border.all(
                                        color: Colors
                                            .black45), // Optional: Add a border
                                  ),
                                  child: Center(
                                    child: GestureDetector(
                                      onTap: _decrementGroundFloor,
                                      child: const Icon(Icons.remove,
                                          size: 16,
                                          color: Colors
                                              .black87), // Smaller icon size
                                    ),
                                  ),
                                ),
                              ),
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 8.0),
                                child: Text('$_numberOfGroundFloor'),
                              ),
                              Center(
                                child: Container(
                                  width: 24.0, // Set the desired width
                                  height: 24.0, // Set the desired height
                                  decoration: BoxDecoration(
                                    color: Colors
                                        .white54, // Customize the background color
                                    borderRadius: BorderRadius.circular(12.0),
                                    border: Border.all(
                                        color: Colors
                                            .black45), // Optional: Add a border
                                  ),
                                  child: Center(
                                    child: GestureDetector(
                                      onTap: _incrementGroundFloor,
                                      child: const Icon(Icons.add,
                                          size: 16,
                                          color: Colors
                                              .black87), // Smaller icon size
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Số tầng hầm: '),
                          Row(
                            children: [
                              Center(
                                child: Container(
                                  width: 24.0, // Set the desired width
                                  height: 24.0, // Set the desired height
                                  decoration: BoxDecoration(
                                    color: Colors
                                        .white54, // Customize the background color
                                    borderRadius: BorderRadius.circular(12.0),
                                    border: Border.all(
                                        color: Colors
                                            .black45), // Optional: Add a border
                                  ),
                                  child: Center(
                                    child: GestureDetector(
                                      onTap: _decrementUndergroundFloor,
                                      child: const Icon(Icons.remove,
                                          size: 16,
                                          color: Colors
                                              .black87), // Smaller icon size
                                    ),
                                  ),
                                ),
                              ),
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 8.0),
                                child: Text('$_numberOfUndergroundFloor'),
                              ),
                              Center(
                                child: Container(
                                  width: 24.0, // Set the desired width
                                  height: 24.0, // Set the desired height
                                  decoration: BoxDecoration(
                                    color: Colors
                                        .white54, // Customize the background color
                                    borderRadius: BorderRadius.circular(12.0),
                                    border: Border.all(
                                        color: Colors
                                            .black45), // Optional: Add a border
                                  ),
                                  child: Center(
                                    child: GestureDetector(
                                      onTap: _incrementUndergroundFloor,
                                      child: const Icon(Icons.add,
                                          size: 16,
                                          color: Colors
                                              .black87), // Smaller icon size
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Checkbox(
                      value: _hasSemiBasement,
                      onChanged: (bool? value) {
                        setState(() {
                          _hasSemiBasement = value!;
                        });
                      },
                    ),
                    const Text('Có tầng bán hầm'),
                  ],
                ),
              ],
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                onPressed: _previewHouse,
                child: const Text('Preview House'),
              ),
              ElevatedButton(
                onPressed: _saveHouseSettings,
                child: const Text('Save'),
              ),
            ],
          ),
          if (_retrievedHouseSettings != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text('House Settings: $_retrievedHouseSettings'),
            ),
        ],
      ),
    ));
  }
}
