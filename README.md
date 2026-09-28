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
  hooks/useProgress.js         # Simpan progres ke localStorage
  hooks/useTheme.js            # Mode terang/gelap
  hooks/useSpeech.js           # Pelafalan Jepang (Web Speech API)
  components/Flashcard.jsx     # Mode hafalan kartu berurutan
  components/Quiz.jsx          # Mode kuis pilihan ganda
  components/SpeakerButton.jsx # Tombol pelafalan (audio)
  App.jsx                      # Kerangka buku + navigasi tab
  index.css / App.css          # Tema "kertas"
```
