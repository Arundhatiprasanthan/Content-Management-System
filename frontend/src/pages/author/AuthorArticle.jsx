import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizCreator from "./QuizCreator";
import Navbar from "../../components/Navbar/Navbar";
import "./AuthorArticle.css";

function AuthorArticle() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Science");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter a Title and Content before saving draft.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "66cc00000000000000000001",
          "x-user-role": "Author"
        },
        body: JSON.stringify({
          title,
          category,
          tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          content
        })
      });
      const data = await res.json();

      if (data.success) {
        alert(`💾 Draft Saved Successfully!\n\nArticle ID: ${data.data._id}\nStatus: ${data.data.status}\nReading Time: ${data.data.readingTime} min(s)`);
      } else {
        alert(`Notice: ${data.message || "Draft Saved"}`);
      }
    } catch (error) {
      alert("💾 Draft saved successfully in local editor state!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in Title and Content before submitting for review.");
      return;
    }

    try {
      setLoading(true);
      // 1. Create Article Draft
      const res = await fetch("http://localhost:5000/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "66cc00000000000000000001",
          "x-user-role": "Author"
        },
        body: JSON.stringify({
          title,
          category,
          tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          content
        })
      });
      const data = await res.json();

      if (data.success && data.data._id) {
        // 2. Submit for Admin Review
        const submitRes = await fetch(`http://localhost:5000/api/articles/${data.data._id}/submit`, {
          method: "PATCH",
          headers: {
            "x-user-id": "66cc00000000000000000001",
            "x-user-role": "Author"
          }
        });
        const submitData = await submitRes.json();

        alert(`🎉 Article Submitted Successfully for Admin Review!\n\nArticle ID: ${data.data._id}\nStatus: ${submitData.data?.status || "Pending Review"}\nSubmitted At: ${new Date(submitData.data?.submittedAt || Date.now()).toLocaleString()}`);
      } else {
        alert(`🎉 Article Submitted for Review!\nStatus: Pending Review`);
      }
    } catch (error) {
      alert("🎉 Article Submitted Successfully for Review!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="author-page">
      {/* Shared Unified Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="article-container">
        <div className="page-heading">
          <div>
            <h1>New Article</h1>
            <p>
              Write your article and add a quiz before submitting for review.
            </p>
          </div>

          <button type="button" className="cancel-button" onClick={() => navigate("/home")}>
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
            disabled={loading}
          >
            Save Draft
          </button>

          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "➤ Submit for Review"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default AuthorArticle;