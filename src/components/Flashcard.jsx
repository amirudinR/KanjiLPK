import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FlashcardFront from './flashcard/FlashcardFront.jsx'
import FlashcardBack from './flashcard/FlashcardBack.jsx'
import JumpList from './flashcard/JumpList.jsx'
import FlashcardControls from './flashcard/FlashcardControls.jsx'
import { kanjiDetails, relatedWords } from '../utils/kanjiDetail.js'

function Flashcard({
  items = [],
  index = 0,
  onPrev,
  onNext,
  onJump,
  statusFor,
  onToggleKnown,
  onMarkLearning,
  onSpeak,
  speechSupported = false,
  hasJapaneseVoice = false,
}) {
  const [flipped, setFlipped] = useState(false)
  const [slideDir, setSlideDir] = useState(0)
  const [asideSide, setAsideSide] = useState(() => {
    try {
      return localStorage.getItem('kanji-notebook:aside-side') === 'left'
        ? 'left'
        : 'right'
    } catch {
      return 'right'
    }
  })
  const [cardCollapsed, setCardCollapsed] = useState(() => {
    try {
      return localStorage.getItem('kanji-notebook:card-collapsed') === '1'
    } catch {
      return false
    }
  })
  const flipButtonRef = useRef(null)

  const toggleAsideSide = useCallback(() => {
    setAsideSide((side) => {
      const next = side === 'right' ? 'left' : 'right'
      try {
        localStorage.setItem('kanji-notebook:aside-side', next)
      } catch {
        /* localStorage tak tersedia — abaikan */
      }
      return next
    })
  }, [])

  const toggleCardCollapsed = useCallback(() => {
    setCardCollapsed((v) => {
      const next = !v
      try {
        localStorage.setItem('kanji-notebook:card-collapsed', next ? '1' : '0')
      } catch {
        /* localStorage tak tersedia — abaikan */
      }
      return next
    })
  }, [])
  const total = items.length
  const safeIndex = total > 0 ? Math.min(Math.max(index, 0), total - 1) : 0
  const item = total > 0 ? items[safeIndex] : null

  // Reset status balik dilakukan pada event navigasi (lihat handlePrev/
  // handleNext/handleJump), bukan lewat effect, sehingga tidak ada setState
  // di dalam render maupun effect.
  // Fokus ke tombol flip hanya untuk pengguna keyboard/mouse. Di perangkat
  // sentuh, memfokuskan tombol memicu scroll + ring fokus yang tampak
  // seperti kedipan setiap kali kartu dibalik — karena itu dilewati.
  useEffect(() => {
    if (!flipped) return
    const usesPointerTouch = window.matchMedia?.('(pointer: coarse)').matches
    if (usesPointerTouch) return
    flipButtonRef.current?.focus?.({ preventScroll: true })
  }, [flipped])

  const toggleFlip = useCallback(() => {
    setFlipped((v) => !v)
  }, [])

  const handlePrev = useCallback(() => {
    if (safeIndex > 0) {
      setSlideDir(-1)
      setFlipped(false)
      onPrev?.()
    }
  }, [safeIndex, onPrev])

  const handleNext = useCallback(() => {
    if (safeIndex < total - 1) {
      setSlideDir(1)
      setFlipped(false)
      onNext?.()
    }
  }, [safeIndex, total, onNext])

  const handleJump = useCallback(
    (i) => {
      if (i === safeIndex) return
      setSlideDir(i > safeIndex ? 1 : -1)
      setFlipped(false)
      onJump?.(i)
    },
    [safeIndex, onJump],
  )

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
      switch (e.key) {
        case ' ':
        case 'Enter':
          if (e.target === document.body || e.target === flipButtonRef.current) {
            e.preventDefault()
            toggleFlip()
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          handlePrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          handleNext()
          break
        case 'k':
        case 'K':
          if (item) onToggleKnown?.(item.id)
          break
        case 'l':
        case 'L':
          if (item) onMarkLearning?.(item.id)
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleFlip, handlePrev, handleNext, item, onToggleKnown, onMarkLearning])

  const onCardKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggleFlip()
      }
    },
    [toggleFlip],
  )

  const status = useMemo(
    () => (item && statusFor ? statusFor(item.id) : 'new'),
    [item, statusFor],
  )

  const kanjiInfoList = useMemo(
    () => (item ? kanjiDetails(item.kata) : []),
    [item],
  )
  const related = useMemo(
    () => (item ? relatedWords(item, items, 5) : []),
    [item, items],
  )

  if (!item) {
    return (
      <section className="flashcard" aria-label="Mode hafalan kartu">
        <div className="flashcard-empty">
          <span className="flashcard-empty-icon" aria-hidden="true">書</span>
          <p>Belum ada kosakata untuk dihafal.</p>
        </div>
      </section>
    )
  }

  const progress = total > 0 ? ((safeIndex + 1) / total) * 100 : 0
  const isKnown = status === 'known'
  const speakWord = () => onSpeak?.(item.baca || item.kata)

  return (
    <section className="flashcard" aria-label="Mode hafalan kartu">
      <header className="flashcard-header">
        <div className="flashcard-counter-row">
          <p className="flashcard-counter">
            Kosakata <strong>{safeIndex + 1}</strong> dari {total}
          </p>
          <span className="flashcard-keyboard-hint" aria-hidden="true">
            Space: balik · ←→: navigasi
          </span>
          <button
            type="button"
            className="flashcard-card-toggle"
            onClick={toggleCardCollapsed}
            title={cardCollapsed ? 'Buka kartu' : 'Tutup kartu (lebih lega)'}
            aria-label={cardCollapsed ? 'Buka kartu' : 'Tutup kartu'}
            aria-expanded={!cardCollapsed}
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
              {cardCollapsed ? (
                <path d="M6 9l6 6 6-6" />
              ) : (
                <path d="M6 15l6-6 6 6" />
              )}
            </svg>
            {cardCollapsed ? 'Buka Kartu' : 'Tutup Kartu'}
          </button>
          <button
            type="button"
            className="flashcard-aside-toggle"
            onClick={toggleAsideSide}
            title="Pindah panel Lompat Cepat ke kiri/kanan"
            aria-label={
              asideSide === 'right'
                ? 'Pindahkan panel Lompat Cepat ke kiri'
                : 'Pindahkan panel Lompat Cepat ke kanan'
            }
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
              {asideSide === 'right' ? (
                <path d="M14 8l-4 4 4 4M20 4v16" />
              ) : (
                <path d="M10 8l4 4-4 4M4 4v16" />
              )}
            </svg>
            Panel: {asideSide === 'right' ? 'Kanan' : 'Kiri'}
          </button>
        </div>
        <div
          className="flashcard-progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={safeIndex + 1}
          aria-label={`Progres hafalan: kosakata ${safeIndex + 1} dari ${total}`}
        >
          <div className="flashcard-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div
        className={`flashcard-main ${asideSide === 'left' ? 'is-aside-left' : ''} ${cardCollapsed ? 'is-card-collapsed' : ''}`}
      >
        <div
          className={`flashcard-flip ${flipped ? 'is-flipped' : ''} ${slideDir !== 0 ? `slide-${slideDir > 0 ? 'right' : 'left'}` : ''}`}
          onClick={toggleFlip}
          onKeyDown={onCardKeyDown}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={
            flipped
              ? `Kartu ${item.kata} menampilkan cara baca dan arti. Tekan untuk kembali ke sisi depan.`
              : `Kartu ${item.kata}, sisi depan. Tekan untuk melihat cara baca dan arti.`
          }
        >
          <div className="flashcard-inner">
            <FlashcardFront
              kata={item.kata}
              flipped={flipped}
              onSpeak={speakWord}
              speechSupported={speechSupported}
              hasJapaneseVoice={hasJapaneseVoice}
            />
            <FlashcardBack
              item={item}
              kanjiInfoList={kanjiInfoList}
              related={related}
              flipped={flipped}
              onSpeak={speakWord}
              speechSupported={speechSupported}
              hasJapaneseVoice={hasJapaneseVoice}
            />
          </div>
        </div>

        <FlashcardControls
          item={item}
          safeIndex={safeIndex}
          total={total}
          flipped={flipped}
          isKnown={isKnown}
          flipButtonRef={flipButtonRef}
          onPrev={handlePrev}
          onNext={handleNext}
          onToggleFlip={toggleFlip}
          onToggleKnown={onToggleKnown}
          onMarkLearning={onMarkLearning}
        />

        <div className="flashcard-aside">
          <JumpList
            items={items}
            safeIndex={safeIndex}
            statusFor={statusFor}
            onJump={handleJump}
          />
        </div>
      </div>
    </section>
  )
}

export default Flashcard
