import Icon from './Icon.jsx'

/**
 * Navigasi tab mode belajar.
 *
 * @param {object} props
 * @param {Array<{id:string,label:string,icon:string}>} props.tabs
 * @param {string} props.active
 * @param {(id:string) => void} props.onChange
 */
function TabNav({ tabs, active, onChange }) {
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
    </nav>
  )
}

export default TabNav
