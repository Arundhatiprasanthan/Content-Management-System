import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Dashboard
export const getAdminDashboard = () => {
  return API.get("/admin/dashboard");
};

// Review Queue
export const getReviewQueue = () => {
  return API.get("/admin/articles/review");
};

// Approve Article
export const approveArticle = (articleId) => {
  return API.patch(`/admin/articles/${articleId}/approve`);
};

// Request Changes
export const requestArticleChanges = (articleId, comment) => {
  return API.patch(
    `/admin/articles/${articleId}/request-changes`,
    { comment }
  );
};

// Reject Article
export const rejectArticle = (articleId, comment) => {
  return API.patch(
    `/admin/articles/${articleId}/reject`,
    { comment }
  );
};

export default API;