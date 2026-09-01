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
import articles from "../../../data/articles";

function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articles.find((article) => article.id === Number(id));
  if (!article) {
    return (
      <div className="article-not-found">
        <h1>Article not found</h1>
        <button onClick={() => navigate("/browse")}>Back to browse</button>
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
        <button className="back-button" onClick={() => navigate("/browse")}>
          <FiArrowLeft />
          <span>Back</span>
        </button>
        <div className="article-header">
          <div className="details-meta">
            <span className="details-category">{article.category}</span>
            <span>{article.readTime}</span>
            <span>{article.date}</span>
          </div>
          <h1>{article.title}</h1>
          <p className="article-subtitle">{article.description}</p>
          <div className="author-stats-section">
            <div className="details-author">
              <div className="details-avatar">
                {article.author.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </div>
              <div className="author-details">
                <h4>{article.author.name}</h4>
                <p>{article.author.bio}</p>
              </div>
            </div>
            <div className="details-stats">
              <div>
                <FiEye />
                <span>{article.stats.views.toLocaleString()}</span>
              </div>
              <div>
                <FiThumbsUp />
                <span>{article.stats.likes}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="img-container">
          <img
            className="details-image"
            src={article.img}
            alt={article.title}
          />
        </div>
        <article className="article-content">
          {contentLines.map((line, index) => {
            if (line.startsWith("### ")) {
              return <h3 key={index}>{line.replace("### ", "")}</h3>;
            }
            return <p key={index}>{line}</p>;
          })}
          <div className="article-tags">
            {article.tags.map((tag) => (
              <span key={tag}>
                <FiTag />
                {tag}
              </span>
            ))}
          </div>
        </article>
        <div className="quiz-container">
          <div>
            <div className="help-icon-container">
              <FiHelpCircle className="help-icon" />
            </div>
            <div className="quiz-name-container">
              <h3>Test Your Understanding</h3>
              <p>{article.quizname}</p>
            </div>
            <div className="quiz-button-container">
              <button 
                className="quiz-button" 
                onClick={() => navigate('/quiz')}
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
