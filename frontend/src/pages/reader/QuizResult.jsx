import {
  Home,
  Search,
  User,
  Bell,
  Trophy,
  Check,
  X,
} from "lucide-react";

import "./QuizResult.css";

function QuizResult({ result }) {
  // Temporary fallback data.
  // Baad mein QuizAttempt se actual result yahan aayega.
  const quizResult = result || {
    questions: [
      {
        question:
          "ARPANET, the precursor to the internet, sent its first message in which year?",
        correct: true,
        explanation:
          "ARPANET sent its first message on October 29, 1969, between UCLA and the Stanford Research Institute.",
      },
      {
        question:
          "What was the intended first message sent over ARPANET?",
        correct: false,
        explanation:
          'The intended message was "Login" — only "Lo" was received before the system crashed.',
      },
    ],
  };

  const total = quizResult.questions.length;

  const score = quizResult.questions.filter(
    (question) => question.correct
  ).length;

  const percentage =
    total > 0 ? Math.round((score / total) * 100) : 0;

  // Figma-style heading
  let heading = "Keep learning!";

  if (percentage === 100) {
    heading = "Well done!";
  } else if (percentage >= 50) {
    heading = "Good effort!";
  }

  return (
    <div className="quiz-result-page">

      {/* ================= NAVBAR ================= */}

      <header className="result-navbar">

        <div className="result-brand">
          <div className="result-brand-icon">
            ▣
          </div>

          <span>Lumen</span>
        </div>

        <nav className="result-nav">

          <button type="button">
            <Home size={13} strokeWidth={1.7} />
            Home
          </button>

          <button type="button">
            <Search size={13} strokeWidth={1.7} />
            Browse
          </button>

          <button type="button">
            <User size={13} strokeWidth={1.7} />
            Profile
          </button>

        </nav>

        <div className="result-user">

          <select defaultValue="reader">
            <option value="reader">
              Lena Kaufmann (reader)
            </option>
          </select>

          <Bell
            size={15}
            strokeWidth={1.7}
          />

          <div className="result-avatar">
            LK
          </div>

        </div>

      </header>

      {/* ================= RESULT ================= */}

      <main className="result-container">

        {/* Trophy */}

        <div
          className={`result-trophy ${
            percentage === 100
              ? "trophy-success"
              : "trophy-normal"
          }`}
        >
          <Trophy
            size={31}
            strokeWidth={1.8}
          />
        </div>

        {/* Heading */}

        <h1>{heading}</h1>

        {/* Score */}

        <p className="score-text">
          You scored {score} of {total} ({percentage}%)
        </p>

        {/* Score Bar */}

        <div className="score-bar">
          <div
            className="score-fill"
            style={{
              width: `${percentage}%`,
            }}
          ></div>
        </div>

        {/* ================= QUESTIONS ================= */}

        <div className="result-questions">

          {quizResult.questions.map(
            (item, index) => (

              <div
                className={`result-question ${
                  item.correct
                    ? "correct"
                    : "incorrect"
                }`}
                key={index}
              >

                <div className="result-question-title">

                  <span className="result-status">

                    {item.correct ? (
                      <Check
                        size={16}
                        strokeWidth={2}
                      />
                    ) : (
                      <X
                        size={16}
                        strokeWidth={2}
                      />
                    )}

                  </span>

                  <span>
                    {item.question}
                  </span>

                </div>

                <p>
                  {item.explanation}
                </p>

              </div>
            )
          )}

        </div>

        {/* Back */}

        <button
          type="button"
          className="back-to-article"
        >
          Back to Article
        </button>

      </main>

    </div>
  );
}

export default QuizResult;