import SpeakerButton from '../SpeakerButton.jsx'
import { splitMeanings } from '../../utils/meanings.js'

/**
 * Sisi belakang kartu hafalan yang lengkap:
 * judul kanji + audio, Bacaan, Arti, Rincian per-kanji, Contoh kata
 * terkait, dan info tabel catatan (nomor).
 *
 * @param {object} props
 * @param {object} props.item - kosakata yang sedang ditampilkan
 * @param {string[]} props.kanjiList - daftar karakter kanji dalam kata
 * @param {Array} props.related - contoh kata terkait (dari dataset)
 * @param {boolean} props.flipped - apakah kartu menampilkan sisi belakang
 * @param {(text:string) => void} props.onSpeak - bacakan teks
 * @param {boolean} props.speechSupported
 * @param {boolean} props.hasJapaneseVoice
 */
function FlashcardBack({
  item,
  kanjiList = [],
  related = [],
  flipped,
  onSpeak,
  speechSupported,
  hasJapaneseVoice,
}) {
  const meanings = splitMeanings(item.arti)

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
              {meanings.map((meaning, i) => (
                <li key={`${meaning}-${i}`} className="flashcard-meaning">
                  {meaning}
                </li>
              ))}
            </ul>
          </dd>
        </div>

        {kanjiList.length > 0 ? (
          <div className="flashcard-detail">
            <dt>Kanji</dt>
            <dd>
              <ul className="flashcard-kanji-list">
                {kanjiList.map((ch, i) => (
                  <li key={`${ch}-${i}`} className="flashcard-kanji-chip">
                    <span className="flashcard-kanji-chip-char" lang="ja">
                      {ch}
                    </span>
                    <SpeakerButton
                      onClick={() => onSpeak?.(ch)}
                      supported={speechSupported}
                      japanese={hasJapaneseVoice}
                      label={`Dengarkan kanji ${ch}`}
                      className="speak-btn-inline"
                    />
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}

        {related.length > 0 ? (
          <div className="flashcard-detail">
            <dt>Contoh</dt>
            <dd>
              <ul className="flashcard-related">
                {related.map((r) => (
                  <li key={r.id} className="flashcard-related-item">
                    <span className="flashcard-related-word" lang="ja">
                      {r.kata}
                    </span>
                    <span className="flashcard-related-read" lang="ja">
                      {r.baca}
                    </span>
                    <span className="flashcard-related-arti">{r.arti}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="flashcard-note">
        <span className="flashcard-note-label">Nomor</span>
        <span className="flashcard-note-value">#{item.id}</span>
      </div>
    </div>
  )
}

export default FlashcardBack
