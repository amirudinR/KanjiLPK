// Data kanji level JLPT N5 untuk aplikasi hafalan.
// On'yomi ditulis dalam katakana, kun'yomi dalam hiragana.
// Urutan: angka -> hari & waktu -> orang & keluarga -> alam & benda dasar
//         -> tubuh & penunjuk -> kata sifat & kata kerja -> aktivitas lain.
// Jika suatu kanji tidak memiliki on'yomi/kun'yomi, diberi array kosong [].

export const kanjiN5 = [
  // ===== Angka =====
  {
    id: 1,
    kanji: "一",
    onyomi: ["イチ", "イツ"],
    kunyomi: ["ひと"],
    arti: "satu",
    contoh: [
      { kata: "一つ", baca: "ひとつ", arti: "satu (buah)" },
      { kata: "一月", baca: "いちがつ", arti: "Januari" }
    ],
    level: "N5"
  },
  {
    id: 2,
    kanji: "二",
    onyomi: ["ニ"],
    kunyomi: ["ふた"],
    arti: "dua",
    contoh: [
      { kata: "二つ", baca: "ふたつ", arti: "dua (buah)" },
      { kata: "二月", baca: "にがつ", arti: "Februari" }
    ],
    level: "N5"
  },
  {
    id: 3,
    kanji: "三",
    onyomi: ["サン"],
    kunyomi: ["み", "みっ"],
    arti: "tiga",
    contoh: [
      { kata: "三つ", baca: "みっつ", arti: "tiga (buah)" },
      { kata: "三月", baca: "さんがつ", arti: "Maret" }
    ],
    level: "N5"
  },
  {
    id: 4,
    kanji: "四",
    onyomi: ["シ"],
    kunyomi: ["よ", "よん", "よっ"],
    arti: "empat",
    contoh: [
      { kata: "四つ", baca: "よっつ", arti: "empat (buah)" },
      { kata: "四月", baca: "しがつ", arti: "April" }
    ],
    level: "N5"
  },
  {
    id: 5,
    kanji: "五",
    onyomi: ["ゴ"],
    kunyomi: ["いつ"],
    arti: "lima",
    contoh: [
      { kata: "五つ", baca: "いつつ", arti: "lima (buah)" },
      { kata: "五月", baca: "ごがつ", arti: "Mei" }
    ],
    level: "N5"
  },
  {
    id: 6,
    kanji: "六",
    onyomi: ["ロク"],
    kunyomi: ["む", "むっ"],
    arti: "enam",
    contoh: [
      { kata: "六つ", baca: "むっつ", arti: "enam (buah)" },
      { kata: "六月", baca: "ろくがつ", arti: "Juni" }
    ],
    level: "N5"
  },
  {
    id: 7,
    kanji: "七",
    onyomi: ["シチ"],
    kunyomi: ["なな", "ななっ"],
    arti: "tujuh",
    contoh: [
      { kata: "七つ", baca: "ななつ", arti: "tujuh (buah)" },
      { kata: "七月", baca: "しちがつ", arti: "Juli" }
    ],
    level: "N5"
  },
  {
    id: 8,
    kanji: "八",
    onyomi: ["ハチ"],
    kunyomi: ["や", "やっ"],
    arti: "delapan",
    contoh: [
      { kata: "八つ", baca: "やっつ", arti: "delapan (buah)" },
      { kata: "八月", baca: "はちがつ", arti: "Agustus" }
    ],
    level: "N5"
  },
  {
    id: 9,
    kanji: "九",
    onyomi: ["キュウ", "ク"],
    kunyomi: ["ここの"],
    arti: "sembilan",
    contoh: [
      { kata: "九つ", baca: "ここのつ", arti: "sembilan (buah)" },
      { kata: "九月", baca: "くがつ", arti: "September" }
    ],
    level: "N5"
  },
  {
    id: 10,
    kanji: "十",
    onyomi: ["ジュウ"],
    kunyomi: ["とお"],
    arti: "sepuluh",
    contoh: [
      { kata: "十日", baca: "とおか", arti: "tanggal sepuluh" },
      { kata: "十月", baca: "じゅうがつ", arti: "Oktober" }
    ],
    level: "N5"
  },
  {
    id: 11,
    kanji: "百",
    onyomi: ["ヒャク"],
    kunyomi: [],
    arti: "seratus",
    contoh: [
      { kata: "百円", baca: "ひゃくえん", arti: "seratus yen" }
    ],
    level: "N5"
  },
  {
    id: 12,
    kanji: "千",
    onyomi: ["セン"],
    kunyomi: ["ち"],
    arti: "seribu",
    contoh: [
      { kata: "千円", baca: "せんえん", arti: "seribu yen" }
    ],
    level: "N5"
  },
  {
    id: 13,
    kanji: "万",
    onyomi: ["マン", "バン"],
    kunyomi: [],
    arti: "sepuluh ribu",
    contoh: [
      { kata: "一万", baca: "いちまん", arti: "sepuluh ribu" }
    ],
    level: "N5"
  },
  {
    id: 14,
    kanji: "円",
    onyomi: ["エン"],
    kunyomi: ["まる"],
    arti: "yen; bulat",
    contoh: [
      { kata: "百円", baca: "ひゃくえん", arti: "seratus yen" },
      { kata: "円い", baca: "まるい", arti: "bulat" }
    ],
    level: "N5"
  },

  // ===== Hari & Waktu =====
  {
    id: 15,
    kanji: "日",
    onyomi: ["ニチ", "ジツ"],
    kunyomi: ["ひ", "か"],
    arti: "hari; matahari",
    contoh: [
      { kata: "日本", baca: "にほん", arti: "Jepang" },
      { kata: "日曜日", baca: "にちようび", arti: "hari Minggu" }
    ],
    level: "N5"
  },
  {
    id: 16,
    kanji: "月",
    onyomi: ["ゲツ", "ガツ"],
    kunyomi: ["つき"],
    arti: "bulan; bulan (kalender)",
    contoh: [
      { kata: "月曜日", baca: "げつようび", arti: "hari Senin" },
      { kata: "一月", baca: "いちがつ", arti: "Januari" }
    ],
    level: "N5"
  },
  {
    id: 17,
    kanji: "火",
    onyomi: ["カ"],
    kunyomi: ["ひ"],
    arti: "api",
    contoh: [
      { kata: "火曜日", baca: "かようび", arti: "hari Selasa" },
      { kata: "火", baca: "ひ", arti: "api" }
    ],
    level: "N5"
  },
  {
    id: 18,
    kanji: "水",
    onyomi: ["スイ"],
    kunyomi: ["みず"],
    arti: "air",
    contoh: [
      { kata: "水曜日", baca: "すいようび", arti: "hari Rabu" },
      { kata: "水", baca: "みず", arti: "air" }
    ],
    level: "N5"
  },
  {
    id: 19,
    kanji: "木",
    onyomi: ["モク", "ボク"],
    kunyomi: ["き"],
    arti: "pohon; kayu",
    contoh: [
      { kata: "木曜日", baca: "もくようび", arti: "hari Kamis" },
      { kata: "木", baca: "き", arti: "pohon" }
    ],
    level: "N5"
  },
  {
    id: 20,
    kanji: "金",
    onyomi: ["キン", "コン"],
    kunyomi: ["かね"],
    arti: "emas; uang",
    contoh: [
      { kata: "金曜日", baca: "きんようび", arti: "hari Jumat" },
      { kata: "お金", baca: "おかね", arti: "uang" }
    ],
    level: "N5"
  },
  {
    id: 21,
    kanji: "土",
    onyomi: ["ド", "ト"],
    kunyomi: ["つち"],
    arti: "tanah",
    contoh: [
      { kata: "土曜日", baca: "どようび", arti: "hari Sabtu" },
      { kata: "土", baca: "つち", arti: "tanah" }
    ],
    level: "N5"
  },
  {
    id: 22,
    kanji: "曜",
    onyomi: ["ヨウ"],
    kunyomi: [],
    arti: "hari (dalam nama hari)",
    contoh: [
      { kata: "日曜日", baca: "にちようび", arti: "hari Minggu" }
    ],
    level: "N5"
  },
  {
    id: 23,
    kanji: "年",
    onyomi: ["ネン"],
    kunyomi: ["とし"],
    arti: "tahun",
    contoh: [
      { kata: "今年", baca: "ことし", arti: "tahun ini" },
      { kata: "去年", baca: "きょねん", arti: "tahun lalu" }
    ],
    level: "N5"
  },
  {
    id: 24,
    kanji: "時",
    onyomi: ["ジ"],
    kunyomi: ["とき"],
    arti: "jam; waktu",
    contoh: [
      { kata: "時間", baca: "じかん", arti: "waktu; jam" },
      { kata: "三時", baca: "さんじ", arti: "jam tiga" }
    ],
    level: "N5"
  },
  {
    id: 25,
    kanji: "分",
    onyomi: ["フン", "ブン"],
    kunyomi: ["わ"],
    arti: "menit; membagi; mengerti",
    contoh: [
      { kata: "五分", baca: "ごふん", arti: "lima menit" },
      { kata: "分かる", baca: "わかる", arti: "mengerti" }
    ],
    level: "N5"
  },
  {
    id: 26,
    kanji: "半",
    onyomi: ["ハン"],
    kunyomi: ["なか"],
    arti: "setengah",
    contoh: [
      { kata: "二時半", baca: "にじはん", arti: "jam dua lewat tiga puluh menit" }
    ],
    level: "N5"
  },
  {
    id: 27,
    kanji: "今",
    onyomi: ["コン"],
    kunyomi: ["いま"],
    arti: "sekarang",
    contoh: [
      { kata: "今", baca: "いま", arti: "sekarang" },
      { kata: "今日", baca: "きょう", arti: "hari ini" }
    ],
    level: "N5"
  },
  {
    id: 28,
    kanji: "毎",
    onyomi: ["マイ"],
    kunyomi: [],
    arti: "setiap",
    contoh: [
      { kata: "毎日", baca: "まいにち", arti: "setiap hari" },
      { kata: "毎朝", baca: "まいあさ", arti: "setiap pagi" }
    ],
    level: "N5"
  },
  {
    id: 29,
    kanji: "午",
    onyomi: ["ゴ"],
    kunyomi: [],
    arti: "tengah hari",
    contoh: [
      { kata: "午前", baca: "ごぜん", arti: "pagi (AM)" },
      { kata: "午後", baca: "ごご", arti: "siang/sore (PM)" }
    ],
    level: "N5"
  },
  {
    id: 30,
    kanji: "前",
    onyomi: ["ゼン"],
    kunyomi: ["まえ"],
    arti: "sebelum; depan",
    contoh: [
      { kata: "午前", baca: "ごぜん", arti: "pagi (AM)" },
      { kata: "名前", baca: "なまえ", arti: "nama" }
    ],
    level: "N5"
  },
  {
    id: 31,
    kanji: "後",
    onyomi: ["ゴ", "コウ"],
    kunyomi: ["あと", "うし"],
    arti: "sesudah; belakang",
    contoh: [
      { kata: "午後", baca: "ごご", arti: "siang/sore (PM)" },
      { kata: "後ろ", baca: "うしろ", arti: "belakang" }
    ],
    level: "N5"
  },

  // ===== Orang & Keluarga =====
  {
    id: 32,
    kanji: "人",
    onyomi: ["ジン", "ニン"],
    kunyomi: ["ひと"],
    arti: "orang",
    contoh: [
      { kata: "日本人", baca: "にほんじん", arti: "orang Jepang" },
      { kata: "人", baca: "ひと", arti: "orang" }
    ],
    level: "N5"
  },
  {
    id: 33,
    kanji: "男",
    onyomi: ["ダン"],
    kunyomi: ["おとこ"],
    arti: "laki-laki",
    contoh: [
      { kata: "男の人", baca: "おとこのひと", arti: "pria (laki-laki)" },
      { kata: "男の子", baca: "おとこのこ", arti: "anak laki-laki" }
    ],
    level: "N5"
  },
  {
    id: 34,
    kanji: "女",
    onyomi: ["ジョ"],
    kunyomi: ["おんな"],
    arti: "perempuan",
    contoh: [
      { kata: "女の人", baca: "おんなのひと", arti: "wanita" },
      { kata: "女の子", baca: "おんなのこ", arti: "anak perempuan" }
    ],
    level: "N5"
  },
  {
    id: 35,
    kanji: "子",
    onyomi: ["シ"],
    kunyomi: ["こ"],
    arti: "anak",
    contoh: [
      { kata: "子供", baca: "こども", arti: "anak-anak" },
      { kata: "女の子", baca: "おんなのこ", arti: "anak perempuan" }
    ],
    level: "N5"
  },
  {
    id: 36,
    kanji: "父",
    onyomi: ["フ"],
    kunyomi: ["ちち"],
    arti: "ayah",
    contoh: [
      { kata: "父", baca: "ちち", arti: "ayah (sendiri)" },
      { kata: "お父さん", baca: "おとうさん", arti: "ayah (orang lain)" }
    ],
    level: "N5"
  },
  {
    id: 37,
    kanji: "母",
    onyomi: ["ボ"],
    kunyomi: ["はは"],
    arti: "ibu",
    contoh: [
      { kata: "母", baca: "はは", arti: "ibu (sendiri)" },
      { kata: "お母さん", baca: "おかあさん", arti: "ibu (orang lain)" }
    ],
    level: "N5"
  },
  {
    id: 38,
    kanji: "友",
    onyomi: ["ユウ"],
    kunyomi: ["とも"],
    arti: "teman",
    contoh: [
      { kata: "友達", baca: "ともだち", arti: "teman" }
    ],
    level: "N5"
  },
  {
    id: 39,
    kanji: "先",
    onyomi: ["セン"],
    kunyomi: ["さき"],
    arti: "dahulu; ujung depan",
    contoh: [
      { kata: "先生", baca: "せんせい", arti: "guru" },
      { kata: "先週", baca: "せんしゅう", arti: "pekan lalu" }
    ],
    level: "N5"
  },
  {
    id: 40,
    kanji: "生",
    onyomi: ["セイ", "ショウ"],
    kunyomi: ["い", "う", "なま"],
    arti: "hidup; lahir",
    contoh: [
      { kata: "先生", baca: "せんせい", arti: "guru" },
      { kata: "学生", baca: "がくせい", arti: "pelajar; mahasiswa" }
    ],
    level: "N5"
  },
  {
    id: 41,
    kanji: "名",
    onyomi: ["メイ", "ミョウ"],
    kunyomi: ["な"],
    arti: "nama",
    contoh: [
      { kata: "名前", baca: "なまえ", arti: "nama" }
    ],
    level: "N5"
  },

  // ===== Alam & Benda Dasar =====
  {
    id: 42,
    kanji: "山",
    onyomi: ["サン"],
    kunyomi: ["やま"],
    arti: "gunung",
    contoh: [
      { kata: "山", baca: "やま", arti: "gunung" },
      { kata: "富士山", baca: "ふじさん", arti: "Gunung Fuji" }
    ],
    level: "N5"
  },
  {
    id: 43,
    kanji: "川",
    onyomi: ["セン"],
    kunyomi: ["かわ"],
    arti: "sungai",
    contoh: [
      { kata: "川", baca: "かわ", arti: "sungai" }
    ],
    level: "N5"
  },
  {
    id: 44,
    kanji: "天",
    onyomi: ["テン"],
    kunyomi: ["あま"],
    arti: "langit; surga",
    contoh: [
      { kata: "天気", baca: "てんき", arti: "cuaca" }
    ],
    level: "N5"
  },
  {
    id: 45,
    kanji: "気",
    onyomi: ["キ", "ケ"],
    kunyomi: [],
    arti: "semangat; udara",
    contoh: [
      { kata: "天気", baca: "てんき", arti: "cuaca" },
      { kata: "元気", baca: "げんき", arti: "sehat; bersemangat" }
    ],
    level: "N5"
  },
  {
    id: 46,
    kanji: "雨",
    onyomi: ["ウ"],
    kunyomi: ["あめ"],
    arti: "hujan",
    contoh: [
      { kata: "雨", baca: "あめ", arti: "hujan" }
    ],
    level: "N5"
  },
  {
    id: 47,
    kanji: "空",
    onyomi: ["クウ"],
    kunyomi: ["そら", "あ", "から"],
    arti: "langit; kosong",
    contoh: [
      { kata: "空", baca: "そら", arti: "langit" },
      { kata: "空気", baca: "くうき", arti: "udara" }
    ],
    level: "N5"
  },
  {
    id: 48,
    kanji: "花",
    onyomi: ["カ"],
    kunyomi: ["はな"],
    arti: "bunga",
    contoh: [
      { kata: "花", baca: "はな", arti: "bunga" },
      { kata: "花見", baca: "はなみ", arti: "melihat bunga sakura" }
    ],
    level: "N5"
  },
  {
    id: 49,
    kanji: "白",
    onyomi: ["ハク"],
    kunyomi: ["しろ", "しら"],
    arti: "putih",
    contoh: [
      { kata: "白い", baca: "しろい", arti: "putih" }
    ],
    level: "N5"
  },
  {
    id: 50,
    kanji: "赤",
    onyomi: ["セキ"],
    kunyomi: ["あか", "あか"],
    arti: "merah",
    contoh: [
      { kata: "赤い", baca: "あかい", arti: "merah" }
    ],
    level: "N5"
  },
  {
    id: 51,
    kanji: "青",
    onyomi: ["セイ"],
    kunyomi: ["あお", "あお"],
    arti: "biru; hijau muda",
    contoh: [
      { kata: "青い", baca: "あおい", arti: "biru" }
    ],
    level: "N5"
  },
  {
    id: 52,
    kanji: "本",
    onyomi: ["ホン"],
    kunyomi: ["もと"],
    arti: "buku; asal",
    contoh: [
      { kata: "本", baca: "ほん", arti: "buku" },
      { kata: "日本", baca: "にほん", arti: "Jepang" }
    ],
    level: "N5"
  },
  {
    id: 53,
    kanji: "国",
    onyomi: ["コク"],
    kunyomi: ["くに"],
    arti: "negara",
    contoh: [
      { kata: "外国", baca: "がいこく", arti: "negara asing" },
      { kata: "外国", baca: "がいこく", arti: "luar negeri" }
    ],
    level: "N5"
  },
  {
    id: 54,
    kanji: "語",
    onyomi: ["ゴ"],
    kunyomi: ["かた"],
    arti: "bahasa; kata",
    contoh: [
      { kata: "日本語", baca: "にほんご", arti: "bahasa Jepang" },
      { kata: "英語", baca: "えいご", arti: "bahasa Inggris" }
    ],
    level: "N5"
  },
  {
    id: 55,
    kanji: "学",
    onyomi: ["ガク"],
    kunyomi: ["まな"],
    arti: "belajar; ilmu",
    contoh: [
      { kata: "学生", baca: "がくせい", arti: "pelajar; mahasiswa" },
      { kata: "学校", baca: "がっこう", arti: "sekolah" }
    ],
    level: "N5"
  },
  {
    id: 56,
    kanji: "校",
    onyomi: ["コウ"],
    kunyomi: [],
    arti: "sekolah",
    contoh: [
      { kata: "学校", baca: "がっこう", arti: "sekolah" }
    ],
    level: "N5"
  },
  {
    id: 57,
    kanji: "車",
    onyomi: ["シャ"],
    kunyomi: ["くるま"],
    arti: "mobil; kendaraan",
    contoh: [
      { kata: "車", baca: "くるま", arti: "mobil" },
      { kata: "電車", baca: "でんしゃ", arti: "kereta listrik" }
    ],
    level: "N5"
  },
  {
    id: 58,
    kanji: "電",
    onyomi: ["デン"],
    kunyomi: [],
    arti: "listrik",
    contoh: [
      { kata: "電車", baca: "でんしゃ", arti: "kereta listrik" },
      { kata: "電話", baca: "でんわ", arti: "telepon" }
    ],
    level: "N5"
  },
  {
    id: 59,
    kanji: "話",
    onyomi: ["ワ"],
    kunyomi: ["はな", "はなし"],
    arti: "berbicara; cerita",
    contoh: [
      { kata: "電話", baca: "でんわ", arti: "telepon" },
      { kata: "話す", baca: "はなす", arti: "berbicara" }
    ],
    level: "N5"
  },
  {
    id: 60,
    kanji: "店",
    onyomi: ["テン"],
    kunyomi: ["みせ"],
    arti: "toko",
    contoh: [
      { kata: "店", baca: "みせ", arti: "toko" },
      { kata: "喫茶店", baca: "きっさてん", arti: "kedai kopi" }
    ],
    level: "N5"
  },
  {
    id: 61,
    kanji: "道",
    onyomi: ["ドウ"],
    kunyomi: ["みち"],
    arti: "jalan",
    contoh: [
      { kata: "道", baca: "みち", arti: "jalan" }
    ],
    level: "N5"
  },
  {
    id: 62,
    kanji: "駅",
    onyomi: ["エキ"],
    kunyomi: [],
    arti: "stasiun",
    contoh: [
      { kata: "駅", baca: "えき", arti: "stasiun" }
    ],
    level: "N5"
  },
  {
    id: 63,
    kanji: "家",
    onyomi: ["カ", "ケ"],
    kunyomi: ["いえ", "や"],
    arti: "rumah; keluarga",
    contoh: [
      { kata: "家", baca: "いえ", arti: "rumah" },
      { kata: "家族", baca: "かぞく", arti: "keluarga" }
    ],
    level: "N5"
  },
  {
    id: 64,
    kanji: "間",
    onyomi: ["カン", "ケン"],
    kunyomi: ["あいだ", "ま"],
    arti: "antara; selang waktu",
    contoh: [
      { kata: "時間", baca: "じかん", arti: "waktu; jam" },
      { kata: "間", baca: "あいだ", arti: "antara" }
    ],
    level: "N5"
  },
  {
    id: 65,
    kanji: "食",
    onyomi: ["ショク"],
    kunyomi: ["た", "く"],
    arti: "makan; makanan",
    contoh: [
      { kata: "食べる", baca: "たべる", arti: "makan" },
      { kata: "食べ物", baca: "たべもの", arti: "makanan" }
    ],
    level: "N5"
  },
  {
    id: 66,
    kanji: "飲",
    onyomi: ["イン"],
    kunyomi: ["の"],
    arti: "minum",
    contoh: [
      { kata: "飲む", baca: "のむ", arti: "minum" }
    ],
    level: "N5"
  },
  {
    id: 67,
    kanji: "物",
    onyomi: ["ブツ", "モツ"],
    kunyomi: ["もの"],
    arti: "benda; barang",
    contoh: [
      { kata: "食べ物", baca: "たべもの", arti: "makanan" },
      { kata: "買い物", baca: "かいもの", arti: "belanja" }
    ],
    level: "N5"
  },
  {
    id: 68,
    kanji: "魚",
    onyomi: ["ギョ"],
    kunyomi: ["さかな", "うお"],
    arti: "ikan",
    contoh: [
      { kata: "魚", baca: "さかな", arti: "ikan" }
    ],
    level: "N5"
  },
  {
    id: 69,
    kanji: "口",
    onyomi: ["コウ", "ク"],
    kunyomi: ["くち"],
    arti: "mulut",
    contoh: [
      { kata: "口", baca: "くち", arti: "mulut" },
      { kata: "入口", baca: "いりぐち", arti: "pintu masuk" }
    ],
    level: "N5"
  },
  {
    id: 70,
    kanji: "目",
    onyomi: ["モク"],
    kunyomi: ["め"],
    arti: "mata",
    contoh: [
      { kata: "目", baca: "め", arti: "mata" }
    ],
    level: "N5"
  },
  {
    id: 71,
    kanji: "耳",
    onyomi: ["ジ"],
    kunyomi: ["みみ"],
    arti: "telinga",
    contoh: [
      { kata: "耳", baca: "みみ", arti: "telinga" }
    ],
    level: "N5"
  },
  {
    id: 72,
    kanji: "手",
    onyomi: ["シュ"],
    kunyomi: ["て"],
    arti: "tangan",
    contoh: [
      { kata: "手", baca: "て", arti: "tangan" },
      { kata: "手紙", baca: "てがみ", arti: "surat" }
    ],
    level: "N5"
  },
  {
    id: 73,
    kanji: "足",
    onyomi: ["ソク"],
    kunyomi: ["あし", "た"],
    arti: "kaki",
    contoh: [
      { kata: "足", baca: "あし", arti: "kaki" }
    ],
    level: "N5"
  },

  // ===== Penunjuk & Kata Tanya =====
  {
    id: 74,
    kanji: "上",
    onyomi: ["ジョウ"],
    kunyomi: ["うえ", "あ", "のぼ"],
    arti: "atas",
    contoh: [
      { kata: "上", baca: "うえ", arti: "atas" },
      { kata: "上手", baca: "じょうず", arti: "pandai; mahir" }
    ],
    level: "N5"
  },
  {
    id: 75,
    kanji: "下",
    onyomi: ["カ", "ゲ"],
    kunyomi: ["した", "さ", "くだ", "お"],
    arti: "bawah",
    contoh: [
      { kata: "下", baca: "した", arti: "bawah" },
      { kata: "地下鉄", baca: "ちかてつ", arti: "kereta bawah tanah" }
    ],
    level: "N5"
  },
  {
    id: 76,
    kanji: "中",
    onyomi: ["チュウ"],
    kunyomi: ["なか"],
    arti: "tengah; dalam",
    contoh: [
      { kata: "中", baca: "なか", arti: "dalam" },
      { kata: "中国", baca: "ちゅうごく", arti: "Tiongkok" }
    ],
    level: "N5"
  },
  {
    id: 77,
    kanji: "外",
    onyomi: ["ガイ", "ゲ"],
    kunyomi: ["そと", "ほか"],
    arti: "luar",
    contoh: [
      { kata: "外国", baca: "がいこく", arti: "luar negeri" },
      { kata: "外", baca: "そと", arti: "luar" }
    ],
    level: "N5"
  },
  {
    id: 78,
    kanji: "右",
    onyomi: ["ウ", "ユウ"],
    kunyomi: ["みぎ"],
    arti: "kanan",
    contoh: [
      { kata: "右", baca: "みぎ", arti: "kanan" }
    ],
    level: "N5"
  },
  {
    id: 79,
    kanji: "左",
    onyomi: ["サ"],
    kunyomi: ["ひだり"],
    arti: "kiri",
    contoh: [
      { kata: "左", baca: "ひだり", arti: "kiri" }
    ],
    level: "N5"
  },
  {
    id: 80,
    kanji: "東",
    onyomi: ["トウ"],
    kunyomi: ["ひがし"],
    arti: "timur",
    contoh: [
      { kata: "東", baca: "ひがし", arti: "timur" },
      { kata: "東京", baca: "とうきょう", arti: "Tokyo" }
    ],
    level: "N5"
  },
  {
    id: 81,
    kanji: "西",
    onyomi: ["セイ", "サイ"],
    kunyomi: ["にし"],
    arti: "barat",
    contoh: [
      { kata: "西", baca: "にし", arti: "barat" }
    ],
    level: "N5"
  },
  {
    id: 82,
    kanji: "南",
    onyomi: ["ナン"],
    kunyomi: ["みなみ"],
    arti: "selatan",
    contoh: [
      { kata: "南", baca: "みなみ", arti: "selatan" }
    ],
    level: "N5"
  },
  {
    id: 83,
    kanji: "北",
    onyomi: ["ホク"],
    kunyomi: ["きた"],
    arti: "utara",
    contoh: [
      { kata: "北", baca: "きた", arti: "utara" }
    ],
    level: "N5"
  },

  // ===== Kata Sifat =====
  {
    id: 84,
    kanji: "大",
    onyomi: ["ダイ", "タイ"],
    kunyomi: ["おお"],
    arti: "besar",
    contoh: [
      { kata: "大きい", baca: "おおきい", arti: "besar" },
      { kata: "大学", baca: "だいがく", arti: "universitas" }
    ],
    level: "N5"
  },
  {
    id: 85,
    kanji: "小",
    onyomi: ["ショウ"],
    kunyomi: ["ちい", "こ", "お"],
    arti: "kecil",
    contoh: [
      { kata: "小さい", baca: "ちいさい", arti: "kecil" },
      { kata: "小学校", baca: "しょうがっこう", arti: "sekolah dasar" }
    ],
    level: "N5"
  },
  {
    id: 86,
    kanji: "高",
    onyomi: ["コウ"],
    kunyomi: ["たか"],
    arti: "tinggi; mahal",
    contoh: [
      { kata: "高い", baca: "たかい", arti: "tinggi; mahal" }
    ],
    level: "N5"
  },
  {
    id: 87,
    kanji: "安",
    onyomi: ["アン"],
    kunyomi: ["やす"],
    arti: "murah; aman",
    contoh: [
      { kata: "安い", baca: "やすい", arti: "murah" }
    ],
    level: "N5"
  },
  {
    id: 88,
    kanji: "新",
    onyomi: ["シン"],
    kunyomi: ["あたら", "あら"],
    arti: "baru",
    contoh: [
      { kata: "新しい", baca: "あたらしい", arti: "baru" },
      { kata: "新聞", baca: "しんぶん", arti: "koran" }
    ],
    level: "N5"
  },
  {
    id: 89,
    kanji: "古",
    onyomi: ["コ"],
    kunyomi: ["ふる"],
    arti: "lama; kuno",
    contoh: [
      { kata: "古い", baca: "ふるい", arti: "lama; kuno" }
    ],
    level: "N5"
  },
  {
    id: 90,
    kanji: "長",
    onyomi: ["チョウ"],
    kunyomi: ["なが"],
    arti: "panjang; pemimpin",
    contoh: [
      { kata: "長い", baca: "ながい", arti: "panjang" }
    ],
    level: "N5"
  },
  {
    id: 91,
    kanji: "多",
    onyomi: ["タ"],
    kunyomi: ["おお"],
    arti: "banyak",
    contoh: [
      { kata: "多い", baca: "おおい", arti: "banyak" }
    ],
    level: "N5"
  },
  {
    id: 92,
    kanji: "少",
    onyomi: ["ショウ"],
    kunyomi: ["すこ", "すく"],
    arti: "sedikit",
    contoh: [
      { kata: "少し", baca: "すこし", arti: "sedikit" },
      { kata: "少ない", baca: "すくない", arti: "sedikit" }
    ],
    level: "N5"
  },
  {
    id: 93,
    kanji: "早",
    onyomi: ["ソウ"],
    kunyomi: ["はや"],
    arti: "cepat; awal",
    contoh: [
      { kata: "早い", baca: "はやい", arti: "cepat; pagi-pagi" }
    ],
    level: "N5"
  },
  {
    id: 94,
    kanji: "明",
    onyomi: ["メイ"],
    kunyomi: ["あか", "あき"],
    arti: "terang; jelas",
    contoh: [
      { kata: "明るい", baca: "あかるい", arti: "terang" },
      { kata: "明日", baca: "あした", arti: "besok" }
    ],
    level: "N5"
  },
  {
    id: 95,
    kanji: "暗",
    onyomi: ["アン"],
    kunyomi: ["くら"],
    arti: "gelap",
    contoh: [
      { kata: "暗い", baca: "くらい", arti: "gelap" }
    ],
    level: "N5"
  },
  {
    id: 96,
    kanji: "広",
    onyomi: ["コウ"],
    kunyomi: ["ひろ"],
    arti: "luas",
    contoh: [
      { kata: "広い", baca: "ひろい", arti: "luas" }
    ],
    level: "N5"
  },
  {
    id: 97,
    kanji: "有",
    onyomi: ["ユウ"],
    kunyomi: ["あ"],
    arti: "ada; memiliki",
    contoh: [
      { kata: "有名", baca: "ゆうめい", arti: "terkenal" }
    ],
    level: "N5"
  },
  // ===== Kata Kerja =====
  {
    id: 98,
    kanji: "行",
    onyomi: ["コウ", "ギョウ"],
    kunyomi: ["い", "ゆ"],
    arti: "pergi",
    contoh: [
      { kata: "行く", baca: "いく", arti: "pergi" },
      { kata: "銀行", baca: "ぎんこう", arti: "bank" }
    ],
    level: "N5"
  },
  {
    id: 99,
    kanji: "来",
    onyomi: ["ライ"],
    kunyomi: ["く", "き"],
    arti: "datang",
    contoh: [
      { kata: "来る", baca: "くる", arti: "datang" }
    ],
    level: "N5"
  },
  {
    id: 100,
    kanji: "見",
    onyomi: ["ケン"],
    kunyomi: ["み"],
    arti: "melihat",
    contoh: [
      { kata: "見る", baca: "みる", arti: "melihat" },
      { kata: "見せる", baca: "みせる", arti: "memperlihatkan" }
    ],
    level: "N5"
  },
  {
    id: 101,
    kanji: "聞",
    onyomi: ["ブン"],
    kunyomi: ["き"],
    arti: "mendengar; bertanya",
    contoh: [
      { kata: "聞く", baca: "きく", arti: "mendengar; bertanya" },
      { kata: "新聞", baca: "しんぶん", arti: "koran" }
    ],
    level: "N5"
  },
  {
    id: 102,
    kanji: "読",
    onyomi: ["ドク"],
    kunyomi: ["よ"],
    arti: "membaca",
    contoh: [
      { kata: "読む", baca: "よむ", arti: "membaca" }
    ],
    level: "N5"
  },
  {
    id: 103,
    kanji: "書",
    onyomi: ["ショ"],
    kunyomi: ["か"],
    arti: "menulis",
    contoh: [
      { kata: "書く", baca: "かく", arti: "menulis" },
      { kata: "辞書", baca: "じしょ", arti: "kamus" }
    ],
    level: "N5"
  },
  {
    id: 104,
    kanji: "言",
    onyomi: ["ゲン", "ゴン"],
    kunyomi: ["い"],
    arti: "berkata",
    contoh: [
      { kata: "言う", baca: "いう", arti: "berkata" }
    ],
    level: "N5"
  },
  {
    id: 105,
    kanji: "買",
    onyomi: ["バイ"],
    kunyomi: ["か"],
    arti: "membeli",
    contoh: [
      { kata: "買う", baca: "かう", arti: "membeli" },
      { kata: "買い物", baca: "かいもの", arti: "belanja" }
    ],
    level: "N5"
  },
  {
    id: 106,
    kanji: "立",
    onyomi: ["リツ"],
    kunyomi: ["た"],
    arti: "berdiri",
    contoh: [
      { kata: "立つ", baca: "たつ", arti: "berdiri" }
    ],
    level: "N5"
  },
  {
    id: 107,
    kanji: "出",
    onyomi: ["シュツ"],
    kunyomi: ["で", "だ"],
    arti: "keluar",
    contoh: [
      { kata: "出る", baca: "でる", arti: "keluar" },
      { kata: "出口", baca: "でぐち", arti: "pintu keluar" }
    ],
    level: "N5"
  },
  {
    id: 108,
    kanji: "入",
    onyomi: ["ニュウ"],
    kunyomi: ["い", "はい"],
    arti: "masuk",
    contoh: [
      { kata: "入る", baca: "はいる", arti: "masuk" },
      { kata: "入口", baca: "いりぐち", arti: "pintu masuk" }
    ],
    level: "N5"
  },
  {
    id: 109,
    kanji: "休",
    onyomi: ["キュウ"],
    kunyomi: ["やす"],
    arti: "istirahat; libur",
    contoh: [
      { kata: "休む", baca: "やすむ", arti: "istirahat" },
      { kata: "休み", baca: "やすみ", arti: "hari libur" }
    ],
    level: "N5"
  },
  {
    id: 110,
    kanji: "働",
    onyomi: ["ドウ"],
    kunyomi: ["はたら"],
    arti: "bekerja",
    contoh: [
      { kata: "働く", baca: "はたらく", arti: "bekerja" }
    ],
    level: "N5"
  },
  {
    id: 111,
    kanji: "住",
    onyomi: ["ジュウ"],
    kunyomi: ["す"],
    arti: "tinggal; menetap",
    contoh: [
      { kata: "住む", baca: "すむ", arti: "tinggal" }
    ],
    level: "N5"
  },
  {
    id: 112,
    kanji: "会",
    onyomi: ["カイ", "エ"],
    kunyomi: ["あ"],
    arti: "bertemu; perkumpulan",
    contoh: [
      { kata: "会う", baca: "あう", arti: "bertemu" },
      { kata: "会社", baca: "かいしゃ", arti: "perusahaan" }
    ],
    level: "N5"
  },
  {
    id: 113,
    kanji: "社",
    onyomi: ["シャ"],
    kunyomi: ["やしろ"],
    arti: "perusahaan; kuil",
    contoh: [
      { kata: "会社", baca: "かいしゃ", arti: "perusahaan" }
    ],
    level: "N5"
  },
  {
    id: 114,
    kanji: "銀",
    onyomi: ["ギン"],
    kunyomi: [],
    arti: "perak",
    contoh: [
      { kata: "銀行", baca: "ぎんこう", arti: "bank" }
    ],
    level: "N5"
  },
  {
    id: 115,
    kanji: "寺",
    onyomi: ["ジ"],
    kunyomi: ["てら"],
    arti: "kuil (Buddha)",
    contoh: [
      { kata: "お寺", baca: "おてら", arti: "kuil" }
    ],
    level: "N5"
  },
  {
    id: 116,
    kanji: "病",
    onyomi: ["ビョウ"],
    kunyomi: ["やまい"],
    arti: "sakit; penyakit",
    contoh: [
      { kata: "病院", baca: "びょういん", arti: "rumah sakit" }
    ],
    level: "N5"
  },
  {
    id: 117,
    kanji: "院",
    onyomi: ["イン"],
    kunyomi: [],
    arti: "institusi; lembaga",
    contoh: [
      { kata: "病院", baca: "びょういん", arti: "rumah sakit" }
    ],
    level: "N5"
  },
  {
    id: 118,
    kanji: "図",
    onyomi: ["ズ", "ト"],
    kunyomi: ["はか"],
    arti: "gambar; rencana",
    contoh: [
      { kata: "図書館", baca: "としょかん", arti: "perpustakaan" }
    ],
    level: "N5"
  },
  {
    id: 119,
    kanji: "館",
    onyomi: ["カン"],
    kunyomi: ["やかた"],
    arti: "gedung; bangunan",
    contoh: [
      { kata: "図書館", baca: "としょかん", arti: "perpustakaan" }
    ],
    level: "N5"
  },
  {
    id: 120,
    kanji: "走",
    onyomi: ["ソウ"],
    kunyomi: ["はし"],
    arti: "berlari",
    contoh: [
      { kata: "走る", baca: "はしる", arti: "berlari" }
    ],
    level: "N5"
  },
  {
    id: 121,
    kanji: "歩",
    onyomi: ["ホ", "ブ"],
    kunyomi: ["ある", "あゆ"],
    arti: "berjalan",
    contoh: [
      { kata: "歩く", baca: "あるく", arti: "berjalan" },
      { kata: "散歩", baca: "さんぽ", arti: "jalan-jalan" }
    ],
    level: "N5"
  },
  {
    id: 122,
    kanji: "待",
    onyomi: ["タイ"],
    kunyomi: ["ま"],
    arti: "menunggu",
    contoh: [
      { kata: "待つ", baca: "まつ", arti: "menunggu" }
    ],
    level: "N5"
  },
  {
    id: 123,
    kanji: "作",
    onyomi: ["サク", "サ"],
    kunyomi: ["つく"],
    arti: "membuat",
    contoh: [
      { kata: "作る", baca: "つくる", arti: "membuat" }
    ],
    level: "N5"
  },
  {
    id: 124,
    kanji: "使",
    onyomi: ["シ"],
    kunyomi: ["つか"],
    arti: "memakai; menggunakan",
    contoh: [
      { kata: "使う", baca: "つかう", arti: "memakai" }
    ],
    level: "N5"
  },
  {
    id: 125,
    kanji: "思",
    onyomi: ["シ"],
    kunyomi: ["おも"],
    arti: "berpikir; merasa",
    contoh: [
      { kata: "思う", baca: "おもう", arti: "berpikir; merasa" }
    ],
    level: "N5"
  },
  {
    id: 126,
    kanji: "知",
    onyomi: ["チ"],
    kunyomi: ["し"],
    arti: "tahu",
    contoh: [
      { kata: "知る", baca: "しる", arti: "tahu" }
    ],
    level: "N5"
  },
  {
    id: 127,
    kanji: "帰",
    onyomi: ["キ"],
    kunyomi: ["かえ"],
    arti: "pulang",
    contoh: [
      { kata: "帰る", baca: "かえる", arti: "pulang" }
    ],
    level: "N5"
  },
  {
    id: 128,
    kanji: "教",
    onyomi: ["キョウ"],
    kunyomi: ["おし", "おそ"],
    arti: "mengajar",
    contoh: [
      { kata: "教える", baca: "おしえる", arti: "mengajar; memberitahu" },
      { kata: "教室", baca: "きょうしつ", arti: "ruang kelas" }
    ],
    level: "N5"
  },
  {
    id: 129,
    kanji: "室",
    onyomi: ["シツ"],
    kunyomi: ["むろ"],
    arti: "ruangan",
    contoh: [
      { kata: "教室", baca: "きょうしつ", arti: "ruang kelas" }
    ],
    level: "N5"
  },
  {
    id: 130,
    kanji: "紙",
    onyomi: ["シ"],
    kunyomi: ["かみ"],
    arti: "kertas",
    contoh: [
      { kata: "手紙", baca: "てがみ", arti: "surat" }
    ],
    level: "N5"
  },
  {
    id: 131,
    kanji: "洋",
    onyomi: ["ヨウ"],
    kunyomi: [],
    arti: "samudra; gaya Barat",
    contoh: [
      { kata: "洋服", baca: "ようふく", arti: "pakaian (Barat)" }
    ],
    level: "N5"
  },
  {
    id: 132,
    kanji: "服",
    onyomi: ["フク"],
    kunyomi: [],
    arti: "pakaian",
    contoh: [
      { kata: "洋服", baca: "ようふく", arti: "pakaian (Barat)" }
    ],
    level: "N5"
  },
  {
    id: 133,
    kanji: "地",
    onyomi: ["チ", "ジ"],
    kunyomi: [],
    arti: "tanah; bumi",
    contoh: [
      { kata: "地下鉄", baca: "ちかてつ", arti: "kereta bawah tanah" }
    ],
    level: "N5"
  },
  {
    id: 134,
    kanji: "鉄",
    onyomi: ["テツ"],
    kunyomi: [],
    arti: "besi",
    contoh: [
      { kata: "地下鉄", baca: "ちかてつ", arti: "kereta bawah tanah" }
    ],
    level: "N5"
  },
  {
    id: 135,
    kanji: "週",
    onyomi: ["シュウ"],
    kunyomi: [],
    arti: "pekan; minggu",
    contoh: [
      { kata: "先週", baca: "せんしゅう", arti: "pekan lalu" },
      { kata: "毎週", baca: "まいしゅう", arti: "setiap pekan" }
    ],
    level: "N5"
  },
  {
    id: 136,
    kanji: "去",
    onyomi: ["キョ", "コ"],
    kunyomi: ["さ"],
    arti: "pergi; lalu",
    contoh: [
      { kata: "去年", baca: "きょねん", arti: "tahun lalu" }
    ],
    level: "N5"
  },
  {
    id: 137,
    kanji: "朝",
    onyomi: ["チョウ"],
    kunyomi: ["あさ"],
    arti: "pagi",
    contoh: [
      { kata: "朝", baca: "あさ", arti: "pagi" },
      { kata: "毎朝", baca: "まいあさ", arti: "setiap pagi" }
    ],
    level: "N5"
  },
  {
    id: 138,
    kanji: "昼",
    onyomi: ["チュウ"],
    kunyomi: ["ひる"],
    arti: "siang",
    contoh: [
      { kata: "昼", baca: "ひる", arti: "siang" },
      { kata: "昼ご飯", baca: "ひるごはん", arti: "makan siang" }
    ],
    level: "N5"
  },
  {
    id: 139,
    kanji: "夜",
    onyomi: ["ヤ"],
    kunyomi: ["よる", "よ"],
    arti: "malam",
    contoh: [
      { kata: "夜", baca: "よる", arti: "malam" }
    ],
    level: "N5"
  },
  {
    id: 140,
    kanji: "飯",
    onyomi: ["ハン"],
    kunyomi: ["めし"],
    arti: "nasi; makan",
    contoh: [
      { kata: "ご飯", baca: "ごはん", arti: "nasi; makanan" },
      { kata: "昼ご飯", baca: "ひるごはん", arti: "makan siang" }
    ],
    level: "N5"
  },
  {
    id: 141,
    kanji: "茶",
    onyomi: ["チャ", "サ"],
    kunyomi: [],
    arti: "teh",
    contoh: [
      { kata: "お茶", baca: "おちゃ", arti: "teh" },
      { kata: "喫茶店", baca: "きっさてん", arti: "kedai kopi" }
    ],
    level: "N5"
  },
  {
    id: 142,
    kanji: "肉",
    onyomi: ["ニク"],
    kunyomi: [],
    arti: "daging",
    contoh: [
      { kata: "肉", baca: "にく", arti: "daging" }
    ],
    level: "N5"
  },
  {
    id: 143,
    kanji: "犬",
    onyomi: ["ケン"],
    kunyomi: ["いぬ"],
    arti: "anjing",
    contoh: [
      { kata: "犬", baca: "いぬ", arti: "anjing" }
    ],
    level: "N5"
  },
  {
    id: 144,
    kanji: "鳥",
    onyomi: ["チョウ"],
    kunyomi: ["とり"],
    arti: "burung",
    contoh: [
      { kata: "鳥", baca: "とり", arti: "burung" }
    ],
    level: "N5"
  },
  {
    id: 145,
    kanji: "牛",
    onyomi: ["ギュウ"],
    kunyomi: ["うし"],
    arti: "sapi",
    contoh: [
      { kata: "牛", baca: "うし", arti: "sapi" },
      { kata: "牛肉", baca: "ぎゅうにく", arti: "daging sapi" }
    ],
    level: "N5"
  }
];

export default kanjiN5;
