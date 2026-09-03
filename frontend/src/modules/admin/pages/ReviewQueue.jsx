import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import "./ReviewQueue.css";

function ReviewQueue() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("articles");

  const [articles, setArticles] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PENDING ARTICLES AND QUIZZES
  // ==========================================

  useEffect(() => {
    fetchReviewQueue();
  }, []);

  const fetchReviewQueue = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch articles and quizzes together
      const [articleResponse, quizResponse] =
        await Promise.all([
          fetch(
            "http://localhost:5000/api/admin/articles/review",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),

          fetch(
            "http://localhost:5000/api/admin/quizzes/review",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

      // ==========================================
      // AUTHORIZATION CHECK
      // ==========================================

      if (
        articleResponse.status === 401 ||
        quizResponse.status === 401
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (
        articleResponse.status === 403 ||
        quizResponse.status === 403
      ) {
        alert(
          "You do not have permission to access the review queue."
        );

        navigate("/home");
        return;
      }

      const articleData =
        await articleResponse.json();

      const quizData =
        await quizResponse.json();

      console.log(
        "Pending articles:",
        articleData
      );

      console.log(
        "Pending quizzes:",
        quizData
      );

      // ==========================================
      // CHECK ARTICLE RESPONSE
      // ==========================================

      if (!articleResponse.ok) {
        throw new Error(
          articleData.message ||
            "Failed to fetch pending articles"
        );
      }

      // ==========================================
      // CHECK QUIZ RESPONSE
      // ==========================================

      if (!quizResponse.ok) {
        throw new Error(
          quizData.message ||
            "Failed to fetch pending quizzes"
        );
      }

      // ==========================================
      // SET DATA
      // ==========================================

      if (articleData.success) {
        setArticles(
          articleData.articles ||
            articleData.data ||
            []
        );
      } else {
        setArticles([]);
      }

      if (quizData.success) {
        setQuizzes(
          quizData.quizzes ||
            quizData.data ||
            []
        );
      } else {
        setQuizzes([]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch review queue:",
        error
      );

      setArticles([]);
      setQuizzes([]);

      setError(
        error.message ||
          "Unable to load the review queue."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REVIEW ARTICLE
  // ==========================================

  const handleArticleReview = (article) => {
    console.log(
      "========== ARTICLE REVIEW CLICKED =========="
    );

    console.log("Article:", article);
    console.log("Article ID:", article?._id);

    if (!article?._id) {
      alert("Article ID is missing.");
      return;
    }

    navigate(
      `/admin/review/article/${article._id}`
    );
  };

  // ==========================================
  // REVIEW QUIZ
  // ==========================================

  const handleQuizReview = (quiz) => {
    console.log(
      "========== QUIZ REVIEW CLICKED =========="
    );

    console.log("Quiz:", quiz);
    console.log("Quiz ID:", quiz?._id);

    if (!quiz?._id) {
      alert("Quiz ID is missing.");
      return;
    }

    navigate(
      `/admin/review/quiz/${quiz._id}`
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page">

          <section className="page-heading">
            <div>
              <h1>Review Queue</h1>

              <p>
                Review articles and quizzes
                submitted by authors.
              </p>
            </div>

            <span className="section-count">
              —
            </span>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-empty">
              <h3>
                Loading submissions...
              </h3>

              <p>
                Please wait while we load
                pending articles and quizzes.
              </p>
            </div>
          </section>

        </div>
      </AdminLayout>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-page">

          <section className="page-heading">
            <div>
              <h1>Review Queue</h1>

              <p>
                Review articles and quizzes
                submitted by authors.
              </p>
            </div>

            <span className="section-count">
              0
            </span>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-empty">

              <div className="empty-icon">
                !
              </div>

              <h3>
                Unable to load review queue
              </h3>

              <p>{error}</p>

              <button
                type="button"
                onClick={fetchReviewQueue}
              >
                Try Again
              </button>

            </div>
          </section>

        </div>
      </AdminLayout>
    );
  }

  // ==========================================
  // ACTIVE DATA
  // ==========================================

  const activeItems =
    activeTab === "articles"
      ? articles
      : quizzes;

  const totalPending =
    articles.length + quizzes.length;

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <AdminLayout>
      <div className="admin-page">

        {/* PAGE HEADING */}

        <section className="page-heading">

          <div>
            <h1>Review Queue</h1>

            <p>
              Review articles and quizzes
              submitted by authors.
            </p>
          </div>

          <span className="section-count">
            {totalPending}
          </span>

        </section>

        {/* TABS */}

        <div className="review-tabs">

          <button
            type="button"
            className={`review-tab ${
              activeTab === "articles"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("articles")
            }
          >
            Articles
            <span className="tab-count">
              {articles.length}
            </span>
          </button>

          <button
            type="button"
            className={`review-tab ${
              activeTab === "quizzes"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("quizzes")
            }
          >
            Quizzes
            <span className="tab-count">
              {quizzes.length}
            </span>
          </button>

        </div>

        {/* REVIEW CONTENT */}

        <section className="dashboard-section">

          {activeItems.length === 0 ? (

            <div className="dashboard-empty">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                {activeTab === "articles"
                  ? "No articles pending review"
                  : "No quizzes pending review"}
              </h3>

              <p>
                {activeTab === "articles"
                  ? "Submitted articles will appear here."
                  : "Submitted quizzes will appear here."}
              </p>

            </div>

          ) : (

            <div className="review-list">

              {/* ==================================
                  ARTICLES
              ================================== */}

              {activeTab === "articles" &&
                articles.map((article) => (

                  <div
                    className="review-card"
                    key={article._id}
                  >

                    <div className="review-card-content">

                      <span className="review-category">
                        {article.category ||
                          "Article"}
                      </span>

                      <h2 className="review-card-title">
                        {article.title ||
                          "Untitled Article"}
                      </h2>

                      <p className="review-card-description">
                        {article.description ||
                          "No description available."}
                      </p>

                      <div className="review-meta">

                        <span>
                          Author:{" "}
                          {article.author?.name ||
                            article.authorId?.name ||
                            article.authorName ||
                            "Unknown"}
                        </span>

                        <span>
                          {article.submittedAt
                            ? `Submitted: ${new Date(
                                article.submittedAt
                              ).toLocaleDateString()}`
                            : article.createdAt
                            ? `Created: ${new Date(
                                article.createdAt
                              ).toLocaleDateString()}`
                            : ""}
                        </span>

                      </div>

                    </div>

                    <button
                      type="button"
                      className="review-button"
                      onClick={() =>
                        handleArticleReview(
                          article
                        )
                      }
                    >
                      Review
                    </button>

                  </div>

                ))}

              {/* ==================================
                  QUIZZES
              ================================== */}

              {activeTab === "quizzes" &&
                quizzes.map((quiz) => (

                  <div
                    className="review-card"
                    key={quiz._id}
                  >

                    <div className="review-card-content">

                      <span className="review-category">
                        Quiz
                      </span>

                      <h2 className="review-card-title">
                        {quiz.title ||
                          "Untitled Quiz"}
                      </h2>

                      <p className="review-card-description">
                        {quiz.description ||
                          "No description available."}
                      </p>

                      <div className="review-meta">

                        <span>
                          Author:{" "}
                          {quiz.author?.name ||
                            quiz.authorId?.name ||
                            "Unknown"}
                        </span>

                        <span>
                          Article:{" "}
                          {quiz.article?.title ||
                            quiz.articleId?.title ||
                            "Unknown"}
                        </span>

                        <span>
                          Questions:{" "}
                          {quiz.questions?.length ||
                            0}
                        </span>

                      </div>

                    </div>

                    <button
                      type="button"
                      className="review-button"
                      onClick={() =>
                        handleQuizReview(quiz)
                      }
                    >
                      Review
                    </button>

                  </div>

                ))}

            </div>

          )}

        </section>

      </div>
    </AdminLayout>
  );
}

export default ReviewQueue;