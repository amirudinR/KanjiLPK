/**
 * Tombol kecil untuk membacakan teks (pelafalan Jepang) lewat Web Speech API.
 * Hanya dirender bila browser mendukung.
 *
 * @param {object} props
 * @param {() => void} props.onClick
 * @param {string} [props.label] - aria-label tombol
 * @param {boolean} [props.supported] - apakah speech didukung
 * @param {boolean} [props.japanese] - apakah suara Jepang tersedia
 * @param {string} [props.className]
 */
function SpeakerButton({
  onClick,
  label = 'Bacakan',
  supported = true,
  japanese = true,
  className = '',
}) {
  if (!supported || !japanese) return null

  return (
    <button
      type="button"
      className={`speak-btn ${className}`.trim()}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
      aria-label={label}
      title={label}
    >
      <svg
        className="speak-btn-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 9.5v5a1 1 0 0 0 1 1h2.6L12 19V5L7.6 8.5H5a1 1 0 0 0-1 1Z" />
        <path d="M16 8.6a4.5 4.5 0 0 1 0 6.8" />
        <path d="M18.8 6a8 8 0 0 1 0 12" />
      </svg>
    </button>
  )
}

export default SpeakerButton
