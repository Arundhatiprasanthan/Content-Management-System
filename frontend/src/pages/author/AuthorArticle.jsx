import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizCreator from "./QuizCreator";
import {
  Home,
  Search,
  PenLine,
  User,
  Bell,
  ChevronDown,
} from "lucide-react";
import "./AuthorArticle.css";

function AuthorArticle() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Science");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  const handleSaveDraft = () => {
    console.log("Save Draft", {
      title,
      category,
      tags,
      content,
    });
    alert("Draft saved successfully!");
  };

  const handleSubmit = () => {
    console.log("Submit for Review", {
      title,
      category,
      tags,
      content,
    });
    alert("Article submitted for review!");
    navigate("/home");
  };

  return (
    <div className="author-page">
      {/* Top Navigation */}
      <header className="top-nav">
        <div className="brand" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <div className="brand-icon">▣</div>
          <span>Lumen</span>
        </div>

        <nav className="main-nav">
          <button type="button" onClick={() => navigate("/home")}>
            <Home size={13} strokeWidth={1.7} />
            Home
          </button>

          <button type="button" onClick={() => navigate("/browse")}>
            <Search size={13} strokeWidth={1.7} />
            Browse
          </button>

          <button type="button" className="active" onClick={() => navigate("/author/article")}>
            <PenLine size={13} strokeWidth={1.7} />
            Write
          </button>

          <button type="button" onClick={() => navigate("/home")}>
            <User size={13} strokeWidth={1.7} />
            Profile
          </button>
        </nav>

        <div className="user-section">
          <select 
            defaultValue="author"
            onChange={(e) => {
              if (e.target.value === "reader") {
                navigate("/home");
              }
            }}
          >
            <option value="author">Priya Mehta (author)</option>
            <option value="reader">Lena Kaufmann (reader)</option>
          </select>

          <span className="notification">🔔</span>

          <div className="avatar">PM</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="article-container">
        <div className="page-heading">
          <div>
            <h1>New Article</h1>
            <p>
              Write your article and add a quiz before submitting for review.
            </p>
          </div>

          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate("/home")}
          >
            ← Cancel
          </button>
        </div>

        {/* Title */}
        <section className="article-card title-card">
          <label htmlFor="article-title">Title</label>

          <input
            id="article-title"
            type="text"
            placeholder="Enter your article title..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </section>

        {/* Category + Tags + Content */}
        <section className="article-card content-card">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>

              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Science</option>
                <option>Technology</option>
                <option>Environment</option>
                <option>Health</option>
                <option>History</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)</label>

              <input
                id="tags"
                type="text"
                placeholder="biology, medicine, genetics"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
            </div>
          </div>

          <div className="form-group content-group">
            <label htmlFor="content">Content</label>

            <textarea
              id="content"
              placeholder={'Write your article here. Use "**bold text**" for subheadings.'}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
        </section>

        {/* Quiz */}
        <QuizCreator />

        {/* Bottom Actions */}
        <div className="article-actions">
          <button
            type="button"
            className="save-button"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>

          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
          >
            ➤ Submit for Review
          </button>
        </div>
      </main>
    </div>
  );
}

export default AuthorArticle;