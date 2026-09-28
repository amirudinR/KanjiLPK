import { useCallback, useMemo, useState } from 'react'

const SESSION_SIZE = 10
const OPTION_COUNT = 4

function shuffle(list) {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function buildSession(items, size) {
  return shuffle(items).slice(0, Math.min(size, items.length))
}

function buildOptions(item, pool, count) {
  const distractors = []
  const seen = new Set([item.arti])
  for (const candidate of shuffle(pool)) {
    if (candidate.id === item.id) continue
    if (seen.has(candidate.arti)) continue
    seen.add(candidate.arti)
    distractors.push(candidate.arti)
    if (distractors.length === count - 1) break
  }
  return shuffle([item.arti, ...distractors])
}

function CheckIcon() {
  return (
    <svg
      className="quiz-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="presentation"
      aria-hidden="true"
    >
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg
      className="quiz-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="presentation"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function Quiz({ items = [], statusFor, onCorrect, onWrong }) {
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
    const percentage = session.length
      ? Math.round((score / session.length) * 100)
      : 0
    return (
      <div className="quiz">
        <div className="quiz-card quiz-summary">
          <h2 className="quiz-summary-title">Kuis Selesai</h2>
          <p className="quiz-summary-score">
            Skor akhir: <strong>{score}</strong> / {session.length}
          </p>
          <p className="quiz-summary-detail">Ketepatan: {percentage}%</p>
          <button type="button" className="quiz-restart" onClick={restart}>
            Main Lagi
          </button>
        </div>
      </div>
    )
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
            {current.kanji}
          </span>
          {status && status !== 'new' ? (
            <span className={`quiz-status quiz-status-${status}`}>
              {status === 'known' ? 'Sudah hafal' : 'Sedang belajar'}
            </span>
          ) : null}
        </div>

        <h2 className="quiz-question">Apa arti kanji di atas?</h2>

        <ul className="quiz-options">
          {options.map((option) => {
            const isCorrectOption = option === correctAnswer
            const isChosen = selected === option
            const classes = ['quiz-option']
            if (isAnswered && isCorrectOption) classes.push('correct')
            if (isAnswered && isChosen && !isCorrectOption) classes.push('wrong')

            return (
              <li key={option} className="quiz-option-item">
                <button
                  type="button"
                  className={classes.join(' ')}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  aria-label={`Jawaban: ${option}${
                    isAnswered && isCorrectOption ? ', jawaban benar' : ''
                  }${
                    isAnswered && isChosen && !isCorrectOption
                      ? ', jawaban salah'
                      : ''
                  }`}
                >
                  <span className="quiz-option-label">{option}</span>
                  {isAnswered && isCorrectOption ? (
                    <>
                      <CheckIcon />
                      <span className="sr-only">jawaban benar</span>
                    </>
                  ) : null}
                  {isAnswered && isChosen && !isCorrectOption ? (
                    <>
                      <CrossIcon />
                      <span className="sr-only">jawaban salah</span>
                    </>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>

        {isAnswered ? (
          <div className="quiz-feedback">
            <p
              className={
                selected === correctAnswer
                  ? 'quiz-feedback-text correct'
                  : 'quiz-feedback-text wrong'
              }
            >
              {selected === correctAnswer
                ? 'Jawaban benar.'
                : `Jawaban salah. Arti yang benar: ${correctAnswer}`}
            </p>
            <button
              type="button"
              className="quiz-next"
              onClick={handleNext}
              aria-label="Lanjut ke soal berikutnya"
            >
              Soal Berikutnya
            </button>
          </div>
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
