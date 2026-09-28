/** Blok umpan balik setelah menjawab soal. */
function QuizFeedback({ isCorrect, correctAnswer, onNext }) {
  return (
    <div className="quiz-feedback">
      <p className={isCorrect ? 'quiz-feedback-text correct' : 'quiz-feedback-text wrong'}>
        {isCorrect
          ? 'Jawaban benar.'
          : `Jawaban salah. Arti yang benar: ${correctAnswer}`}
      </p>
      <button
        type="button"
        className="quiz-next"
        onClick={onNext}
        aria-label="Lanjut ke soal berikutnya"
      >
        Soal Berikutnya
      </button>
    </div>
  )
}

export default QuizFeedback
