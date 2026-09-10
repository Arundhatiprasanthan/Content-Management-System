import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchApprovedQuizzes,
  fetchQuizByArticleId,
  fetchQuizById,
  createAttempt,
  submitQuizAttempt,
  fetchMyAttempts,
} from "../../services/quizApi";
import QuizResult from "./QuizResult";
import "./QuizAttempt.css";

function QuizAttempt() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [view, setView] = useState("list");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [approved, attempts] = await Promise.all([
          fetchApprovedQuizzes(),
          fetchMyAttempts(),
        ]);
        setQuizzes(approved);
        setHistory(attempts);

        const quizId = searchParams.get("quizId");
        const articleId = searchParams.get("articleId");
        const selected = quizId
          ? await fetchQuizById(quizId)
          : articleId
            ? await fetchQuizByArticleId(articleId)
            : null;

        if (selected) {
          selectQuiz(selected);
        } else if (searchParams.get("view") === "history") {
          setView("history");
        }
      } catch (loadError) {
        setError(loadError.message || "Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchParams]);

  const selectQuiz = (selectedQuiz) => {
    setQuiz(selectedQuiz);
    setAnswers(new Array(selectedQuiz.questions?.length || 0).fill(null));
    setQuestionIndex(0);
    setResult(null);
    setView("instructions");
  };

  const startQuiz = async () => {
    const session = await createAttempt(quiz._id);
    setAttemptId(session?.attemptId || null);
    setView("attempt");
  };

  const submit = async () => {
    if (answers.some((answer) => answer === null)) {
      setError("Please answer every question before submitting.");
      return;
    }

    setError("");
    const submittedResult = await submitQuizAttempt(quiz._id, answers, attemptId);
    setResult(submittedResult);
    setHistory(await fetchMyAttempts());
    setView("result");
  };

  const resetToList = () => {
    setQuiz(null);
    setResult(null);
    setView("list");
    setSearchParams({});
  };

  if (loading) return <div className="quiz-page"><h2>Loading quizzes...</h2></div>;
  if (error && !quiz) return <div className="quiz-page"><h2>{error}</h2></div>;
  if (view === "result" && result) {
    return <QuizResult result={result} onRetake={() => selectQuiz(quiz)} onBackToQuizzes={resetToList} />;
  }
  if (view === "history") {
    return (
      <div className="quiz-page">
        <button type="button" onClick={resetToList}>Back to Quizzes</button>
        <h1>Attempt History</h1>
        {history.map((attempt) => (
          <p key={attempt._id || attempt.attemptId}>
            {attempt.quizId?.title || attempt.quizTitle || "Quiz"}: {attempt.score}/{attempt.total}
          </p>
        ))}
      </div>
    );
  }
  if (view === "instructions" && quiz) {
    return (
      <div className="quiz-page">
        <button type="button" onClick={resetToList}>Back to Quizzes</button>
        <h1>{quiz.title}</h1>
        <p>{quiz.description}</p>
        <button type="button" onClick={startQuiz}>Start Quiz</button>
      </div>
    );
  }
  if (view === "attempt" && quiz) {
    const question = quiz.questions[questionIndex];
    return (
      <div className="quiz-page">
        <h1>{quiz.title}</h1>
        <h2>{questionIndex + 1}. {question.question}</h2>
        {question.options.map((option, optionIndex) => (
          <label key={optionIndex} className="quiz-option">
            <input
              type="radio"
              name={`question-${questionIndex}`}
              checked={answers[questionIndex] === optionIndex}
              onChange={() => setAnswers((current) => current.map((answer, index) => index === questionIndex ? optionIndex : answer))}
            />
            {option}
          </label>
        ))}
        <div>
          <button type="button" disabled={questionIndex === 0} onClick={() => setQuestionIndex((index) => index - 1)}>Previous</button>
          {questionIndex < quiz.questions.length - 1 ? (
            <button type="button" onClick={() => setQuestionIndex((index) => index + 1)}>Next</button>
          ) : (
            <button type="button" onClick={submit}>Submit Quiz</button>
          )}
        </div>
        {error && <p className="quiz-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <h1>Interactive Article Quizzes</h1>
      <button type="button" onClick={() => { setView("history"); setSearchParams({ view: "history" }); }}>Attempt History</button>
      {quizzes.map((item) => (
        <article key={item._id} className="approved-quiz-card">
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <button type="button" onClick={() => selectQuiz(item)}>Take Quiz</button>
        </article>
      ))}
      <button type="button" onClick={() => navigate("/home")}>Back Home</button>
    </div>
  );
}

export default QuizAttempt;
