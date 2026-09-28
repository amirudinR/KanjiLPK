import { useCallback, useMemo, useState } from 'react'
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
import './styles/index.css'

const TABS = [
  { id: 'belajar', label: 'Hafalan', icon: 'card' },
  { id: 'kuis', label: 'Kuis', icon: 'quiz' },
  { id: 'progres', label: 'Progres', icon: 'chart' },
]

function App() {
  const [tab, setTab] = useState('belajar')
  const [index, setIndex] = useState(0)
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
      <div className="notebook">
        <div className="notebook-spiral" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="notebook-ring" />
          ))}
        </div>

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

          {tab === 'progres' && (
            <Dashboard
              counts={counts}
              total={total}
              onContinue={() => setTab('belajar')}
              onReset={handleReset}
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
