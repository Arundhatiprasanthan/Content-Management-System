import { useEffect, useState } from "react";

function ContentManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Published");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/articles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setArticles(data.articles || data.data || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch articles:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      filter === "All" ||
      article.status === filter
  );

  return (
    <div className="admin-page">

      <section className="page-heading">
        <div>
          <h1>Content Management</h1>

          <p>
            Manage articles and published content.
          </p>
        </div>
      </section>

      <section className="dashboard-section">

        <div className="content-filter-bar">

          {[
            "All",
            "Published",
            "Pending Review",
            "Changes Requested",
            "Rejected",
          ].map((status) => (
            <button
              key={status}
              className={
                filter === status
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}

        </div>

        {loading ? (
          <div className="dashboard-empty">
            <h3>Loading content...</h3>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="dashboard-empty">
            <h3>No content found</h3>

            <p>
              There are no articles in this category.
            </p>
          </div>
        ) : (
          <div className="content-list">

            {filteredArticles.map((article) => (
              <div
                className="content-card"
                key={article._id}
              >

                <div>
                  <h3>
                    {article.title ||
                      "Untitled Article"}
                  </h3>

                  <p>
                    {article.author?.name ||
                      article.authorName ||
                      "Unknown Author"}
                  </p>
                </div>

                <span
                  className={`content-status ${(
                    article.status || ""
                  )
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {article.status || "Unknown"}
                </span>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default ContentManagement;

