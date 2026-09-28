# Kanji Notebook — Hafalan Kanji N5

Aplikasi web untuk menghafal **kanji JLPT N5 secara berurutan**, dengan desain bergaya **buku catatan kertas**. Dibuat dengan React + Vite.

## Fitur

- **Hafalan (Flashcard) berurutan** — tampilkan kanji satu per satu sesuai urutan, kartu bisa dibalik untuk melihat arti.
- **On'yomi, Kun'yomi & Arti** — lengkap dengan contoh kosakata tiap kanji.
- **Kuis pilihan ganda** — 10 soal acak per sesi, dengan skor dan ringkasan akhir.
- **Simpan progres otomatis** — tandai kanji "sudah hafal" / "sedang belajar"; tersimpan di `localStorage` browser.
- **Dashboard progres** — ringkasan jumlah kanji hafal, sedang belajar, dan belum hafal.
- **Desain kertas** — latar buku bergaris, spiral, font tulisan tangan, kartu flip 3D.

## Data

Berisi **145 kanji level N5** lengkap dengan on'yomi (katakana), kun'yomi (hiragana), arti, dan contoh kosakata.

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
  data/kanji.js             # Data 145 kanji N5
  hooks/useProgress.js      # Simpan progres ke localStorage
  components/Flashcard.jsx  # Mode hafalan kartu berurutan
  components/Quiz.jsx       # Mode kuis pilihan ganda
  App.jsx                   # Kerangka buku + navigasi tab
  index.css / App.css       # Tema "kertas"
```
