import { Link } from "react-router-dom";

function ReviewArticleCard({ article }) {
  return (
    <div className="review-article-card">
      <div className="review-article-image">
        <img
          src={article.coverImage}
          alt={article.title}
        />
      </div>

      <div className="review-article-info">
        <div className="review-article-top">
          <span className="article-category">
            {article.category}
          </span>

          <span className="article-status">
            {article.status}
          </span>
        </div>

        <h3>{article.title}</h3>

        <p>{article.description}</p>

        <div className="review-article-meta">
          <span>By {article.author}</span>
          <span>{article.readingTime} min read</span>
        </div>

        <Link
          to={`/admin/review/${article.id}`}
          className="review-button"
        >
          Review Article
        </Link>
      </div>
    </div>
  );
}

export default ReviewArticleCard;