import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import {
  FiArrowLeft,
  FiEye,
  FiThumbsUp,
  FiTag,
  FiHelpCircle,
} from "react-icons/fi";
import "./ArticleDetails.css";

function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/articles/${id}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load article"
          );
        }

        setArticle(data.data);
      } catch (error) {
        console.error(
          "Article loading error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleTakeQuiz = () => {
    navigate(`/quiz/${article._id}`);
  };

  const getAuthorName = () => {
    if (
      article?.authorId &&
      typeof article.authorId === "object"
    ) {
      return article.authorId.name || "Unknown Author";
    }

    return "Unknown Author";
  };

  const getAuthorBio = () => {
    if (
      article?.authorId &&
      typeof article.authorId === "object"
    ) {
      return (
        article.authorId.bio ||
        "Content author"
      );
    }

    return "Content author";
  };

  const getAuthorInitials = () => {
    return getAuthorName()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="article-not-found">
        <h2>Loading article...</h2>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-not-found">
        <h1>Article not found</h1>

        <p>{error || "Unable to load article."}</p>

        <button
          onClick={() => navigate("/browse")}
        >
          Back to browse
        </button>
      </div>
    );
  }

  const contentLines = article.content
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div>
      <Navbar />

      <div className="article-details-page">
        <button
          className="back-button"
          onClick={() => navigate("/browse")}
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        <div className="article-header">
          <div className="details-meta">
            <span className="details-category">
              {article.category}
            </span>

            <span>
              {article.readingTime || 1} min read
            </span>

            <span>
              {new Date(
                article.createdAt
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h1>{article.title}</h1>

          <p className="article-subtitle">
            {article.description}
          </p>

          <div className="author-stats-section">
            <div className="details-author">
              <div className="details-avatar">
                {getAuthorInitials()}
              </div>

              <div className="author-details">
                <h4>{getAuthorName()}</h4>

                <p>{getAuthorBio()}</p>
              </div>
            </div>

            <div className="details-stats">
              <div>
                <FiEye />

                <span>
                  {(article.views || 0).toLocaleString()}
                </span>
              </div>

              <div>
                <FiThumbsUp />

                <span>
                  {article.likes || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {article.coverImage && (
          <div className="img-container">
            <img
              className="details-image"
              src={article.coverImage}
              alt={article.title}
            />
          </div>
        )}

        <article className="article-content">
          {contentLines.map((line, index) => {
            if (line.startsWith("### ")) {
              return (
                <h3 key={index}>
                  {line.replace("### ", "")}
                </h3>
              );
            }

            return (
              <p key={index}>
                {line}
              </p>
            );
          })}

          {article.tags?.length > 0 && (
            <div className="article-tags">
              {article.tags.map((tag) => (
                <span key={tag}>
                  <FiTag />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        <div className="quiz-container">
          <div>
            <div className="help-icon-container">
              <FiHelpCircle className="help-icon" />
            </div>

            <div className="quiz-name-container">
              <h3>Test Your Understanding</h3>

              <p>
                Take the quiz to test your knowledge
                of this article.
              </p>
            </div>

            <div className="quiz-button-container">
              <button
                className="quiz-button"
                onClick={handleTakeQuiz}
              >
                Take the Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetails;