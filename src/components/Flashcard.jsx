import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Mode hafalan kartu BERURUTAN: satu kanji per kartu, bisa dibalik
 * untuk melihat on'yomi, kun'yomi, arti, dan contoh kosakata.
 *
 * @param {object} props
 * @param {Array<{id:number|string, kanji:string, onyomi:string[], kunyomi:string[], arti:string, contoh:Array<{kata:string, baca:string, arti:string}>}>} props.items
 * @param {number} props.index - index kanji yang sedang ditampilkan
 * @param {() => void} props.onPrev
 * @param {() => void} props.onNext
 * @param {(i: number) => void} props.onJump
 * @param {(id: number|string) => 'known'|'learning'|'new'} props.statusFor
 * @param {(id: number|string) => void} props.onToggleKnown
 * @param {(id: number|string) => void} props.onMarkLearning
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
}) {
  const [flipped, setFlipped] = useState(false)
  // Menyimpan index terakhir yang dilihat untuk mendeteksi pergantian kanji.
  const [lastIndex, setLastIndex] = useState(index)
  const flipButtonRef = useRef(null)
  const total = items.length
  const safeIndex = total > 0 ? Math.min(Math.max(index, 0), total - 1) : 0
  const item = total > 0 ? items[safeIndex] : null

  // Setiap ganti kanji, kartu otomatis kembali ke sisi depan.
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
        <p className="flashcard-empty">Belum ada kanji untuk dihafal.</p>
      </section>
    )
  }

  const progress = total > 0 ? ((safeIndex + 1) / total) * 100 : 0
  const isKnown = status === 'known'

  return (
    <section className="flashcard" aria-label="Mode hafalan kartu">
      <header className="flashcard-header">
        <p className="flashcard-counter">
          Kanji <strong>{safeIndex + 1}</strong> dari {total}
        </p>
        <div
          className="flashcard-progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={safeIndex + 1}
          aria-label={`Progres hafalan: kanji ${safeIndex + 1} dari ${total}`}
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
              ? `Kartu ${item.kanji} menampilkan arti dan cara baca. Tekan untuk kembali ke sisi depan.`
              : `Kartu kanji ${item.kanji}, sisi depan. Tekan untuk melihat arti dan cara baca.`
          }
        >
          <div className="flashcard-inner">
            <div className="flashcard-face flashcard-front" aria-hidden={flipped}>
              <span className="flashcard-kanji" lang="ja">
                {item.kanji}
              </span>
              <span className="flashcard-hint">Klik untuk melihat arti</span>
            </div>

            <div className="flashcard-face flashcard-back" aria-hidden={!flipped}>
              <h2 className="flashcard-back-title" lang="ja">
                {item.kanji}
              </h2>
              <dl className="flashcard-details">
                <div className="flashcard-detail">
                  <dt>On&rsquo;yomi</dt>
                  <dd lang="ja">
                    {item.onyomi?.length ? item.onyomi.join('、') : '—'}
                  </dd>
                </div>
                <div className="flashcard-detail">
                  <dt>Kun&rsquo;yomi</dt>
                  <dd lang="ja">
                    {item.kunyomi?.length ? item.kunyomi.join('、') : '—'}
                  </dd>
                </div>
                <div className="flashcard-detail">
                  <dt>Arti</dt>
                  <dd>{item.arti}</dd>
                </div>
                {item.contoh?.length > 0 && (
                  <div className="flashcard-detail">
                    <dt>Contoh</dt>
                    <dd>
                      <ul className="flashcard-examples">
                        {item.contoh.map((c, i) => (
                          <li
                            key={`${c.kata}-${i}`}
                            className="flashcard-example"
                          >
                            <span className="flashcard-example-word" lang="ja">
                              {c.kata}
                            </span>
                            <span className="flashcard-example-read" lang="ja">
                              {c.baca}
                            </span>
                            <span className="flashcard-example-arti">
                              {c.arti}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        <aside className="flashcard-sidebar" aria-label="Lompat ke kanji">
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
                    aria-label={`Lompat ke kanji nomor ${i + 1}${
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
          aria-label="Kanji sebelumnya"
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
              ? `Batalkan tanda hafal untuk kanji ${item.kanji}`
              : `Tandai kanji ${item.kanji} sudah hafal`
          }
        >
          {isKnown ? '★ Hafal' : '☆ Tandai Hafal'}
        </button>

        <button
          type="button"
          className="flashcard-btn flashcard-btn-learning"
          onClick={() => onMarkLearning?.(item.id)}
          aria-label={`Tandai kanji ${item.kanji} sedang dipelajari`}
        >
          Tandai Sedang Belajar
        </button>

        <button
          type="button"
          className="flashcard-btn flashcard-btn-next"
          onClick={onNext}
          disabled={safeIndex >= total - 1}
          aria-label="Kanji berikutnya"
        >
          Berikutnya ›
        </button>
      </div>
    </section>
  )
}

export default Flashcard
