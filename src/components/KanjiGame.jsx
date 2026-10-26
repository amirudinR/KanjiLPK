import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import SpeakerButton from './SpeakerButton.jsx'
import HistoryPanel from './kanjigame/HistoryPanel.jsx'
import useKanjiGameStore from '../hooks/useKanjiGameStore.js'
import {
  LEVELS,
  MODES,
  SESSION_SIZE,
  buildPool,
  buildQuestions,
  sessionCount,
  sessionSlice,
} from '../utils/kanjiGame.js'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

/**
 * Game Kanji — mode "arcade" hafalan kanji.
 *
 * Tiga fase: menu (pilih level & mode + riwayat) → main → hasil.
 * Semua skor & riwayat disimpan di localStorage lewat useKanjiGameStore.
 */
function KanjiGame({
  items = [],
  statusFor,
  onCorrect,
  onWrong,
  onSpeak,
  speechSupported = false,
  hasJapaneseVoice = false,
  title = 'Game Kanji',
  kind = 'kanji',
  totalHint = 613,
}) {
  const {
    results,
    best,
    history,
    saveSession,
    addHistory,
    clearHistory,
    resetLevel,
  } = useKanjiGameStore()

  const [phase, setPhase] = useState('menu') // 'menu' | 'play' | 'result'
  const [levelId, setLevelId] = useState(LEVELS[0].id)
  const [modeId, setModeId] = useState(MODES[0].id)
  const [sessionIdx, setSessionIdx] = useState(0)
  // Hasil run terakhir yang dioper Play→Result. Sumber utama layar Hasil
  // supaya tidak bergantung timing penyimpanan store (anti-race).
  const [lastResult, setLastResult] = useState(null)

  const level = useMemo(
    () => LEVELS.find((l) => l.id === levelId) ?? LEVELS[0],
    [levelId],
  )
  const mode = useMemo(
    () => MODES.find((m) => m.id === modeId) ?? MODES[0],
    [modeId],
  )

  // Bank kata level terpilih (urut). items datang dari prop (613 entri).
  // Skor & riwayat dipisah per jenis (kanji / kotoba) lewat prefix level id,
  // supaya skor kanji tidak tertimpa skor Kotoba. Kanji memakai id lama tanpa
  // prefix agar skor yang sudah tersimpan tidak hilang.
  const keyOf = useCallback(
    (id) => (kind === 'kanji' ? id : `${kind}:${id}`),
    [kind],
  )

  const pool = useMemo(() => buildPool(items, level.maxId), [items, level.maxId])
  const totalSesi = sessionCount(pool.length)
  const bestOfLevel = best[keyOf(level.id)] ?? 0
  const sessionsDone = Object.keys(results[keyOf(level.id)] ?? {}).length

  const totalScore = useMemo(
    () =>
      Object.entries(best)
        .filter(([k]) =>
          kind === 'kanji' ? !k.includes(':') : k.startsWith(`${kind}:`),
        )
        .reduce((n, [, v]) => n + (v || 0), 0),
    [best, kind],
  )

  const start = useCallback(() => {
    setSessionIdx(0)
    setPhase('play')
  }, [])

  const playSession = useCallback((idx) => {
    setSessionIdx(idx)
    setPhase('play')
  }, [])

  return (
    <div className="kg">
      {phase === 'menu' && (
        <Menu
          levels={LEVELS}
          modes={MODES}
          level={level}
          mode={mode}
          title={title}
          kind={kind}
          totalHint={totalHint}
          keyOf={keyOf}
          onPickLevel={setLevelId}
          onPickMode={setModeId}
          onStart={start}
          poolSize={pool.length}
          totalSesi={totalSesi}
          bestOfLevel={bestOfLevel}
          sessionsDone={sessionsDone}
          totalScore={totalScore}
          results={results}
          history={history}
          onClearHistory={clearHistory}
          onPlaySession={playSession}
        />
      )}

      {phase === 'play' && (
        <Play
          key={`${kind}-${level.id}-${mode.id}-${sessionIdx}`}
          level={level}
          mode={mode}
          kind={kind}
          keyOf={keyOf}
          pool={pool}
          items={items}
          sessionIdx={sessionIdx}
          statusFor={statusFor}
          onCorrect={onCorrect}
          onWrong={onWrong}
          onSpeak={onSpeak}
          speechSupported={speechSupported}
          hasJapaneseVoice={hasJapaneseVoice}
          onFinish={(finalResult) => {
            setLastResult(finalResult ?? null)
            setPhase('result')
          }}
          onQuit={() => setPhase('menu')}
          onSave={saveSession}
          onHistory={addHistory}
        />
      )}

      {phase === 'result' && (
        <Result
          level={level}
          mode={mode}
          kind={kind}
          keyOf={keyOf}
          sessionIdx={sessionIdx}
          totalSesi={totalSesi}
          lastResult={lastResult}
          results={results}
          best={best}
          history={history}
          onNext={() => playSession(sessionIdx + 1)}
          onReplay={() => playSession(sessionIdx)}
          onMenu={() => setPhase('menu')}
          onClearHistory={clearHistory}
          onResetLevel={resetLevel}
        />
      )}
    </div>
  )
}

/* ================================================================== *
 * FASE 1 — Menu
 * ================================================================== */

function Menu({
  levels,
  modes,
  level,
  mode,
  title,
  totalHint,
  keyOf,
  onPickLevel,
  onPickMode,
  onStart,
  poolSize,
  totalSesi,
  bestOfLevel,
  sessionsDone,
  totalScore,
  results,
  history,
  onClearHistory,
  onPlaySession,
}) {
  const levelResults = results[keyOf(level.id)] ?? {}

  return (
    <div className="kg-menu">
      {/* Hero */}
      <header className="kg-hero">
        <span className="kg-hero-kanji" aria-hidden="true">
          遊
        </span>
        <div className="kg-hero-text">
          <h2 className="kg-hero-title">{title}</h2>
          <p className="kg-hero-sub">
            Uji semua {poolSize} kosakata dari {totalHint} entri. Pilih level
            &amp; mode, lalu kerjakan soal per {SESSION_SIZE} dengan urutan asli.
          </p>
        </div>
      </header>

      {/* Statistik */}
      <div className="kg-stats">
        <Stat icon="trophy" label="Total skor" value={totalScore} tone="accent" />
        <Stat icon="star" label="Skor level ini" value={bestOfLevel} tone="seal" />
        <Stat icon="card" label="Kata ber-kanji" value={poolSize} />
        <Stat icon="flag" label="Sesi / level" value={totalSesi} />
      </div>

      {/* Level */}
      <section className="kg-section">
        <h3 className="kg-section-title">
          <Icon name="flag" size={18} /> Pilih Level
          <span className="kg-count">{levels.length}</span>
        </h3>
        <div className="kg-grid kg-grid-levels">
          {levels.map((lv, i) => {
            const sel = lv.id === level.id
            const done = Object.keys(results[keyOf(lv.id)] ?? {}).length
            return (
              <button
                key={lv.id}
                type="button"
                className={`kg-card kg-level ${sel ? 'is-sel' : ''} tone-${lv.tone}`}
                onClick={() => onPickLevel(lv.id)}
                aria-pressed={sel}
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <span className="kg-level-emoji">
                  <Icon name={lv.icon} size={22} />
                </span>
                <span className="kg-level-body">
                  <span className="kg-level-name">
                    {lv.name}
                    <em>{lv.jp}</em>
                  </span>
                  <span className="kg-level-desc">{lv.desc}</span>
                  <span className="kg-level-tags">
                    <Tag icon="quiz" text={`${lv.options} opsi`} />
                    <Tag icon="timer" text={lv.seconds ? `${lv.seconds}s` : 'santai'} />
                    <Tag icon="star" text={`×${lv.weight}`} />
                    {done > 0 ? <Tag icon="check" text={`${done} sesi`} accent /> : null}
                  </span>
                </span>
                {sel ? (
                  <span className="kg-level-check">
                    <Icon name="check" size={18} />
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </section>

      {/* Mode */}
      <section className="kg-section">
        <h3 className="kg-section-title">
          <Icon name="game" size={18} /> Pilih Mode
          <span className="kg-count">{modes.length}</span>
        </h3>
        <div className="kg-grid kg-grid-modes">
          {modes.map((md, i) => {
            const sel = md.id === mode.id
            return (
              <button
                key={md.id}
                type="button"
                className={`kg-card kg-mode ${sel ? 'is-sel' : ''}`}
                onClick={() => onPickMode(md.id)}
                aria-pressed={sel}
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <span className="kg-mode-icon">
                  <Icon name={md.icon} size={20} />
                </span>
                <span className="kg-mode-body">
                  <span className="kg-mode-title">
                    <b>{md.no}.</b> {md.title}
                  </span>
                  <span className="kg-mode-desc">{md.desc}</span>
                </span>
                {sel ? (
                  <span className="kg-mode-check">
                    <Icon name="check" size={16} />
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </section>

      {/* Tombol mulai */}
      <div className="kg-startbar">
        <div className="kg-startbar-info">
          <span className="kg-startbar-ready">Siap dimainkan</span>
          <strong>
            {level.name} · {mode.title}
          </strong>
          <span className="kg-startbar-meta">
            {poolSize} kata · {totalSesi} sesi ·{' '}
            {level.seconds ? `${level.seconds}s/soal` : 'tanpa timer'}
          </span>
        </div>
        <button type="button" className="btn btn-primary kg-start" onClick={onStart}>
          <Icon name="play" size={18} /> Mulai Main
        </button>
      </div>

      {/* Daftar sesi (kalau sudah pernah main) */}
      {sessionsDone > 0 ? (
        <section className="kg-section">
          <h3 className="kg-section-title">
            <Icon name="card" size={18} /> Sesi di Level {level.name}
          </h3>
          <div className="kg-session-grid">
            {Array.from({ length: totalSesi }).map((_, i) => {
              const r = levelResults[i]
              const start = i * SESSION_SIZE + 1
              const end = Math.min((i + 1) * SESSION_SIZE, poolSize)
              return (
                <button
                  key={i}
                  type="button"
                  className={`kg-session ${r ? 'is-done' : ''}`}
                  onClick={() => onPlaySession(i)}
                  title={`Soal ${start}–${end}`}
                >
                  <span className="kg-session-no">{i + 1}</span>
                  <span className="kg-session-range">
                    {start}–{end}
                  </span>
                  {r ? (
                    <span className="kg-session-score">
                      {r.benar}/{r.total}
                    </span>
                  ) : (
                    <span className="kg-session-score is-empty">—</span>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* Riwayat */}
      <HistoryPanel history={history} onClear={onClearHistory} />
    </div>
  )
}

function Stat({ icon, label, value, tone = 'ink' }) {
  return (
    <div className={`kg-stat tone-${tone}`}>
      <span className="kg-stat-icon">
        <Icon name={icon} size={18} />
      </span>
      <span className="kg-stat-body">
        <strong>{value}</strong>
        <small>{label}</small>
      </span>
    </div>
  )
}

function Tag({ icon, text, accent }) {
  return (
    <span className={`kg-tag ${accent ? 'is-accent' : ''}`}>
      <Icon name={icon} size={12} /> {text}
    </span>
  )
}

/* ================================================================== *
 * FASE 2 — Play
 * ================================================================== */

function Play({
  level,
  mode,
  kind,
  keyOf,
  pool,
  items,
  sessionIdx,
  statusFor,
  onCorrect,
  onWrong,
  onSpeak,
  speechSupported,
  hasJapaneseVoice,
  onFinish,
  onQuit,
  onSave,
  onHistory,
}) {
  const cards = useMemo(() => sessionSlice(pool, sessionIdx), [pool, sessionIdx])
  const questions = useMemo(
    () => buildQuestions(cards, level, mode, pool, items),
    [cards, level, mode, pool, items],
  )
  const total = questions.length

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [timedOut, setTimedOut] = useState(false)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(level.seconds)
  const startedAtRef = useRef(null)
  const savedRef = useRef(false)
  // Menandai soal saat ini sudah dijawab. Dipakai timer supaya penalti waktu
  // habis TIDAK bertambah berkali-kali dalam rentang interval 250ms.
  const answeredRef = useRef(false)

  // Catat waktu mulai sekali saat sesi dibuka (bukan saat render).
  useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  const current = questions[index] ?? null
  const isAnswered = selected !== null || timedOut
  const isLast = index >= total - 1

  const answer = current?.answer ?? ''
  const isCorrect = selected !== null && selected === answer

  const handleAnswer = useCallback(
    (option) => {
      if (isAnswered || !current) return
      answeredRef.current = true
      const ok = option === answer
      setSelected(option)
      if (ok) {
        setScore((s) => s + level.weight)
        setCorrectCount((c) => c + 1)
        if (onCorrect) onCorrect(current.card.id)
      } else {
        setScore((s) => Math.max(0, s - level.penalty))
        if (onWrong) onWrong(current.card.id)
      }
    },
    [isAnswered, current, answer, level, onCorrect, onWrong],
  )

  const handleTimeout = useCallback(() => {
    // Kunci ganda: cegah penalti dobel walau dipanggil beberapa kali
    // sebelum React sempat me-render ulang (closure masih `isAnswered=false`).
    if (answeredRef.current || isAnswered || !current) return
    answeredRef.current = true
    setTimedOut(true)
    setScore((s) => Math.max(0, s - level.penalty))
    if (onWrong) onWrong(current.card.id)
  }, [isAnswered, current, level.penalty, onWrong])

  // Timer per soal: hitung mundur berbasis waktu nyata (interval 250ms),
  // bukan re-render tiap detik. Berhenti saat soal dijawab atau waktu habis.
  useEffect(() => {
    if (level.seconds === 0 || isAnswered || !current) return undefined
    const deadline = Date.now() + level.seconds * 1000
    const timerId = window.setInterval(() => {
      const sisa = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setTimeLeft(sisa)
      if (sisa <= 0) {
        window.clearInterval(timerId)
        handleTimeout()
      }
    }, 250)
    return () => window.clearInterval(timerId)
  }, [index, isAnswered, level.seconds, current, handleTimeout])

  // Simpan hasil saat soal terakhir dijawab (sekali per sesi).
  useEffect(() => {
    if (total === 0 || savedRef.current) return
    if (index >= total - 1 && isAnswered) {
      savedRef.current = true
      const now = Date.now()
      const result = { benar: correctCount, total, skor: score, at: now }
      onSave(keyOf(level.id), sessionIdx, result)
      onHistory({
        ...result,
        kind,
        levelId: keyOf(level.id),
        levelName: level.name,
        levelJp: level.jp,
        modeId: mode.id,
        modeTitle: mode.title,
        sessionIdx,
        durationMs: now - startedAtRef.current,
      })
    }
  }, [
    index,
    total,
    isAnswered,
    correctCount,
    score,
    level,
    mode,
    kind,
    keyOf,
    sessionIdx,
    onSave,
    onHistory,
  ])

  // Hasil final untuk dioper ke layar Result (anti-race: nilai selalu ada).
  // `at` diisi saat disimpan; di sini tidak perlu jadi nilai presisi.
  const finalResult = useMemo(
    () => ({ benar: correctCount, total, skor: score, at: 0 }),
    [correctCount, total, score],
  )
  const finish = useCallback(() => onFinish(finalResult), [onFinish, finalResult])

  const handleNext = useCallback(() => {
    answeredRef.current = false
    setSelected(null)
    setTimedOut(false)
    setTimeLeft(level.seconds)
    setIndex((v) => v + 1)
  }, [level.seconds])

  // Keyboard: 1-5 jawab, Enter lanjut.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
      if (isAnswered) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (isLast) finish()
          else handleNext()
        }
        return
      }
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= (current?.options.length ?? 0)) {
        e.preventDefault()
        handleAnswer(current.options[num - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isAnswered, isLast, current, handleAnswer, handleNext, finish])

  if (total === 0) {
    return (
      <div className="kg-play">
        <div className="kg-empty">
          <span className="kg-empty-icon" aria-hidden="true">
            空
          </span>
          <p>Belum ada kata untuk dimainkan di sesi ini.</p>
          <button type="button" className="btn btn-ghost" onClick={onQuit}>
            Kembali ke Menu
          </button>
        </div>
      </div>
    )
  }

  const showPct = Math.round(((index + (isAnswered ? 1 : 0)) / total) * 100)

  return (
    <div className="kg-play">
      {/* Bar atas */}
      <div className="kg-playbar">
        <button type="button" className="kg-back" onClick={onQuit} aria-label="Kembali ke menu">
          <Icon name="back" size={18} />
        </button>
        <div className="kg-playbar-mid">
          <span className="kg-playbar-text">
            Sesi {sessionIdx + 1} · Soal {index + 1}/{total}
          </span>
          <span className="kg-playbar-track">
            <span className="kg-playbar-fill" style={{ width: `${showPct}%` }} />
          </span>
        </div>
        <span className="kg-playbar-score">{score} poin</span>
      </div>

      {/* Timer */}
      {level.seconds > 0 ? (
        <div className="kg-timer">
          <Icon name="timer" size={16} />
          <span className="kg-timer-track">
            <span
              className={`kg-timer-fill ${
                timeLeft <= Math.ceil(level.seconds * 0.3) && !isAnswered ? 'is-danger' : ''
              }`}
              style={{ width: `${isAnswered ? 0 : (timeLeft / level.seconds) * 100}%` }}
            />
          </span>
          <span className="kg-timer-num">{Math.max(0, timeLeft)}s</span>
        </div>
      ) : null}

      <div className="kg-play-grid">
        {/* Kartu soal */}
        <div className="kg-prompt">
          <span className="kg-prompt-label">
            {mode.title} · No. {sessionIdx * SESSION_SIZE + index + 1}
          </span>
          <span
            className={`kg-prompt-text ${
              mode.prompt === 'kanji'
                ? 'is-kanji'
                : mode.prompt === 'kana'
                  ? 'is-kana'
                  : 'is-long'
            }`}
            lang="ja"
          >
            {current.prompt}
          </span>

          {speechSupported && hasJapaneseVoice && mode.prompt !== 'arti' ? (
            <SpeakerButton
              onClick={() => onSpeak?.(current.card.baca || current.card.kata)}
              supported={speechSupported}
              japanese={hasJapaneseVoice}
              label="Dengarkan pelafalan"
              className="kg-prompt-speak"
            />
          ) : null}

          <span className="kg-prompt-status">
            {statusFor && statusFor(current.card.id) !== 'new'
              ? statusFor(current.card.id) === 'known'
                ? 'Sudah hafal'
                : 'Sedang belajar'
              : 'Kata baru'}
          </span>
        </div>

        {/* Opsi + feedback */}
        <div className="kg-answers">
          <p className="kg-answers-hint">Pilih jawaban yang benar</p>
          <ul className="kg-options">
            {current.options.map((opt, i) => {
              const isThis = opt === answer
              const isChosen = selected === opt
              const classes = ['kg-option']
              if (isAnswered && isThis) classes.push('is-correct')
              else if (isAnswered && isChosen) classes.push('is-wrong')
              else if (isAnswered) classes.push('is-dim')
              const big = mode.answer === 'kanji' || mode.answer === 'kana'
              return (
                <li key={`${i}-${opt}`}>
                  <button
                    type="button"
                    className={classes.join(' ')}
                    onClick={() => handleAnswer(opt)}
                    disabled={isAnswered}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <span className="kg-option-letter">{LETTERS[i]}</span>
                    <span className={`kg-option-label ${big ? 'is-jp' : ''}`} lang="ja">
                      {opt}
                    </span>
                    {isAnswered && isThis ? (
                      <span className="kg-option-mark is-ok">
                        <Icon name="check" size={18} />
                      </span>
                    ) : null}
                    {isAnswered && isChosen && !isThis ? (
                      <span className="kg-option-mark is-no">
                        <Icon name="cross" size={18} />
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>

          {isAnswered ? (
            <div className="kg-feedback" role="status" aria-live="polite">
              <p className={`kg-feedback-title ${isCorrect ? 'is-ok' : 'is-no'}`}>
                {isCorrect ? (
                  <>
                    <Icon name="check" size={18} /> Benar
                  </>
                ) : timedOut ? (
                  <>
                    <Icon name="timer" size={18} /> Waktu habis
                  </>
                ) : (
                  <>
                    <Icon name="cross" size={18} /> Kurang tepat
                  </>
                )}
              </p>
              {!isCorrect ? (
                <p className="kg-feedback-answer">
                  Jawaban benar: <strong lang="ja">{current.answer}</strong>
                </p>
              ) : null}
              <p className="kg-feedback-detail" lang="ja">
                {current.card.kata} · {current.card.baca} · {current.card.arti}
              </p>
              <button
                type="button"
                className="btn btn-primary kg-next"
                onClick={() => (isLast ? finish() : handleNext())}
              >
                {isLast ? 'Lihat Hasil' : 'Soal Berikutnya'} <Icon name="arrow" size={18} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== *
 * FASE 3 — Result
 * ================================================================== */

function Result({
  level,
  mode,
  keyOf,
  sessionIdx,
  totalSesi,
  lastResult,
  results,
  best,
  history,
  onNext,
  onReplay,
  onMenu,
  onClearHistory,
  onResetLevel,
}) {
  // Utamakan hasil run terakhir (dioper langsung, anti-race); kalau tidak ada
  // (mis. halaman dibuka ulang), jatuh ke rekor tersimpan di store.
  const r = lastResult ?? results[keyOf(level.id)]?.[sessionIdx]
  const benar = r?.benar ?? 0
  const total = r?.total ?? 0
  const skor = r?.skor ?? 0
  const pct = total ? Math.round((benar / total) * 100) : 0
  const perfect = total > 0 && benar === total
  const hasNext = sessionIdx + 1 < totalSesi
  const levelBest = best[keyOf(level.id)] ?? 0
  const sessionsDone = Object.keys(results[keyOf(level.id)] ?? {}).length

  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className="kg-result">
      <div className={`kg-result-card ${perfect ? 'is-perfect' : ''}`}>
        {perfect ? (
          <span className="kg-stamp" aria-hidden="true">
            満
          </span>
        ) : null}
        <p className="kg-result-eyebrow">Skor Sesi</p>
        <p className="kg-result-score">
          <strong>{benar}</strong>
          <small>/{total}</small>
        </p>
        <span className="kg-result-bar">
          <span
            className={`kg-result-bar-fill ${perfect ? 'is-perfect' : pct >= 50 ? 'is-mid' : 'is-low'}`}
            style={{ width: `${pct}%` }}
          />
        </span>
        <p className="kg-result-tags">
          <Tag icon="star" text={`${skor} poin`} accent />
          <Tag icon="flag" text={`${pct}%`} />
          <Tag icon="trophy" text={`terbaik ${levelBest}`} />
        </p>
        <p className="kg-result-note">
          {perfect
            ? 'Sempurna, semua benar!'
            : pct >= 70
              ? 'Bagus sekali, teruskan!'
              : pct >= 40
                ? 'Sudah setengah jalan.'
                : 'Awal yang baik, ulangi lagi.'}
        </p>
        <p className="kg-result-sub">
          {level.name} · {mode.title} · sesi {sessionIdx + 1} dari {totalSesi}
        </p>
      </div>

      <div className="kg-result-actions">
        {hasNext ? (
          <button type="button" className="btn btn-primary" onClick={onNext}>
            <Icon name="arrow" size={18} /> Sesi Berikutnya
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onMenu}>
            <Icon name="flag" size={18} /> Selesai — Pilih Level
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={onReplay}>
          <Icon name="reset" size={18} /> Ulangi Sesi
        </button>
        <button type="button" className="kg-chip kg-chip-off" onClick={onMenu}>
          Menu
        </button>
      </div>

      {!hasNext ? (
        <p className="kg-result-final">
          🎉 Sesi terakhir level {level.name}! Kamu sudah menuntaskan {sessionsDone} sesi.
        </p>
      ) : null}

      <HistoryPanel history={history} onClear={onClearHistory} />

      <div className="kg-result-reset">
        {!confirmReset ? (
          <button
            type="button"
            className="kg-reset-link"
            onClick={() => setConfirmReset(true)}
          >
            Reset progres level ini
          </button>
        ) : (
          <span className="kg-reset-confirm">
            <span>Hapus skor level {level.name}?</span>
            <button
              type="button"
              className="kg-chip kg-chip-on"
              onClick={() => {
                onResetLevel(keyOf(level.id))
                setConfirmReset(false)
                onMenu()
              }}
            >
              <Icon name="trash" size={14} /> Ya
            </button>
            <button
              type="button"
              className="kg-chip kg-chip-off"
              onClick={() => setConfirmReset(false)}
            >
              Batal
            </button>
          </span>
        )}
      </div>
    </div>
  )
}

export default KanjiGame
