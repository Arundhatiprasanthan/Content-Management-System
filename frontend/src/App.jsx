import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthorArticle from "./pages/author/AuthorArticle";
import QuizCreator from "./pages/author/QuizCreator";

import QuizAttempt from "./pages/reader/QuizAttempt";
import QuizResult from "./pages/reader/QuizResult";
import Home from "./pages/reader/Home/Home";
import Browse from "./pages/reader/Browse/Browse";
import ArticleDetails from "./pages/reader/ArticleDetails/ArticleDetails";

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

        <Route path="/home" element={<Home/>}/>

        <Route path="/browse" element={<Browse/>}/>

        <Route path="/article/:id" element={<ArticleDetails/>}/>
        
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
          element={<Navigate to="/home" replace />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/home" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;