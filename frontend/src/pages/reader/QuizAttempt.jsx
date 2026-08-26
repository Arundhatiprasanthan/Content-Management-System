import { useState } from "react";
import {
  Home,
  Search,
  User,
  Bell,
  ArrowLeft,
  PenLine,
} from "lucide-react";

import QuizResult from "./QuizResult";
import "./QuizAttempt.css";

const quizQuestions = [
  {
    question:
      "ARPANET, the precursor to the internet, sent its first message in which year?",
    options: ["1965", "1969", "1973", "1979"],
    correctAnswer: 1,
    explanation:
      "ARPANET sent its first message on October 29, 1969, between UCLA and the Stanford Research Institute.",
  },
  {
    question: "What does HTTP stand for?",
    options: [
      "HyperText Transfer Protocol",
      "HighText Transfer Protocol",
      "HyperText Transmission Program",
      "High Transfer Text Protocol",
    ],
    correctAnswer: 0,
    explanation:
      "HTTP stands for HyperText Transfer Protocol, the protocol used for communication between web browsers and servers.",
  },
];

function QuizAttempt() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [answeredCount, setAnsweredCount] =
    useState(0);

  // Store answers submitted by the user
  const [answers, setAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );

  // Result page state
  const [quizCompleted, setQuizCompleted] =
    useState(false);

  const [quizResult, setQuizResult] =
    useState(null);

  const question =
    quizQuestions[currentQuestion];

  /* =========================
     SELECT ANSWER
  ========================= */

  const handleSelectAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
  };

  /* =========================
     NEXT / SUBMIT
  ========================= */

  const handleNextQuestion = () => {
    // Don't continue without selecting answer
    if (selectedAnswer === null) {
      return;
    }

    // Save current answer
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] =
      selectedAnswer;

    setAnswers(updatedAnswers);

    // Number of questions answered
    const newAnsweredCount =
      updatedAnswers.filter(
        (answer) => answer !== null
      ).length;

    setAnsweredCount(newAnsweredCount);

    /* =========================
       LAST QUESTION
    ========================= */

    if (
      currentQuestion ===
      quizQuestions.length - 1
    ) {
      // Calculate score
      const score =
        updatedAnswers.filter(
          (answer, index) =>
            answer ===
            quizQuestions[index].correctAnswer
        ).length;

      // Prepare result data
      const resultQuestions =
        quizQuestions.map(
          (question, index) => ({
            question: question.question,

            correct:
              updatedAnswers[index] ===
              question.correctAnswer,

            explanation:
              question.explanation,
          })
        );

      const result = {
        score,
        total: quizQuestions.length,
        questions: resultQuestions,
      };

      setQuizResult(result);
      setQuizCompleted(true);

      return;
    }

    /* =========================
       NEXT QUESTION
    ========================= */

    setCurrentQuestion(
      (current) => current + 1
    );

    setSelectedAnswer(null);
  };

  /* =========================
     RESULT PAGE
  ========================= */

  if (quizCompleted && quizResult) {
    return (
      <QuizResult result={quizResult} />
    );
  }

  return (
    <div className="quiz-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="quiz-navbar">

        <div className="quiz-brand">

          <div className="quiz-brand-icon">
            ▣
          </div>

          <span>Lumen</span>

        </div>

        <nav className="quiz-nav">

          <button type="button">
            <Home
              size={13}
              strokeWidth={1.7}
            />
            Home
          </button>

          <button type="button">
            <Search
              size={13}
              strokeWidth={1.7}
            />
            Browse
          </button>

          <button type="button">
            <PenLine
              size={13}
              strokeWidth={1.7}
            />
            Write
          </button>

          <button type="button">
            <User
              size={13}
              strokeWidth={1.7}
            />
            Profile
          </button>

        </nav>

        <div className="quiz-user">

          <select defaultValue="reader">

            <option value="reader">
              Lena Kaufmann (reader)
            </option>

          </select>

          <Bell
            className="quiz-bell"
            size={15}
            strokeWidth={1.7}
          />

          <div className="quiz-avatar">
            LK
          </div>

        </div>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="quiz-attempt-container">

        {/* Back */}

        <button
          type="button"
          className="back-article"
        >
          <ArrowLeft size={14} />

          Back to Article
        </button>

        {/* =========================
            PROGRESS
        ========================= */}

        <div className="quiz-progress-header">

          <span>
            QUESTION {currentQuestion + 1} OF{" "}
            {quizQuestions.length}
          </span>

          <span>
            {answeredCount} answered
          </span>

        </div>

        <div className="progress-line">

          <div
            className="progress-fill"
            style={{
              width: `${
                (answeredCount /
                  quizQuestions.length) *
                100
              }%`,
            }}
          ></div>

        </div>

        {/* =========================
            QUESTION CARD
        ========================= */}

        <section className="attempt-question-card">

          <h1>
            {question.question}
          </h1>

          <div className="answer-list">

            {question.options.map(
              (option, optionIndex) => {

                const selected =
                  selectedAnswer ===
                  optionIndex;

                return (
                  <button
                    type="button"
                    key={optionIndex}
                    className={`answer-option ${
                      selected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectAnswer(
                        optionIndex
                      )
                    }
                  >

                    <span className="answer-letter">
                      {String.fromCharCode(
                        65 + optionIndex
                      )}
                    </span>

                    <span className="answer-text">
                      {option}
                    </span>

                  </button>
                );
              }
            )}

          </div>

        </section>

        {/* =========================
            NEXT / SUBMIT
        ========================= */}

        <button
          type="button"
          className={`next-question ${
            selectedAnswer !== null
              ? "enabled"
              : ""
          }`}
          onClick={handleNextQuestion}
        >
          {currentQuestion ===
          quizQuestions.length - 1
            ? "Submit Quiz"
            : "Next Question"}
        </button>

      </main>

    </div>
  );
}

export default QuizAttempt;