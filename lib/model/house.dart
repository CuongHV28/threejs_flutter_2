class House {
  final String imageUrl;
  final String title;
  final String houseSettings;
  final int soTangNoi;
  final int soTangHam;
  final bool hasSemiBasement;

  House({
    required this.imageUrl,
    required this.title,
    required this.houseSettings,
    required this.soTangNoi,
    required this.soTangHam,
    required this.hasSemiBasement,
  });

  Map<String, dynamic> toJson() => {
        'imageUrl': imageUrl,
        'title': title,
        'houseSettings': houseSettings,
        'soTangNoi': soTangNoi,
        'soTangHam': soTangHam,
        '_hasSemiBasement': hasSemiBasement,
      };
}
