/**
 * Logika Game Kanji — mode latihan "arcade" untuk hafalan kanji JFT.
 *
 * Berbeda dari `utils/quiz.js` (kuis tunggal: tebak arti dari kanji),
 * game ini:
 *   - menguji SELURUH 613 entri,
 *   - punya 5 LEVEL (gampang → senpai) dengan timer & jumlah opsi berbeda,
 *   - punya 5 MODE (kombinasi tampil ↔ jawab: kana/kanji/arti/romaji),
 *   - dipecah jadi SESI berisi maksimal 100 soal, urut sesuai data,
 *   - mencatat skor & riwayat di localStorage.
 */

import { kosakataJft } from '../data/kosakata.js'

/** Jumlah soal maksimal per sesi. */
export const SESSION_SIZE = 100

/* ------------------------------------------------------------------ *
 * Konversi kana → romaji
 *
 * Data proyek ini hanya menyimpan { id, kata, baca, arti } — tidak ada
 * romaji. Untuk mode "Kanji → Romaji" kita konversi sendiri dari `baca`
 * (hiragana/katakana) memakai tabel Hepburn sederhana. Tidak perlu 100%
 * sempurna; cukup mendekati agar bisa dipakai sebagai opsi jawaban.
 * ------------------------------------------------------------------ */

// Katakana → hiragana (geser blok U+30A1–U+30F6 sebesar -0x60).
function katakanaToHiragana(str) {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  )
}

// Tabel digraf (2 karakter) diproses lebih dulu daripada tunggal.
const DIGRAPHS = {
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo',
  てぃ: 'ti', でぃ: 'di', うぇ: 'we', うぃ: 'wi',
  しぇ: 'she', じぇ: 'je', ちぇ: 'che',
}

const MONOGRAPHS = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'wo', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
  ゔ: 'vu',
  ー: '', // tanda panjang: cukup dilewati untuk perkiraan
}

/**
 * Ubah teks kana (hiragana/katakana) jadi romaji perkiraan.
 * Hanya mengambil cara baca PERTAMA bila ada beberapa (dipisah 、／/).
 */
export function toRomaji(reading) {
  if (!reading) return ''
  const first = String(reading).replace(/[～〜~]/g, '').split(/[、,／/]/)[0].trim()
  if (!first) return ''
  const hira = katakanaToHiragana(first)
  let out = ''
  let geminate = false // menandai っ (konsonan ganda)

  for (let i = 0; i < hira.length; i += 1) {
    const two = hira.slice(i, i + 2)
    const one = hira[i]

    if (one === 'っ') {
      geminate = true
      continue
    }

    let romaji = null
    if (DIGRAPHS[two]) {
      romaji = DIGRAPHS[two]
      i += 1
    } else if (MONOGRAPHS[one] !== undefined) {
      romaji = MONOGRAPHS[one]
    }

    if (romaji === null) {
      // Bukan kana (kanji/simbol/latin) — pertahankan apa adanya.
      out += one
      geminate = false
      continue
    }

    if (geminate && romaji) {
      romaji = romaji[0] + romaji
      geminate = false
    }
    out += romaji
  }

  return out
}

/* ------------------------------------------------------------------ *
 * Level
 * ------------------------------------------------------------------ */

/**
 * @typedef {object} LevelConfig
 * @property {string} id
 * @property {string} jp     Kanji/nama Jepang (visual)
 * @property {string} name   Nama Indonesia
 * @property {string} desc   Keterangan singkat
 * @property {number} maxId  Batas id kosakata yang dipakai (level rendah = awal-awal saja)
 * @property {number} seconds Durasi tiap soal (0 = tanpa timer)
 * @property {number} options Jumlah opsi jawaban
 * @property {number} weight  Bobot skor tiap jawaban benar
 * @property {number} penalty Penalti skor tiap jawaban salah
 * @property {string} icon   Nama ikon (Icon.jsx)
 * @property {string} tone   Warna aksen (css class suffix)
 */

/** @type {LevelConfig[]} */
export const LEVELS = [
  {
    id: 'gampang',
    jp: '初',
    name: 'Gampang',
    desc: '50 kata pertama · tanpa timer',
    maxId: 50,
    seconds: 0,
    options: 3,
    weight: 1,
    penalty: 0,
    icon: 'star',
    tone: 'ease',
  },
  {
    id: 'sedang',
    jp: '慣',
    name: 'Sedang',
    desc: '150 kata pertama · timer longgar',
    maxId: 150,
    seconds: 25,
    options: 4,
    weight: 2,
    penalty: 0,
    icon: 'book',
    tone: 'easy',
  },
  {
    id: 'menengah',
    jp: '中',
    name: 'Menengah',
    desc: 'Semua kata · timer sedang',
    maxId: 613,
    seconds: 15,
    options: 4,
    weight: 3,
    penalty: 0,
    icon: 'quiz',
    tone: 'mid',
  },
  {
    id: 'sulit',
    jp: '上',
    name: 'Sulit',
    desc: 'Semua kata · 10 detik per soal',
    maxId: 613,
    seconds: 10,
    options: 4,
    weight: 4,
    penalty: 0,
    icon: 'star',
    tone: 'hard',
  },
  {
    id: 'senpai',
    jp: '先',
    name: 'Senpai',
    desc: 'Semua kata · 5 opsi · 8 detik · ada penalti',
    maxId: 613,
    seconds: 8,
    options: 5,
    weight: 5,
    penalty: 1,
    icon: 'chart',
    tone: 'master',
  },
]

export function levelById(id) {
  return LEVELS.find((l) => l.id === id) ?? null
}

/* ------------------------------------------------------------------ *
 * Mode
 * ------------------------------------------------------------------ */

/**
 * @typedef {object} ModeConfig
 * @property {string} id
 * @property {number} no
 * @property {string} title
 * @property {string} desc
 * @property {'kana'|'kanji'|'arti'|'romaji'} prompt Field yang ditampilkan
 * @property {'kana'|'kanji'|'arti'|'romaji'} answer Field yang dipilih
 * @property {string} icon
 */

/** @type {ModeConfig[]} */
export const MODES = [
  {
    id: 'kana-kanji',
    no: 1,
    title: 'Bacaan → Kanji',
    desc: 'Tampil bacaan, pilih kanjinya',
    prompt: 'kana',
    answer: 'kanji',
    icon: 'quiz',
  },
  {
    id: 'kanji-arti',
    no: 2,
    title: 'Kanji → Arti',
    desc: 'Tampil kanji, pilih artinya',
    prompt: 'kanji',
    answer: 'arti',
    icon: 'book',
  },
  {
    id: 'arti-kana',
    no: 3,
    title: 'Arti → Bacaan',
    desc: 'Tampil arti, pilih bacaannya',
    prompt: 'arti',
    answer: 'kana',
    icon: 'speaker',
  },
  {
    id: 'kanji-kana',
    no: 4,
    title: 'Kanji → Bacaan',
    desc: 'Tampil kanji, pilih cara bacanya',
    prompt: 'kanji',
    answer: 'kana',
    icon: 'card',
  },
  {
    id: 'kanji-romaji',
    no: 5,
    title: 'Kanji → Romaji',
    desc: 'Tampil kanji, pilih cara baca latin',
    prompt: 'kanji',
    answer: 'romaji',
    icon: 'type',
  },
]

/** Ambil nilai field tertentu dari sebuah entri. */
export function fieldValue(item, field) {
  switch (field) {
    case 'kana':
      return item.baca ?? ''
    case 'kanji':
      return item.kata ?? ''
    case 'arti':
      return item.arti ?? ''
    case 'romaji':
      return toRomaji(item.baca)
    default:
      return ''
  }
}

/* ------------------------------------------------------------------ *
 * Bank soal & sesi
 * ------------------------------------------------------------------ */

/**
 * Bank kata untuk level tertentu, urut sesuai data asli (id menaik).
 * Hanya entri yang "punya kanji" — kata sederhana seperti ～時 tetap ikut
 * karena memang itu isi materi JFT.
 */
export function buildPool(items = kosakataJft, maxId = 613) {
  // Id kanji berupa angka; id Kotoba berupa string ("k25-3") sehingga tidak
  // bisa dibandingkan dengan maxId. Untuk id non-angka, pakai posisi array.
  if (items.some((it) => typeof it.id !== 'number')) {
    return items.slice(0, maxId)
  }
  return items
    .filter((it) => it.id <= maxId)
    .slice()
    .sort((a, b) => a.id - b.id)
}

/** Jumlah sesi (kelompok ≤ SESSION_SIZE) dari sebuah pool. */
export function sessionCount(poolSize) {
  return Math.max(1, Math.ceil(poolSize / SESSION_SIZE))
}

/** Ambil satu sesi (indeks 0-based) dari pool. */
export function sessionSlice(pool, sessionIdx) {
  const start = sessionIdx * SESSION_SIZE
  return pool.slice(start, start + SESSION_SIZE)
}

/* ------------------------------------------------------------------ *
 * Soal & pengecoh
 * ------------------------------------------------------------------ */

function norm(s) {
  return String(s).toLowerCase().replace(/\s+/g, '').trim()
}

/**
 * Ambil `count` pengecoh unik dari `source` untuk jawaban `answer`.
 */
export function pickDistractors(source, field, answer, count, excludeId) {
  const seen = new Set([norm(answer)])
  const out = []
  const pool = shuffle(source)
  for (const item of pool) {
    if (out.length >= count) break
    if (excludeId != null && item.id === excludeId) continue
    const cand = fieldValue(item, field)
    if (!cand) continue
    const key = norm(cand)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(cand)
  }
  return out
}

/**
 * Susun semua soal untuk satu sesi.
 * - Urutan soal = urutan pool.
 * - Opsi diacak.
 * - Pengecoh diambil dari `pool`; ditambal dari `allPool` bila kurang.
 */
export function buildQuestions(cards, level, mode, allPool, items) {
  const need = level.options - 1
  return cards.map((card) => {
    const answer = fieldValue(card, mode.answer)
    let distractors = pickDistractors(
      cards,
      mode.answer,
      answer,
      need,
      card.id,
    )
    if (distractors.length < need) {
      const extra = pickDistractors(
        allPool,
        mode.answer,
        answer,
        need - distractors.length,
        card.id,
      ).filter((d) => !distractors.some((x) => norm(x) === norm(d)))
      distractors = [...distractors, ...extra]
    }
    // Jaring terakhir: kalau masih kurang (mis. field romaji banyak kosong),
    // ambil dari seluruh 613 entri.
    if (distractors.length < need && items) {
      const extra = pickDistractors(
        items,
        mode.answer,
        answer,
        need - distractors.length,
        card.id,
      ).filter((d) => !distractors.some((x) => norm(x) === norm(d)))
      distractors = [...distractors, ...extra]
    }
    const options = shuffle([answer, ...distractors])
    return {
      card,
      prompt: fieldValue(card, mode.prompt),
      answer,
      options,
    }
  })
}

/** Mengacak array tanpa mengubah inputnya (Fisher–Yates). */
export function shuffle(list) {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
