import { useCallback, useState } from 'react'
import Icon from './Icon.jsx'

/**
 * Navigasi tab mode belajar. Bisa dilipat (collapse) agar ruang konten
 * lebih lega. Saat dilipat, tab aktif tetap ditampilkan agar tidak bingung.
 *
 * @param {object} props
 * @param {Array<{id:string,label:string,icon:string}>} props.tabs
 * @param {string} props.active
 * @param {(id:string) => void} props.onChange
 */
function TabNav({ tabs, active, onChange }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('kanji-notebook:tabs-collapsed') === '1'
    } catch {
      return false
    }
  })

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => {
      const next = !v
      try {
        localStorage.setItem('kanji-notebook:tabs-collapsed', next ? '1' : '0')
      } catch {
        /* localStorage tak tersedia — abaikan */
      }
      return next
    })
  }, [])

  const activeTab = tabs.find((t) => t.id === active)

  const collapseBtn = (
    <button
      type="button"
      className="tabs-collapse"
      onClick={toggleCollapsed}
      aria-expanded={!collapsed}
      aria-label={collapsed ? 'Buka navigasi tab' : 'Tutup navigasi tab'}
      title={collapsed ? 'Buka tab' : 'Tutup tab (lebih lega)'}
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
      {collapsed ? 'Buka Tab' : 'Tutup Tab'}
    </button>
  )

  if (collapsed) {
    return (
      <nav className="tabs is-collapsed" aria-label="Mode belajar">
        <button
          type="button"
          className="tab tab-compact is-active"
          onClick={toggleCollapsed}
          title="Buka navigasi tab"
        >
          <span className="tab-icon" aria-hidden="true">
            <Icon name={activeTab?.icon ?? 'card'} />
          </span>
          {activeTab?.label ?? 'Hafalan'}
        </button>
        <span className="tabs-compact-hint">Klik untuk lihat semua tab</span>
      </nav>
    )
  }

  return (
    <nav className="tabs" aria-label="Mode belajar">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`tab ${active === t.id ? 'is-active' : ''}`}
          onClick={() => onChange(t.id)}
          aria-current={active === t.id ? 'true' : undefined}
        >
          <span className="tab-icon" aria-hidden="true">
            <Icon name={t.icon} />
          </span>
          {t.label}
        </button>
      ))}
      {collapseBtn}
    </nav>
  )
}

export default TabNav
