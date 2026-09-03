import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import "./Browse.css";
import {
  FiSearch,
  FiEye,
  FiThumbsUp,
  FiBookOpen,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

function Browse() {
  const navigate = useNavigate();
  const location = useLocation();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState(
    location.state?.category || "All"
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);

      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/articles?status=Published",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load articles"
          );
        }

        setArticles(data.data || []);
      } catch (error) {
        console.error("Articles loading error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
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
      article.category?.toLowerCase() ===
        activeCategory.toLowerCase();

    const searchText = search.toLowerCase().trim();

    const authorName =
      typeof article.authorId === "object"
        ? article.authorId?.name || ""
        : "";

    const matchesSearch =
      searchText === "" ||
      article.title?.toLowerCase().includes(searchText) ||
      article.description
        ?.toLowerCase()
        .includes(searchText) ||
      article.category
        ?.toLowerCase()
        .includes(searchText) ||
      authorName.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  const getAuthorName = (article) => {
    if (
      article.authorId &&
      typeof article.authorId === "object"
    ) {
      return article.authorId.name || "Unknown Author";
    }

    return "Unknown Author";
  };

  const getAuthorInitials = (article) => {
    const name = getAuthorName(article);

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getReadingTime = (article) => {
    return `${article.readingTime || 1} min read`;
  };

  const getImage = (article) => {
    return (
      article.coverImage ||
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop&auto=format"
    );
  };

  if (loading) {
    return (
      <div className="browse-page">
        <Navbar />

        <div className="browse-no-articles">
          <div className="browse-no-articles-icon">
            <FiBookOpen />
          </div>

          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="browse-page">
        <Navbar />

        <div className="browse-no-articles">
          <div className="browse-no-articles-icon">
            <FiBookOpen />
          </div>

          <p>Failed to load articles.</p>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-page">
      <Navbar />

      <div className="browse-page-heading">
        <h1>Browse Articles</h1>

        <p>
          Explore curated long-form writing across science,
          technology, and the world.
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
              key={article._id}
              onClick={() =>
                navigate(`/article/${article._id}`)
              }
            >
              <img
                src={getImage(article)}
                alt={article.title}
              />

              <div className="browse-article-info">
                <div className="browse-article-meta">
                  <span className="browse-article-category">
                    {article.category}
                  </span>

                  <span className="browse-article-read-time">
                    {getReadingTime(article)}
                  </span>
                </div>

                <h4 className="browse-article-title">
                  {article.title}
                </h4>

                <p className="browse-article-description">
                  {article.description}
                </p>

                <div className="browse-article-footer">
                  <div className="browse-article-author">
                    <div className="browse-author-avatar">
                      {getAuthorInitials(article)}
                    </div>

                    <span className="browse-author-name">
                      {getAuthorName(article)}
                    </span>
                  </div>

                  <div className="browse-article-stats">
                    <div className="browse-stat">
                      <FiEye />
                      <span>
                        {(article.views || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="browse-stat">
                      <FiThumbsUp />
                      <span>
                        {article.likes || 0}
                      </span>
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