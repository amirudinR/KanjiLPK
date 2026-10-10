import { useState } from 'react'
import Icon from './Icon.jsx'

function Stat({ value, label, tone, sub, icon }) {
  return (
    <div className={`stat stat-${tone}`}>
      {icon ? (
        <span className="stat-icon" aria-hidden="true">
          <Icon name={icon} />
        </span>
      ) : null}
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub ? <span className="stat-sub">{sub}</span> : null}
    </div>
  )
}

function Dashboard({ counts, total, onContinue, onReset }) {
  const [confirming, setConfirming] = useState(false)
  const pct = total > 0 ? Math.round((counts.known / total) * 100) : 0
  const remaining = total - counts.known

  const handleReset = () => {
    if (confirming) {
      onReset()
      setConfirming(false)
    } else {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
    }
  }

  return (
    <section className="dashboard" aria-label="Ringkasan progres">
      <h2 className="dashboard-title">Ringkasan Progres</h2>
      <p className="dashboard-intro">
        Pantau seberapa jauh hafalanmu. Buka tab <strong>Hafalan</strong> untuk
        menandai kosakata satu per satu.
      </p>

      <div className="dashboard-progress">
        <div className="dashboard-progress-header">
          <span className="dashboard-progress-label">Progres Keseluruhan</span>
          <span className="dashboard-progress-value">{pct}%</span>
        </div>
        <div
          className="dashboard-progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label={`Progres hafalan: ${pct}%`}
        >
          <div className="dashboard-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="dashboard-progress-note">
          {remaining === 0
            ? 'Semua kosakata sudah dihafal. Luar biasa!'
            : `${remaining} kata lagi menuju tamat.`}
        </p>
      </div>

      <div className="stat-grid">
        <Stat value={counts.known} label="Sudah hafal" tone="known" sub="entri" icon="star" />
        <Stat value={counts.learning} label="Sedang belajar" tone="learning" sub="entri" icon="book" />
        <Stat value={total - counts.known} label="Belum hafal" tone="todo" sub="entri" icon="card" />
      </div>

      <div className="dashboard-actions">
        <button type="button" className="btn btn-primary" onClick={onContinue}>
          <span className="btn-icon" aria-hidden="true">
            <Icon name="card" />
          </span>
          Lanjut Hafalan
        </button>
        <button
          type="button"
          className={`btn ${confirming ? 'btn-danger-confirm' : 'btn-danger'}`}
          onClick={handleReset}
        >
          <span className="btn-icon" aria-hidden="true">
            <Icon name="reset" />
          </span>
          {confirming ? 'Klik lagi untuk konfirmasi' : 'Reset Progres'}
        </button>
      </div>
    </section>
  )
}

export default Dashboard
