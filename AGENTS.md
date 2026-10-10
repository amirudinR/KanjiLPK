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
  components/          # Icon, NotebookHeader, TabNav, Dashboard, Flashcard, Quiz, dll.
  styles/              # CSS modular: layout, flashcard, quiz, dashboard, responsive, dark
  App.jsx
```
