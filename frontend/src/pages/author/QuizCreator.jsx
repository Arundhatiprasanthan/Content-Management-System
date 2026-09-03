import { useState } from "react";
import "./QuizCreator.css";

const createQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: null,
});

function QuizCreator({ onQuizChange }) {
  const [quizEnabled, setQuizEnabled] = useState(true);

  const [questions, setQuestions] = useState([
    createQuestion(),
  ]);

  const updateQuestions = (updatedQuestions) => {
    setQuestions(updatedQuestions);

    if (onQuizChange) {
      onQuizChange({
        enabled: quizEnabled,
        questions: updatedQuestions,
      });
    }
  };

  const handleQuestionChange = (questionIndex, value) => {
    const updatedQuestions = questions.map((question, index) =>
      index === questionIndex
        ? { ...question, question: value }
        : question
    );

    updateQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    questionIndex,
    optionIndex,
    value
  ) => {
    const updatedQuestions = questions.map(
      (question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const updatedOptions = [...question.options];
        updatedOptions[optionIndex] = value;

        return {
          ...question,
          options: updatedOptions,
        };
      }
    );

    updateQuestions(updatedQuestions);
  };

  const handleCorrectAnswer = (
    questionIndex,
    optionIndex
  ) => {
    const updatedQuestions = questions.map(
      (question, index) =>
        index === questionIndex
          ? {
              ...question,
              correctAnswer: optionIndex,
            }
          : question
    );

    updateQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    const updatedQuestions = [
      ...questions,
      createQuestion(),
    ];

    updateQuestions(updatedQuestions);
  };

  const removeQuestion = (questionIndex) => {
    if (questions.length === 1) {
      return;
    }

    const updatedQuestions = questions.filter(
      (_, index) => index !== questionIndex
    );

    updateQuestions(updatedQuestions);
  };

  const handleToggle = () => {
    const newEnabled = !quizEnabled;

    setQuizEnabled(newEnabled);

    if (onQuizChange) {
      onQuizChange({
        enabled: newEnabled,
        questions,
      });
    }
  };

  return (
    <section className="quiz-creator">
      <div className="quiz-header">
        <div>
          <h2>Add a Quiz</h2>
          <p>
            Quizzes increase reader engagement significantly.
          </p>
        </div>

        <button
          type="button"
          className={`quiz-toggle ${
            quizEnabled ? "active" : ""
          }`}
          onClick={handleToggle}
          aria-label="Toggle quiz"
        >
          <span></span>
        </button>
      </div>

      {quizEnabled && (
        <>
          <div className="quiz-divider"></div>

          {questions.map((question, questionIndex) => (
            <div
              className="question-card"
              key={questionIndex}
            >
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
                {question.options.map(
                  (option, optionIndex) => {
                    const optionLetter =
                      String.fromCharCode(
                        65 + optionIndex
                      );

                    const isCorrect =
                      question.correctAnswer ===
                      optionIndex;

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
                            isCorrect
                              ? "selected"
                              : ""
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
                  }
                )}
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