import { useMemo, useState } from 'react'
import Icon from './Icon.jsx'

/**
 * Halaman "Semua Kosakata" — tampilan list & grid dengan search dan filter.
 *
 * @param {object} props
 * @param {Array<{id:number|string, kata:string, baca:string, arti:string}>} props.items
 * @param {(id: number|string) => 'known'|'learning'|'new'} props.statusFor
 * @param {(index: number) => void} props.onJumpToCard - lompat ke mode hafalan
 */
function AllWords({ items, statusFor, onJumpToCard }) {
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

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

  const handleJumpToCard = (index) => {
    onJumpToCard(index)
  }

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
            return (
              <button
                key={item.id}
                type="button"
                className={`allwords-card allwords-card-${status}`}
                onClick={() => handleJumpToCard(item._index)}
              >
                <span className="allwords-card-no">{item.id}</span>
                <span className="allwords-card-kata" lang="ja">{item.kata}</span>
                <span className="allwords-card-baca" lang="ja">{item.baca}</span>
                <span className="allwords-card-arti">{item.arti}</span>
              </button>
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
