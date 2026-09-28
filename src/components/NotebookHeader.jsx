import Icon from './Icon.jsx'

/**
 * Kepala buku: judul, pemilih font, tombol tema, dan badge progres.
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
      </div>
    </header>
  )
}

export default NotebookHeader
