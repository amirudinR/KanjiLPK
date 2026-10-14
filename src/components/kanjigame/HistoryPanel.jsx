import Icon from '../Icon.jsx'

/**
 * Panel riwayat bermain Game Kanji.
 * Menampilkan sesi yang pernah diselesaikan (terbaru di depan).
 */
function relTime(ms) {
  const diff = Date.now() - ms
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'baru saja'
  if (min < 60) return `${min} menit lalu`
  const jam = Math.floor(min / 60)
  if (jam < 24) return `${jam} jam lalu`
  const hari = Math.floor(jam / 24)
  if (hari < 30) return `${hari} hari lalu`
  return new Date(ms).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

function accClass(pct) {
  if (pct >= 80) return 'is-high'
  if (pct >= 50) return 'is-mid'
  return 'is-low'
}

function HistoryPanel({ history = [], onClear, limit = 12 }) {
  if (!history.length) {
    return (
      <section className="kg-history">
        <h3 className="kg-section-title">
          <Icon name="history" size={18} /> Riwayat Bermain
        </h3>
        <p className="kg-history-empty">Belum ada riwayat. Selesaikan satu sesi dulu.</p>
      </section>
    )
  }

  const shown = history.slice(0, limit)

  return (
    <section className="kg-history">
      <div className="kg-history-head">
        <h3 className="kg-section-title">
          <Icon name="history" size={18} /> Riwayat Bermain
          <span className="kg-count">{history.length}</span>
        </h3>
        {onClear ? (
          <button type="button" className="kg-chip kg-chip-off" onClick={onClear}>
            <Icon name="trash" size={14} /> Hapus
          </button>
        ) : null}
      </div>

      <ul className="kg-history-list">
        {shown.map((h, i) => {
          const pct = h.total ? Math.round((h.benar / h.total) * 100) : 0
          return (
            <li
              key={`${h.at}-${i}`}
              className="kg-history-item"
              style={{ animationDelay: `${Math.min(i * 45, 400)}ms` }}
            >
              <span className="kg-history-badge" aria-hidden="true">
                {h.levelJp}
              </span>
              <span className="kg-history-main">
                <span className="kg-history-title">
                  {h.levelName}
                  <span className="kg-history-mode">{h.modeTitle}</span>
                </span>
                <span className="kg-history-sub">
                  Sesi {h.sessionIdx + 1} · {relTime(h.at)}
                  {h.durationMs > 0
                    ? ` · ${Math.max(1, Math.round(h.durationMs / 1000))}s`
                    : ''}
                </span>
              </span>
              <span className={`kg-history-score ${accClass(pct)}`}>
                <strong>
                  {h.benar}
                  <small>/{h.total}</small>
                </strong>
                <span>
                  {pct}% · {h.skor} poin
                </span>
              </span>
            </li>
          )
        })}
      </ul>

      {history.length > limit ? (
        <p className="kg-history-more">
          Menampilkan {limit} terbaru dari {history.length} entri.
        </p>
      ) : null}
    </section>
  )
}

export default HistoryPanel
