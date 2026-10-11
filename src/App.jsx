import { useCallback, useEffect, useMemo, useState } from 'react'
import kosakataJft from './data/kosakata.js'
import useProgress from './hooks/useProgress.js'
import useTheme from './hooks/useTheme.js'
import useSpeech from './hooks/useSpeech.js'
import useFont from './hooks/useFont.js'
import Flashcard from './components/Flashcard.jsx'
import Quiz from './components/Quiz.jsx'
import NotebookHeader from './components/NotebookHeader.jsx'
import TabNav from './components/TabNav.jsx'
import ProgressStrip from './components/ProgressStrip.jsx'
import Dashboard from './components/Dashboard.jsx'
import AllWords from './components/AllWords.jsx'
import './styles/index.css'

const TABS = [
  { id: 'belajar', label: 'Hafalan', icon: 'card' },
  { id: 'kuis', label: 'Kuis', icon: 'quiz' },
  { id: 'semua', label: 'Semua', icon: 'grid' },
  { id: 'progres', label: 'Progres', icon: 'chart' },
]

function App() {
  const [tab, setTab] = useState('belajar')
  const [index, setIndex] = useState(0)
  const [focusMode, setFocusMode] = useState(() => {
    try {
      return localStorage.getItem('kanji-notebook:focus-mode') === '1'
    } catch {
      return false
    }
  })
  const total = kosakataJft.length

  const { theme, toggleTheme } = useTheme()
  const { speak, supported: speechSupported, hasJapaneseVoice } = useSpeech()
  const { font, setFont, options: fontOptions } = useFont()

  const {
    statusFor,
    toggleKnown,
    markKnown,
    markLearning,
    resetAll,
    exportProgress,
    importProgress,
    counts,
    streak,
  } = useProgress(total)

  const progressPercent = total ? Math.round((counts.known / total) * 100) : 0

  const toggleFocus = useCallback(() => {
    setFocusMode((v) => {
      const next = !v
      try {
        localStorage.setItem('kanji-notebook:focus-mode', next ? '1' : '0')
      } catch {
        /* localStorage tak tersedia — abaikan */
      }
      return next
    })
  }, [])

  // Tekan "f" untuk keluar/masuk mode fokus, Esc untuk keluar.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        toggleFocus()
      } else if (e.key === 'Escape' && focusMode) {
        setFocusMode(false)
        try {
          localStorage.setItem('kanji-notebook:focus-mode', '0')
        } catch {
          /* abaikan */
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleFocus, focusMode])

  const handlePrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const handleNext = useCallback(
    () => setIndex((i) => Math.min(total - 1, i + 1)),
    [total],
  )
  const handleJump = useCallback((i) => setIndex(i), [])

  const handleReset = useCallback(() => {
    if (
      window.confirm(
        'Hapus semua progres hafalan? Tindakan ini tidak bisa dibatalkan.',
      )
    ) {
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

  const speechProps = { onSpeak: speak, speechSupported, hasJapaneseVoice }

  return (
    <div className="app">
      <div className={`notebook ${focusMode ? 'is-focus' : ''}`}>
        <div className="notebook-spiral" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="notebook-ring" />
          ))}
        </div>

        <button
          type="button"
          className="focus-toggle"
          onClick={toggleFocus}
          aria-pressed={focusMode}
          title={focusMode ? 'Tampilkan header, tab, dan progres (F / Esc)' : 'Mode fokus: sembunyikan header, tab, dan progres (F)'}
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
            {focusMode ? (
              <path d="M6 9l6 6 6-6" />
            ) : (
              <path d="M6 15l6-6 6 6" />
            )}
          </svg>
          {focusMode ? 'Keluar Fokus' : 'Mode Fokus'}
        </button>

        <div className={`notebook-topbar ${focusMode ? 'is-hidden' : ''}`}>
          <NotebookHeader
            total={total}
            progressPercent={progressPercent}
            theme={theme}
            onToggleTheme={toggleTheme}
            font={font}
            onSetFont={setFont}
            fontOptions={fontOptions}
          />

          <TabNav tabs={TABS} active={tab} onChange={setTab} />

          <ProgressStrip percent={progressPercent} note={statusNote} />
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
              {...speechProps}
            />
          )}

          {tab === 'kuis' && (
            <Quiz
              items={kosakataJft}
              statusFor={statusFor}
              onCorrect={markKnown}
              onWrong={markLearning}
              {...speechProps}
            />
          )}

          {tab === 'semua' && (
            <AllWords
              items={kosakataJft}
              statusFor={statusFor}
              onJumpToCard={(i) => {
                setIndex(i)
                setTab('belajar')
              }}
            />
          )}

          {tab === 'progres' && (
            <Dashboard
              counts={counts}
              total={total}
              onContinue={() => setTab('belajar')}
              onReset={handleReset}
              streak={streak}
              onExport={exportProgress}
              onImport={importProgress}
            />
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
