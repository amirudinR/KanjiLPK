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
- **Game Kanji** — Mode "arcade" hafalan kanji: 5 LEVEL × 5 MODE, sesi berisi 100 soal, timer per level, skor + riwayat tersimpan di localStorage. Lihat bagian "Game Kanji" di bawah.
- **Font** — 13 pilihan font (notebook, clean, rounded, hand, mincho, gothic, kyokasho, kaisho, gyosho, sosho, tegaki, pop, yumincho, meiryo).
- **Dark Mode** — Toggle terang/gelap dengan transisi halus.
- **Responsive** — Layout adaptif untuk desktop dan mobile.

## Game Kanji — catatan

Tab **Game** (`src/components/KanjiGame.jsx`) adalah mode latihan "arcade"
sebagai pelengkap Kuis. Bedanya dengan Kuis: Game menguji **seluruh 613 entri**,
punya **5 level** dengan timer & jumlah opsi berbeda, **5 mode** kombinasi
tampil↔jawab, dan mencatat **riwayat skor**.

### Struktur file

| File | Isi |
| --- | --- |
| `src/utils/kanjiGame.js` | Logika murni: `LEVELS`, `MODES`, `SESSION_SIZE`, `buildPool`, `buildQuestions`, `fieldValue`, `toRomaji`, `shuffle` |
| `src/hooks/useKanjiGameStore.js` | Skor & riwayat di localStorage (`kanji-hafalan-game-v1`) |
| `src/components/KanjiGame.jsx` | Halaman game (3 fase: menu → play → result) |
| `src/components/kanjigame/HistoryPanel.jsx` | Panel riwayat |
| `src/styles/kanjigame.css` | Style (import di `styles/index.css`) |

### 5 Level (`LEVELS`)

| Level | id | Batas id kata | Timer | Opsi | Bobot | Penalti |
| --- | --- | --- | --- | --- | --- | --- |
| Gampang | `gampang` | ≤ 50 | — | 3 | ×1 | 0 |
| Sedang | `sedang` | ≤ 150 | 25s | 4 | ×2 | 0 |
| Menengah | `menengah` | semua | 15s | 4 | ×3 | 0 |
| Sulit | `sulit` | semua | 10s | 4 | ×4 | 0 |
| Senpai | `senpai` | semua | 8s | 5 | ×5 | 1 |

- Level rendah sengaja dibatasi ke kata awal (`maxId`) supaya tidak kewalahan.
- Timer habis = soal dihitung salah. Bar timer memerah saat sisa ≤ 30%.
- Skor: `+weight` benar, `−penalty` salah (minimum 0).

### 5 Mode (`MODES`)

1. Bacaan → Kanji (`kana` → `kanji`)
2. Kanji → Arti (`kanji` → `arti`)
3. Arti → Bacaan (`arti` → `kana`)
4. Kanji → Bacaan (`kanji` → `kana`)
5. Kanji → Romaji (`kanji` → `romaji`)

Mode 1–4 memakai data apa adanya. **Mode 5 butuh konversi kana→romaji** karena
data proyek **tidak menyimpan romaji** — dipakai `toRomaji()` (tabel Hepburn
sederhana: digraf きゃ/しゅ/っ double konsonan/ー dibuang). Hasilnya perkiraan,
bukan transkripsi sempurna (mis. コーヒー → "kohi"), tapi cukup untuk opsi kuis.

### Sesi

- `SESSION_SIZE = 100`. Pool urut `id` menaik (bukan diacak) → sesi 1 = kata
  1–100, dst. 613 kata → **7 sesi**.
- Opsi jawaban tetap diacak. Pengecoh diambil dari pool; ditambal dari pool
  penuh lalu dari seluruh 613 entri bila kurang (`buildQuestions`).
- Snapshot pool di Play dibekukan lewat `useMemo` atas `cards` sesi — tidak
  berubah di tengah sesi.

### Penyimpanan (`useKanjiGameStore`)

Key `localStorage` **`kanji-hafalan-game-v1`**:
`{ results: {[levelId]: {[sessionIdx]: {benar,total,skor,at}}}, best: {[levelId]: number}, history: [...] }`.
`saveSession` menyimpan hasil **terbaik** per sesi; `addHistory` menambah entri
riwayat (maks `HISTORY_LIMIT = 60`, terbaru di depan).

### Animasi

`kanjigame.css` punya keyframes: `kg-fade-rise`, `kg-pop-in`, `kg-slide-in`,
`kg-opt-rise`, `kg-shake` (opsi salah), `kg-pulse` (opsi benar), `kg-stamp`
(cap 満). Semua `transform`/`opacity` saja (60fps) dan dinonaktifkan lewat
`@media (prefers-reduced-motion: reduce)`.

### Ikon

Ikon baru di `Icon.jsx` untuk game: `game`, `timer`, `trophy`, `crown`, `fire`,
`clock`, `medal`, `flag`, `trash`, `check`, `cross`, `play`, `arrow`, `back`,
`spark`, `history`. Tambah ikon baru di objek `PATHS` sebelum dipakai — nama
yang tidak ada akan dirender `null` (tombol kosong).

## Flashcard — catatan penting (JANGAN dikembalikan)

Tiga perbaikan pernah dilakukan pada kartu hafalan. Semuanya sengaja dipasang
untuk mengatasi keluhan/masalah nyata di perangkat mobile. **Jangan mengubah
balik** ke pola lama tanpa alasan kuat.

### 1. Tombol kontrol di mode landscape paksa — jangan biarkan melar

Mode landscape paksa aktif saat HP **portrait** (`@media (max-width: 760px)
and (orientation: portrait)` di `responsive.css`): notebook dirotasi 90° dan
`.flashcard-main` jadi grid **3 kolom** — kartu | kontrol (**132px**) | Lompat
Cepat (168px).

Masalah lama: di HP ≤460px, `@media (max-width: 460px)` mengubah
`.flashcard-controls` jadi **grid 2 kolom** dan memberi `.flashcard-btn-flip`
`grid-column: 1 / -1` + `order: -1`. Karena aturan landscape **tidak** meng-set
`display`, grid dari aturan ≤460px tetap menang → tombol "Balik Kartu"
membentang melebihi kolom 132px dan **menimpa tombol lain** (tampak terjepit).

Perbaikan (di blok landscape `responsive.css`):
- `.flashcard-controls` di-set ulang `display: flex; flex-direction: column`
  (menimpa grid dari aturan ≤460px), plus `min-width: 0; max-width: 100%;
  align-items: stretch`.
- `.flashcard-btn-flip` direset `grid-column: auto; order: 0`.
- Setiap `.flashcard-btn` dalam kontrol: `flex: 1 1 0; min-width: 0; max-width:
  100%; white-space: normal; overflow-wrap: anywhere; line-height: 1.15`.

Kalau mengubah aturan landscape atau aturan `max-width: 460px`, **pastikan dua
media query ini tidak bentrok lagi** — grid vs flex pada `.flashcard-controls`.

### 2. Kedipan 3D saat kartu dibalik (WebKit)

Gejala: saat kartu diputar, isi/garis kartu berkedip (khususnya Safari/WebKit).

Perbaikan (`flashcard.css`):
- `.flashcard-face`: `overflow` **`hidden`** (bukan `auto`). `overflow: auto`
  memaksa WebKit me-repaint isi tiap frame saat elemen berputar 3D → kedip.
- `.flashcard-inner`: tambah `will-change: transform` +
  `backface-visibility: hidden` supaya sisi belakang siap sebelum animasi.
- `.flashcard-back`: `overflow-y: auto` + `overscroll-behavior: contain` untuk
  scroll internal tanpa memicu repaint wrapper 3D.

**Jangan** mengubah `.flashcard-face` kembali ke `overflow: auto`, dan jangan
tambahkan `transform` (mis. `translateZ(0)`) pada `.flashcard-face` — itu bisa
menimpa `transform: rotateY(180deg)` milik `.flashcard-back` (spesifisitas sama,
yang terakhir menang) dan merusak sisi belakang.

### 3. Kedipan saat kartu disentuh (Chrome Android) — tap highlight

Gejala: tepat saat kartu **ditekan/disentuh**, ada kilatan seperti kedip.
Penyebabnya bukan animasi, tapi **default Chrome Android**: `.flashcard-flip`
punya `role="button"` + `tabIndex={0}` (agar bisa di-Enter), sehingga Chrome
menampilkan `-webkit-tap-highlight-color` dan ring fokus bawaan saat disentuh.

Perbaikan (`layout.css`, bagian paling atas):
- `* { -webkit-tap-highlight-color: transparent; }` (global, satu kali).
- `.flashcard-flip { outline: none; -webkit-tap-highlight-color: transparent;
  touch-action: manipulation; }`.
- Ring fokus tetap ada lewat `.flashcard-flip:focus-visible { outline: 3px
  solid var(--accent); }` — hanya untuk **keyboard**, bukan sentuh.

**Jangan** hapus aturan ini "demi aksesibilitas" — `:focus-visible` sudah
menggantikan ring untuk keyboard. Menghapusnya akan menghidupkan lagi kedipan
tap di Android.

### 4. `focus()` ke tombol flip — hanya untuk keyboard/mouse

`Flashcard.jsx` memfokuskan tombol flip setiap kali `flipped` berubah, **tetapi
dengan guard**: kalau `matchMedia('(pointer: coarse)')` true (perangkat sentuh),
fokus dilewati. Di HP, memfokuskan tombol memicu scroll + ring fokus yang
tampak seperti kedipan. Jangan hapus guard ini; kehilangan fokus keyboard di
desktop justru regresi aksesibilitas kecil, sedangkan tanpa guard = kedip di HP.

### 5. Isi kartu sisi belakang harus bisa di-scroll — jangan dibalik oleh klik drag

Gejala: kartu sisi belakang (Bacaan/Arti/Kanji/Contoh) isinya lebih tinggi dari
kartu, lalu **tidak bisa digulir** — setiap kali mencoba scroll, kartu justru
terbalik kembali ke sisi depan.

Penyebab: `.flashcard-flip` (induk) punya `onClick` untuk membalik kartu.
Karena `.flashcard-back` berada **di dalam** elemen induk itu, klik yang
mengakhiri gesture scroll dianggap "tap" → kartu keburu terbalik.

Perbaikan yang sudah dipasang:
- `Flashcard.jsx`: `pointerStartRef` merekam titik `pointerdown`; `handleCardClick`
  mem-`return` tanpa membalik kalau pointer berpindah >10px (`dx > 10 || dy > 10`).
  Tap murni (delta ~0–2px) tetap membalik; drag/scroll tidak.
- `flashcard.css`: `.flashcard-back` diberi `scrollbar-gutter: stable`,
  `scrollbar-width: thin`, `scrollbar-color: var(--accent) transparent`, plus
  `::-webkit-scrollbar` yang lebih tebal (10px). Sebelumnya scrollbar terlalu
  tipis/auto-hide sehingga terkesan isi kartu tidak bisa di-scroll.

**Jangan** hilangkan guard drag di `handleCardClick` — tanpa itu, scroll kartu
kembali membalik kartu. Jangan ubah `overflow: hidden` pada `.flashcard-face`
(lihat poin 2) — scroll tetap ditangani `.flashcard-back` yang `overflow-y: auto`.

### 6. `inert` harus boolean `true`, bukan string kosong (React 19)

`FlashcardFront.jsx` & `FlashcardBack.jsx` menyembunyikan sisi kartu yang tidak
aktif dengan `inert`. Di React 19, `inert={flipped ? '' : undefined}` memicu
peringatan console berulang: *"Received an empty string for a boolean attribute
`inert`"*. Perbaikan: pakai `inert={flipped ? true : undefined}`. **Jangan**
kembalikan ke `''` — React 19 memperlakukannya sebagai false + warning tiap
render.

### Regresi yang HARUS diuji ulang setelah menyentuh flashcard

Setelah mengubah `flashcard.css`, `responsive.css`, atau `Flashcard.jsx`, uji:
1. **Desktop** (≥761px): kartu tetap bisa dibalik, ring fokus keyboard muncul.
2. **HP portrait** (≤460px, landscape paksa): tombol kontrol sejajar, tidak ada
   yang terjepit/menimpa; kartu bisa dibalik; **tidak ada kedip** saat disentuh.
3. **HP landscape fisik**: layout 3 kolom normal tetap jalan.
4. `npm run build` + `npm run lint` bersih.

### Riwayat perubahan flashcard (catatan anti-bentrok)

Tabel ini melacak perubahan yang sudah dilakukan agar tidak ada yang mengulang
atau menimpanya tanpa sengaja. Perbarui tabel ini setiap menyentuh flashcard.

| # | File | Perubahan | Alasan | Status |
| --- | --- | --- | --- | --- |
| 1 | `responsive.css` | Reset `.flashcard-controls` jadi flex column + reset `grid-column`/`order` tombol flip di blok landscape | Tombol "Balik Kartu" menimpa tombol lain di HP ≤460px | ada |
| 2 | `flashcard.css` | `.flashcard-face` `overflow: hidden`; `.flashcard-inner` `will-change`+`backface-visibility`; `.flashcard-back` `overflow-y: auto` + `overscroll-behavior: contain` | Kedip 3D di WebKit | ada |
| 3 | `layout.css` | `* { -webkit-tap-highlight-color: transparent }`; `.flashcard-flip` outline/tap-highlight/touch-action; ring `:focus-visible` | Kedip saat disentuh di Chrome Android | ada |
| 4 | `Flashcard.jsx` | `focus()` ke tombol flip dengan guard `pointer: coarse` | Fokus di HP memicu kedip | ada |
| 5 | `Flashcard.jsx`, `flashcard.css` | Guard drag `pointerStartRef` (tolak flip bila delta >10px) + scrollbar `.flashcard-back` dipertegas | Isi kartu sisi belakang tidak bisa di-scroll; tiap scroll kartu terbalik | ada |
| 6 | `FlashcardFront.jsx`, `FlashcardBack.jsx` | `inert={flipped ? true : undefined}` (dulu `''`) | React 19 memperingatkan "empty string for a boolean attribute `inert`" di console | ada |

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
git add -A && git commit -m "..."   # commit ke GitHub (repo KanjiLPK)
git push origin main                # push ke GitHub
npx vercel --prod                   # deploy ke produksi
```

Jika domain `kanjilpk.vercel.app` tidak menampilkan versi terbaru, cek & hapus
alias lama (lihat bagian "PENTING — domain nyangkut" di atas). Setelah deploy,
pesan `Aliased: https://kanjilpk.vercel.app` menandakan domain sudah mengarah
ke deployment baru (tidak nyangkut).

### Status deploy terakhir

| Item | Nilai |
| --- | --- |
| Commit terakhir yang di-push | (menyusul) — "feat: Game Kanji (5 level × 5 mode, sesi 100 soal, timer, riwayat)" |
| File yang diubah | `src/utils/kanjiGame.js` (baru), `src/hooks/useKanjiGameStore.js` (baru), `src/components/KanjiGame.jsx` (baru), `src/components/kanjigame/HistoryPanel.jsx` (baru), `src/styles/kanjigame.css` (baru), `src/components/Icon.jsx`, `src/App.jsx`, `src/styles/index.css`, `AGENTS.md` |
| Status push ke `origin/main` | ⏳ pending |
| Status `npx vercel --prod` | ⏳ pending |

> **Aturan anti-bentrok proyek ini:**
> - Proyek Kanji **hanya** di `D:\LPK\KanjiLPK-asli` (repo `KanjiLPK`, domain
>   `kanjilpk.vercel.app`). **Jangan** menyentuh `D:\LPK\kanji-hafalan` — itu
>   proyek Kotoba (repo `kotoba50bab`). Nama folder menyesatkan.
> - Sebelum mengubah flashcard, baca tabel "Riwayat perubahan flashcard" di atas
>   agar tidak menimpa perbaikan yang sudah ada.
> - Setelah setiap perubahan: `npm run lint` + `npm run build` **wajib** lolos,
>   lalu commit → push → `npx vercel --prod`, dan perbarui "Status deploy terakhir".

## Struktur

```
src/
  data/kosakata.js     # 613 kosakata JFT (urut sesuai docx)
  data/kanjiDict.js    # kamus 490 kanji (KANJIDIC2)
  hooks/               # useProgress, useTheme, useSpeech, useFont, useKanjiGameStore
  utils/               # meanings.js, quiz.js, kanjiDetail.js, kanjiGame.js
  components/
    Icon.jsx           # Ikon SVG
    NotebookHeader.jsx # Header + font picker + theme toggle + badge progres
    TabNav.jsx         # Navigasi tab
    ProgressStrip.jsx  # Strip progres
    Dashboard.jsx      # Dashboard progres + streak + export/import
    Flashcard.jsx      # Mode hafalan kartu berurutan
    Quiz.jsx           # Mode kuis pilihan ganda
    KanjiGame.jsx      # Mode game (5 level × 5 mode, timer, riwayat)
    AllWords.jsx       # Halaman Semua Kosakata (grid/list, search, filter, expandable)
    SpeakerButton.jsx  # Tombol pelafalan audio
    flashcard/         # Sub-komponen: Front, Back, Controls, JumpList
    quiz/              # Sub-komponen: Options, Feedback, Result, Icons
    kanjigame/         # Sub-komponen: HistoryPanel
  styles/
    index.css          # Tema dasar + 13 font options
    layout.css         # Kerangka buku catatan
    flashcard.css      # Mode hafalan
    quiz.css           # Mode kuis
    kanjigame.css      # Mode game kanji
    dashboard.css      # Dashboard progres
    allwords.css       # Halaman Semua Kosakata
    responsive.css     # Responsif mobile/desktop
    dark.css           # Penyesuaian mode gelap
  App.jsx              # Rangkaian utama (routing)
```
