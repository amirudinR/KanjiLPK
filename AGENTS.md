# AGENTS.md

Panduan untuk AI agent (atau developer) yang mengerjakan proyek ini.

## Ringkasan Proyek

| Item | Nilai |
| --- | --- |
| Nama paket | `kanji-hafalan` (private, `version` 1.0.0) |
| Fungsi | Hafalan kanji/kosakata JFT berurutan (613 entri) |
| Tech stack | React 19 + Vite 8, JavaScript (bukan TypeScript) |
| Styling | CSS modular (`src/styles/`) — bukan Tailwind |
| Data | `src/data/kosakata.js` (613 entri) + `src/data/kanjiDict.js` (490 kanji) |
| Target deploy | Static site di Vercel |
| Repository | `https://github.com/amirudinR/KanjiLPK.git` (branch `main`) |
| Domain produksi | `https://kanjilpk.vercel.app` |
| Folder kerja | `D:\LPK\KanjiLPK-asli` |
| Proyek Vercel | `kanjilpk` (team `amirs-projects-e5d6b990`) |

## Penting

- Folder `D:\LPK\kanji-hafalan` **BUKAN** proyek ini (nama folder menyesatkan).
  Proyek Kanji yang benar ada di **`D:\LPK\KanjiLPK-asli`**.
- Repo `KanjiLPK` pernah keliru ditimpa kode proyek lain (force push). Sudah
  dipulihkan ke versi Kanji asli.

### PENTING — domain `kanjilpk.vercel.app` bisa "nyangkut" di deploy lama

Pernah terjadi: deploy baru tidak muncul di domain, yang tampil malah versi
lama/berbeda. Penyebabnya **alias manual** yang mematok domain ke sebuah
deployment lama (menimpa domain produksi otomatis). Diagnosa & perbaikan:

```bash
# Lihat apakah domain dipatok manual ke deployment lama
npx vercel alias ls | Select-String "kanjilpk"

# Hapus patokan lama (jika ada alias kanjilpk.vercel.app -> deployment lama)
npx vercel alias rm kanjilpk.vercel.app --yes

# Deploy ulang supaya domain mengarah ke versi terbaru
npx vercel --prod
```

Cek hasil:
```bash
(Invoke-WebRequest https://kanjilpk.vercel.app -UseBasicParsing).Content -match '<title>(.*?)</title>'
```
Harus memuat `<title>Kanji Notebook`.

### Auto-deploy dari GitHub tidak aktif

Project Vercel `kanjilpk` **tidak** auto-deploy dari push ke repo `KanjiLPK`.
Setiap ada perubahan, jalankan deploy manual `npx vercel --prod` dari folder ini.
(Alternatif: hubungkan ulang repo di Dashboard Vercel → Settings → Git.)

### PENTING — service worker lama "Kotoba" menyodorkan versi basi

Sebelum proyek Kanji, domain ini pernah dipakai aplikasi **Kotoba** yang merupakan
**PWA** (`vite-plugin-pwa`). PWA meninggalkan **service worker** di browser
pengunjung. Akibatnya browser tetap menyajikan bundle Kotoba lama walau server
sudah mengirim versi Kanji. Gejala: buka `kanjilpk.vercel.app` di browser normal
tampil Kotoba, tapi di Incognito tampil "Kanji Notebook" dengan benar.

Solusi yang sudah dipasang: skrip pembersih di `index.html` yang
**meng-unregister semua service worker** dan **menghapus Cache Storage lama**
(selain cache milik `kanji-notebook`). App Kanji sendiri **bukan** PWA — tidak
ada `vite-plugin-pwa` maupun registrasi SW, jadi pembersihan ini aman.

Pembersihan manual (satu kali per browser yang terpengaruh):
1. Buka DevTools (F12) → tab **Application**.
2. **Service Workers** → klik **Unregister** untuk semua.
3. **Storage** → **Clear site data**.
4. Muat ulang dengan **Ctrl+Shift+R**.

## Fitur

- **Flashcard** — Kartu flip 3D dengan keyboard shortcuts (Space/Enter=flip, ←→=navigasi, K=hafal, L=belajar). Rincian kanji dan contoh kata bisa dibuka-tutup (collapsible).
- **Quiz** — Kuis pilihan ganda dengan keyboard shortcuts (1-4=jawab, Enter=lanjut).
- **Semua Kosakata** — Grid/list toggle, search, filter status (Semua/Hafal/Belajar/Baru), kartu expandable dengan detail lengkap.
- **Progres** — Dashboard dengan streak harian, export/import progress, reset dengan konfirmasi 2-klik.
- **Font** — 13 pilihan font (notebook, clean, rounded, hand, mincho, gothic, kyokasho, kaisho, gyosho, sosho, tegaki, pop, yumincho, meiryo).
- **Dark Mode** — Toggle terang/gelap dengan transisi halus.
- **Responsive** — Layout adaptif untuk desktop dan mobile.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build produksi ke dist/
npm run lint     # oxlint
```

## Deploy

Auto-deploy GitHub **tidak** aktif untuk proyek ini. Deploy manual dari folder
ini setelah setiap perubahan:

```bash
npx vercel --prod
```

Jika domain `kanjilpk.vercel.app` tidak menampilkan versi terbaru, cek & hapus
alias lama (lihat bagian "PENTING — domain nyangkut" di atas).

## Struktur

```
src/
  data/kosakata.js     # 613 kosakata JFT (urut sesuai docx)
  data/kanjiDict.js    # kamus 490 kanji (KANJIDIC2)
  hooks/               # useProgress, useTheme, useSpeech, useFont
  utils/               # meanings.js, quiz.js, kanjiDetail.js
  components/
    Icon.jsx           # Ikon SVG
    NotebookHeader.jsx # Header + font picker + theme toggle + badge progres
    TabNav.jsx         # Navigasi tab
    ProgressStrip.jsx  # Strip progres
    Dashboard.jsx      # Dashboard progres + streak + export/import
    Flashcard.jsx      # Mode hafalan kartu berurutan
    Quiz.jsx           # Mode kuis pilihan ganda
    AllWords.jsx       # Halaman Semua Kosakata (grid/list, search, filter, expandable)
    SpeakerButton.jsx  # Tombol pelafalan audio
    flashcard/         # Sub-komponen: Front, Back, Controls, JumpList
    quiz/              # Sub-komponen: Options, Feedback, Result, Icons
  styles/
    index.css          # Tema dasar + 13 font options
    layout.css         # Kerangka buku catatan
    flashcard.css      # Mode hafalan
    quiz.css           # Mode kuis
    dashboard.css      # Dashboard progres
    allwords.css       # Halaman Semua Kosakata
    responsive.css     # Responsif mobile/desktop
    dark.css           # Penyesuaian mode gelap
  App.jsx              # Rangkaian utama (routing)
```
