/** Memecah arti menjadi beberapa makna (dipisah koma, garis miring, dll). */
export function splitMeanings(arti) {
  if (!arti) return []
  return String(arti)
    .split(/[,、;／/]|(?:\s-\s)/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export default splitMeanings
