import { useCallback, useEffect, useState } from 'react'

export const THEME_KEY = 'kanji-hafalan-theme-v1'

function getInitialTheme() {
  try {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  } catch {
    // localStorage/matchMedia tidak tersedia
  }
  return 'light'
}

/**
 * Mengelola tema terang/gelap. Pilihan disimpan di localStorage dan
 * diterapkan ke <html data-theme="..."> agar seluruh CSS ikut berubah.
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.style.colorScheme = theme
    try {
      window.localStorage.setItem(THEME_KEY, theme)
    } catch {
      // abaikan kegagalan penyimpanan
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}

export default useTheme
