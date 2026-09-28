/** Ringkasan akhir kuis: skor, ketepatan, dan tombol main lagi. */
function QuizResult({ score, total, onRestart }) {
  const percentage = total ? Math.round((score / total) * 100) : 0

  return (
    <div className="quiz">
      <div className="quiz-card quiz-summary">
        <h2 className="quiz-summary-title">Kuis Selesai</h2>
        <p className="quiz-summary-score">
          Skor akhir: <strong>{score}</strong> / {total}
        </p>
        <p className="quiz-summary-detail">Ketepatan: {percentage}%</p>
        <button type="button" className="quiz-restart" onClick={onRestart}>
          Main Lagi
        </button>
      </div>
    </div>
  )
}

export default QuizResult
