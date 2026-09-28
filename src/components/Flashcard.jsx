import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SpeakerButton from './SpeakerButton.jsx'

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

  if (!item) {
    return (
      <section className="flashcard" aria-label="Mode hafalan kartu">
        <p className="flashcard-empty">Belum ada kosakata untuk dihafal.</p>
      </section>
    )
  }

  const progress = total > 0 ? ((safeIndex + 1) / total) * 100 : 0
  const isKnown = status === 'known'
  const speakWord = () => onSpeak?.(item.kata)
  const speakReading = () => onSpeak?.(item.baca)

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
            <div className="flashcard-face flashcard-front" aria-hidden={flipped}>
              <span className="flashcard-kanji" lang="ja">
                {item.kata}
              </span>
              {speechSupported && hasJapaneseVoice ? (
                <div className="flashcard-audio">
                  <SpeakerButton
                    onClick={speakWord}
                    supported={speechSupported}
                    japanese={hasJapaneseVoice}
                    label={`Dengarkan pelafalan ${item.kata}`}
                    className="speak-btn-lg"
                  />
                </div>
              ) : null}
              <span className="flashcard-hint">Klik untuk melihat arti</span>
            </div>

            <div className="flashcard-face flashcard-back" aria-hidden={!flipped}>
              <h2 className="flashcard-back-title" lang="ja">
                {item.kata}
              </h2>
              <dl className="flashcard-details">
                <div className="flashcard-detail">
                  <dt>Bacaan</dt>
                  <dd lang="ja" className="flashcard-detail-baca">
                    <span>{item.baca}</span>
                    <SpeakerButton
                      onClick={speakReading}
                      supported={speechSupported}
                      japanese={hasJapaneseVoice}
                      label={`Dengarkan bacaan ${item.baca}`}
                      className="speak-btn-inline"
                    />
                  </dd>
                </div>
                <div className="flashcard-detail">
                  <dt>Arti</dt>
                  <dd>{item.arti}</dd>
                </div>
                <div className="flashcard-detail">
                  <dt>Nomor</dt>
                  <dd>#{item.id}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <aside className="flashcard-sidebar" aria-label="Lompat ke kosakata">
          <h3 className="flashcard-sidebar-title">
            <svg
              className="flashcard-sidebar-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            Lompat Cepat
          </h3>
          <ol className="flashcard-jump-list">
            {items.map((it, i) => {
              const s = statusFor ? statusFor(it.id) : 'new'
              const isCurrent = i === safeIndex
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    className={`flashcard-jump flashcard-jump-${s} ${
                      isCurrent ? 'is-current' : ''
                    }`}
                    onClick={() => onJump?.(i)}
                    aria-current={isCurrent ? 'true' : undefined}
                    aria-label={`Lompat ke kosakata nomor ${i + 1}${
                      s === 'known'
                        ? ', sudah hafal'
                        : s === 'learning'
                          ? ', sedang belajar'
                          : ''
                    }${isCurrent ? ', sedang ditampilkan' : ''}`}
                  >
                    {i + 1}
                  </button>
                </li>
              )
            })}
          </ol>
        </aside>
      </div>

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
          onClick={toggleFlip}
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
    </section>
  )
}

export default Flashcard
