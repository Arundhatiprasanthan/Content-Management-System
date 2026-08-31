import { useState } from "react";
import "./QuizCreator.css";

const createQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: null,
});

function QuizCreator() {
  const [quizEnabled, setQuizEnabled] = useState(true);

  const [questions, setQuestions] = useState([
    createQuestion(),
  ]);

  const handleQuestionChange = (questionIndex, value) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, index) =>
        index === questionIndex
          ? { ...question, question: value }
          : question
      )
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const updatedOptions = [...question.options];
        updatedOptions[optionIndex] = value;

        return {
          ...question,
          options: updatedOptions,
        };
      })
    );
  };

  const handleCorrectAnswer = (questionIndex, optionIndex) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, index) =>
        index === questionIndex
          ? { ...question, correctAnswer: optionIndex }
          : question
      )
    );
  };

  const addQuestion = () => {
    setQuestions((currentQuestions) => [
      ...currentQuestions,
      createQuestion(),
    ]);
  };

  const removeQuestion = (questionIndex) => {
    if (questions.length === 1) {
      return;
    }

    setQuestions((currentQuestions) =>
      currentQuestions.filter(
        (_, index) => index !== questionIndex
      )
    );
  };

  return (
    <section className="quiz-creator">
      <div className="quiz-header">
        <div>
          <h2>Add a Quiz</h2>
          <p>Quizzes increase reader engagement significantly.</p>
        </div>

        <button
          type="button"
          className={`quiz-toggle ${
            quizEnabled ? "active" : ""
          }`}
          onClick={() => setQuizEnabled((enabled) => !enabled)}
          aria-label="Toggle quiz"
        >
          <span></span>
        </button>
      </div>

      {quizEnabled && (
        <>
          <div className="quiz-divider"></div>

          {questions.map((question, questionIndex) => (
            <div className="question-card" key={questionIndex}>
              <div className="question-header">
                <span>
                  QUESTION {questionIndex + 1}
                </span>

                {questions.length > 1 && (
                  <button
                    type="button"
                    className="delete-question"
                    onClick={() =>
                      removeQuestion(questionIndex)
                    }
                  >
                    Delete
                  </button>
                )}
              </div>

              <input
                type="text"
                className="question-input"
                placeholder="Enter question..."
                value={question.question}
                onChange={(event) =>
                  handleQuestionChange(
                    questionIndex,
                    event.target.value
                  )
                }
              />

              <div className="options-grid">
                {question.options.map((option, optionIndex) => {
                  const optionLetter = String.fromCharCode(
                    65 + optionIndex
                  );

                  const isCorrect =
                    question.correctAnswer === optionIndex;

                  return (
                    <div
                      className={`option-field ${
                        isCorrect ? "correct" : ""
                      }`}
                      key={optionIndex}
                    >
                      <button
                        type="button"
                        className={`correct-selector ${
                          isCorrect ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleCorrectAnswer(
                            questionIndex,
                            optionIndex
                          )
                        }
                        aria-label={`Set option ${optionLetter} as correct answer`}
                      >
                        {isCorrect && "✓"}
                      </button>

                      <input
                        type="text"
                        placeholder={`Option ${optionLetter}`}
                        value={option}
                        onChange={(event) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            event.target.value
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-question"
            onClick={addQuestion}
          >
            <span>+</span>
            Add Question
          </button>
        </>
      )}
    </section>
  );
}

export default QuizCreator;