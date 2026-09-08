import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import { FiEye, FiThumbsUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import staticArticles from "../../../data/articles";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [articlesList, setArticlesList] = useState(staticArticles);

  useEffect(() => {
    const fetchLiveArticles = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/articles?status=Published");
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const formatted = data.data.map((art) => {
            let imgUrl = (art.coverImage && art.coverImage.trim())
              ? art.coverImage
              : (art.image && art.image.trim())
              ? art.image
              : "";

            if (!imgUrl || imgUrl.includes("photo-1544551763")) {
              if (art.title && art.title.toLowerCase().includes("artificial intelligence")) {
                imgUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80";
              } else {
                imgUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80";
              }
            }

            return {
              id: art._id,
              title: art.title,
              description: art.description || (art.content ? art.content.slice(0, 160) + "..." : "No description"),
              category: art.category || "Science",
              readTime: `${art.readingTime || 5} min read`,
              img: imgUrl,
              author: {
                name: art.authorId?.name || art.authorName || "Author",
              },
              stats: {
                views: art.viewsCount || 1024,
                likes: art.likesCount || 84,
              },
              date: art.publishedAt || art.createdAt || new Date().toISOString(),
            };
          });

          const combined = [...formatted, ...staticArticles];
          setArticlesList(combined);
        }
      } catch (err) {}
    };

    fetchLiveArticles();
  }, []);

  const mainarticle = articlesList[0];
  const sortedArticles = [...articlesList].sort(
    (a, b) => new Date(b.date || Date.now()) - new Date(a.date || Date.now())
  );
  const recentArticles = sortedArticles.slice(0, 6);

  return (
    <div>
      <Navbar />
      <div className="home-page">
        <div
          className="main-article"
          onClick={() => navigate(`/article/${mainarticle.id}`)}
          style={{ cursor: "pointer" }}
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
              <span>{mainarticle.author ? mainarticle.author.name : "Author"}</span>
              <span>{mainarticle.readTime}</span>
              <span className="main-article-views">
                <FiEye />
                {mainarticle.stats ? mainarticle.stats.views : 1024}
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
                style={{ cursor: "pointer" }}
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
                        {article.author && article.author.name
                          ? article.author.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                          : "A"}
                      </div>
                      <span className="recent-author-name">
                        {article.author ? article.author.name : "Author"}
                      </span>
                    </div>
                    <div className="recent-article-stats">
                      <div className="recent-stat">
                        <FiEye />
                        <span>{article.stats ? article.stats.views.toLocaleString() : 1024}</span>
                      </div>
                      <div className="recent-stat">
                        <FiThumbsUp />
                        <span>{article.stats ? article.stats.likes : 84}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="browse-by-category">
            <div className="category-heading">
              <span>BROWSE BY CATEGORY</span>
            </div>
            <div className="category-buttons">
              {[
                "Science",
                "Technology",
                "Environment",
                "Health",
                "History",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    navigate("/browse", {
                      state: { category },
                    })
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
