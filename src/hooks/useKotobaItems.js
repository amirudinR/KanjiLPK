import { useEffect, useState } from 'react'

/**
 * Muat data Kotoba (2.910 entri) secara dinamis — chunk terpisah, tidak
 * masuk bundle awal. Mengembalikan null selama memuat.
 */
export function useKotobaItems() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    let alive = true
    import('../data/kotobaMinna.js').then((mod) => {
      if (!alive) return
      // Ratakan KOTOBA_BAB menjadi satu array berurutan bab lalu nomor.
      setItems(Object.keys(mod.KOTOBA_BAB).flatMap((b) => mod.KOTOBA_BAB[b]))
    })
    return () => {
      alive = false
    }
  }, [])

  return items
}

export default useKotobaItems
