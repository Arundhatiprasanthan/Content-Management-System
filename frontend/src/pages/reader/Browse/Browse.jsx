import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import "./Browse.css";
import { FiSearch, FiEye, FiThumbsUp, FiBookOpen } from "react-icons/fi";
import articles from "../../../data/articles";
import { useLocation, useNavigate } from "react-router-dom";

function Browse() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(
    location.state?.category || "All",
  );
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);
  const categories = [
    "All",
    "Science",
    "Technology",
    "Environment",
    "Health",
    "History",
  ];
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      activeCategory === "All" ||
      article.category.toLowerCase() === activeCategory.toLowerCase();
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      searchText === "" ||
      article.title.toLowerCase().includes(searchText) ||
      article.description.toLowerCase().includes(searchText) ||
      article.category.toLowerCase().includes(searchText) ||
      article.author.name.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });
  return (
    <div className="browse-page">
      <Navbar />
      <div className="browse-page-heading">
        <h1>Browse Articles</h1>
        <p>
          Explore curated long-form writing across science, technology, and the
          world.
        </p>
      </div>
      <div className="browse-search-filter-container">
        <div className="browse-search-container">
          <div className="browse-search-icon">
            <FiSearch />
          </div>
          <input
            type="text"
            className="browse-search-input"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="browse-filter-container">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`browse-filter-btn ${
                activeCategory === category
                  ? "browse-filter-btn-active"
                  : "browse-filter-btn-inactive"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="browse-article-container">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div
              className="browse-article-card"
              key={article.id}
              onClick={() => navigate(`/article/${article.id}`)}
            >
              <img src={article.img} alt={article.title} />
              <div className="browse-article-info">
                <div className="browse-article-meta">
                  <span className="browse-article-category">
                    {article.category}
                  </span>
                  <span className="browse-article-read-time">
                    {article.readTime}
                  </span>
                </div>
                <h4 className="browse-article-title">{article.title}</h4>
                <p className="browse-article-description">
                  {article.description}
                </p>
                <div className="browse-article-footer">
                  <div className="browse-article-author">
                    <div className="browse-author-avatar">
                      {article.author.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </div>
                    <span className="browse-author-name">
                      {article.author.name}
                    </span>
                  </div>
                  <div className="browse-article-stats">
                    <div className="browse-stat">
                      <FiEye />
                      <span>{article.stats.views.toLocaleString()}</span>
                    </div>
                    <div className="browse-stat">
                      <FiThumbsUp />
                      <span>{article.stats.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="browse-no-articles">
            <div className="browse-no-articles-icon">
              <FiBookOpen />
            </div>
            <p>No articles match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;
