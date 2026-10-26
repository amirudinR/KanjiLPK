import { useEffect, useMemo, useState } from 'react'
import Flashcard from './Flashcard.jsx'
import Icon from './Icon.jsx'

const BAB_KEY = 'kanji-notebook:kotoba-bab'

/**
 * Halaman Kotoba — kosakata Minna no Nihongo, dipilih per bab.
 * Data 2.910 entri diimpor dinamis agar tidak masuk bundle awal.
 */
function Kotoba({
  statusFor,
  onToggleKnown,
  onMarkLearning,
  onSpeak,
  speechSupported = false,
  hasJapaneseVoice = false,
}) {
  const [bab, setBab] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(BAB_KEY))
      return Number.isInteger(saved) && saved >= 1 && saved <= 50 ? saved : null
    } catch {
      return null
    }
  })
  const [data, setData] = useState(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let alive = true
    import('../data/kotobaMinna.js').then((mod) => {
      if (alive) setData(mod.KOTOBA_BAB)
    })
    return () => {
      alive = false
    }
  }, [])

  const items = useMemo(
    () => (data && bab ? (data[bab] ?? []) : []),
    [data, bab],
  )

  const pick = (n) => {
    setBab(n)
    setIndex(0)
    try {
      localStorage.setItem(BAB_KEY, String(n))
    } catch {
      /* localStorage tak tersedia — abaikan */
    }
  }

  if (!data) {
    return (
      <section className="allwords" aria-label="Kotoba">
        <div className="allwords-empty">
          <p>Memuat kosakata…</p>
        </div>
      </section>
    )
  }

  // Pemilih bab
  if (!bab) {
    return (
      <section className="allwords" aria-label="Pilih bab Kotoba">
        <header>
          <h2 className="allwords-title">
            <Icon name="book" /> Kotoba Minna no Nihongo
          </h2>
          <p>2.910 kosakata · 50 bab</p>
        </header>
        <div className="allwords-filter" style={{ flexWrap: 'wrap' }}>
          {Object.keys(data).map((n) => (
            <button
              key={n}
              type="button"
              className="allwords-filter-btn"
              onClick={() => pick(Number(n))}
            >
              BAB {n} <span style={{ opacity: 0.6 }}>({data[n].length})</span>
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <button
        type="button"
        className="allwords-filter-btn"
        onClick={() => setBab(null)}
        style={{ marginBottom: 12 }}
      >
        ← Pilih bab lain
      </button>
      <Flashcard
        items={items}
        index={index}
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
        onJump={setIndex}
        statusFor={statusFor}
        onToggleKnown={onToggleKnown}
        onMarkLearning={onMarkLearning}
        onSpeak={onSpeak}
        speechSupported={speechSupported}
        hasJapaneseVoice={hasJapaneseVoice}
      />
    </>
  )
}

export default Kotoba
