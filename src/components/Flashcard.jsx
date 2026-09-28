import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FlashcardFront from './flashcard/FlashcardFront.jsx'
import FlashcardBack from './flashcard/FlashcardBack.jsx'
import JumpList from './flashcard/JumpList.jsx'
import FlashcardControls from './flashcard/FlashcardControls.jsx'
import { kanjiChars, relatedWords } from '../utils/kanjiDetail.js'

/**
 * Mode hafalan kartu BERURUTAN: satu kosakata per kartu, bisa dibalik
 * untuk melihat cara baca dan arti. Tersedia tombol pelafalan (audio).
 *
 * @param {object} props
 * @param {Array<{id:number|string, kata:string, baca:string, arti:string}>} props.items
 * @param {number} props.index - index kosakata yang sedang ditampilkan
 * @param {() => void} props.onPrev
 * @param {() => void} props.onNext
 * @param {(i: number) => void} props.onJump
 * @param {(id: number|string) => 'known'|'learning'|'new'} props.statusFor
 * @param {(id: number|string) => void} props.onToggleKnown
 * @param {(id: number|string) => void} props.onMarkLearning
 * @param {(text:string) => void} props.onSpeak - bacakan teks
 * @param {boolean} props.speechSupported
 * @param {boolean} props.hasJapaneseVoice
 */
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
  // Menyimpan index terakhir yang dilihat untuk mendeteksi pergantian kartu.
  const [lastIndex, setLastIndex] = useState(index)
  const flipButtonRef = useRef(null)
  const total = items.length
  const safeIndex = total > 0 ? Math.min(Math.max(index, 0), total - 1) : 0
  const item = total > 0 ? items[safeIndex] : null

  // Setiap ganti kosakata, kartu otomatis kembali ke sisi depan.
  // Direset saat render (pola React "adjusting state on prop change") agar
  // tidak memicu render berantai lewat effect seperti yang ditandai linter.
  if (lastIndex !== safeIndex) {
    setLastIndex(safeIndex)
    setFlipped(false)
  }

  // Saat kartu dibalik, kembalikan fokus ke tombol flip agar pengguna keyboard
  // tidak kehilangan posisi (fokus tetap di kontrol, bukan dipindah ke sidebar).
  useEffect(() => {
    if (flipped) {
      flipButtonRef.current?.focus?.({ preventScroll: true })
    }
  }, [flipped])

  const toggleFlip = useCallback(() => {
    setFlipped((v) => !v)
  }, [])

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

  // Data tambahan untuk sisi balik (diambil dari dataset sendiri).
  const kanjiList = useMemo(
    () => (item ? kanjiChars(item.kata) : []),
    [item],
  )
  const related = useMemo(
    () => (item ? relatedWords(item, items, 5) : []),
    [item, items],
  )

  if (!item) {
    return (
      <section className="flashcard" aria-label="Mode hafalan kartu">
        <p className="flashcard-empty">Belum ada kosakata untuk dihafal.</p>
      </section>
    )
  }

  const progress = total > 0 ? ((safeIndex + 1) / total) * 100 : 0
  const isKnown = status === 'known'
  // Selalu bacakan CARA BACA (furigana) agar pengucapan akurat,
  // karena TTS sering salah bila membaca kanji langsung.
  const speakWord = () => onSpeak?.(item.baca || item.kata)

  return (
    <section className="flashcard" aria-label="Mode hafalan kartu">
      <header className="flashcard-header">
        <p className="flashcard-counter">
          Kosakata <strong>{safeIndex + 1}</strong> dari {total}
        </p>
        <div
          className="flashcard-progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={safeIndex + 1}
          aria-label={`Progres hafalan: kosakata ${safeIndex + 1} dari ${total}`}
        >
          <div
            className="flashcard-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="flashcard-main">
        <div
          className={`flashcard-flip ${flipped ? 'is-flipped' : ''}`}
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
              kanjiList={kanjiList}
              related={related}
              flipped={flipped}
              onSpeak={speakWord}
              speechSupported={speechSupported}
              hasJapaneseVoice={hasJapaneseVoice}
            />
          </div>
        </div>

        <JumpList
          items={items}
          safeIndex={safeIndex}
          statusFor={statusFor}
          onJump={onJump}
        />
      </div>

      <FlashcardControls
        item={item}
        safeIndex={safeIndex}
        total={total}
        flipped={flipped}
        isKnown={isKnown}
        flipButtonRef={flipButtonRef}
        onPrev={onPrev}
        onNext={onNext}
        onToggleFlip={toggleFlip}
        onToggleKnown={onToggleKnown}
        onMarkLearning={onMarkLearning}
      />
    </section>
  )
}

export default Flashcard
