import 'package:flutter/material.dart';
import 'house_info_widget.dart';
import 'model/house.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'dart:convert';

class HouseListWidget extends StatefulWidget {
  const HouseListWidget({super.key});
  @override
  HouseListWidgetState createState() => HouseListWidgetState();
}

final houseSettings = {
  "firstFloor": {
    "FrontWallSettings": "LargeSideD1W1",
    "LeftWallSettings": "LargeSidePlain",
    "BackWallSettings": "LargeSidePlain",
    "RightWallSettings": "LargeSideW1",
    "StairSettings": "stairSettings"
  },
  "highFloors": [
    {
      "FrontWallSettings": "LargeSideD2B",
      "LeftWallSettings": "LargeSidePlain",
      "BackWallSettings": "LargeSidePlain",
      "RightWallSettings": "LargeSideW1",
      "StairSettings": "stairSettings"
    },
    {
      "FrontWallSettings": "LargeSideD2B",
      "LeftWallSettings": "LargeSidePlain",
      "BackWallSettings": "LargeSidePlain",
      "RightWallSettings": "LargeSideW1",
      "StairSettings": "stairSettings"
    }
  ],
  "roof": "RoofBoxHasRailingsSideExits",
  "wallMaterial": "wallMaterial3",
  "isNhaCap4": false
};

final jsonStringHouseSettings = jsonEncode(houseSettings);

class HouseListWidgetState extends State<HouseListWidget> {
  List<House> items = [
    House(
        imageUrl: 'assets/images/huy.jpg',
        title: 'Item 1',
        houseSettings: jsonStringHouseSettings,
        soTangNoi: 3,
        soTangHam: 0,
        hasSemiBasement: false),
    House(
        imageUrl: 'assets/images/huy.jpg',
        title: 'Item 2',
        houseSettings: jsonStringHouseSettings,
        soTangNoi: 3,
        soTangHam: 0,
        hasSemiBasement: false),
    // Add more items here
  ];

  int currentPage = 0;

  void _loadMoreData() {
    // Simulate loading more data
    setState(() {
      items.addAll([
        House(
            imageUrl: 'assets/images/huy.jpg',
            title: 'Item 3',
            houseSettings: jsonStringHouseSettings,
            soTangNoi: 3,
            soTangHam: 0,
            hasSemiBasement: false),
        House(
            imageUrl: 'assets/images/huy.jpg',
            title: 'Item 4',
            houseSettings: jsonStringHouseSettings,
            soTangNoi: 3,
            soTangHam: 0,
            hasSemiBasement: false),
        // Add more items here
      ]);
      currentPage++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('House List')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                return ListTile(
                  leading: Image.asset(item.imageUrl),
                  title: Text(item.title),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => HouseWidget(house: item),
                      ),
                    );
                  },
                );
              },
            ),
          ),
          ElevatedButton(
            onPressed: _loadMoreData,
            child: const Text('Load More'),
          ),
        ],
      ),
    );
  }
}
