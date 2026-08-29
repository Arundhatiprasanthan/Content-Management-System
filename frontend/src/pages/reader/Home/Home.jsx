import Navbar from "../../../components/Navbar/Navbar";
import { FiEye, FiThumbsUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import articles from "../../../data/articles";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const mainarticle = articles[0];
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const recentArticles = sortedArticles
    .filter((article) => article.id !== mainarticle.id)
    .slice(0, 3);
  return (
    <div>
      <Navbar />
      <div className="home-page">
        <div
          className="main-article"
          onClick={() => navigate(`/article/${mainarticle.id}`)}
        >
          <img
            src={mainarticle.img}
            alt={mainarticle.title}
            className="main-article-img"
          />
          <div className="main-article-overlay"></div>
          <div className="main-article-content">
            <div className="main-article-meta">
              <span className="featured-bage">FEATURED</span>
              <span className="main-article-category">
                {mainarticle.category}
              </span>
            </div>
            <h1 className="main-article-title">{mainarticle.title}</h1>
            <p className="main-article-description">
              {mainarticle.description}
            </p>
            <div className="main-article-details">
              <span>{mainarticle.author.name}</span>
              <span>{mainarticle.readTime}</span>
              <span className="main-article-views">
                <FiEye />
                {mainarticle.stats.views}
              </span>
            </div>
          </div>
        </div>
        <div className="recent-articles">
          <div className="recent-header">
            <h2>Recent Articles</h2>
            <div className="recent-header-line"></div>
            <span className="recent-count">
              {recentArticles.length}{" "}
              {recentArticles.length === 1 ? "article" : "articles"}
            </span>
          </div>
          <div className="recent-article-container">
            {recentArticles.map((article) => (
              <div
                className="recent-article-card"
                key={article.id}
                onClick={() => navigate(`/article/${article.id}`)}
              >
                <img src={article.img} alt={article.title} />
                <div className="recent-article-info">
                  <div className="recent-article-meta">
                    <span className="recent-article-category">
                      {article.category}
                    </span>
                    <span className="recent-article-read-time">
                      {article.readTime}
                    </span>
                  </div>
                  <h4 className="recent-article-title">{article.title}</h4>
                  <p className="recent-article-description">
                    {article.description}
                  </p>
                  <div className="recent-article-footer">
                    <div className="recent-article-author">
                      <div className="recent-author-avatar">
                        {article.author.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")}
                      </div>
                      <span className="recent-author-name">
                        {article.author.name}
                      </span>
                    </div>
                    <div className="recent-article-stats">
                      <div className="recent-stat">
                        <FiEye />
                        <span>{article.stats.views.toLocaleString()}</span>
                      </div>
                      <div className="recent-stat">
                        <FiThumbsUp />
                        <span>{article.stats.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
