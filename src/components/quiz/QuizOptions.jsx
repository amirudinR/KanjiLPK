import { CheckIcon, CrossIcon } from './QuizIcons.jsx'

/** Daftar pilihan jawaban kuis beserta penanda benar/salah. */
function QuizOptions({
  options = [],
  correctAnswer,
  selected,
  isAnswered,
  onAnswer,
}) {
  return (
    <ul className="quiz-options">
      {options.map((option) => {
        const isCorrectOption = option === correctAnswer
        const isChosen = selected === option
        const classes = ['quiz-option']
        if (isAnswered && isCorrectOption) classes.push('correct')
        if (isAnswered && isChosen && !isCorrectOption) classes.push('wrong')

        return (
          <li key={option} className="quiz-option-item">
            <button
              type="button"
              className={classes.join(' ')}
              onClick={() => onAnswer(option)}
              disabled={isAnswered}
              aria-label={`Jawaban: ${option}${
                isAnswered && isCorrectOption ? ', jawaban benar' : ''
              }${
                isAnswered && isChosen && !isCorrectOption
                  ? ', jawaban salah'
                  : ''
              }`}
            >
              <span className="quiz-option-label">{option}</span>
              {isAnswered && isCorrectOption ? (
                <>
                  <CheckIcon />
                  <span className="sr-only">jawaban benar</span>
                </>
              ) : null}
              {isAnswered && isChosen && !isCorrectOption ? (
                <>
                  <CrossIcon />
                  <span className="sr-only">jawaban salah</span>
                </>
              ) : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default QuizOptions
