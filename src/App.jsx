import { useCallback, useMemo, useState } from 'react'
import kosakataJft from './data/kosakata.js'
import useProgress from './hooks/useProgress.js'
import useTheme from './hooks/useTheme.js'
import useSpeech from './hooks/useSpeech.js'
import Flashcard from './components/Flashcard.jsx'
import Quiz from './components/Quiz.jsx'
import './App.css'

const TABS = [
  { id: 'belajar', label: 'Hafalan', icon: 'card' },
  { id: 'kuis', label: 'Kuis', icon: 'quiz' },
  { id: 'progres', label: 'Progres', icon: 'chart' },
]

/* --- Ikon digambar (SVG satu gaya: stroke 2, ujung bulat) --- */
function Icon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  if (name === 'card') {
    return (
      <svg {...common}>
        <rect x="3" y="6" width="15" height="12" rx="2" />
        <rect x="7" y="9" width="14" height="11" rx="2" />
      </svg>
    )
  }
  if (name === 'quiz') {
    return (
      <svg {...common}>
        <path d="M9.2 9a3 3 0 1 1 3.8 2.9c-.8.3-1 .9-1 1.6v.3" />
        <circle cx="12" cy="17.5" r="0.6" />
        <circle cx="12" cy="12" r="9.2" />
      </svg>
    )
  }
  if (name === 'chart') {
    return (
      <svg {...common}>
        <path d="M4 20V4" />
        <path d="M4 20h16" />
        <path d="M8 20v-5" />
        <path d="M13 20v-9" />
        <path d="M18 20v-6" />
      </svg>
    )
  }
  if (name === 'star') {
    return (
      <svg {...common}>
        <path d="m12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.9 6.7 19.5l1.1-6L3.4 9.3l6-.8Z" />
      </svg>
    )
  }
  if (name === 'reset') {
    return (
      <svg {...common}>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v4h4" />
      </svg>
    )
  }
  if (name === 'book') {
    return (
      <svg {...common}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
        <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5A2.5 2.5 0 0 1 4 20.5Z" />
      </svg>
    )
  }
  if (name === 'sun') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
      </svg>
    )
  }
  if (name === 'moon') {
    return (
      <svg {...common}>
        <path d="M20 14.4A8.2 8.2 0 1 1 9.6 4a6.6 6.6 0 0 0 10.4 10.4Z" />
      </svg>
    )
  }
  return null
}

function Stat({ value, label, tone, sub }) {
  return (
    <div className={`stat stat-${tone}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub ? <span className="stat-sub">{sub}</span> : null}
    </div>
  )
}

function App() {
  const [tab, setTab] = useState('belajar')
  const [index, setIndex] = useState(0)
  const total = kosakataJft.length

  const { theme, toggleTheme } = useTheme()
  const { speak, supported: speechSupported, hasJapaneseVoice } = useSpeech()

  const {
    statusFor,
    toggleKnown,
    markKnown,
    markLearning,
    resetAll,
    counts,
  } = useProgress(total)

  const progressPercent = total ? Math.round((counts.known / total) * 100) : 0

  const handlePrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const handleNext = useCallback(
    () => setIndex((i) => Math.min(total - 1, i + 1)),
    [total],
  )
  const handleJump = useCallback((i) => setIndex(i), [])

  const handleReset = useCallback(() => {
    if (window.confirm('Hapus semua progres hafalan? Tindakan ini tidak bisa dibatalkan.')) {
      resetAll()
    }
  }, [resetAll])

  const tabTitle = useMemo(
    () => TABS.find((t) => t.id === tab)?.label ?? '',
    [tab],
  )

  const statusNote = useMemo(() => {
    if (counts.known === 0) return 'Mulai tandai kosakata yang sudah kamu hafal.'
    if (counts.known === total) return 'Semua kosakata sudah ditandai hafal!'
    return `Sisa ${total - counts.known} kosakata lagi menuju tamat.`
  }, [counts.known, total])

  return (
    <div className="app">
      <div className="notebook">
        <div className="notebook-spiral" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="notebook-ring" />
          ))}
        </div>

        <header className="notebook-head">
          <div className="notebook-title">
            <span className="notebook-title-icon" aria-hidden="true">
              <Icon name="book" />
            </span>
            <div>
              <h1>Buku Hafalan Kanji</h1>
              <p className="notebook-subtitle">
                Kosakata <span className="subtitle-level">JFT</span> · {total}{' '}
                entri berurutan
              </p>
            </div>
          </div>

          <div className="notebook-head-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark'
                  ? 'Ganti ke mode terang'
                  : 'Ganti ke mode gelap'
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

        <nav className="tabs" aria-label="Mode belajar">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'true' : undefined}
            >
              <span className="tab-icon" aria-hidden="true">
                <Icon name={t.icon} />
              </span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="progress-strip">
          <div
            className="progress-strip-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            aria-label={`Progres hafalan ${progressPercent} persen`}
          >
            <span
              className="progress-strip-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="progress-strip-note">{statusNote}</p>
        </div>

        <main className="notebook-body">
          {tab === 'belajar' && (
            <Flashcard
              items={kosakataJft}
              index={index}
              onPrev={handlePrev}
              onNext={handleNext}
              onJump={handleJump}
              statusFor={statusFor}
              onToggleKnown={toggleKnown}
              onMarkLearning={markLearning}
              onSpeak={speak}
              speechSupported={speechSupported}
              hasJapaneseVoice={hasJapaneseVoice}
            />
          )}

          {tab === 'kuis' && (
            <Quiz
              items={kosakataJft}
              statusFor={statusFor}
              onCorrect={markKnown}
              onWrong={markLearning}
              onSpeak={speak}
              speechSupported={speechSupported}
              hasJapaneseVoice={hasJapaneseVoice}
            />
          )}

          {tab === 'progres' && (
            <section className="dashboard" aria-label="Ringkasan progres">
              <h2 className="dashboard-title">Ringkasan Progres</h2>
              <p className="dashboard-intro">
                Pantau seberapa jauh hafalanmu. Buka tab{' '}
                <strong>Hafalan</strong> untuk menandai kosakata satu per satu.
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
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setTab('belajar')}
                >
                  Lanjut Hafalan
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleReset}
                >
                  <span className="btn-icon" aria-hidden="true">
                    <Icon name="reset" />
                  </span>
                  Reset Progres
                </button>
              </div>
            </section>
          )}
        </main>

        <footer className="notebook-foot">
          <span className="foot-tab">{tabTitle}</span>
          <span className="foot-line" aria-hidden="true" />
          <span className="foot-note">
            Progres tersimpan otomatis di browser ini
          </span>
        </footer>
      </div>
    </div>
  )
}

export default App
