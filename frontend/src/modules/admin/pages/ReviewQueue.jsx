import { Link } from "react-router-dom";

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
    },
  ];

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <h1>Review Queue</h1>
        <p>Review articles submitted by authors.</p>
      </div>

      <div className="review-queue">

        <div className="review-queue-header">
          <h2>Pending Articles</h2>
        </div>

        <div className="review-articles">

          {articles.length === 0 ? (
            <div className="review-empty">
              <h3>No articles pending review</h3>
              <p>New submissions will appear here.</p>
            </div>
          ) : (
            articles.map((article) => (
              <div
                className="review-article-card"
                key={article.id}
              >

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
                    <span>Author: {article.author}</span>
                    <span>{article.readingTime}</span>
                  </div>

                  <Link
                    to={`/admin/review/${article.id}`}
                    className="review-button"
                  >
                    Review Article
                  </Link>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default ReviewQueue;