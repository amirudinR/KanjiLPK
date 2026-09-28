/**
 * Deretan tombol kontrol kartu hafalan.
 *
 * @param {object} props
 * @param {object} props.item - kosakata yang sedang ditampilkan
 * @param {number} props.safeIndex
 * @param {number} props.total
 * @param {boolean} props.flipped
 * @param {boolean} props.isKnown
 * @param {React.Ref<HTMLButtonElement>} props.flipButtonRef
 * @param {() => void} props.onPrev
 * @param {() => void} props.onNext
 * @param {() => void} props.onToggleFlip
 * @param {(id: number|string) => void} [props.onToggleKnown]
 * @param {(id: number|string) => void} [props.onMarkLearning]
 */
function FlashcardControls({
  item,
  safeIndex,
  total,
  flipped,
  isKnown,
  flipButtonRef,
  onPrev,
  onNext,
  onToggleFlip,
  onToggleKnown,
  onMarkLearning,
}) {
  return (
    <div className="flashcard-controls">
      <button
        type="button"
        className="flashcard-btn flashcard-btn-prev"
        onClick={onPrev}
        disabled={safeIndex === 0}
        aria-label="Kosakata sebelumnya"
      >
        ‹ Sebelumnya
      </button>

      <button
        type="button"
        ref={flipButtonRef}
        className="flashcard-btn flashcard-btn-flip"
        onClick={onToggleFlip}
        aria-label={flipped ? 'Sembunyikan arti' : 'Balik kartu untuk melihat arti'}
      >
        {flipped ? 'Sembunyikan Arti' : 'Balik Kartu'}
      </button>

      <button
        type="button"
        className={`flashcard-btn flashcard-btn-known ${
          isKnown ? 'is-known' : ''
        }`}
        onClick={() => onToggleKnown?.(item.id)}
        aria-pressed={isKnown}
        aria-label={
          isKnown
            ? `Batalkan tanda hafal untuk ${item.kata}`
            : `Tandai ${item.kata} sudah hafal`
        }
      >
        {isKnown ? '★ Hafal' : '☆ Tandai Hafal'}
      </button>

      <button
        type="button"
        className="flashcard-btn flashcard-btn-learning"
        onClick={() => onMarkLearning?.(item.id)}
        aria-label={`Tandai ${item.kata} sedang dipelajari`}
      >
        Tandai Sedang Belajar
      </button>

      <button
        type="button"
        className="flashcard-btn flashcard-btn-next"
        onClick={onNext}
        disabled={safeIndex >= total - 1}
        aria-label="Kosakata berikutnya"
      >
        Berikutnya ›
      </button>
    </div>
  )
}

export default FlashcardControls
