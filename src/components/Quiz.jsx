import { useCallback, useMemo, useState } from 'react'
import SpeakerButton from './SpeakerButton.jsx'
import QuizOptions from './quiz/QuizOptions.jsx'
import QuizFeedback from './quiz/QuizFeedback.jsx'
import QuizResult from './quiz/QuizResult.jsx'
import { SESSION_SIZE, OPTION_COUNT, buildSession, buildOptions } from '../utils/quiz.js'

function Quiz({
  items = [],
  statusFor,
  onCorrect,
  onWrong,
  onSpeak,
  speechSupported = false,
  hasJapaneseVoice = false,
}) {
  const [session, setSession] = useState(() => buildSession(items, SESSION_SIZE))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [score, setScore] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const [sessionItems, setSessionItems] = useState(items)

  // Reset the quiz when the item list changes (adjust state during render).
  if (items !== sessionItems) {
    setSessionItems(items)
    setSession(buildSession(items, SESSION_SIZE))
    setIndex(0)
    setSelected(null)
    setAnsweredCount(0)
    setScore(0)
    setAnnouncement('')
  }

  const current = session[index] ?? null
  const isFinished = session.length > 0 && index >= session.length
  const isAnswered = selected !== null

  const options = useMemo(
    () => (current ? buildOptions(current, items, OPTION_COUNT) : []),
    [current, items],
  )

  const correctAnswer = current ? current.arti : ''

  const restart = useCallback(() => {
    setSession(buildSession(items, SESSION_SIZE))
    setIndex(0)
    setSelected(null)
    setAnsweredCount(0)
    setScore(0)
    setAnnouncement('')
  }, [items])

  const handleAnswer = useCallback(
    (option) => {
      if (selected !== null || !current) return
      const isCorrect = option === correctAnswer
      setSelected(option)
      setAnsweredCount((count) => count + 1)
      if (isCorrect) {
        setScore((value) => value + 1)
        setAnnouncement(`Benar. ${correctAnswer}.`)
        if (onCorrect) onCorrect(current.id)
      } else {
        setAnnouncement(`Salah. Jawaban yang benar: ${correctAnswer}.`)
        if (onWrong) onWrong(current.id)
      }
    },
    [selected, current, correctAnswer, onCorrect, onWrong],
  )

  const handleNext = useCallback(() => {
    setSelected(null)
    setAnnouncement('')
    setIndex((value) => value + 1)
  }, [])

  if (items.length === 0) {
    return (
      <div className="quiz">
        <div className="quiz-card">
          <p className="quiz-empty">Belum ada kanji untuk dikuis.</p>
        </div>
      </div>
    )
  }

  if (isFinished) {
    return <QuizResult score={score} total={session.length} onRestart={restart} />
  }

  if (!current) {
    return null
  }

  const status = statusFor ? statusFor(current.id) : 'new'

  return (
    <div className="quiz">
      <div className="quiz-progress">
        <span className="quiz-progress-text">
          Soal {index + 1} dari {session.length}
        </span>
        <span className="quiz-score">
          Skor: {score} / {answeredCount}
        </span>
      </div>

      <div className="quiz-card">
        <div className="quiz-kanji-wrap">
          <span className="quiz-kanji" lang="ja">
            {current.kata}
          </span>
          {speechSupported && hasJapaneseVoice ? (
            <SpeakerButton
              onClick={() => onSpeak?.(current.baca || current.kata)}
              supported={speechSupported}
              japanese={hasJapaneseVoice}
              label={`Dengarkan pelafalan ${current.baca || current.kata}`}
              className="speak-btn-lg"
            />
          ) : null}
          {status && status !== 'new' ? (
            <span className={`quiz-status quiz-status-${status}`}>
              {status === 'known' ? 'Sudah hafal' : 'Sedang belajar'}
            </span>
          ) : null}
        </div>

        <h2 className="quiz-question">Apa arti kosakata di atas?</h2>

        <QuizOptions
          options={options}
          correctAnswer={correctAnswer}
          selected={selected}
          isAnswered={isAnswered}
          onAnswer={handleAnswer}
        />

        {isAnswered ? (
          <QuizFeedback
            isCorrect={selected === correctAnswer}
            correctAnswer={correctAnswer}
            onNext={handleNext}
          />
        ) : null}
      </div>

      <div className="quiz-actions">
        <button type="button" className="quiz-restart" onClick={restart}>
          Mulai Ulang Kuis
        </button>
      </div>

      <p className="quiz-live" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  )
}

export default Quiz
