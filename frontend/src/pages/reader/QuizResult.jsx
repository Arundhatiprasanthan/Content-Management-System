import { useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  User,
  Bell,
  Trophy,
  Check,
  X,
  PenLine,
  RotateCcw,
  History,
  ArrowLeft,
  BookOpen,
  Layers,
  Award,
} from "lucide-react";

import "./QuizResult.css";

function QuizResult({ result, onRetake, onViewHistory, onBackToQuizzes }) {
  const navigate = useNavigate();

  // Fallback if accessed directly
  const quizResult = result || {
    score: 2,
    total: 2,
    percentage: 100,
    questions: [
      {
        question: "ARPANET, the precursor to the internet, sent its first message in which year?",
        correct: true,
        selectedOption: 1,
        correctAnswer: 1,
        options: ["1965", "1969", "1973", "1979"],
        explanation: "ARPANET sent its first message on October 29, 1969, between UCLA and the Stanford Research Institute."
      },
      {
        question: "What does HTTP stand for?",
        correct: true,
        selectedOption: 0,
        correctAnswer: 0,
        options: [
          "HyperText Transfer Protocol",
          "HighText Transfer Protocol",
          "HyperText Transmission Program",
          "High Transfer Text Protocol"
        ],
        explanation: "HTTP stands for HyperText Transfer Protocol, the protocol used by web browsers and web servers."
      }
    ]
  };

  const total = quizResult.total || quizResult.questions?.length || 0;
  const score =
    quizResult.score !== undefined
      ? quizResult.score
      : (quizResult.questions || []).filter((q) => q.correct || q.isCorrect).length;

  const percentage =
    quizResult.percentage !== undefined
      ? quizResult.percentage
      : total > 0
      ? Math.round((score / total) * 100)
      : 0;

  let heading = "Keep learning!";
  let badgeText = "Needs Review";
  let trophyClass = "trophy-review";

  if (percentage === 100) {
    heading = "Outstanding! Perfect Score";
    badgeText = "Mastery Achieved";
    trophyClass = "trophy-success";
  } else if (percentage >= 70) {
    heading = "Well done! Passed";
    badgeText = "Passed";
    trophyClass = "trophy-good";
  } else if (percentage >= 50) {
    heading = "Good effort!";
    badgeText = "Review Recommended";
    trophyClass = "trophy-review";
  }

  const handleRetake = () => {
    if (onRetake) {
      onRetake();
    } else {
      navigate("/quiz");
    }
  };

  const handleHistory = () => {
    if (onViewHistory) {
      onViewHistory();
    } else {
      navigate("/quiz?view=history");
    }
  };

  const handleBackToQuizzes = () => {
    if (onBackToQuizzes) {
      onBackToQuizzes();
    } else {
      navigate("/quiz");
    }
  };

  const handleBackToArticle = () => {
    if (quizResult.articleId) {
      const artId = quizResult.articleId._id || quizResult.articleId.id || quizResult.articleId;
      navigate(`/article/${artId}`);
    } else {
      navigate("/browse");
    }
  };

  return (
    <div className="quiz-result-page">
      {/* ================= NAVBAR ================= */}
      <header className="result-navbar">
        <div className="result-brand" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <div className="result-brand-icon">
            ▣
          </div>
          <span>Lumen</span>
        </div>

        <nav className="result-nav">
          <button type="button" onClick={() => navigate("/home")}>
            <Home size={14} strokeWidth={1.7} />
            Home
          </button>
          <button type="button" onClick={() => navigate("/browse")}>
            <Search size={14} strokeWidth={1.7} />
            Browse
          </button>
          <button type="button" onClick={handleBackToQuizzes}>
            <Layers size={14} strokeWidth={1.7} />
            Quizzes
          </button>
          <button type="button" onClick={handleHistory}>
            <History size={14} strokeWidth={1.7} />
            Attempt History
          </button>
          <button type="button" onClick={() => navigate("/author/article")}>
            <PenLine size={14} strokeWidth={1.7} />
            Write
          </button>
        </nav>

        <div className="result-user">
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

          <Bell size={15} strokeWidth={1.7} />
          <div className="result-avatar">LK</div>
        </div>
      </header>

      {/* ================= RESULT HERO ================= */}
      <main className="result-container">
        {/* Navigation Breadcrumb */}
        <div className="result-top-actions">
          <button type="button" className="result-back-link" onClick={handleBackToQuizzes}>
            <ArrowLeft size={14} /> Back to All Quizzes
          </button>
          {quizResult.articleId && (
            <button type="button" className="result-article-link" onClick={handleBackToArticle}>
              <BookOpen size={14} /> Back to Article
            </button>
          )}
        </div>

        <div className="result-header-card">
          <div className={`result-trophy ${trophyClass}`}>
            <Trophy size={34} strokeWidth={1.8} />
          </div>

          <div className="result-badge-pill">{badgeText}</div>
          <h1 className="result-heading">{heading}</h1>

          <p className="score-text">
            You scored <strong>{score}</strong> out of <strong>{total}</strong> questions ({percentage}%)
          </p>

          <div className="score-bar">
            <div
              className={`score-fill ${percentage >= 70 ? "score-fill-pass" : "score-fill-review"}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {/* Action Row */}
          <div className="result-actions-row">
            <button type="button" className="retake-quiz-action" onClick={handleRetake}>
              <RotateCcw size={15} /> Retake Quiz
            </button>
            <button type="button" className="history-quiz-action" onClick={handleHistory}>
              <History size={15} /> View Attempt History
            </button>
          </div>
        </div>

        {/* ================= QUESTIONS BREAKDOWN ================= */}
        <div className="result-questions-section">
          <div className="section-title-row">
            <h2>Detailed Review & Explanations</h2>
            <span className="breakdown-tag">
              {score} Correct • {total - score} Incorrect
            </span>
          </div>

          <div className="result-questions-list">
            {(quizResult.questions || []).map((item, index) => {
              const isCorrect = item.correct || item.isCorrect;
              const hasOptions = Array.isArray(item.options) && item.options.length > 0;

              return (
                <div
                  className={`result-question-card ${isCorrect ? "card-correct" : "card-incorrect"}`}
                  key={index}
                >
                  <div className="card-header-row">
                    <span className={`result-indicator-badge ${isCorrect ? "badge-correct" : "badge-incorrect"}`}>
                      {isCorrect ? (
                        <>
                          <Check size={14} strokeWidth={2.4} /> Correct
                        </>
                      ) : (
                        <>
                          <X size={14} strokeWidth={2.4} /> Incorrect
                        </>
                      )}
                    </span>
                    <span className="question-number">Question {index + 1}</span>
                  </div>

                  <h3 className="result-question-text">{item.question}</h3>

                  {/* If options available, display the options with user and correct selections */}
                  {hasOptions && (
                    <div className="result-options-review">
                      {item.options.map((opt, optIdx) => {
                        const isUserChoice = item.selectedOption === optIdx;
                        const isAnswer = item.correctAnswer === optIdx;

                        let optClass = "opt-neutral";
                        if (isAnswer) {
                          optClass = "opt-correct-answer";
                        } else if (isUserChoice && !isCorrect) {
                          optClass = "opt-wrong-choice";
                        }

                        return (
                          <div className={`review-option ${optClass}`} key={optIdx}>
                            <span className="review-letter">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="review-text">{opt}</span>
                            {isAnswer && (
                              <span className="correct-tag">
                                <Check size={12} /> Correct Answer
                              </span>
                            )}
                            {isUserChoice && !isCorrect && (
                              <span className="wrong-tag">
                                <X size={12} /> Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation box */}
                  {item.explanation && (
                    <div className="result-explanation-box">
                      <strong>Explanation:</strong>
                      <p>{item.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default QuizResult;