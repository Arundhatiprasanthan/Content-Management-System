<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
=======
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Home,
  Search,
  User,
  Bell,
  ArrowLeft,
  PenLine,
  CheckCircle2,
  HelpCircle,
  Clock,
  Award,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  History,
  BookOpen,
  Sparkles,
  Check,
  X,
  Layers,
  ArrowRight
} from "lucide-react";

import {
  fetchApprovedQuizzes,
  fetchQuizByArticleId,
  fetchQuizById,
  createAttempt,
  submitQuizAttempt,
  fetchMyAttempts,
  fetchAttemptResult
} from "../../services/quizApi";

import QuizResult from "./QuizResult";
import "./QuizAttempt.css";
>>>>>>> Stashed changes

function QuizAttempt() {
  const { articleId } = useParams();
  const navigate = useNavigate();
<<<<<<< Updated upstream

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
=======
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation & View states: 'list' | 'instructions' | 'attempt' | 'history'
  const [viewMode, setViewMode] = useState("list");

  // Data states
  const [approvedQuizzes, setApprovedQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  // Quiz Attempt progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [attemptSessionId, setAttemptSessionId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Result state
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Status states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const articleIdParam = searchParams.get("articleId");
  const quizIdParam = searchParams.get("quizId");
  const viewParam = searchParams.get("view");

  /* =========================================================
     INITIAL LOAD: FETCH QUIZZES & HANDLE PARAMS
     ========================================================= */
  useEffect(() => {
    loadInitialData();
  }, [articleIdParam, quizIdParam, viewParam]);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch approved quizzes list
      const quizzes = await fetchApprovedQuizzes();
      setApprovedQuizzes(quizzes);

      // 2. Fetch user's previous attempt history
      const attempts = await fetchMyAttempts();
      setHistoryList(attempts);

      // 3. Handle specific view or direct target quiz
      if (viewParam === "history") {
        setViewMode("history");
        setIsLoading(false);
        return;
      }

      if (quizIdParam) {
        const found = quizzes.find((q) => q._id === quizIdParam) || (await fetchQuizById(quizIdParam));
        if (found) {
          selectQuizForInstructions(found);
          setIsLoading(false);
          return;
        }
      }

      if (articleIdParam) {
        const quizForArticle = await fetchQuizByArticleId(articleIdParam);
        if (quizForArticle) {
          selectQuizForInstructions(quizForArticle);
          setIsLoading(false);
          return;
        }
      }

      // Default: Display approved quizzes list
      setViewMode("list");
    } catch (err) {
      console.error("Error loading quiz data:", err);
      setError("Failed to load quizzes. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     QUIZ SELECTION & INSTRUCTIONS
     ========================================================= */
  const selectQuizForInstructions = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setQuizCompleted(false);
    setQuizResult(null);
    setViewMode("instructions");
  };

  /* =========================================================
     START QUIZ ATTEMPT (API SESSION)
     ========================================================= */
  const handleStartQuiz = async () => {
    if (!activeQuiz) return;
    setIsLoading(true);
    try {
      const session = await createAttempt(activeQuiz._id);
      if (session && session.attemptId) {
        setAttemptSessionId(session.attemptId);
      }
      setViewMode("attempt");
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.warn("Could not start API attempt session, proceeding locally:", err);
      setViewMode("attempt");
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     ANSWER SELECTION
     ========================================================= */
  const handleSelectAnswer = (optionIndex) => {
    const updated = [...answers];
    updated[currentQuestionIndex] = optionIndex;
    setAnswers(updated);
  };

  /* =========================================================
     QUESTION NAVIGATION
     ========================================================= */
  const handleJumpToQuestion = (index) => {
    if (index >= 0 && index < (activeQuiz?.questions?.length || 0)) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < (activeQuiz?.questions?.length || 1) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Trigger confirmation modal on final question
      setIsConfirmModalOpen(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  /* =========================================================
     SUBMIT QUIZ WITH CONFIRMATION
     ========================================================= */
  const handleConfirmSubmit = async () => {
    if (!activeQuiz) return;
    setIsConfirmModalOpen(false);
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitQuizAttempt(activeQuiz._id, answers, attemptSessionId);
      setQuizResult(result);
      setQuizCompleted(true);

      // Refresh attempt history
      const updatedHistory = await fetchMyAttempts();
      setHistoryList(updatedHistory);
    } catch (err) {
      console.error("Submission failed:", err);
      setError(err.message || "Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     RETAKE QUIZ
     ========================================================= */
  const handleRetakeQuiz = () => {
    if (activeQuiz) {
      selectQuizForInstructions(activeQuiz);
    }
  };

  /* =========================================================
     CALCULATED VALUES FOR ATTEMPT
     ========================================================= */
  const totalQuestions = activeQuiz?.questions?.length || 0;
  const answeredCount = answers.filter((a) => a !== null).length;
  const currentQuestion = activeQuiz?.questions?.[currentQuestionIndex];
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // Render Completed Result Page
  if (quizCompleted && quizResult) {
    return (
      <QuizResult
        result={quizResult}
        onRetake={handleRetakeQuiz}
        onViewHistory={() => setViewMode("history")}
        onBackToQuizzes={() => {
          setActiveQuiz(null);
          setQuizCompleted(false);
          setQuizResult(null);
          setViewMode("list");
          setSearchParams({});
        }}
      />
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

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
=======
      {/* ================= HEADER / NAVBAR ================= */}
      <header className="quiz-navbar">
        <div className="quiz-brand" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <div className="quiz-brand-icon">▣</div>
          <span>Lumen</span>
        </div>

        <nav className="quiz-nav">
          <button type="button" onClick={() => navigate("/home")}>
            <Home size={14} strokeWidth={1.7} />
            Home
          </button>
          <button type="button" onClick={() => navigate("/browse")}>
            <Search size={14} strokeWidth={1.7} />
            Browse
          </button>
          <button
            type="button"
            className={viewMode === "list" || viewMode === "instructions" ? "active" : ""}
            onClick={() => {
              setViewMode("list");
              setActiveQuiz(null);
              setSearchParams({});
            }}
          >
            <Layers size={14} strokeWidth={1.7} />
            Quizzes
          </button>
          <button
            type="button"
            className={viewMode === "history" ? "active" : ""}
            onClick={() => setViewMode("history")}
          >
            <History size={14} strokeWidth={1.7} />
            Attempt History
          </button>
          <button type="button" onClick={() => navigate("/author/article")}>
            <PenLine size={14} strokeWidth={1.7} />
            Write
          </button>
        </nav>

        <div className="quiz-user">
          <select
            defaultValue="reader"
            onChange={(e) => {
              if (e.target.value === "author") {
                navigate("/author/article");
              }
            }}
          >
            <option value="reader">Lena Kaufmann (reader)</option>
            <option value="author">Priya Mehta (author)</option>
          </select>

          <Bell className="quiz-bell" size={15} strokeWidth={1.7} />
          <div className="quiz-avatar">LK</div>
        </div>
      </header>

      {/* ================= ERROR BANNER ================= */}
      {error && (
        <div className="quiz-error-banner">
          <AlertTriangle size={18} />
          <span>{error}</span>
          <button onClick={loadInitialData}>Retry</button>
        </div>
      )}

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="quiz-attempt-container">
        {/* =========================================================
            VIEW 1: DISPLAY APPROVED QUIZZES
           ========================================================= */}
        {viewMode === "list" && (
          <div className="approved-quizzes-view">
            <div className="quiz-section-header">
              <div className="header-badge">
                <Sparkles size={14} /> Approved Knowledge Checks
              </div>
              <h1>Interactive Article Quizzes</h1>
              <p>
                Strengthen your retention and test your understanding with verified quizzes curated by our expert authors.
              </p>
            </div>

            {isLoading ? (
              <div className="quiz-loading-state">
                <div className="quiz-spinner"></div>
                <p>Loading approved quizzes...</p>
              </div>
            ) : (
              <div className="approved-quiz-grid">
                {approvedQuizzes.map((quiz) => {
                  // Find any previous score for this quiz
                  const pastAttempt = historyList.find(
                    (h) => (h.quizId?._id || h.quizId) === quiz._id
                  );

                  return (
                    <div className="approved-quiz-card" key={quiz._id}>
                      <div className="card-top">
                        <span className="quiz-category-tag">
                          {quiz.articleId?.category || "Technology"}
                        </span>
                        <span className="quiz-status-badge">
                          <CheckCircle2 size={12} /> Approved
                        </span>
                      </div>

                      <h3 className="card-title">{quiz.title}</h3>
                      <p className="card-desc">
                        {quiz.description || "Challenge yourself with interactive questions based on the published article."}
                      </p>

                      <div className="card-article-ref">
                        <BookOpen size={13} />
                        <span>{quiz.articleId?.title || "Associated Article"}</span>
                      </div>

                      <div className="card-meta">
                        <span className="meta-item">
                          <HelpCircle size={13} /> {quiz.questions?.length || 3} Questions
                        </span>
                        <span className="meta-item">
                          <Clock size={13} /> ~{quiz.questions?.length ? quiz.questions.length * 1.5 : 3} mins
                        </span>
                      </div>

                      {pastAttempt && (
                        <div className="card-past-score">
                          <Award size={13} />
                          <span>
                            Best Score: {pastAttempt.score}/{pastAttempt.total} ({pastAttempt.percentage}%)
                          </span>
                        </div>
                      )}

                      <div className="card-action">
                        <button
                          type="button"
                          className="take-quiz-btn"
                          onClick={() => selectQuizForInstructions(quiz)}
                        >
                          {pastAttempt ? "Retake Quiz" : "Take Quiz"}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            VIEW 2: QUIZ INSTRUCTIONS (PRE-QUIZ SCREEN)
           ========================================================= */}
        {viewMode === "instructions" && activeQuiz && (
          <div className="quiz-instructions-view">
            <button
              type="button"
              className="back-article"
              onClick={() => {
                setViewMode("list");
                setSearchParams({});
              }}
            >
              <ArrowLeft size={14} />
              Back to Quizzes
            </button>

            <div className="instructions-card">
              <div className="instructions-badge">
                <BookOpen size={14} /> Quiz Instructions & Overview
              </div>

              <h1>{activeQuiz.title}</h1>
              <p className="instructions-subtitle">
                Associated Article: <strong>{activeQuiz.articleId?.title || "Selected Reading"}</strong>
              </p>

              <div className="instructions-stats-bar">
                <div className="stat-pill">
                  <span className="stat-label">Total Questions</span>
                  <span className="stat-val">{activeQuiz.questions?.length || 0}</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Passing Score</span>
                  <span className="stat-val">70%</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Question Type</span>
                  <span className="stat-val">Multiple Choice</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Verification</span>
                  <span className="stat-val">Instant Explanations</span>
                </div>
              </div>

              <div className="instructions-rules">
                <h3>Important Guidelines:</h3>
                <ul>
                  <li>
                    <span className="bullet">1</span>
                    <div>
                      <strong>One Answer Per Question:</strong> Carefully examine each scenario and select the most appropriate option.
                    </div>
                  </li>
                  <li>
                    <span className="bullet">2</span>
                    <div>
                      <strong>Free Navigation:</strong> You can jump forward or backward between any questions using the navigation jumper bar.
                    </div>
                  </li>
                  <li>
                    <span className="bullet">3</span>
                    <div>
                      <strong>Change Answers:</strong> You can modify your selected answers at any point prior to final submission.
                    </div>
                  </li>
                  <li>
                    <span className="bullet">4</span>
                    <div>
                      <strong>Instant Evaluation:</strong> Upon confirmation, your score, percentage, correct answers, and thorough explanations will be revealed.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="instructions-footer">
                <button
                  type="button"
                  className="start-quiz-btn"
                  onClick={handleStartQuiz}
                >
                  <Sparkles size={16} />
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 3: ACTIVE QUIZ ATTEMPT & QUESTION NAVIGATION
           ========================================================= */}
        {viewMode === "attempt" && activeQuiz && currentQuestion && (
          <div className="quiz-active-view">
            {/* Back Button */}
            <button
              type="button"
              className="back-article"
              onClick={() => setViewMode("instructions")}
            >
              <ArrowLeft size={14} />
              Review Instructions
            </button>

            {/* Progress Header */}
            <div className="quiz-progress-header">
              <span>
                QUESTION {currentQuestionIndex + 1} OF {totalQuestions}
              </span>
              <span>
                {answeredCount} of {totalQuestions} answered
              </span>
            </div>

            {/* Progress Bar */}
            <div className="progress-line">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>

            {/* Question Navigation Grid (Jumper Pills) */}
            <div className="question-jumper-container">
              <span className="jumper-label">Question Jump:</span>
              <div className="jumper-pill-grid">
                {activeQuiz.questions.map((_, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = answers[idx] !== null;

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`jumper-pill ${isCurrent ? "active-pill" : ""} ${
                        isAnswered ? "answered-pill" : "unanswered-pill"
                      }`}
                      onClick={() => handleJumpToQuestion(idx)}
                      title={`Jump to Question ${idx + 1} (${isAnswered ? "Answered" : "Unanswered"})`}
                    >
                      {idx + 1}
                      {isAnswered && !isCurrent && <Check size={10} className="pill-check" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Card */}
            <section className="attempt-question-card">
              <div className="question-index-indicator">
                Question {currentQuestionIndex + 1}
              </div>
              <h1 className="question-title-text">{currentQuestion.question}</h1>

              {/* Options List */}
              <div className="answer-list">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = answers[currentQuestionIndex] === optIdx;

                  return (
                    <button
                      type="button"
                      key={optIdx}
                      className={`answer-option ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectAnswer(optIdx)}
                    >
                      <span className="answer-letter">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="answer-text">{option}</span>
                      {isSelected && (
                        <span className="selection-check">
                          <Check size={14} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Navigation Buttons: Previous, Next, Submit */}
            <div className="quiz-controls-row">
              <button
                type="button"
                className="prev-question-btn"
                disabled={currentQuestionIndex === 0}
                onClick={handlePrevious}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="controls-right">
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    className="next-question enabled"
                    onClick={handleNext}
                  >
                    Next Question
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="submit-final-btn"
                    onClick={() => setIsConfirmModalOpen(true)}
                  >
                    Submit Quiz
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 4: ATTEMPT HISTORY DRAWER / VIEW
           ========================================================= */}
        {viewMode === "history" && (
          <div className="attempt-history-view">
            <div className="quiz-section-header">
              <div className="header-badge">
                <History size={14} /> Performance History
              </div>
              <h1>Your Quiz Attempt Records</h1>
              <p>Review your historical scores, progression, and learning milestones across all articles.</p>
            </div>

            {historyList.length === 0 ? (
              <div className="history-empty-state">
                <Award size={40} strokeWidth={1.5} />
                <h3>No attempts yet!</h3>
                <p>You haven't attempted any quizzes yet. Explore our approved quizzes to test your knowledge.</p>
                <button
                  type="button"
                  className="browse-quizzes-cta"
                  onClick={() => setViewMode("list")}
                >
                  Browse Approved Quizzes
                </button>
              </div>
            ) : (
              <div className="history-table-card">
                <div className="history-grid-header">
                  <span>Quiz & Article</span>
                  <span>Date</span>
                  <span>Score</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>

                <div className="history-rows">
                  {historyList.map((item, idx) => {
                    const quizTitle = item.quizId?.title || "Article Quiz";
                    const articleTitle = item.articleId?.title || "Knowledge Check";
                    const isPassed = item.percentage >= 70;
                    const dateStr = item.submittedAt
                      ? new Date(item.submittedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })
                      : "Recent";

                    return (
                      <div className="history-row" key={item._id || idx}>
                        <div className="row-quiz-info">
                          <span className="row-quiz-title">{quizTitle}</span>
                          <span className="row-article-title">{articleTitle}</span>
                        </div>

                        <div className="row-date">{dateStr}</div>

                        <div className="row-score">
                          <strong>
                            {item.score} / {item.total}
                          </strong>
                          <span className="row-percentage">({item.percentage}%)</span>
                        </div>

                        <div className="row-status">
                          <span className={`status-pill ${isPassed ? "pill-pass" : "pill-review"}`}>
                            {isPassed ? "Passed" : "Needs Review"}
                          </span>
                        </div>

                        <div className="row-action">
                          <button
                            type="button"
                            className="review-attempt-btn"
                            onClick={async () => {
                              const detail = await fetchAttemptResult(item._id || item.attemptId);
                              if (detail) {
                                setQuizResult(detail);
                                setQuizCompleted(true);
                              }
                            }}
                          >
                            View Result
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
>>>>>>> Stashed changes

      {/* =========================================================
          CONFIRMATION MODAL BEFORE SUBMISSION
         ========================================================= */}
      {isConfirmModalOpen && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-box">
            <div className="modal-icon-badge">
              <CheckCircle2 size={24} />
            </div>

            <h2>Submit Your Quiz?</h2>
            <p className="modal-lead">
              You have answered <strong>{answeredCount}</strong> out of{" "}
              <strong>{totalQuestions}</strong> questions.
            </p>

            {answeredCount < totalQuestions && (
              <div className="modal-warning-banner">
                <AlertTriangle size={18} />
                <span>
                  You have {totalQuestions - answeredCount} unanswered question
                  {totalQuestions - answeredCount > 1 ? "s" : ""}. Unanswered questions will receive 0 points.
                </span>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                disabled={isSubmitting}
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Review Answers
              </button>

              <button
                type="button"
                className="modal-confirm-btn"
                disabled={isSubmitting}
                onClick={handleConfirmSubmit}
              >
                {isSubmitting ? (
                  <>
                    <span className="mini-spinner"></span>
                    Evaluating...
                  </>
                ) : (
                  <>
                    Confirm & Submit
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizAttempt;