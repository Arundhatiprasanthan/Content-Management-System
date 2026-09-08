import React from "react";
import { FiArrowLeft, FiClock, FiTag, FiBookOpen } from "react-icons/fi";
import CommentSection from "../components/Comments/CommentSection";

export default function ArticleView() {
  const article = {
    id: "1",
    title: "How CRISPR Is Rewriting the Story of Human Disease",
    subtitle:
      "A quiet revolution in molecular biology has produced a tool precise enough to correct a single letter in the three-billion-character book of human DNA.",
    category: "Science",
    readTime: "7 min read",
    author: {
      name: "Priya Mehta",
      role: "Author",
      bio: "Science communicator and molecular biologist."
    },
    date: "July 16, 2026",
    tags: ["biology", "genetics", "crispr", "medicine"]
  };

  return (
    <div className="article-page-container">
      {/* Top Navbar */}
      <header className="app-navbar">
        <div className="navbar-content">
          <div className="brand-logo">
            <FiBookOpen size={22} />
            <span>Lumen</span>
          </div>
          <div className="module-badge">
            Module 2.1 — Comment & Discussion Showcase
          </div>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="article-main-content">
        <a href="#discussion" className="back-link">
          <FiArrowLeft />
          <span>Articles</span>
        </a>

        <header className="article-header">
          <div className="meta-row">
            <span className="category-pill">{article.category}</span>
            <span className="meta-text">
              <FiClock size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />
              {article.readTime}
            </span>
            <span className="meta-text">{article.date}</span>
          </div>

          <h1 className="article-title">{article.title}</h1>
          <p className="article-subtitle">{article.subtitle}</p>

          <div className="author-strip">
            <div className="author-avatar">PM</div>
            <div className="author-meta">
              <span className="author-name">{article.author.name}</span>
              <span className="author-bio">{article.author.bio}</span>
            </div>
          </div>
        </header>

        {/* Article Excerpt */}
        <section className="article-body-text">
          <p>
            The laboratory is a place of carefully managed uncertainty. For Priya Mehta, a morning at the bench begins not with pipettes and PCR machines, but with a kind of reckoning — with what might work, what might fail, and what could change everything.
          </p>
          <p>
            CRISPR-Cas9, the gene-editing system that has dominated biology headlines since 2012, is now moving from bench to bedside with a speed that startles even its pioneers. In late 2023, the FDA approved the first CRISPR-based therapy for sickle cell disease, marking a turning point that many researchers thought was still a decade away.
          </p>
          <div className="article-tags-list">
            {article.tags.map((tag) => (
              <span key={tag} className="article-tag-item">
                <FiTag size={13} />
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Deliverable: Module 2.1 Comment & Discussion Module */}
        <div id="discussion">
          <CommentSection articleId={article.id} />
        </div>
      </main>
    </div>
  );
}
