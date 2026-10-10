import { useCallback, useState } from 'react'
import Icon from './Icon.jsx'

/**
 * Kepala buku: judul, pemilih font, tombol tema, dan badge progres.
 * Bisa dilipat (collapse) supaya ruang konten lebih lega.
 *
 * @param {object} props
 * @param {number} props.total
 * @param {number} props.progressPercent
 * @param {string} props.theme
 * @param {() => void} props.onToggleTheme
 * @param {string} props.font
 * @param {(id:string) => void} props.onSetFont
 * @param {Array<{id:string,label:string}>} props.fontOptions
 */
function NotebookHeader({
  total,
  progressPercent,
  theme,
  onToggleTheme,
  font,
  onSetFont,
  fontOptions,
}) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('kanji-notebook:header-collapsed') === '1'
    } catch {
      return false
    }
  })

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => {
      const next = !v
      try {
        localStorage.setItem('kanji-notebook:header-collapsed', next ? '1' : '0')
      } catch {
        /* localStorage tak tersedia — abaikan */
      }
      return next
    })
  }, [])

  const toggleThemeBtn = (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggleTheme}
      aria-label={
        theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'
      }
      title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </span>
    </button>
  )

  const collapseBtn = (
    <button
      type="button"
      className="notebook-head-collapse"
      onClick={toggleCollapsed}
      aria-expanded={!collapsed}
      aria-label={collapsed ? 'Buka header buku' : 'Tutup header buku'}
      title={collapsed ? 'Buka header' : 'Tutup header (lebih lega)'}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {collapsed ? (
          <path d="M6 9l6 6 6-6" />
        ) : (
          <path d="M6 15l6-6 6 6" />
        )}
      </svg>
      {collapsed ? 'Buka Header' : 'Tutup Header'}
    </button>
  )

  if (collapsed) {
    return (
      <header className="notebook-head is-collapsed">
        <div className="notebook-head-compact">
          <span className="notebook-title-icon" aria-hidden="true">
            <Icon name="book" />
          </span>
          <h1 className="notebook-head-compact-title">Buku Hafalan Kanji</h1>
          <span
            className="notebook-head-compact-badge"
            role="status"
            aria-label={`Progres hafalan ${progressPercent} persen`}
          >
            {progressPercent}% hafal
          </span>
          <div className="notebook-head-compact-actions">
            {toggleThemeBtn}
            {collapseBtn}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="notebook-head">
      <div className="notebook-title">
        <span className="notebook-title-icon" aria-hidden="true">
          <Icon name="book" />
        </span>
        <div>
          <h1>Buku Hafalan Kanji</h1>
          <p className="notebook-subtitle">
            Kosakata <span className="subtitle-level">JFT</span> · {total} entri
            berurutan
          </p>
        </div>
      </div>

      <div className="notebook-head-actions">
        <label className="font-picker">
          <span className="sr-only">Pilih gaya font</span>
          <span className="font-picker-icon" aria-hidden="true">
            <Icon name="type" />
          </span>
          <select
            className="font-picker-select"
            value={font}
            onChange={(event) => onSetFont(event.target.value)}
            aria-label="Pilih gaya font"
          >
            {fontOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {toggleThemeBtn}

        <div
          className="notebook-badge"
          role="status"
          aria-label={`Progres hafalan ${progressPercent} persen`}
        >
          <span className="notebook-badge-num" aria-hidden="true">
            {progressPercent}%
          </span>
          <span className="notebook-badge-label" aria-hidden="true">
            hafal
          </span>
        </div>

        {collapseBtn}
      </div>
    </header>
  )
}

export default NotebookHeader
