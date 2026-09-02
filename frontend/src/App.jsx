import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Profile from "./pages/profile/Profile";
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
        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Reader Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/article/:id" element={<ArticleDetails />} />
        <Route path="/quiz" element={<QuizAttempt />} />
        <Route path="/quiz/result" element={<QuizResult />} />

        {/* Protected Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected Author Routes (Only Author and Admin) */}
        <Route
          path="/author/article"
          element={
            <ProtectedRoute allowedRoles={["Author", "Admin"]}>
              <AuthorArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/author/quiz"
          element={
            <ProtectedRoute allowedRoles={["Author", "Admin"]}>
              <QuizCreator />
            </ProtectedRoute>
          }
        />

        {/* Default route -> Redirects to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Unknown URL -> Redirects to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;