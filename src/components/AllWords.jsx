import { useEffect, useMemo, useState } from 'react'
import Icon from './Icon.jsx'
import { kanjiDetails, relatedWords } from '../utils/kanjiDetail.js'

function AllWords({ items, statusFor, onJumpToCard }) {
  const [view, setView] = useState(() => {
    try {
      const v = localStorage.getItem('kanji-notebook:allwords-view')
      return v === 'list' ? 'list' : 'grid'
    } catch {
      return 'grid'
    }
  })
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(() => {
    try {
      const f = localStorage.getItem('kanji-notebook:allwords-filter')
      return ['all', 'known', 'learning', 'new'].includes(f) ? f : 'all'
    } catch {
      return 'all'
    }
  })
  const [expandedId, setExpandedId] = useState(null)

  // Simpan preferensi tampilan & filter agar bertahan setelah refresh.
  useEffect(() => {
    try {
      localStorage.setItem('kanji-notebook:allwords-view', view)
    } catch {
      /* abaikan */
    }
  }, [view])

  useEffect(() => {
    try {
      localStorage.setItem('kanji-notebook:allwords-filter', filter)
    } catch {
      /* abaikan */
    }
  }, [filter])

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items
      .map((item, index) => ({ ...item, _index: index }))
      .filter((item) => {
        if (q) {
          const match =
            item.kata.toLowerCase().includes(q) ||
            item.baca.toLowerCase().includes(q) ||
            item.arti.toLowerCase().includes(q)
          if (!match) return false
        }
        if (filter !== 'all') {
          const status = statusFor(item.id)
          if (status !== filter) return false
        }
        return true
      })
  }, [items, search, filter, statusFor])

  const expandedItem = useMemo(() => {
    if (expandedId === null) return null
    return items.find((it) => it.id === expandedId) ?? null
  }, [expandedId, items])

  const expandedKanjiInfo = useMemo(
    () => (expandedItem ? kanjiDetails(expandedItem.kata) : []),
    [expandedItem],
  )
  const expandedRelated = useMemo(
    () => (expandedItem ? relatedWords(expandedItem, items, 5) : []),
    [expandedItem, items],
  )

  const handleCardClick = (item) => {
    setExpandedId((prev) => (prev === item.id ? null : item.id))
  }

  const handleJumpToCard = (index) => {
    onJumpToCard(index)
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'g' || e.key === 'G') setView('grid')
      if (e.key === 'l' || e.key === 'L') setView('list')
      if (e.key === '/') {
        e.preventDefault()
        document.querySelector('.allwords-search-input')?.focus()
      }
      if (e.key === 'Escape') setExpandedId(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <section className="allwords" aria-label="Semua kosakata">
      <header className="allwords-header">
        <div className="allwords-header-info">
          <h2 className="allwords-title">Semua Kosakata</h2>
          <p className="allwords-subtitle">
            {filteredItems.length} dari {items.length} kata
          </p>
        </div>
        <div className="allwords-controls">
          <div className="allwords-search">
            <span className="allwords-search-icon" aria-hidden="true">
              <Icon name="search" />
            </span>
            <input
              type="search"
              className="allwords-search-input"
              placeholder="Cari kata, bacaan, atau arti..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari kosakata"
            />
          </div>
          <div className="allwords-view-toggle">
            <button
              type="button"
              className={`allwords-view-btn ${view === 'grid' ? 'is-active' : ''}`}
              onClick={() => setView('grid')}
              aria-pressed={view === 'grid'}
            >
              <Icon name="grid" />
              Grid
            </button>
            <button
              type="button"
              className={`allwords-view-btn ${view === 'list' ? 'is-active' : ''}`}
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
            >
              <Icon name="list" />
              List
            </button>
          </div>
          <div className="allwords-filter">
            <button
              type="button"
              className={`allwords-filter-btn ${filter === 'all' ? 'is-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Semua
            </button>
            <button
              type="button"
              className={`allwords-filter-btn ${filter === 'known' ? 'is-active' : ''}`}
              onClick={() => setFilter('known')}
            >
              Hafal
            </button>
            <button
              type="button"
              className={`allwords-filter-btn ${filter === 'learning' ? 'is-active' : ''}`}
              onClick={() => setFilter('learning')}
            >
              Belajar
            </button>
            <button
              type="button"
              className={`allwords-filter-btn ${filter === 'new' ? 'is-active' : ''}`}
              onClick={() => setFilter('new')}
            >
              Baru
            </button>
          </div>
        </div>
      </header>

      {filteredItems.length === 0 ? (
        <div className="allwords-empty">
          <span className="allwords-empty-icon" aria-hidden="true">探</span>
          <p>Tidak ada kosakata yang cocok.</p>
          {search ? (
            <button
              type="button"
              className="allwords-clear-btn"
              onClick={() => setSearch('')}
            >
              Bersihkan pencarian
            </button>
          ) : null}
        </div>
      ) : view === 'grid' ? (
        <div className="allwords-grid">
          {filteredItems.map((item) => {
            const status = statusFor(item.id)
            const isExpanded = expandedId === item.id
            return (
              <div
                key={item.id}
                className={`allwords-card-wrapper ${isExpanded ? 'is-expanded' : ''}`}
              >
                <button
                  type="button"
                  className={`allwords-card allwords-card-${status}`}
                  onClick={() => handleCardClick(item)}
                  aria-expanded={isExpanded}
                >
                  <span className="allwords-card-no">{item.id}</span>
                  <span className="allwords-card-kata" lang="ja">{item.kata}</span>
                  <span className="allwords-card-baca" lang="ja">{item.baca}</span>
                  <span className="allwords-card-arti">{item.arti}</span>
                  <span className="allwords-card-toggle" aria-hidden="true">
                    {isExpanded ? '−' : '+'}
                  </span>
                </button>
                {isExpanded && (
                  <div className="allwords-card-detail">
                    <div className="allwords-detail-section">
                      <span className="allwords-detail-label">Bacaan</span>
                      <span className="allwords-detail-value" lang="ja">{item.baca}</span>
                    </div>
                    <div className="allwords-detail-section">
                      <span className="allwords-detail-label">Arti</span>
                      <span className="allwords-detail-value">{item.arti}</span>
                    </div>
                    {expandedKanjiInfo.length > 0 && (
                      <div className="allwords-detail-section">
                        <span className="allwords-detail-label">Kanji</span>
                        <div className="allwords-detail-kanji-list">
                          {expandedKanjiInfo.map((k, i) => (
                            <span key={`${k.char}-${i}`} className="allwords-detail-kanji-chip" lang="ja">
                              {k.char}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {expandedRelated.length > 0 && (
                      <div className="allwords-detail-section">
                        <span className="allwords-detail-label">Contoh</span>
                        <ul className="allwords-detail-related">
                          {expandedRelated.map((r) => (
                            <li key={r.id}>
                              <span lang="ja">{r.kata}</span>
                              <span className="allwords-detail-related-arti">{r.arti}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button
                      type="button"
                      className="allwords-detail-jump"
                      onClick={() => handleJumpToCard(item._index)}
                    >
                      Buka di mode Hafalan
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="allwords-table-wrap">
          <table className="allwords-table">
            <thead>
              <tr>
                <th className="allwords-th-no">No</th>
                <th className="allwords-th-kata">Kata</th>
                <th className="allwords-th-baca">Bacaan</th>
                <th className="allwords-th-arti">Arti</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const status = statusFor(item.id)
                return (
                  <tr
                    key={item.id}
                    className={`allwords-row allwords-row-${status}`}
                    onClick={() => handleJumpToCard(item._index)}
                  >
                    <td className="allwords-td-no">{item.id}</td>
                    <td className="allwords-td-kata" lang="ja">{item.kata}</td>
                    <td className="allwords-td-baca" lang="ja">{item.baca}</td>
                    <td className="allwords-td-arti">{item.arti}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default AllWords
