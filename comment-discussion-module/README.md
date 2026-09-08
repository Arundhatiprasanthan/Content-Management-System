# 💬 Module 2.1 — Comment & Discussion Module
**Author:** Nandini Agarwal  
**Platform:** Lumen Content Management System  
**Deliverable:** Complete comment, reply, and discussion functionality (Frontend & Backend).

---

## 📖 Overview

This standalone project contains the complete code for the **Comment & Discussion Module** (Module 2.1) of the Lumen CMS. It allows readers, authors, and admins to engage in rich, multi-level threaded discussions underneath published articles.

### ✨ Features Included

#### Frontend
- **Display Comments**: Threaded discussion view below articles with comment counter badge.
- **Add Comments**: Top-level comment box with avatar, character counter (`0/1500`), auto-expanding input, and `Cmd/Ctrl + Enter` shortcut.
- **Reply to Comments**: Inline reply box with *"Replying to @Author"* tag.
- **Display Nested Replies**: Indented discussion tree with vertical connector lines and collapsible toggle (*"Hide/Show X replies"*).
- **Edit Own Comments**: Inline editing mode with Save and Cancel, guarded by ownership permissions, showing `(edited)` tag.
- **Delete Own Comments**: Ownership-guarded deletion. Uses soft-deletion (*"[This comment has been deleted]"*) when child replies exist to preserve thread structure.
- **Display Commenter Information**: User avatar with initials, full name, role badges (`Reader`, `Author`, `Admin`), and relative timestamps (*"2h ago"*, *"Just now"*).
- **Comment Interactions**: Like/upvote counter with toggle reaction.
- **Report Comment Modal**: Dialog with categorized community guideline reasons (Spam, Harassment, Inappropriate, Misinformation, Other) and optional context.
- **Active Account Switcher**: Interactive toolbar to switch between **Reader** (*Lena Kaufmann*), **Author** (*Syed Zaid*), and **Admin** (*Nikhitha Admin*) to easily test ownership permissions and role badges live.
- **UX States**: Shimmering skeleton loaders, friendly empty state card, and retryable error banners.
- **Responsive Design**: Custom CSS optimized for desktop, tablet, and mobile.

#### Backend
- **Comment Model**: Mongoose schema with `articleId`, `userId`, `parentCommentId`, `likes`, `isEdited`, `isDeleted`, `reports` subdocuments, and compound indexes.
- **Thread Hierarchy Engine**: Assembles recursive nested reply trees with sorting (`newest`, `oldest`, `most_liked`).
- **REST CRUD APIs**: Top-level comment creation, single comment retrieval, ownership-validated update, and deletion.
- **Reply APIs**: Dedicated reply creation and child reply retrieval.
- **Moderation & Reporting**: Comment reporting API with duplicate prevention, report counters, auto-flagging at threshold, and admin queue.
- **Reactions**: Like toggle API.
- **Authentication & Authorization**: Protected endpoints using JWT / developer fallback headers with role-based moderation privileges.
- **Automated Test Suite**: 12 unit and integration tests verifying all model constraints, permissions, soft deletes, and interactions.

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install
npm start
```
- API will run on `http://localhost:5000`
- Run automated tests:
```bash
npm test
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` (or the URL printed by Vite) in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/articles/:articleId/comments` | Get threaded comments tree for article | Optional |
| `POST` | `/api/articles/:articleId/comments` | Post a new top-level comment | Yes |
| `GET` | `/api/comments/:id` | Get single comment by ID | Optional |
| `PUT` | `/api/comments/:id` | Edit own comment (Ownership validated) | Yes |
| `DELETE` | `/api/comments/:id` | Delete own comment / Admin moderate | Yes |
| `POST` | `/api/comments/:commentId/replies` | Reply to an existing comment | Yes |
| `GET` | `/api/comments/:commentId/replies` | Get child replies for a comment | Optional |
| `POST` | `/api/comments/:commentId/like` | Toggle like/upvote | Yes |
| `POST` | `/api/comments/:commentId/report` | Report comment for moderation | Yes |
| `GET` | `/api/comments/reported` | Get flagged/reported queue (Admin) | Admin |

---

## 🧪 Test Verification

Run the test suite:
```bash
cd backend
node tests/verify-comments.js
```
Output:
```
====================================================
🧪 Starting Comment & Discussion Backend Verification
====================================================

📦 1. Comment Schema & Validation Tests
  ✅ Schema contains required fields and indexes
  ✅ Validates required fields when creating an instance
  ✅ Validates report reasons against allowed enum values
  ✅ Allows valid report reasons

🌳 2. Comment Tree & Reply Hierarchy Construction
  ✅ Builds nested discussion tree with replies correctly

🔒 3. Ownership & Authorization Validation Tests
  ✅ Enforces comment edit ownership: Author can edit
  ✅ Enforces comment edit ownership: Stranger receives 403 Forbidden
  ✅ Enforces comment delete authorization: Admin can moderate any comment

🗑️  4. Thread Hierarchy & Soft Delete Preservation
  ✅ Soft deletes comments with replies, preserving child discussions

👍 5. Like / Upvote Interaction Tests
  ✅ Toggles like on and off cleanly for a user

🚩 6. Reporting & Moderation Flags
  ✅ Allows user to report comment once and prevents duplicate reports
  ✅ Automatically flags comment when report threshold (>= 3) is reached

====================================================
📊 Test Results: 12 passed, 0 failed
====================================================
```
