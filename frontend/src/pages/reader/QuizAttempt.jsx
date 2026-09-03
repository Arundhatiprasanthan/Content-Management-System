import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function QuizAttempt() {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET QUIZ BY ARTICLE ID
  // ==========================================
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/quizzes/article/${articleId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load quiz"
          );
        }

        setQuiz(data.data);
      } catch (error) {
        console.error("Quiz loading error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchQuiz();
    }
  }, [articleId]);

  // ==========================================
  // SELECT ANSWER
  // ==========================================
  const handleAnswerChange = (
    questionIndex,
    optionIndex
  ) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionIndex]: optionIndex,
    }));
  };

  // ==========================================
  // SUBMIT QUIZ
  // ==========================================
  const handleSubmit = async () => {
    if (!quiz || !quiz.questions) {
      return;
    }

    // Check whether all questions are answered
    const unanswered = quiz.questions.some(
      (_, index) => answers[index] === undefined
    );

    if (unanswered) {
      alert(
        "Please answer all questions before submitting."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      /*
        Backend expects:

        {
          answers: [0, 2, 1]
        }

        Each number represents the selected
        option index for that question.
      */

      const answerArray = quiz.questions.map(
        (_, index) => answers[index]
      );

      // ==========================================
      // POST QUIZ ATTEMPT
      // ==========================================

      const response = await fetch(
        `http://localhost:5000/api/quizzes/${quiz._id}/attempt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            answers: answerArray,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit quiz"
        );
      }

      console.log("Quiz result:", data.data);

      // ==========================================
      // GO TO RESULT PAGE
      // ==========================================

      navigate("/quiz/result", {
        state: {
          result: data.data,
          quizTitle: quiz.title,
        },
      });
    } catch (error) {
      console.error(
        "Quiz submission error:",
        error
      );

      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="quiz-page">
        <h2>Loading quiz...</h2>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !quiz) {
    return (
      <div className="quiz-page">
        <h2>Unable to load quiz</h2>

        <p>{error}</p>

        <button onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // ==========================================
  // QUIZ NOT FOUND
  // ==========================================

  if (!quiz) {
    return (
      <div className="quiz-page">
        <h2>Quiz not found</h2>

        <p>
          There is no quiz associated with this article.
        </p>

        <button onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // ==========================================
  // QUIZ UI
  // ==========================================

  return (
    <div className="quiz-page">

      {/* ======================================
          QUIZ HEADER
      ======================================= */}

      <div className="quiz-header">
        <h1>{quiz.title}</h1>

        {quiz.description && (
          <p>{quiz.description}</p>
        )}

        <p>
          {quiz.questions.length}{" "}
          {quiz.questions.length === 1
            ? "Question"
            : "Questions"}
        </p>
      </div>


      {/* ======================================
          QUESTIONS
      ======================================= */}

      <div className="quiz-questions">

        {quiz.questions.map(
          (question, questionIndex) => (
            <div
              className="quiz-question"
              key={
                question._id ||
                questionIndex
              }
            >

              <h3>
                {questionIndex + 1}.{" "}
                {question.question}
              </h3>


              {/* =================================
                  OPTIONS
              ================================== */}

              <div className="quiz-options">

                {question.options.map(
                  (option, optionIndex) => (
                    <label
                      className={`quiz-option ${
                        answers[questionIndex] ===
                        optionIndex
                          ? "selected"
                          : ""
                      }`}
                      key={optionIndex}
                    >

                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={optionIndex}
                        checked={
                          answers[
                            questionIndex
                          ] === optionIndex
                        }
                        onChange={() =>
                          handleAnswerChange(
                            questionIndex,
                            optionIndex
                          )
                        }
                      />

                      <span>{option}</span>

                    </label>
                  )
                )}

              </div>

            </div>
          )
        )}

      </div>


      {/* ======================================
          SUBMISSION ERROR
      ======================================= */}

      {error && (
        <div className="quiz-error">
          {error}
        </div>
      )}


      {/* ======================================
          SUBMIT BUTTON
      ======================================= */}

      <div className="quiz-submit-container">

        <button
          className="quiz-submit-button"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : "Submit Quiz"}
        </button>

      </div>

    </div>
  );
}

export default QuizAttempt;