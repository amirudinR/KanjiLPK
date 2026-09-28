# Kanji Notebook — Hafalan Kanji JFT

Aplikasi web untuk menghafal **kosakata/kanji JFT secara berurutan**, dengan desain bergaya **buku catatan kertas**. Dibuat dengan React + Vite.

## Fitur

- **Hafalan (Flashcard) berurutan** — tampilkan kosakata satu per satu sesuai urutan; kartu bisa dibalik untuk melihat cara baca & arti.
- **Audio pelafalan** — tombol speaker membacakan kata/bacaan dengan pelafalan bahasa Jepang (Web Speech API).
- **Kuis pilihan ganda** — 10 soal acak per sesi, dengan skor dan ringkasan akhir.
- **Simpan progres otomatis** — tandai kosakata "sudah hafal" / "sedang belajar"; tersimpan di `localStorage` browser.
- **Dashboard progres** — ringkasan jumlah hafal, sedang belajar, dan belum hafal.
- **Mode gelap** — tombol terang/gelap di header, ikut preferensi sistem, pilihan tersimpan otomatis.
- **Lompat cepat** — grid nomor untuk pindah langsung; responsif di layar ponsel.
- **Desain kertas** — latar buku bergaris, spiral, font tulisan tangan, kartu flip 3D.

## Data

Berisi **613 entri kosakata** dari materi *KANJI JFT (1).docx*, sudah diurutkan sesuai nomor pada file sumber (1 - 613). Tiap entri: `{ id, kata, baca, arti }`.

Ditambah **kamus kanji** (`src/data/kanjiDict.js`) berisi 490 kanji yang dipakai di dataset, lengkap dengan on'yomi, kun'yomi, arti, dan jumlah goresan. Sumber: **KANJIDIC2** (EDRDG, lisensi Creative Commons BY-SA 3.0).

## Sisi Balik Kartu

Saat kartu dibalik, ditampilkan selengkap mungkin:
- **Bacaan** (furigana) dan **Arti** (dipecah per makna)
- **Rincian per-kanji** — karakter, on'yomi (音), kun'yomi (訓), arti, dengan tombol audio per karakter
- **Contoh kata terkait** — kata lain di dataset yang memakai kanji sama (otomatis dari data). Bila tidak ada, muncul keterangan.
- **Nomor** entri

## Audio

Pelafalan memakai **Web Speech API** bawaan browser (tanpa file audio tambahan). Suara bahasa Jepang (ja-JP) hanya muncul bila perangkat/browser menyediakannya. Bila tidak ada, tombol audio otomatis disembunyikan.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Skrip

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Jalankan server pengembangan |
| `npm run build` | Build untuk produksi ke folder `dist/` |
| `npm run preview` | Pratinjau hasil build |
| `npm run lint` | Jalankan oxlint |

## Struktur

```
src/
  data/kosakata.js             # Data 613 kosakata JFT (urut sesuai docx)
  data/kanjiDict.js            # Kamus 490 kanji (KANJIDIC2)
  hooks/                       # useProgress, useTheme, useSpeech, useFont
  utils/                       # meanings.js, quiz.js, kanjiDetail.js
  components/
    Icon.jsx                   # Ikon SVG seragam
    NotebookHeader.jsx         # Kepala buku + pemilih font/tema + badge
    TabNav.jsx                 # Navigasi tab
    ProgressStrip.jsx          # Strip progres
    Dashboard.jsx              # Ringkasan progres (+ Stat)
    Flashcard.jsx              # Penyusun mode hafalan
    Quiz.jsx                   # Penyusun mode kuis
    SpeakerButton.jsx          # Tombol pelafalan (audio)
    flashcard/                 # Sub-komponen: Front, Back, JumpList, Controls
    quiz/                      # Sub-komponen: Options, Feedback, Result, Icons
  styles/                      # CSS modular:
    layout.css                 #   kerangka buku, header, tab, footer
    flashcard.css              #   mode hafalan
    quiz.css                   #   mode kuis
    dashboard.css              #   dashboard progres
    responsive.css             #   tata letak responsif
    dark.css                   #   penyesuaian mode gelap
    index.css                  #   pengimpor semua gaya
  App.jsx                      # Rangkaian utama (ringkas)
  index.css                    # Tema dasar "kertas" + token warna/font
```
