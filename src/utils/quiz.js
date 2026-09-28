/** Jumlah soal per sesi kuis. */
export const SESSION_SIZE = 10
/** Jumlah pilihan jawaban per soal. */
export const OPTION_COUNT = 4

/** Mengacak urutan list tanpa mengubah list aslinya. */
export function shuffle(list) {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Menyusun sesi kuis sejumlah size item yang diacak. */
export function buildSession(items, size) {
  return shuffle(items).slice(0, Math.min(size, items.length))
}

/** Menyusun pilihan jawaban (jawaban benar + distraktor unik). */
export function buildOptions(item, pool, count) {
  const distractors = []
  const seen = new Set([item.arti])
  for (const candidate of shuffle(pool)) {
    if (candidate.id === item.id) continue
    if (seen.has(candidate.arti)) continue
    seen.add(candidate.arti)
    distractors.push(candidate.arti)
    if (distractors.length === count - 1) break
  }
  return shuffle([item.arti, ...distractors])
}
