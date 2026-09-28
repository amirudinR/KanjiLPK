import SpeakerButton from '../SpeakerButton.jsx'
import { splitMeanings } from '../../utils/meanings.js'

/**
 * Sisi belakang kartu hafalan: judul kanji + tombol audio, detail
 * Bacaan/Arti/Nomor, dan daftar makna.
 *
 * @param {object} props
 * @param {object} props.item - kosakata yang sedang ditampilkan
 * @param {boolean} props.flipped - apakah kartu sedang menampilkan sisi belakang
 * @param {() => void} props.onSpeak - bacakan kosakata
 * @param {boolean} props.speechSupported
 * @param {boolean} props.hasJapaneseVoice
 */
function FlashcardBack({
  item,
  flipped,
  onSpeak,
  speechSupported,
  hasJapaneseVoice,
}) {
  return (
    <div className="flashcard-face flashcard-back" aria-hidden={!flipped}>
      <div className="flashcard-back-head">
        <span className="flashcard-back-kanji" lang="ja">
          {item.kata}
        </span>
        <SpeakerButton
          onClick={onSpeak}
          supported={speechSupported}
          japanese={hasJapaneseVoice}
          label={`Dengarkan pelafalan ${item.baca || item.kata}`}
          className="speak-btn-lg"
        />
      </div>

      <dl className="flashcard-details">
        <div className="flashcard-detail">
          <dt>Bacaan</dt>
          <dd lang="ja" className="flashcard-detail-baca">
            <span>{item.baca}</span>
          </dd>
        </div>
        <div className="flashcard-detail">
          <dt>Arti</dt>
          <dd>
            <ul className="flashcard-meanings">
              {splitMeanings(item.arti).map((meaning, i) => (
                <li key={`${meaning}-${i}`} className="flashcard-meaning">
                  {meaning}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="flashcard-detail">
          <dt>Nomor</dt>
          <dd>#{item.id}</dd>
        </div>
      </dl>
    </div>
  )
}

export default FlashcardBack
