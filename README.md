# Content Management System

A full-stack **Content Management System (CMS)** for creating, reviewing, publishing, browsing, and interacting with articles and quizzes.

The system supports three user roles:

* **Reader** — browses published articles and attempts quizzes.
* **Author** — creates and manages articles and quizzes.
* **Admin** — reviews and manages submitted content.

---

## Features

### Reader

* Register and login
* Browse published articles
* Search and filter articles
* View article details
* Attempt quizzes
* View quiz results
* Receive notifications
* Manage profile

### Author

* Create articles
* Save and manage drafts
* Edit articles
* Submit articles for review
* Create and manage quizzes
* Track article status
* Receive review notifications
* Manage profile

### Admin

* Admin dashboard
* View article review queue
* Review submitted articles
* Approve articles
* Reject articles
* Request changes
* Manage published content
* Receive notifications
* Manage profile

---

## Project Structure

```text
content-management-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
├── docs/
│   └── prd.md
│
├── README.md
└── .gitignore
```

---

## Technology Stack

### Frontend

* React
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Tools

* Git
* GitHub
* Postman
* Figma

---

## System Architecture

```text
                 CONTENT MANAGEMENT SYSTEM
                            │
                 ┌──────────┴──────────┐
                 │                     │
              Frontend              Backend
               React              Node + Express
                 │                     │
                 └──────────┬──────────┘
                            │
                         MongoDB
```

---

## User Roles

### Reader

```text
Reader
 ├── Home
 ├── Browse
 ├── Search
 ├── Article Details
 ├── Quiz Attempt
 ├── Quiz Result
 ├── Notifications
 └── Profile
```

### Author

```text
Author
 ├── Article Creation
 ├── Drafts
 ├── Article Submission
 ├── Quiz Creation
 ├── Quiz Management
 ├── Notifications
 └── Profile
```

### Admin

```text
Admin
 ├── Dashboard
 ├── Review Queue
 ├── Article Review
 ├── Content Management
 ├── Notifications
 └── Profile
```

---

## Article Workflow

```text
Author
  │
  ▼
Create Article
  │
  ▼
Save Draft
  │
  ▼
Submit for Review
  │
  ▼
Pending Review
  │
  ├──────────────┬──────────────┐
  ▼              ▼              ▼
Approve       Request         Reject
  │            Changes           │
  ▼              │               ▼
Published        ▼            Rejected
             Author Updates
                  │
                  ▼
             Resubmit Review
```

---

## Quiz Workflow

```text
Author
  │
  ▼
Create Quiz
  │
  ▼
Add Questions
  │
  ▼
Associate with Article
  │
  ▼
Published with Approved Content
  │
  ▼
Reader Attempts Quiz
  │
  ▼
Submit Answers
  │
  ▼
Calculate Score
  │
  ▼
Display Result
```

---

## Development Setup

### Clone the Repository

```bash
git clone <repository-url>
cd content-management-system
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

The commands may be updated according to the final project configuration.

---

## Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do not commit `.env` files or sensitive credentials to the repository.

---

## Git Workflow

```text
main
  │
  └── develop
        │
        ├── feature/auth
        ├── feature/articles
        ├── feature/quiz
        ├── feature/admin
        └── feature/notifications
```

### Branch Rules

* `main` contains stable code.
* `develop` contains integrated development code.
* Features must be developed in separate branches.
* Do not directly push feature work to `main`.
* Create a Pull Request when a feature is completed.
* Review and test Pull Requests before merging.

### Branch Naming

```text
feature/<feature-name>
```

Examples:

```text
feature/user-authentication
feature/article-management
feature/quiz-system
feature/admin-dashboard
feature/notifications
```

---

## Team Responsibilities

| Member                       | Responsibility                             |
| ---------------------------- | ------------------------------------------ |
| Harsh Kumar Bhardwaj         | Backend — Authentication & User Management |
| Ritik Raj                    | Backend — Articles & Content               |
| Syed Zaid Ahmed .A           | Backend — Quiz & Notifications             |
| Nikhitha Yedulla             | Frontend — Admin                           |
| Solanki Sunilkumar Kantibhai | Frontend — Reader Home & Browse            |
| Khushi Aggarwal              | Frontend — Author Articles                 |
| Nisha Gupta                  | Frontend — Authentication & Profile        |
| Dablu Kumar                  | Frontend — Author & Reader Quiz            |
| Nandini Agarwal              | Integration & Testing                      |

---

## UI & Design

The application UI should follow the approved **Figma design**.

The implementation should maintain consistency in:

* Layout
* Colors
* Typography
* Buttons
* Cards
* Navigation
* Icons
* Forms
* Status badges
* Responsive behavior

---

## Testing

### Reader Workflow

```text
Register/Login
      ↓
Browse
      ↓
Search
      ↓
View Article
      ↓
Attempt Quiz
      ↓
View Result
```

### Author Workflow

```text
Login
  ↓
Create Article
  ↓
Save Draft
  ↓
Create Quiz
  ↓
Submit Article
  ↓
Track Review Status
```

### Admin Workflow

```text
Login
  ↓
Admin Dashboard
  ↓
Review Article
  ↓
Approve / Reject / Request Changes
  ↓
Verify Content Status
```

---

## Project Goal

The goal of this **Content Management System** is to provide a complete platform where:

**Authors create content → Admins review content → Readers consume content and attempt quizzes.**

The system should provide a secure, responsive, reliable, and user-friendly experience for all three roles.

---

