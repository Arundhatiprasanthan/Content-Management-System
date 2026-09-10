import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import {
  FiSearch,
  FiX,
  FiEye,
  FiThumbsUp,
  FiUser,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiFilter
} from "react-icons/fi";
import staticArticles from "../../../data/articles";
import "./Search.css";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get("q") || "";
  const typeParam = searchParams.get("type") || "all";
  const categoryParam = searchParams.get("category") || "All";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeType, setActiveType] = useState(typeParam);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [currentPage, setCurrentPage] = useState(pageParam);

  const [articles, setArticles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    "All",
    "Science",
    "Technology",
    "Environment",
    "Health",
    "History",
  ];

  // Sync state with URL params
  useEffect(() => {
    setSearchQuery(queryParam);
    setActiveType(typeParam);
    setActiveCategory(categoryParam);
    setCurrentPage(pageParam);
  }, [queryParam, typeParam, categoryParam, pageParam]);

  // Fetch Search Results from Backend API
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const url = `http://localhost:5000/api/search?q=${encodeURIComponent(
          queryParam
        )}&type=${activeType}&category=${encodeURIComponent(
          activeCategory === "All" ? "" : activeCategory
        )}&page=${currentPage}&limit=9`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.success && data.data) {
          const liveArticles = (data.data.articles || []).map((art, idx) => ({
            id: art._id,
            title: art.title,
            description:
              art.description ||
              (art.content ? art.content.slice(0, 160) + "..." : "No description"),
            category: art.category || "Science",
            readTime: `${art.readingTime || 5} min read`,
            img:
              art.coverImage ||
              art.image ||
              (idx % 2 === 0
                ? "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80"
                : "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"),
            author: {
              name: art.authorId?.name || art.authorName || "Author",
              bio: art.authorId?.bio || "Writer & Contributor"
            },
            stats: {
              views: art.viewsCount || 1024,
              likes: art.likesCount || 84,
            },
          }));

          // Fallback filtering with static data if backend articles count is small
          let combinedArticles = liveArticles;
          if (liveArticles.length === 0) {
            combinedArticles = staticArticles.filter((art) => {
              const matchesCat =
                activeCategory === "All" ||
                art.category.toLowerCase() === activeCategory.toLowerCase();
              const matchesQuery =
                !queryParam.trim() ||
                art.title.toLowerCase().includes(queryParam.toLowerCase()) ||
                art.description.toLowerCase().includes(queryParam.toLowerCase()) ||
                art.category.toLowerCase().includes(queryParam.toLowerCase()) ||
                (art.author &&
                  art.author.name &&
                  art.author.name.toLowerCase().includes(queryParam.toLowerCase()));
              return matchesCat && matchesQuery;
            });
          }

          setArticles(combinedArticles);
          setAuthors(data.data.authors || []);
          setUsers(data.data.users || []);
          setTotalResults(
            data.total || combinedArticles.length + (data.data.authors?.length || 0)
          );
          setTotalPages(data.totalPages || 1);
        } else {
          fallbackLocalSearch();
        }
      } catch (err) {
        fallbackLocalSearch();
      } finally {
        setLoading(false);
      }
    };

    const fallbackLocalSearch = () => {
      const filtered = staticArticles.filter((art) => {
        const matchesCat =
          activeCategory === "All" ||
          art.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesQuery =
          !queryParam.trim() ||
          art.title.toLowerCase().includes(queryParam.toLowerCase()) ||
          art.description.toLowerCase().includes(queryParam.toLowerCase()) ||
          art.category.toLowerCase().includes(queryParam.toLowerCase()) ||
          (art.author &&
            art.author.name &&
            art.author.name.toLowerCase().includes(queryParam.toLowerCase()));
        return matchesCat && matchesQuery;
      });

      setArticles(filtered);
      setAuthors([
        { _id: "u1", name: "Priya Mehta", role: "Author", bio: "Molecular Biologist & Science Communicator" },
        { _id: "u2", name: "Thomas Okeke", role: "Author", bio: "Tech Analyst & Quantum Computing Researcher" },
        { _id: "u3", name: "Rahul Kr", role: "Reader", bio: "Avid Reader & Lifelong Learner" },
      ].filter(u => !queryParam.trim() || u.name.toLowerCase().includes(queryParam.toLowerCase()) || u.role.toLowerCase().includes(queryParam.toLowerCase())));
      setTotalResults(filtered.length);
      setTotalPages(1);
    };

    fetchSearchResults();
  }, [queryParam, activeType, activeCategory, currentPage]);

  // Execute Search Submit
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    updateUrlParams({ q: searchQuery, page: 1 });
  };

  const updateUrlParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        updated.set(key, value);
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    updateUrlParams({ q: "", page: 1 });
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    updateUrlParams({ type, page: 1 });
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    updateUrlParams({ category, page: 1 });
  };

  return (
    <div className="search-page-container">
      <Navbar />

      <main className="search-content-wrapper">
        {/* Header */}
        <div className="search-header-box">
          <h1>Global Search</h1>
          <p>Search articles, authors, and topics across the Lumen knowledge base.</p>
        </div>

        {/* Search Input Box */}
        <div className="search-input-card">
          <form onSubmit={handleSearchSubmit}>
            <div className="search-bar-row">
              <FiSearch className="search-icon-svg" />
              <input
                type="text"
                className="search-main-input"
                placeholder="Search articles by title, content, author name, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                  title="Clear search query"
                >
                  <FiX />
                </button>
              )}
              <button type="submit" className="btn-search-trigger">
                Search
              </button>
            </div>
          </form>

          {/* Filter Controls */}
          <div className="search-filter-section">
            <div className="filter-row">
              <span className="filter-label">Search Type:</span>
              <div className="pill-group">
                <button
                  type="button"
                  className={`type-pill-btn ${
                    activeType === "all" ? "active" : ""
                  }`}
                  onClick={() => handleTypeChange("all")}
                >
                  All Results
                </button>
                <button
                  type="button"
                  className={`type-pill-btn ${
                    activeType === "articles" ? "active" : ""
                  }`}
                  onClick={() => handleTypeChange("articles")}
                >
                  Articles
                </button>
                <button
                  type="button"
                  className={`type-pill-btn ${
                    activeType === "authors" ? "active" : ""
                  }`}
                  onClick={() => handleTypeChange("authors")}
                >
                  Authors & Users
                </button>
              </div>
            </div>

            <div className="filter-row">
              <span className="filter-label">Category:</span>
              <div className="pill-group">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    className={`cat-chip-btn ${
                      activeCategory === cat ? "active" : ""
                    }`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Meta Bar */}
        <div className="results-meta-bar">
          <span className="results-count-text">
            {queryParam ? (
              <>
                Found <strong>{totalResults}</strong> {totalResults === 1 ? "result" : "results"} for "
                <strong>{queryParam}</strong>"
              </>
            ) : (
              <>Showing all available content ({totalResults} total)</>
            )}
          </span>
        </div>

        {/* Content Section */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#78716c" }}>
            Searching database...
          </div>
        ) : totalResults === 0 ? (
          /* Empty Search State */
          <div className="empty-search-card">
            <FiBookOpen className="empty-search-icon" />
            <h3>No results found</h3>
            <p>
              We couldn't find any articles or authors matching "<strong>{queryParam}</strong>".
            </p>
            <ul className="empty-tips-list">
              <li>Check your spelling or try different keywords</li>
              <li>Try switching the category filter to "All"</li>
              <li>Search for broader terms like "Science", "Technology", or "AI"</li>
            </ul>
          </div>
        ) : (
          <>
            {/* Authors & Users Section */}
            {(activeType === "all" || activeType === "authors") &&
              authors.length > 0 && (
                <div className="search-users-section">
                  <h3 className="section-subheading">
                    Authors & Contributors ({authors.length})
                  </h3>
                  <div className="users-cards-grid">
                    {authors.map((usr) => (
                      <div key={usr._id} className="user-result-card">
                        <div className="user-card-avatar">
                          {usr.name
                            ? usr.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "U"}
                        </div>
                        <div className="user-card-info">
                          <h4 className="user-name-title">{usr.name}</h4>
                          <span className="user-role-badge">{usr.role || "Author"}</span>
                          <p className="user-bio-snippet">
                            {usr.bio || "Writer & Content Creator"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Articles Grid */}
            {(activeType === "all" || activeType === "articles") &&
              articles.length > 0 && (
                <div>
                  {activeType === "all" && authors.length > 0 && (
                    <h3 className="section-subheading" style={{ marginTop: "1rem" }}>
                      Articles ({articles.length})
                    </h3>
                  )}

                  <div className="search-results-grid">
                    {articles.map((art) => (
                      <div
                        key={art.id}
                        className="search-article-card"
                        onClick={() => navigate(`/article/${art.id}`)}
                      >
                        <div className="card-img-box">
                          <img src={art.img} alt={art.title} />
                        </div>
                        <div className="card-body-box">
                          <div className="card-meta-row">
                            <span className="badge-category">{art.category}</span>
                            <span className="text-readtime">{art.readTime}</span>
                          </div>
                          <h4 className="card-title-text">{art.title}</h4>
                          <p className="card-desc-text">{art.description}</p>

                          <div className="card-footer-row">
                            <div className="author-chip">
                              <div className="author-avatar-circle">
                                {art.author.name
                                  ? art.author.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                  : "A"}
                              </div>
                              <span className="author-name-span">
                                {art.author.name}
                              </span>
                            </div>

                            <div className="card-stats-box">
                              <div className="card-stat-item">
                                <FiEye />
                                <span>{art.stats.views}</span>
                              </div>
                              <div className="card-stat-item">
                                <FiThumbsUp />
                                <span>{art.stats.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage <= 1}
                  onClick={() => updateUrlParams({ page: currentPage - 1 })}
                >
                  <FiChevronLeft style={{ verticalAlign: "middle" }} /> Previous
                </button>
                <span className="page-num-indicator">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => updateUrlParams({ page: currentPage + 1 })}
                >
                  Next <FiChevronRight style={{ verticalAlign: "middle" }} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Search;
