import { useEffect, useRef, useState } from 'react'
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

function Dashboard({ counts, total, onContinue, onReset, streak, onExport, onImport }) {
  const [confirming, setConfirming] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const fileInputRef = useRef(null)
  const resetTimerRef = useRef(null)
  const importTimerRef = useRef(null)
  const pct = total > 0 ? Math.round((counts.known / total) * 100) : 0
  const remaining = total - counts.known

  // Bersihkan semua timer saat komponen dilepas agar tidak setState
  // pada komponen yang sudah unmount.
  useEffect(() => {
    return () => {
      clearTimeout(resetTimerRef.current)
      clearTimeout(importTimerRef.current)
    }
  }, [])

  const handleReset = () => {
    if (confirming) {
      onReset()
      setConfirming(false)
      clearTimeout(resetTimerRef.current)
    } else {
      setConfirming(true)
      clearTimeout(resetTimerRef.current)
      resetTimerRef.current = setTimeout(() => setConfirming(false), 3000)
    }
  }

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = onImport(ev.target?.result)
      setImportMessage(result ? 'Progres berhasil diimpor!' : 'Gagal mengimpor file.')
      clearTimeout(importTimerRef.current)
      importTimerRef.current = setTimeout(() => setImportMessage(''), 3000)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <section className="dashboard" aria-label="Ringkasan progres">
      <h2 className="dashboard-title">Ringkasan Progres</h2>
      <p className="dashboard-intro">
        Pantau seberapa jauh hafalanmu. Buka tab <strong>Hafalan</strong> untuk
        menandai kosakata satu per satu.
      </p>

      {streak.count > 0 && (
        <div className="dashboard-streak">
          <span className="dashboard-streak-icon" aria-hidden="true">
            <Icon name="star" />
          </span>
          <span className="dashboard-streak-text">
            <strong>{streak.count}</strong> hari berturut-turut!
          </span>
        </div>
      )}

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

      <div className="dashboard-backup">
        <h3 className="dashboard-backup-title">Backup & Restore</h3>
        <p className="dashboard-backup-desc">
          Simpan progresmu ke file atau pulihkan dari backup sebelumnya.
        </p>
        <div className="dashboard-backup-actions">
          <button type="button" className="btn btn-ghost" onClick={onExport}>
            <span className="btn-icon" aria-hidden="true">
              <Icon name="download" />
            </span>
            Export Progres
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="btn-icon" aria-hidden="true">
              <Icon name="upload" />
            </span>
            Import Progres
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="sr-only"
            onChange={handleImportFile}
            aria-label="Pilih file backup untuk diimpor"
          />
        </div>
        {importMessage && (
          <p className="dashboard-import-message" role="status">{importMessage}</p>
        )}
      </div>
    </section>
  )
}

export default Dashboard
