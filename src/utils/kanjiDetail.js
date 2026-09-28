/**
 * Utilitas untuk memperkaya sisi balik kartu dari dataset JFT sendiri:
 * - memecah kata menjadi karakter kanji
 * - mencari kata lain yang berbagi kanji (contoh terkait)
 * - menyusun info tabel catatan
 *
 * Semua data berasal dari daftar kosakata (tanpa mengarang).
 */

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
  for (const other of items) {
    if (other.id === item.id) continue
    let shared = 0
    for (const ch of new Set(kanjiChars(other.kata))) {
      if (chars.has(ch)) shared += 1
    }
    if (shared > 0) scored.push({ other, shared })
  }
  scored.sort((a, b) => b.shared - a.shared || a.other.id - b.other.id)
  return scored.slice(0, limit).map((s) => s.other)
}

/** Apakah kata memuat karakter kanji. */
export function hasKanji(kata) {
  return kanjiChars(kata).length > 0
}
