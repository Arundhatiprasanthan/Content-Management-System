import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import "./QuizReview.css";

function QuizReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showChangesBox, setShowChangesBox] = useState(false);
  const [changeMessage, setChangeMessage] = useState("");

  // ==========================================
  // FETCH QUIZ
  // ==========================================

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!id) {
        console.error("Quiz ID is missing");
        setQuiz(null);
        return;
      }

      console.log("Fetching quiz for admin review:", id);

      const response = await fetch(
        `http://localhost:5000/api/admin/quizzes/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Quiz review response:", data);

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        alert("You do not have permission to review quizzes.");
        navigate("/home");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch quiz"
        );
      }

      if (data.success) {
        setQuiz(data.quiz || data.data);
      } else {
        throw new Error(
          data.message || "Quiz not found"
        );
      }
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      alert(error.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // APPROVE / REJECT QUIZ
  // ==========================================

  const updateQuizStatus = async (action) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setActionLoading(true);

      console.log(
        `Updating quiz status: ${action}`,
        id
      );

      const response = await fetch(
        `http://localhost:5000/api/admin/quizzes/${id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Quiz status response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Action failed"
        );
      }

      alert(
        data.message ||
          "Quiz status updated successfully."
      );

      navigate("/admin/review");
    } catch (error) {
      console.error(
        "Quiz status update error:",
        error
      );

      alert(
        error.message ||
          "Failed to update quiz status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // REQUEST CHANGES
  // ==========================================

  const requestChanges = async () => {
    if (!changeMessage.trim()) {
      alert(
        "Please enter a message explaining the changes required."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setActionLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/admin/quizzes/${id}/request-changes`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: changeMessage.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Request changes response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to request changes"
        );
      }

      alert(
        data.message ||
          "Changes requested successfully."
      );

      navigate("/admin/review");
    } catch (error) {
      console.error(
        "Request quiz changes error:",
        error
      );

      alert(
        error.message ||
          "Failed to request changes."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <div className="dashboard-empty">
            <h3>Loading quiz...</h3>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ==========================================
  // QUIZ NOT FOUND
  // ==========================================

  if (!quiz) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <div className="dashboard-empty">
            <h3>Quiz not found</h3>

            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/admin/review")
              }
            >
              ← Back to Review Queue
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const questions = quiz.questions || [];

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <AdminLayout>
      <div className="admin-page">

        {/* PAGE HEADER */}

        <section className="page-heading">
          <div>
            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/admin/review")
              }
            >
              ← Back to Review Queue
            </button>

            <h1>Quiz Review</h1>

            <p>
              Review the submitted quiz before
              publishing it.
            </p>
          </div>
        </section>

        {/* QUIZ CONTENT */}

        <section className="dashboard-section">

          {/* QUIZ INFORMATION */}

          <div className="quiz-review-header">

            <div className="quiz-review-title-row">

              <div>
                <span className="review-category">
                  Quiz
                </span>

                <h2>
                  {quiz.title ||
                    "Untitled Quiz"}
                </h2>
              </div>

              <span className="review-status">
                {quiz.status ||
                  "Pending Review"}
              </span>

            </div>

            <p className="quiz-description">
              {quiz.description ||
                "No description provided."}
            </p>

            {/* AUTHOR / ARTICLE DETAILS */}

            <div className="quiz-review-meta">

              <div>
                <strong>Author</strong>

                <span>
                  {quiz.author?.name ||
                    quiz.authorId?.name ||
                    "Unknown"}
                </span>
              </div>

              <div>
                <strong>Email</strong>

                <span>
                  {quiz.author?.email ||
                    quiz.authorId?.email ||
                    "Not available"}
                </span>
              </div>

              <div>
                <strong>Article</strong>

                <span>
                  {quiz.article?.title ||
                    quiz.articleId?.title ||
                    "Not available"}
                </span>
              </div>

              <div>
                <strong>Questions</strong>

                <span>
                  {questions.length}
                </span>
              </div>

            </div>
          </div>

          {/* QUESTIONS */}

          <div className="quiz-questions">

            <div className="quiz-section-heading">
              <h2>Questions</h2>

              <span>
                {questions.length}{" "}
                {questions.length === 1
                  ? "Question"
                  : "Questions"}
              </span>
            </div>

            {questions.length === 0 ? (
              <div className="dashboard-empty">
                <h3>No questions found</h3>

                <p>
                  This quiz does not contain
                  any questions.
                </p>
              </div>
            ) : (
              questions.map(
                (question, index) => (
                  <div
                    className="quiz-question-card"
                    key={
                      question._id || index
                    }
                  >

                    {/* QUESTION */}

                    <div className="question-header">

                      <span className="question-number">
                        Question {index + 1}
                      </span>

                      <h3>
                        {question.question ||
                          "Question text missing"}
                      </h3>

                    </div>

                    {/* OPTIONS */}

                    <div className="quiz-options">

                      {(question.options || []).map(
                        (option, optionIndex) => {

                          const isCorrect =
                            Number(
                              question.correctAnswer
                            ) === optionIndex;

                          return (
                            <div
                              className={`quiz-option ${
                                isCorrect
                                  ? "correct-option"
                                  : ""
                              }`}
                              key={optionIndex}
                            >

                              <span className="option-letter">
                                {String.fromCharCode(
                                  65 + optionIndex
                                )}
                              </span>

                              <span className="option-text">
                                {option}
                              </span>

                              {isCorrect && (
                                <span className="correct-label">
                                  ✓ Correct Answer
                                </span>
                              )}

                            </div>
                          );
                        }
                      )}

                    </div>

                    {/* EXPLANATION */}

                    {question.explanation && (
                      <div className="question-explanation">

                        <strong>
                          Explanation
                        </strong>

                        <p>
                          {question.explanation}
                        </p>

                      </div>
                    )}

                  </div>
                )
              )
            )}

          </div>

          {/* REQUEST CHANGES */}

          {showChangesBox && (
            <div className="changes-box">

              <h3>
                Request Changes
              </h3>

              <p>
                Explain what the author needs
                to change in this quiz.
              </p>

              <textarea
                value={changeMessage}
                onChange={(e) =>
                  setChangeMessage(
                    e.target.value
                  )
                }
                placeholder="Example: Question 2 has an incorrect answer. Please review the options and explanation."
                rows={5}
                disabled={actionLoading}
              />

              <div className="changes-box-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowChangesBox(false);
                    setChangeMessage("");
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="changes-submit-button"
                  onClick={requestChanges}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Submitting..."
                    : "Send Change Request"}
                </button>

              </div>

            </div>
          )}

          {/* ACTION BUTTONS */}

          {!showChangesBox && (
            <div className="review-actions">

              <button
                type="button"
                className="approve-button"
                onClick={() =>
                  updateQuizStatus("approve")
                }
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "✓ Approve & Publish"}
              </button>

              <button
                type="button"
                className="changes-button"
                onClick={() =>
                  setShowChangesBox(true)
                }
                disabled={actionLoading}
              >
                ✎ Request Changes
              </button>

              <button
                type="button"
                className="reject-button"
                onClick={() =>
                  updateQuizStatus("reject")
                }
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "× Reject Quiz"}
              </button>

            </div>
          )}

        </section>
      </div>
    </AdminLayout>
  );
}

export default QuizReview;