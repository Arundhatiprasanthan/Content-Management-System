import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function ReviewQueue() {
  const articles = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence",
      description:
        "Exploring how artificial intelligence is changing the way we work and live.",
      author: "John Doe",
      category: "Technology",
      readingTime: "5 min read",
      status: "Pending Review",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      title: "Climate Change and Our Future",
      description:
        "Understanding the impact of climate change and possible solutions.",
      author: "Sarah Smith",
      category: "Environment",
      readingTime: "7 min read",
      status: "Pending Review",
      image:
        "https://images.unsplash.com/photo-1569511166187-97eb6e387e19?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-page">

        <section className="page-heading">
          <h1>Review Queue</h1>
          <p>
            Review articles submitted by authors.
          </p>
        </section>

        <section className="content-section">

          <div className="section-header">
            <div>
              <h2>Pending Articles</h2>
              <p>
                Review submitted articles before publication.
              </p>
            </div>

            <span className="section-count">
              {articles.length}
            </span>
          </div>

          <div className="review-articles">

            {articles.length === 0 ? (
              <div className="dashboard-empty">
                <div className="empty-icon">
                  ◇
                </div>

                <h3>
                  No articles pending review
                </h3>

                <p>
                  New submissions will appear here.
                </p>
              </div>
            ) : (
              articles.map((article) => (
                <article
                  className="review-article-card"
                  key={article.id}
                >

                  <div className="review-article-info">

                    <img
                      src={article.image}
                      alt={article.title}
                      className="review-article-image"
                    />

                    <div className="article-top-row">

                      <span className="article-category">
                        {article.category}
                      </span>

                      <span className="status-badge pending">
                        {article.status}
                      </span>

                    </div>

                    <h3>
                      {article.title}
                    </h3>

                    <p className="article-description">
                      {article.description}
                    </p>

                    <div className="article-meta">
                      <span>
                        By {article.author}
                      </span>

                      <span>
                        {article.readingTime}
                      </span>
                    </div>

                  </div>

                  <div className="review-card-action">

                    <Link
                      to={`/admin/review/${article.id}`}
                      className="primary-button"
                    >
                      Review Article
                    </Link>

                  </div>

                </article>
              ))
            )}

          </div>

        </section>

      </div>
    </AdminLayout>
  );
}

export default ReviewQueue;