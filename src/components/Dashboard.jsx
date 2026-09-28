import Icon from './Icon.jsx'

function Stat({ value, label, tone, sub }) {
  return (
    <div className={`stat stat-${tone}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub ? <span className="stat-sub">{sub}</span> : null}
    </div>
  )
}

/**
 * Ringkasan progres hafalan.
 *
 * @param {object} props
 * @param {{ known: number, learning: number }} props.counts
 * @param {number} props.total
 * @param {() => void} props.onContinue
 * @param {() => void} props.onReset
 */
function Dashboard({ counts, total, onContinue, onReset }) {
  return (
    <section className="dashboard" aria-label="Ringkasan progres">
      <h2 className="dashboard-title">Ringkasan Progres</h2>
      <p className="dashboard-intro">
        Pantau seberapa jauh hafalanmu. Buka tab <strong>Hafalan</strong> untuk
        menandai kosakata satu per satu.
      </p>

      <div className="stat-grid">
        <Stat value={counts.known} label="Sudah hafal" tone="known" sub="entri" />
        <Stat
          value={counts.learning}
          label="Sedang belajar"
          tone="learning"
          sub="entri"
        />
        <Stat
          value={total - counts.known}
          label="Belum hafal"
          tone="todo"
          sub="entri"
        />
      </div>

      <div className="dashboard-actions">
        <button type="button" className="btn btn-ghost" onClick={onContinue}>
          Lanjut Hafalan
        </button>
        <button type="button" className="btn btn-danger" onClick={onReset}>
          <span className="btn-icon" aria-hidden="true">
            <Icon name="reset" />
          </span>
          Reset Progres
        </button>
      </div>
    </section>
  )
}

export default Dashboard
