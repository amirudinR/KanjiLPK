# AGENTS.md

Panduan untuk AI agent (atau developer) yang mengerjakan proyek ini.

## Ringkasan Proyek

| Item | Nilai |
| --- | --- |
| Nama paket | `kanji-hafalan` (private, `version` 1.0.0) |
| Fungsi | Hafalan kanji/kosakata JFT berurutan (613 entri) |
| Tech stack | React 18 + Vite 8, JavaScript (bukan TypeScript) |
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

Push ke `main` di `KanjiLPK` → Vercel `kanjilpk` auto-deploy.
Deploy manual (dari folder ini):

```bash
npx vercel --prod
```

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
