import { useState } from "react";
import { useNavigate } from "react-router-dom";

import QuizCreator from "./QuizCreator";
import Navbar from "../../components/Navbar/Navbar";

import "./AuthorArticle.css";

function AuthorArticle() {
  const navigate = useNavigate();

  // =========================
  // ARTICLE STATE
  // =========================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Science");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  // =========================
  // QUIZ STATE
  // =========================
  const [quizData, setQuizData] = useState({
    enabled: true,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: null,
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // GET JWT TOKEN
  // =========================
  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return null;
    }

    return token;
  };

  // =========================
  // GET TAGS
  // =========================
  const getTags = () => {
    if (!tags.trim()) {
      return [];
    }

    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  // =========================
  // VALIDATE ARTICLE
  // =========================
  const validateArticle = () => {
    if (!title.trim()) {
      alert("Please enter the article title.");
      return false;
    }

    if (!description.trim()) {
      alert("Please enter the article description.");
      return false;
    }

    if (!content.trim()) {
      alert("Please enter the article content.");
      return false;
    }

    return true;
  };

  // =========================
  // VALIDATE QUIZ
  // =========================
  const validateQuiz = () => {
    // Quiz is disabled
    if (!quizData.enabled) {
      return true;
    }

    // No questions
    if (
      !quizData.questions ||
      quizData.questions.length === 0
    ) {
      alert("Please add at least one quiz question.");
      return false;
    }

    // Validate every question
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];

      // Question text
      if (
        !question.question ||
        !question.question.trim()
      ) {
        alert(`Please enter Question ${i + 1}.`);
        return false;
      }

      // Options
      if (
        !question.options ||
        question.options.length < 2
      ) {
        alert(
          `Question ${i + 1} must have at least 2 options.`
        );
        return false;
      }

      // Empty options
      const hasEmptyOption = question.options.some(
        (option) => !option || !option.trim()
      );

      if (hasEmptyOption) {
        alert(
          `Please fill all options for Question ${i + 1}.`
        );
        return false;
      }

      // Correct answer
      if (
        question.correctAnswer === null ||
        question.correctAnswer === undefined
      ) {
        alert(
          `Please select the correct answer for Question ${
            i + 1
          }.`
        );
        return false;
      }
    }

    return true;
  };

  // =========================
  // CREATE ARTICLE
  // =========================
  const createArticle = async (token) => {
    const response = await fetch(
      "http://localhost:5000/api/articles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          tags: getTags(),
          content: content.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to create article"
      );
    }

    return data.data;
  };

  // =========================
  // SUBMIT ARTICLE FOR REVIEW
  // =========================
  const submitArticle = async (articleId, token) => {
    const response = await fetch(
      `http://localhost:5000/api/articles/${articleId}/submit`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to submit article for review"
      );
    }

    return data.data;
  };

  // =========================
  // CREATE QUIZ
  // =========================
  const createQuiz = async (articleId, token) => {
    // Don't create quiz if disabled
    if (!quizData.enabled) {
      return null;
    }

    const response = await fetch(
      "http://localhost:5000/api/quizzes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          articleId,
          title: `${title.trim()} Quiz`,
          description:
            "Test your understanding of this article.",
          questions: quizData.questions,
          status: "Pending Review",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to create quiz"
      );
    }

    return data.data;
  };

  // =========================
  // SAVE ARTICLE DRAFT
  // =========================
  const handleSaveDraft = async () => {
    if (!validateArticle()) {
      return;
    }

    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        return;
      }

      const article = await createArticle(token);

      alert(
        `💾 Draft Saved Successfully!\n\n` +
          `Article ID: ${article._id}\n` +
          `Status: ${article.status}\n` +
          `Reading Time: ${article.readingTime} min(s)`
      );
    } catch (error) {
      console.error("Save draft error:", error);

      alert(
        `Failed to save draft.\n\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SUBMIT ARTICLE + QUIZ
  // =========================
  const handleSubmit = async () => {
    // Validate article
    if (!validateArticle()) {
      return;
    }

    // Validate quiz
    if (!validateQuiz()) {
      return;
    }

    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        return;
      }

      // ====================================
      // STEP 1: CREATE ARTICLE
      // ====================================
      console.log("Creating article...");

      const article = await createArticle(token);

      console.log("Article created:", article);

      // ====================================
      // STEP 2: SUBMIT ARTICLE
      // ====================================
      console.log("Submitting article for review...");

      const submittedArticle = await submitArticle(
        article._id,
        token
      );

      console.log(
        "Article submitted:",
        submittedArticle
      );

      // ====================================
      // STEP 3: CREATE QUIZ
      // ====================================
      let quiz = null;

      if (quizData.enabled) {
        console.log("Creating quiz...");

        quiz = await createQuiz(
          article._id,
          token
        );

        console.log("Quiz created:", quiz);
      }

      // ====================================
      // SUCCESS MESSAGE
      // ====================================
      alert(
        `🎉 Submitted Successfully for Admin Review!\n\n` +
          `Article Status: ${
            submittedArticle.status
          }\n` +
          `Quiz Status: ${
            quiz ? quiz.status : "Not Added"
          }\n\n` +
          `Article ID: ${article._id}` +
          (quiz
            ? `\nQuiz ID: ${quiz._id}`
            : "")
      );

      // Go back to author article page
      navigate("/author/article");
    } catch (error) {
      console.error(
        "Article/Quiz submission error:",
        error
      );

      alert(
        `Submission failed.\n\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="author-page">
      <Navbar />

      <main className="article-container">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="page-heading">
          <div>
            <h1>New Article</h1>

            <p>
              Write your article and add a quiz before
              submitting for review.
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

        {/* =========================
            TITLE
        ========================= */}
        <section className="article-card title-card">
          <label htmlFor="article-title">
            Title
          </label>

          <input
            id="article-title"
            type="text"
            placeholder="Enter your article title..."
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </section>

        {/* =========================
            DESCRIPTION
        ========================= */}
        <section className="article-card description-card">
          <label htmlFor="article-description">
            Description
          </label>

          <textarea
            id="article-description"
            placeholder="Write a short description of your article..."
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={4}
          />
        </section>

        {/* =========================
            CATEGORY + TAGS + CONTENT
        ========================= */}
        <section className="article-card content-card">

          <div className="form-row">

            {/* CATEGORY */}
            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option>Science</option>
                <option>Technology</option>
                <option>Environment</option>
                <option>Health</option>
                <option>History</option>
                <option>Other</option>
              </select>
            </div>

            {/* TAGS */}
            <div className="form-group">
              <label htmlFor="tags">
                Tags (comma separated)
              </label>

              <input
                id="tags"
                type="text"
                placeholder="AI, technology, machine learning"
                value={tags}
                onChange={(event) =>
                  setTags(event.target.value)
                }
              />
            </div>

          </div>

          {/* CONTENT */}
          <div className="form-group content-group">
            <label htmlFor="content">
              Content
            </label>

            <textarea
              id="content"
              placeholder='Write your article here. Use "**bold text**" for subheadings.'
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
            />
          </div>

        </section>

        {/* =========================
            QUIZ CREATOR
        ========================= */}
        <QuizCreator
          onQuizChange={setQuizData}
        />

        {/* =========================
            ACTION BUTTONS
        ========================= */}
        <div className="article-actions">

          <button
            type="button"
            className="save-button"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Draft"}
          </button>

          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "➤ Submit for Review"}
          </button>

        </div>

      </main>
    </div>
  );
}

export default AuthorArticle;