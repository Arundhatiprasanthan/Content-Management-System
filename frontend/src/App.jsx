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


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/profile" element={<Profile />} />

        <Route
          path="/"
          element={<Navigate to="/admin/dashboard" replace />}
        />

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