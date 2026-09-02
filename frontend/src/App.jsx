import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import ReviewQueue from "./modules/admin/pages/ReviewQueue";
import ArticleReview from "./modules/admin/pages/ArticleReview";
import ContentManagement from "./modules/admin/pages/ContentManagement";
import AdminNotifications from "./modules/admin/pages/AdminNotifications";
import AdminProfile from "./modules/admin/pages/AdminProfile";

import AuthorArticle from "./pages/author/AuthorArticle";
import QuizCreator from "./pages/author/QuizCreator";

import QuizAttempt from "./pages/reader/QuizAttempt";
import QuizResult from "./pages/reader/QuizResult";
import Home from "./pages/reader/Home/Home";
import Browse from "./pages/reader/Browse/Browse";
import ArticleDetails from "./pages/reader/ArticleDetails/ArticleDetails";

import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import Profile from "./pages/auth/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Default → Reader Home */}
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/review"
          element={<ReviewQueue />}
        />

        <Route
          path="/admin/review/:articleId"
          element={<ArticleReview />}
        />

        <Route
          path="/admin/content"
          element={<ContentManagement />}
        />

        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />

        <Route
          path="/admin/profile"
          element={<AdminProfile />}
        />

        {/* ================= AUTHOR ================= */}

        <Route
          path="/author/article"
          element={<AuthorArticle />}
        />

        <Route
          path="/author/quiz"
          element={<QuizCreator />}
        />

        {/* ================= READER ================= */}

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/browse"
          element={<Browse />}
        />

        <Route
          path="/article/:id"
          element={<ArticleDetails />}
        />

        <Route
          path="/quiz"
          element={<QuizAttempt />}
        />

        <Route
          path="/quiz/result"
          element={<QuizResult />}
        />

        {/* ================= UNKNOWN URL ================= */}

        <Route
          path="*"
          element={<Navigate to="/home" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;