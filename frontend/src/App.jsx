import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Authentication
import Login from "./pages/auth/Login";

// Profile
import Profile from "./pages/profile/Profile";

// Admin
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import ReviewQueue from "./modules/admin/pages/ReviewQueue";
import ArticleReview from "./modules/admin/pages/ArticleReview";
import QuizReview from "./modules/admin/pages/QuizReview";
import ContentManagement from "./modules/admin/pages/ContentManagement";
import AdminNotifications from "./modules/admin/pages/AdminNotifications";
import AdminProfile from "./modules/admin/pages/AdminProfile";

// Author
import AuthorArticle from "./pages/author/AuthorArticle";
import QuizCreator from "./pages/author/QuizCreator";

// Reader
import QuizAttempt from "./pages/reader/QuizAttempt";
import QuizResult from "./pages/reader/QuizResult";
import Home from "./pages/reader/Home/Home";
import Browse from "./pages/reader/Browse/Browse";
import ArticleDetails from "./pages/reader/ArticleDetails/ArticleDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            AUTHENTICATION
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Login />}
        />

        {/* =========================
            READER ROUTES
        ========================== */}

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

        {/* =========================
            PROFILE
            All logged-in users
        ========================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =========================
            AUTHOR ROUTES
            Author ONLY
        ========================== */}

        <Route
          path="/author/article"
          element={
            <ProtectedRoute allowedRoles={["Author"]}>
              <AuthorArticle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/author/quiz"
          element={
            <ProtectedRoute allowedRoles={["Author"]}>
              <QuizCreator />
            </ProtectedRoute>
          }
        />

        {/* =========================
            ADMIN ROUTES
            Admin ONLY
        ========================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/review"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ReviewQueue />
            </ProtectedRoute>
          }
        />

        {/* ARTICLE REVIEW */}
        <Route
          path="/admin/review/article/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ArticleReview />
            </ProtectedRoute>
          }
        />

        {/* QUIZ REVIEW */}
        <Route
          path="/admin/review/quiz/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <QuizReview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/content"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ContentManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* =========================
            DEFAULT ROUTE
        ========================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* =========================
            UNKNOWN URL
        ========================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;