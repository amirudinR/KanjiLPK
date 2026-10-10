import { useCallback, useEffect, useState } from 'react'

export const FONT_KEY = 'kanji-hafalan-font-v1'

export const FONT_OPTIONS = [
  { id: 'notebook', label: 'Buku Catatan', hint: 'Tulisan tangan (default)' },
  { id: 'clean', label: 'Bersih', hint: 'Sans-serif modern' },
  { id: 'rounded', label: 'Bulat', hint: 'Lembut & ramah' },
  { id: 'hand', label: 'Tulisan Tangan', hint: 'Goresan pena' },
  { id: 'mincho', label: 'Mincho', hint: 'Serif Jepang klasik' },
  { id: 'gothic', label: 'Gothic', hint: 'Sans-serif Jepang modern' },
  { id: 'kyokasho', label: 'Kyokasho', hint: 'Gaya buku teks' },
  { id: 'kaisho', label: 'Kaisho', hint: 'Gaya kaligrafi' },
  { id: 'gyosho', label: 'Gyosho', hint: 'Gaya semi-cursive' },
  { id: 'sosho', label: 'Sosho', hint: 'Gaya cursive' },
  { id: 'tegaki', label: 'Tegaki', hint: 'Gaya tulisan tangan' },
  { id: 'pop', label: 'Pop', hint: 'Gaya komik ceria' },
  { id: 'yumincho', label: 'Yu Mincho', hint: 'Serif elegan' },
  { id: 'meiryo', label: 'Meiryo', hint: 'Sans-serif profesional' },
]

export function useFont() {
  const [font, setFontState] = useState(() => {
    try {
      if (typeof window === 'undefined') return 'notebook'
      const stored = window.localStorage.getItem(FONT_KEY)
      if (FONT_OPTIONS.some((f) => f.id === stored)) return stored
    } catch {
      // localStorage tidak tersedia
    }
    return 'notebook'
  })

  useEffect(() => {
    const root = document.documentElement
    if (font === 'notebook') {
      root.removeAttribute('data-font')
    } else {
      root.setAttribute('data-font', font)
    }
    try {
      window.localStorage.setItem(FONT_KEY, font)
    } catch {
      // abaikan kegagalan penyimpanan
    }
  }, [font])

  const setFont = useCallback((id) => {
    if (FONT_OPTIONS.some((f) => f.id === id)) setFontState(id)
  }, [])

  return { font, setFont, options: FONT_OPTIONS }
}

export default useFont
