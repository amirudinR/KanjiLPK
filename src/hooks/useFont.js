import { useCallback, useEffect, useState } from 'react'

export const FONT_KEY = 'kanji-hafalan-font-v1'

/**
 * Pilihan gaya font untuk seluruh antarmuka.
 * `id` dipakai sebagai nilai data-font di <html>.
 */
export const FONT_OPTIONS = [
  { id: 'notebook', label: 'Buku Catatan', hint: 'Tulisan tangan (default)' },
  { id: 'clean', label: 'Bersih', hint: 'Sans-serif modern' },
  { id: 'rounded', label: 'Bulat', hint: 'Lembut & ramah' },
  { id: 'hand', label: 'Tulisan Tangan', hint: 'Goresan pena' },
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
