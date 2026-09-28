import SpeakerButton from '../SpeakerButton.jsx'
import { splitMeanings } from '../../utils/meanings.js'

/**
 * Sisi belakang kartu hafalan yang lengkap:
 * judul kanji + audio, Bacaan, Arti, rincian per-kanji (on'yomi,
 * kun'yomi, arti, goresan), contoh kata terkait, dan nomor catatan.
 *
 * @param {object} props
 * @param {object} props.item - kosakata yang sedang ditampilkan
 * @param {Array} props.kanjiInfoList - detail tiap kanji (dari kamus)
 * @param {Array} props.related - contoh kata terkait (dari dataset)
 * @param {boolean} props.flipped - apakah kartu menampilkan sisi belakang
 * @param {(text:string) => void} props.onSpeak - bacakan teks
 * @param {boolean} props.speechSupported
 * @param {boolean} props.hasJapaneseVoice
 */
function FlashcardBack({
  item,
  kanjiInfoList = [],
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

        {kanjiInfoList.length > 0 ? (
          <div className="flashcard-detail">
            <dt>Kanji</dt>
            <dd>
              <ul className="flashcard-kanji-list">
                {kanjiInfoList.map((k, i) => (
                  <li key={`${k.char}-${i}`} className="flashcard-kanji-card">
                    <div className="flashcard-kanji-card-head">
                      <span className="flashcard-kanji-chip-char" lang="ja">
                        {k.char}
                      </span>
                      <SpeakerButton
                        onClick={() => onSpeak?.(k.char)}
                        supported={speechSupported}
                        japanese={hasJapaneseVoice}
                        label={`Dengarkan kanji ${k.char}`}
                        className="speak-btn-inline"
                      />
                    </div>
                    <div className="flashcard-kanji-card-body">
                      {k.on.length > 0 ? (
                        <p className="flashcard-kanji-line">
                          <span className="flashcard-kanji-tag">音</span>
                          <span lang="ja">{k.on.join('、')}</span>
                        </p>
                      ) : null}
                      {k.kun.length > 0 ? (
                        <p className="flashcard-kanji-line">
                          <span className="flashcard-kanji-tag">訓</span>
                          <span lang="ja">{k.kun.join('、')}</span>
                        </p>
                      ) : null}
                      {k.arti ? (
                        <p className="flashcard-kanji-arti">{k.arti}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}

        <div className="flashcard-detail">
          <dt>Contoh</dt>
          <dd>
            {related.length > 0 ? (
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
            ) : (
              <p className="flashcard-related-empty">
                Belum ada kata lain dengan kanji yang sama di daftar ini.
              </p>
            )}
          </dd>
        </div>
      </dl>

      <div className="flashcard-note">
        <span className="flashcard-note-label">Nomor</span>
        <span className="flashcard-note-value">#{item.id}</span>
      </div>
    </div>
  )
}

export default FlashcardBack
