import AdminLayout from "../components/AdminLayout";

function ContentManagement() {
  const articles = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence",
      author: "John Doe",
      category: "Technology",
      status: "Published",
      date: "August 27, 2026",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      title: "Climate Change and Our Future",
      author: "Sarah Smith",
      category: "Environment",
      status: "Published",
      date: "August 25, 2026",
      image:
        "https://images.unsplash.com/photo-1569511166187-97eb6e387e19?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      title: "The Future of Healthcare",
      author: "Michael Brown",
      category: "Health",
      status: "Changes Requested",
      date: "August 24, 2026",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      title: "Understanding Modern History",
      author: "Emily Wilson",
      category: "History",
      status: "Rejected",
      date: "August 22, 2026",
      image:
        "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-page">

        <section className="page-heading">
          <h1>Content Management</h1>

          <p>
            Manage published and reviewed content.
          </p>
        </section>

        <section className="content-stats">

          <div className="content-stat-card">
            <span>Published</span>
            <strong>2</strong>
          </div>

          <div className="content-stat-card">
            <span>Changes Requested</span>
            <strong>1</strong>
          </div>

          <div className="content-stat-card">
            <span>Rejected</span>
            <strong>1</strong>
          </div>

          <div className="content-stat-card">
            <span>Total</span>
            <strong>4</strong>
          </div>

        </section>

        <section className="content-section">

          <div className="section-header">
            <div>
              <h2>All Content</h2>
              <p>
                View and manage submitted content.
              </p>
            </div>
          </div>

          <div className="content-list">

            {articles.map((article) => {

              const statusClass = article.status
                .toLowerCase()
                .replaceAll(" ", "-");

              return (
                <article
                  className="content-card"
                  key={article.id}
                >

                  <div className="content-card-info">

                    {/* Article Image */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="content-article-image"
                    />

                    {/* Category + Status */}
                    <div className="article-top-row">

                      <span className="article-category">
                        {article.category}
                      </span>

                      <span
                        className={`status-badge ${statusClass}`}
                      >
                        {article.status}
                      </span>

                    </div>

                    {/* Article Heading */}
                    <h3>
                      {article.title}
                    </h3>

                    {/* Author + Date */}
                    <div className="article-meta">

                      <span>
                        By {article.author}
                      </span>

                      <span>
                        {article.date}
                      </span>

                    </div>

                  </div>

                  <button
                    className="secondary-button"
                  >
                    View
                  </button>

                </article>
              );
            })}

          </div>

        </section>

      </div>
    </AdminLayout>
  );
}

export default ContentManagement;