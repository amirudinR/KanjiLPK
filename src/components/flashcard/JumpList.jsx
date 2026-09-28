/**
 * Sidebar "Lompat Cepat": judul + grid tombol nomor untuk melompat ke kosakata.
 *
 * @param {object} props
 * @param {Array<{id:number|string}>} props.items
 * @param {number} props.safeIndex - index kosakata yang sedang ditampilkan
 * @param {(id: number|string) => 'known'|'learning'|'new'} [props.statusFor]
 * @param {(i: number) => void} [props.onJump]
 */
function JumpList({ items, safeIndex, statusFor, onJump }) {
  return (
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
  )
}

export default JumpList
