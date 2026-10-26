import Icon from './Icon.jsx'

/** Pilihan sumber soal: Kanji JFT atau Kotoba Minna. */
function SourceSwitch({ value, onChange, kanjiCount, kotobaCount }) {
  return (
    <div className="allwords-filter" role="group" aria-label="Pilih sumber kosakata">
      <button
        type="button"
        className={`allwords-filter-btn ${value === 'kanji' ? 'is-active' : ''}`}
        onClick={() => onChange('kanji')}
        aria-pressed={value === 'kanji'}
      >
        <Icon name="card" size={14} /> Kanji ({kanjiCount})
      </button>
      <button
        type="button"
        className={`allwords-filter-btn ${value === 'kotoba' ? 'is-active' : ''}`}
        onClick={() => onChange('kotoba')}
        aria-pressed={value === 'kotoba'}
      >
        <Icon name="book" size={14} /> Kotoba ({kotobaCount})
      </button>
    </div>
  )
}

export default SourceSwitch
