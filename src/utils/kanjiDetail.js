/**
 * Utilitas untuk memperkaya sisi balik kartu:
 * - memecah kata menjadi karakter kanji
 * - mencari detail kanji dari kamus (on'yomi, kun'yomi, arti, goresan)
 * - mencari kata lain yang berbagi kanji (contoh terkait)
 */

import { kanjiDict } from '../data/kanjiDict.js'

const KANJI_RE = /[\u4e00-\u9fff]/

/** Apakah sebuah karakter termasuk kanji (CJK). */
export function isKanji(ch) {
  return KANJI_RE.test(ch)
}

/** Pisahkan kata menjadi daftar karakter kanji di dalamnya. */
export function kanjiChars(kata) {
  if (!kata) return []
  return [...kata].filter(isKanji)
}

/**
 * Indeks: peta kanji -> daftar kosakata yang memuatnya.
 * Dibangun sekali, lalu dipakai berulang.
 */
export function buildKanjiIndex(items) {
  const index = new Map()
  for (const item of items) {
    for (const ch of new Set(kanjiChars(item.kata))) {
      if (!index.has(ch)) index.set(ch, [])
      index.get(ch).push(item)
    }
  }
  return index
}

/**
 * Cari contoh kata terkait: kosakata lain yang berbagi minimal satu kanji.
 * Hasil diurutkan dari yang paling banyak berbagi kanji.
 *
 * @param {object} item - kosakata acuan
 * @param {Array} items - seluruh kosakata
 * @param {number} limit - jumlah maksimum contoh
 */
export function relatedWords(item, items, limit = 4) {
  const chars = new Set(kanjiChars(item.kata))
  if (chars.size === 0) return []
  const scored = []
  const seen = new Set([item.kata])
  for (const other of items) {
    if (other.id === item.id) continue
    // Lewati kata yang teksnya sama (data bisa punya duplikat).
    if (seen.has(other.kata)) continue
    let shared = 0
    for (const ch of new Set(kanjiChars(other.kata))) {
      if (chars.has(ch)) shared += 1
    }
    if (shared > 0) {
      seen.add(other.kata)
      scored.push({ other, shared })
    }
  }
  scored.sort((a, b) => b.shared - a.shared || a.other.id - b.other.id)
  return scored.slice(0, limit).map((s) => s.other)
}

/** Apakah kata memuat karakter kanji. */
export function hasKanji(kata) {
  return kanjiChars(kata).length > 0
}

/**
 * Bersihkan notasi kun'yomi KANJIDIC.
 * Contoh: "く.う" -> "くう", "-ざかな" -> "ざかな", "かな-" -> "かな".
 */
export function cleanReading(reading) {
  if (!reading) return ''
  return String(reading).replace(/\./g, '').replace(/^-+/, '').replace(/-+$/, '')
}

/**
 * Ambil detail kanji dari kamus (on'yomi, kun'yomi, arti, goresan).
 * Mengembalikan null bila kanji tidak ada di kamus.
 *
 * @param {string} ch - satu karakter kanji
 */
export function kanjiInfo(ch) {
  const d = kanjiDict[ch]
  if (!d) return null
  return {
    char: ch,
    on: d.on.map(cleanReading).filter(Boolean),
    kun: d.kun.map(cleanReading).filter(Boolean),
    arti: d.arti,
    goresan: d.goresan,
  }
}

/**
 * Detail lengkap untuk semua kanji dalam sebuah kata.
 * @param {string} kata
 */
export function kanjiDetails(kata) {
  return kanjiChars(kata)
    .map(kanjiInfo)
    .filter(Boolean)
}
