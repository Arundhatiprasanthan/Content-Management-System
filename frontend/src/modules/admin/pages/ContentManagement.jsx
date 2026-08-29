function ContentManagement() {
  const articles = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence",
      author: "John Doe",
      category: "Technology",
      status: "Published",
      date: "August 27, 2026",
    },
    {
      id: 2,
      title: "Climate Change and Our Future",
      author: "Sarah Smith",
      category: "Environment",
      status: "Published",
      date: "August 25, 2026",
    },
    {
      id: 3,
      title: "The Future of Healthcare",
      author: "Michael Brown",
      category: "Health",
      status: "Changes Requested",
      date: "August 24, 2026",
    },
    {
      id: 4,
      title: "Understanding Modern History",
      author: "Emily Wilson",
      category: "History",
      status: "Rejected",
      date: "August 22, 2026",
    },
  ];

  return (
    <div className="admin-page">

      {/* Page Header */}

      <div className="admin-page-header">
        <h1>Content Management</h1>

        <p>
          Manage published and reviewed content.
        </p>
      </div>

      {/* Statistics */}

      <div className="content-stats">

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

      </div>

      {/* Content List */}

      <div className="content-management">

        <div className="content-management-header">
          <h2>All Content</h2>
        </div>

        <div className="content-list">

          {articles.map((article) => (

            <div
              className="content-card"
              key={article.id}
            >

              <div className="content-card-info">

                <div className="content-card-top">

                  <span className="article-category">
                    {article.category}
                  </span>

                  <span
                    className={`content-status ${article.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {article.status}
                  </span>

                </div>

                <h3>{article.title}</h3>

                <div className="content-meta">

                  <span>
                    Author: {article.author}
                  </span>

                  <span>
                    {article.date}
                  </span>

                </div>

              </div>

              <div className="content-card-actions">

                <button className="view-content-button">
                  View
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default ContentManagement;