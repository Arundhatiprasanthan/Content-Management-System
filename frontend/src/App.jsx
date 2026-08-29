import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import ReviewQueue from "./modules/admin/pages/ReviewQueue";
import ArticleReview from "./modules/admin/pages/ArticleReview";
import ContentManagement from "./modules/admin/pages/ContentManagement";
import AdminNotifications from "./modules/admin/pages/AdminNotifications";
import AdminProfile from "./modules/admin/pages/AdminProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

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
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;