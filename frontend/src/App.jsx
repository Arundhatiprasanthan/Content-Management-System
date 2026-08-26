import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthorArticle from "./pages/author/AuthorArticle";
import QuizCreator from "./pages/author/QuizCreator";

import QuizAttempt from "./pages/reader/QuizAttempt";
import QuizResult from "./pages/reader/QuizResult";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Author */}
        <Route
          path="/author/article"
          element={<AuthorArticle />}
        />

        <Route
          path="/author/quiz"
          element={<QuizCreator />}
        />

        {/* Reader */}
        <Route
          path="/quiz"
          element={<QuizAttempt />}
        />

        <Route
          path="/quiz/result"
          element={<QuizResult />}
        />

        {/* Default page */}
        <Route
          path="/"
          element={<Navigate to="/author/article" replace />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/author/article" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;