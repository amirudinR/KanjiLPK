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

### PENTING — service worker: app INI sekarang PWA (offline-ready)

Riwayat: domain ini pernah dipakai aplikasi **Kotoba** yang juga PWA, dan
meninggalkan **service worker** di browser pengunjung. Dulu app Kanji bukan PWA
dan `index.html` meng-unregister SEMUA service worker.

**Sejak fitur offline dipasang, app Kanji ADALAH PWA** (pakai `vite-plugin-pwa`).
Skrip pembersih di `index.html` sekarang **hanya** membuang service worker/cache
**milik aplikasi lain** (pola nama selain `workbox`/`google-fonts`/`kanji`),
supaya tidak menghapus SW milik kita sendiri. Lihat bagian "PWA / Offline".

## PWA / Offline

App ini **bisa dipakai offline** dan **di-install ke layar utama HP**
("Tambahkan ke layar utama" / "Install app").

### Setup

- Plugin: **`vite-plugin-pwa`** (devDependency). Konfigurasi di `vite.config.js`.
- `registerType: 'autoUpdate'` — versi baru langsung dipakai (tanpa prompt).
- `injectRegister: 'auto'` — registrasi SW disuntik otomatis saat build.
- Saat build menghasilkam: `dist/sw.js`, `dist/workbox-*.js`, `dist/manifest.webmanifest`, `dist/registerSW.js`.

### Yang di-cache (offline)

1. **App shell** — semua JS/CSS/HTML + ikon lokal (`globPatterns`), lewat
   precache Workbox. ~618 KB (17 entri).
2. **Google Fonts** — `fonts.googleapis.com` (StaleWhileRevalidate) &
   `fonts.gstatic.com` (CacheFirst, 1 tahun). Jadi font tetap tampil offline.
3. **Navigasi SPA** — `navigateFallback: '/index.html'` → refresh rute apa pun
   saat offline tetap membuka app.

> **Catatan:** Canvas cache **bukan** "service worker lama Kotoba". Kalau user
> melaporkan "masih versi lama", itu cache browser biasa → hard-refresh
> (Ctrl+Shift+R) / Incognito. Justru sejak jadi PWA, app memang sengaja
> menyajikan versi dari cache saat offline — itu fitur, bukan bug.

### Ikon PWA

| File | Ukuran | Guna |
| --- | --- | --- |
| `public/pwa-192x192.png` | 192×192 | Ikon standar |
| `public/pwa-512x512.png` | 512×512 | Ikon standar (splash) |
| `public/pwa-maskable-512x512.png` | 512×512 | Maskable (Android adaptive) |
| `public/favicon.svg` | vektor | Favicon + ikon `any` |
| `public/apple-touch-icon.png` | 180×180 | Ikon iOS |

Ikon 192/512/maskable di-render dari `favicon.svg` (kanji 漢 di buku catatan).

### Verifikasi offline (cara uji)

```bash
npm run build
npm run preview -- --port 4173
# buka http://localhost:4173, biarkan SW aktif, lalu:
#   DevTools → Application → Service Workers (harus ada sw.js aktif)
#   Network → set Offline → reload → app tetap jalan
```

Sudah diverifikasi lewat headless Chrome: saat network **dimatikan**, app tetap
ter-render, 5 tab muncul, dan tab Game bisa dibuka — tanpa error.

### ⚠️ Aturan PWA (jangan diubah tanpa paham)

- **JANGAN** kembalikan skrip "unregister SEMUA service worker" di `index.html` —
  itu akan **mematikan mode offline**. Skrip sekarang menyaring hanya SW asing.
- `manifest.start_url`/`scope` = `/` — kalau app dipindah ke subpath, keduanya
  harus disesuaikan.
- Setelah mengubah `vite.config.js` PWA, **wajib** `npm run build` & cek
  `dist/sw.js` + `dist/manifest.webmanifest` ter-generate.

## Fitur

- **PWA / Offline** — Bisa di-install ke HP & dipakai tanpa internet (app shell + font di-cache). Lihat bagian "PWA / Offline".
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

### ⚠️ ATURAN WAJIB — JANGAN ULANGI BUG INI (pelajaran berharga)

Bug-bug di bawah ini dulu **kelihatan sepele tapi fatal** (teks tak terbaca,
halaman tak bisa di-scroll, judul ketiban). Semua **sudah diperbaiki** di commit
`8a2fcc2`. Kalau menyentuh CSS game / tema, **jalankan checklist ini**.

#### 1. JANGAN hardcode warna teks di atas latar yang berubah antar tema

`--danger`, `--highlight`, `--accent-deep`, `--success` **berbeda nilai** di
mode terang vs gelap. Di mode gelap `--danger` jadi salmon terang & `--highlight`
jadi kuning — jadi teks **putih/biru-muda di atasnya jadi tak terbaca**
(rasio sampai **1.13:1**!).

| Kombinasi LARANGAN | Dulu | Sekarang |
| --- | --- | --- |
| `#fff` di atas `var(--danger)` | 2.65:1 ❌ | override → `#2b2a26` |
| `var(--accent-deep)` di atas `var(--highlight)` | 1.13:1 ❌ | → `#2b2a26` |
| `#7a6412` di atas `var(--highlight)` | 3.15:1 ❌ | → `#2b2a26` |
| `#fff` di atas `var(--accent-deep)` (mode gelap) | ~1.2:1 ❌ | → `#14202b` |

**Cara benar:** teks di atas latar terang (kuning `--highlight`, salmon
`--danger`) **selalu pakai `#2b2a26`** (gelap) → aman di kedua tema. Kalau butuh
warna beda per tema, **override di `dark.css`** (jangan ubah token global — bisa
kena semua tab). Elemen yang sudah punya override: `.kg-hero-kanji`, `.kg-stamp`,
`.kg-chip-on`, `.kg-stat.tone-accent/.tone-seal`, `.kg-level.tone-hard/.tone-master`,
`.kg-tag.is-accent`, `.kg-history-badge`.

**Kontras minimum = 4.5:1** (WCAG AA). Verifikasi dengan script rasio sebelum
commit (contoh ada di riwayat commit).

#### 2. JANGAN kunci `overflow`/`height` global di media query mobile

`responsive.css` dulu punya `body { overflow: hidden; height: 100dvh }` di blok
`@media (max-width: 760px) and (orientation: portrait)` yang berlaku untuk
**SEMUA** konten → **halaman jadi tak bisa di-scroll** (menu Game panjang
terpotong). Perbaikannya: **scope ke `.is-landscape`** saja pakai `:has()`:

```css
body:has(.notebook.is-landscape) { overflow: hidden; height: 100dvh; }
.app:has(.notebook.is-landscape) { height: 100dvh; }
```

**Aturan:** kalau mengunci scroll/tinggi viewport, **selalu scope ke kelas
khusus** (bukan `body`/`.app` polos). Konten tab normal HARUS selalu bisa scroll.

#### 3. JANGAN taruh tombol absolute di atas header tanpa ruang

Tombol **"Mode Fokus"** (`right: 12px`) & **"Kunci Putar"** (`right: 118px`)
`position: absolute; top: 10px` di dalam `.notebook`. Dulu `.notebook-head`
hanya dikasih `padding-right: 92px` → **judul "Buku Hafalan Kanji" ketiban
tombol** di mobile. Perbaikan: `padding-right: 0; padding-top: 46px` (beri
baris ruang untuk tombol). **Kalau menambah tombol mengambang, pastikan header
punya ruang (`padding-top`/`padding-right`) yang cukup.**

#### 4. Kontras token tema gelap

`--ink-faint` (`#a8a294`) & `--ink-soft` (`#c4bfb2`) di mode gelap sudah
dinaikkan agar **≥5.35:1**. **Jangan turunkan lagi** di bawah 4.5:1 — banyak
label kecil (`.kg-prompt-label`, `.kg-history-sub`, `.kg-result-eyebrow`,
`.foot-note`) bergantung padanya.

#### 5. Checklist uji wajib sebelum commit perubahan UI

1. `npm run lint` (oxlint) + `npm run build` — **harus hijau**.
2. Render di viewport **390px & 512px**, **mode gelap & terang**.
3. Cek: (a) **scroll** sampai footer, (b) **judul tidak ketiban** tombol,
   (c) **semua teks terbaca** (terutama di atas kuning/merah), (d) tak ada
   error di console.
4. Hitung rasio kontras elemen yang diubah (target ≥4.5:1).

> **Catatan deploy:** Vercel auto-deploy dari GitHub **TIDAK aktif** untuk
> proyek ini (lihat bagian Deploy). Setelah push, jalankan `npx vercel --prod`
> manual. Kalau domain masih menyajikan hash bundle lama, itu **cache browser**
> (hard-refresh), bukan deploy rusak — pastikan dulu semua asset HTTP 200.

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

### Riwayat perubahan AllWords / semua kosakata

| # | File | Perubahan | Alasan | Status |
| --- | --- | --- | --- | --- |
| 1 | `AllWords.jsx`, `allwords.css` | Kartu grid: bungkus tombol kartu dalam `.allwords-card-shell`; tombol aksi (speaker + toggle) pindah ke `.allwords-card-actions` absolute kanan-atas (bukan lagi `<span>` di dalam `<button>`); kartu `padding` atas dinaikkan; kata/baca/arti dapat `max-width:100%` + `overflow-wrap:anywhere` | Teks kanji panjang menabrak tombol `+` di pojok; tombol di dalam `<button>` (HTML invalid) | ada |
| 2 | `AllWords.jsx`, `App.jsx` | Tambah tombol **speaker** (`SpeakerButton`) di kartu grid & baris tabel list; `AllWords` menerima `{...speechProps}` (onSpeak, speechSupported, hasJapaneseVoice) dari App | Belum ada pelafalan di halaman Semua Kosakata | ada |
| 3 | `allwords.css` | Style `.allwords-card-speak` & `.allwords-row-speak` (22px, ikon 13px, tanpa shadow) + `.allwords-card-actions` | Menyesuaikan tombol mini di kartu/baris | ada |
| 4 | `allwords.css`, `AllWords.jsx` | Kartu isi panjang melebar: wrapper dapat class `is-wide` (kata ≥5 char / arti ≥16 char) → `grid-column: span 2`; font kata wide dikecilkan; lepas `word-break: keep-all` | Kartu isi panjang menjulang ke bawah (tinggi-sempit), harusnya melebar ke kanan-kiri | ada |
| 5 | `layout.css`, `allwords.css` | `.notebook` `width:100%` + `max-width:none` (dulu `min(1120px,100%)`); grid `minmax` 190px→210px | Konten tidak penuh di desktop (ruang kosong kiri-kanan) | ada |

**Catatan AllWords:** tombol aksi grid berada di `.allwords-card-actions` (absolute kanan-atas). Jangan kembalikan toggle `+`/speaker ke dalam elemen `<button class="allwords-card">` — nested button invalid & bikin event aneh. `onSpeak` membacakan `item.baca` (furigana), bukan kanji.

### Anti-flash tema (JANGAN dihapus)

Kedip putih saat mode gelap (tema gelap baru diterapkan setelah React jalan) dicegah
dengan **inline script blocking di `<head>` `index.html`** yang men-set
`data-theme` dari `localStorage`/`prefers-color-scheme` **sebelum paint pertama**.
Kunci localStorage wajib sama dengan `THEME_KEY` di `src/hooks/useTheme.js`
(`kanji-hafalan-theme-v1`). `html` juga diberi `background-color: var(--paper-2)`
supaya area overscroll ikut bertema. **Jangan hapus inline script ini** — kalau
dihapus, kedip putih (FOUC) muncul lagi saat dark mode. Kalau `THEME_KEY` diubah,
ubah juga string di `index.html`.

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
| Commit terakhir yang di-push | `ac9b4ff` — "docs(agents): guardrail anti-regresi" (+ fitur PWA setelahnya) |
| Riwayat commit fitur | `6f172bd` (feat Game Kanji) → `004d5e6` (fix mobile+timer/penalti/result) → `8a2fcc2` (fix kontras/scroll/header) → `ac9b4ff` (guardrail docs) → **PWA/offline** |
| File yang diubah (PWA) | `vite.config.js` (plugin PWA), `index.html` (meta + skrip SW), `package.json`, `package-lock.json`, `public/pwa-192x192.png` (baru), `public/pwa-512x512.png` (baru), `public/pwa-maskable-512x512.png` (baru), `AGENTS.md` |
| Status push ke `origin/main` | ✅ sudah |
| Status `npx vercel --prod` | ✅ sudah |
| Verifikasi | Build menghasilkan `sw.js` + `manifest.webmanifest` (precache ~618 KB / 17 entri). Diuji headless Chrome: network **offline** → app tetap render, 5 tab muncul, Game bisa dibuka, font Google ke-cache (`google-fonts-*`), tanpa error |

> **Aturan anti-bentrok proyek ini:**
> - Proyek Kanji **hanya** di `D:\LPK\KanjiLPK-asli` (repo `KanjiLPK`, domain
>   `kanjilpk.vercel.app`). **Jangan** menyentuh `D:\LPK\kanji-hafalan` — itu
>   proyek Kotoba (repo `kotoba50bab`). Nama folder menyesatkan.
> - Sebelum mengubah flashcard, baca tabel "Riwayat perubahan flashcard" di atas
>   agar tidak menimpa perbaikan yang sudah ada.
> - Setelah setiap perubahan: `npm run lint` + `npm run build` **wajib** lolos,
>   lalu commit → push → `npx vercel --prod`, dan perbarui "Status deploy terakhir".
> - **Sebelum menyentuh CSS/tema:** baca bagian "⚠️ ATURAN WAJIB — JANGAN ULANGI
>   BUG INI" di atas. Bug kontras warna, scroll mobile, & header ketiban pernah
>   fatal dan sudah diperbaiki — jangan sampai kambuh.

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
public/
  favicon.svg          # Favicon (kanji 漢)
  pwa-192x192.png      # Ikon PWA
  pwa-512x512.png      # Ikon PWA
  pwa-maskable-512x512.png # Ikon maskable Android
  apple-touch-icon.png # Ikon iOS
vite.config.js         # Vite + vite-plugin-pwa (manifest, SW, cache)
index.html             # Meta PWA + skrip pembersih SW asing + registrasi SW
```
