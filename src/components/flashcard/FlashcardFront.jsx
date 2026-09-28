import SpeakerButton from '../SpeakerButton.jsx'

/**
 * Sisi depan kartu hafalan: kanji besar, tombol audio besar, dan hint.
 *
 * @param {object} props
 * @param {string} props.kata - kanji yang ditampilkan
 * @param {boolean} props.flipped - apakah kartu sedang menampilkan sisi belakang
 * @param {() => void} props.onSpeak - bacakan kosakata
 * @param {boolean} props.speechSupported
 * @param {boolean} props.hasJapaneseVoice
 */
function FlashcardFront({
  kata,
  flipped,
  onSpeak,
  speechSupported,
  hasJapaneseVoice,
}) {
  return (
    <div className="flashcard-face flashcard-front" aria-hidden={flipped}>
      <span className="flashcard-kanji" lang="ja">
        {kata}
      </span>
      {speechSupported && hasJapaneseVoice ? (
        <div className="flashcard-audio">
          <SpeakerButton
            onClick={onSpeak}
            supported={speechSupported}
            japanese={hasJapaneseVoice}
            label={`Dengarkan pelafalan ${kata}`}
            className="speak-btn-lg"
          />
        </div>
      ) : null}
      <span className="flashcard-hint">Klik untuk melihat arti</span>
    </div>
  )
}

export default FlashcardFront
