# PRD — Content Management System

## 1. Project Overview

**Lumen** is a content management and knowledge-sharing platform where users can create articles, attach quizzes, browse published content, and interact with quizzes.

The system has three main user roles:

* **Reader** — browses articles and attempts quizzes.
* **Author** — creates and manages articles and quizzes.
* **Admin** — reviews and manages submitted content.

The complete application must follow the provided **Figma design** for UI, layout, navigation, colors, typography, cards, buttons, status badges, and responsive behavior.

---

# 2. Main Modules

The system consists of the following modules:

1. User Management
2. Article / Blog
3. Quiz
4. Admin Verification
5. Content Management
6. Search & Browse
7. Quiz Attempt & Result
8. Notification
9. Common UI, Authentication & Profile

---

# 3. User Roles

## Reader

Readers can:

* Register and login.
* Browse articles.
* Search articles.
* Filter articles by category.
* View complete articles.
* View associated quizzes.
* Attempt quizzes.
* View quiz scores/results.
* Receive notifications.
* Manage their profile.

## Author

Authors can:

* Register and login.
* Create articles.
* Edit articles.
* Delete drafts.
* Submit articles for review.
* View article status.
* Create quizzes for their articles.
* Edit quizzes.
* View approval/rejection/change requests.
* Receive notifications.
* Manage their profile.

## Admin

Admins can:

* Access the Admin Dashboard.
* View submitted articles.
* Review articles.
* Approve articles.
* Request changes.
* Reject articles.
* View article status.
* Manage approved content where required.
* Receive notifications.
* Manage their profile.

---

# 4. Application Navigation

The main application navigation follows the Figma design.

```text
Lumen

Home
Browse
Admin
Profile
Notifications
User / Role Menu
```

The Admin option should only be available to authorized administrators.

The navigation should remain consistent across the application.

---

# 5. Home Module

The Home page provides users with an introduction to the platform and highlights important content.

The page should contain:

* Featured article
* Featured image
* Article title
* Article description
* Author information
* Reading time
* Popular/recent content where applicable
* Navigation to Browse

The design should follow the Figma layout.

---

# 6. User Management Module

## Registration

Users should be able to create an account using:

* Name
* Email
* Password
* Role where applicable

The system must validate:

* Required fields
* Valid email
* Password requirements
* Duplicate email

## Login

Users should be able to login securely.

After authentication, the system should identify the user's role.

```text
Login
  ↓
Authentication
  ↓
Role
  ├── Reader
  ├── Author
  └── Admin
```

## Profile

Users should be able to view their profile information.

The profile design should follow the Figma.

---

# 7. Article / Blog Module

Authors can create and manage articles.

## Article Fields

An article should contain:

* Title
* Description
* Content
* Cover image
* Author
* Category
* Tags
* Reading time
* Status
* Created date
* Updated date

## Article Actions

Authors can:

* Create article
* Save draft
* Edit article
* Delete draft
* Submit article for review

## Article Status

```text
Draft
Pending Review
Changes Requested
Published
Rejected
```

---

# 8. Article Submission Workflow

```text
Author Creates Article
        ↓
      Draft
        ↓
 Submit for Review
        ↓
  Pending Review
        ↓
 ┌──────┼─────────────┐
 ↓      ↓             ↓
Approve Request      Reject
        Changes
 ↓      ↓             ↓
Published Changes    Rejected
         Requested
            ↓
       Author Updates
            ↓
      Resubmit Review
```

---

# 9. Quiz Module

Authors can create quizzes associated with their articles.

A quiz contains:

* Quiz title
* Article ID
* Questions
* Options
* Correct answer
* Question order
* Status

## Author Actions

Authors can:

* Create quiz
* Add questions
* Add options
* Select correct answer
* Edit quiz
* Submit quiz
* View quiz status

---

# 10. Admin Verification Module

Admins verify submitted articles and quizzes before publication.

## Admin Dashboard

The dashboard should display:

* Pending Review
* Changes Requested
* Published
* Rejected

The dashboard should also contain the **Review Queue**.

## Article Review

Admin can view:

* Article title
* Cover image
* Author
* Category
* Article metadata
* Complete content
* Review notes
* Current status

## Admin Actions

```text
Approve
Request Changes
Reject
```

### Approve

```text
Pending Review → Published
```

### Request Changes

Admin provides feedback.

```text
Pending Review → Changes Requested
```

### Reject

Admin provides a rejection reason.

```text
Pending Review → Rejected
```

The author must receive the appropriate notification after each action.

---

# 11. Content Management Module

The system should manage approved content.

Admins can manage:

* Published articles
* Article status
* Categories
* Tags
* Associated quizzes

Content should support appropriate statuses such as:

```text
Draft
Pending
Published
Rejected
Changes Requested
Archived
```

Only approved content should be publicly visible.

---

# 12. Search & Browse Module

The Browse page follows the Figma design.

Users should be able to:

* Browse published articles.
* Search articles.
* Filter by category.
* Open article details.
* View article cards.

Example categories shown in the design include:

```text
Science
Technology
Environment
Health
History
```

## Search

Search should support relevant article information such as:

* Title
* Description
* Category
* Tags
* Author

## Browse Article Card

Cards may display:

* Cover image
* Category
* Article title
* Author
* Reading time
* Publication information

---

# 13. Article Detail Module

Readers should be able to open a published article.

The article detail page should display:

* Back navigation
* Category
* Reading time
* Publication date
* Article title
* Description
* Author
* Author information
* Article image
* Complete article content
* Associated quiz where available

Only published articles should be accessible through the public article detail page.

---

# 14. Quiz Attempt & Result Module

Readers can attempt quizzes associated with published articles.

## Quiz Attempt

The reader should be able to:

* Start a quiz.
* View questions.
* Select options.
* Navigate through questions.
* Submit the quiz.

## Result

After submission, the system should calculate:

* Total questions
* Correct answers
* Incorrect answers
* Score
* Percentage
* Result status

Example:

```text
Quiz Result

Score: 8 / 10
Percentage: 80%
Correct: 8
Incorrect: 2
```

The result should be associated with the logged-in reader.

---

# 15. Notification Module

Notifications inform users about important activities.

## Author Notifications

Examples:

* Article approved
* Article rejected
* Changes requested
* Quiz approved
* Quiz rejected

## Reader Notifications

Examples:

* Important platform updates
* Relevant content updates

## Notification Features

* Notification list
* Read/unread status
* Mark as read
* Mark all as read
* Notification timestamp

---

# 16. Authentication & Authorization

All protected operations must require authentication.

Role-based authorization must be implemented.

```text
Reader
 ├── Browse
 ├── Articles
 └── Quiz Attempts

Author
 ├── Reader Features
 ├── Articles
 └── Quizzes

Admin
 ├── Admin Dashboard
 ├── Article Verification
 └── Content Management
```

The backend must also enforce role permissions.

Frontend route protection alone is not sufficient.

---

# 17. Core Data Models

The system should have, at minimum:

```text
User
Article
Quiz
Question
QuizAttempt
Notification
Category
Tag
Review
```

### User

```text
id
name
email
password
role
profileImage
createdAt
updatedAt
```

### Article

```text
id
title
description
content
coverImage
authorId
category
tags
status
createdAt
updatedAt
submittedAt
```

### Quiz

```text
id
articleId
authorId
title
questions
status
createdAt
updatedAt
```

### Review

```text
id
articleId
adminId
action
comment
createdAt
```

### Quiz Attempt

```text
id
quizId
userId
answers
score
percentage
submittedAt
```

### Notification

```text
id
userId
type
title
message
read
createdAt
```

---

# 18. API Requirements

The backend should provide APIs for:

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Articles

```text
GET    /api/articles
GET    /api/articles/:id
POST   /api/articles
PUT    /api/articles/:id
DELETE /api/articles/:id
PATCH  /api/articles/:id/submit
```

## Admin

```text
GET   /api/admin/dashboard
GET   /api/admin/articles/review
GET   /api/admin/articles/:id
PATCH /api/admin/articles/:id/approve
PATCH /api/admin/articles/:id/request-changes
PATCH /api/admin/articles/:id/reject
```

## Quizzes

```text
GET    /api/quizzes/:articleId
POST   /api/quizzes
PUT    /api/quizzes/:id
DELETE /api/quizzes/:id
```

## Quiz Attempts

```text
POST /api/quizzes/:id/attempt
GET  /api/quizzes/:id/results
```

## Notifications

```text
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

Exact API contracts should be finalized between frontend and backend teams.

---

# 19. UI Requirements

All modules must follow the supplied Figma.

The application should maintain consistent:

* Typography
* Colors
* Buttons
* Cards
* Icons
* Navigation
* Status badges
* Spacing
* Border radius
* Form styles

Every feature should include:

* Loading state
* Empty state
* Error state
* Success feedback
* Form validation where required

---

# 20. Responsive Design

The application should work correctly on:

* Desktop
* Laptop
* Tablet
* Mobile

Layouts, cards, navigation, article content and quiz screens should adapt to screen size.

---

# 21. Security Requirements

* Passwords must be securely hashed.
* Authentication tokens/session data must be handled securely.
* Protected APIs must require authentication.
* Admin APIs must require Admin authorization.
* Users must only access resources they are authorized to access.
* Destructive actions should require confirmation.
* Sensitive operations should be validated on the backend.

---

# 22. Git & Repository Structure

All three teams will work in **one common repository**.

Recommended structure:

```text
project-root/
│
├── frontend/
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── articles/
│       │   ├── quizzes/
│       │   ├── admin/
│       │   ├── browse/
│       │   ├── profile/
│       │   └── notifications/
│       │
│       ├── components/
│       ├── services/
│       ├── routes/
│       └── assets/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── services/
│
├── docs/
│   ├── prd.md
│   ├── API.md
│   └── TEAM_STRUCTURE.md
│
├── README.md
├── CONTRIBUTING.md
└── .gitignore
```

---

# 23. Git Workflow

The repository should use:

```text
main
  ↓
develop
  ↓
feature branches
```

No direct development should be done on `main`.

Feature branches should follow:

```text
feature/<module>-<feature>
```

Examples:

```text
feature/admin-dashboard
feature/article-editor
feature/quiz-creation
feature/browse-search
feature/quiz-attempt
feature/notifications
```

Completed work should be submitted through Pull Requests.

---

# 24. Module Ownership

The project should be divided between the three captain teams.

### Team 1 — Admin / Verification

* Admin Dashboard
* Review Queue
* Article Review
* Approve / Reject / Request Changes
* Content Management
* Admin Notifications
* Admin Profile

### Team 2 — Article / Browse

* Home
* Article Creation
* Article Editing
* Article Submission
* Browse
* Search
* Article Details
* Categories / Tags

### Team 3 — Quiz / User

* User Authentication
* User Profile
* Quiz Creation
* Question Management
* Quiz Attempt
* Quiz Result
* Quiz-related Notifications

Shared functionality such as authentication, API contracts, common components and routing must be coordinated between all three teams.

---

# 25. Definition of Done

A feature is considered complete only when:

* [ ] UI follows Figma.
* [ ] Frontend functionality works.
* [ ] Backend API works.
* [ ] Database integration works.
* [ ] Authentication/authorization works where required.
* [ ] Validation works.
* [ ] Loading state works.
* [ ] Empty state works.
* [ ] Error handling works.
* [ ] Responsive design is tested.
* [ ] Feature has been tested.
* [ ] Pull Request has been reviewed.
* [ ] Feature is merged into `develop`.

---

# 26. Final End-to-End Workflow

```text
                    USER
                      │
              Register / Login
                      │
          ┌───────────┼───────────┐
          │           │           │
        Reader      Author       Admin
          │           │           │
          ▼           ▼           ▼
       Browse      Create       Dashboard
       Search      Article      Review Queue
          │           │           │
       Article      Submit       Review
       Details        │           │
          │           ▼      ┌────┼────┐
        Quiz       Pending    │    │    │
          │        Review   Approve │ Reject
          ▼                    Request
       Attempt                  Changes
          │                       │
          ▼                       ▼
        Result              Notification
```

---

# 27. Project Success Criteria

The project is complete when the three user roles can successfully perform their complete workflows:

### Reader

```text
Login → Browse → Search → Read Article → Attempt Quiz → View Result
```

### Author

```text
Login → Create Article → Add Quiz → Submit → Receive Review Result
```

### Admin

```text
Login → Dashboard → Review Article → Approve/Reject/Request Changes → Manage Status
```
All three workflows must work using the common frontend, backend and database and must follow the provided Figma design.


## Team Task Distribution

The team will independently develop the complete Lumen platform. The system must support all three user roles: **Reader, Author, and Admin**.

Each member is assigned a primary area of responsibility. Members must coordinate with other team members where their modules depend on shared APIs or functionality.

### Backend

#### Harsh Kumar Bhardwaj — Authentication & User Management

* User registration and login
* Authentication and authorization
* Role management: Reader, Author, Admin
* User and profile APIs
* Authentication middleware
* Role-based access control

#### Ritik Raj — Article & Content Management

* Article CRUD APIs
* Article draft management
* Article submission workflow
* Article status management
* Categories and tags
* Search and filtering APIs
* Author article management
* Published article retrieval for Readers

#### Syed Zaid Ahmed .A — Quiz & Notifications Backend

* Quiz creation and management APIs
* Question and option management
* Quiz attempt APIs
* Quiz result and score calculation
* Quiz status management
* Notification APIs
* Notifications for article and quiz activities

### Frontend

#### Nikhitha Yedulla — Admin Module

* Admin Dashboard
* Review Queue
* Article Review
* Approve articles
* Reject articles
* Request changes
* Content management
* Admin notifications

#### Solanki Sunilkumar Kantibhai — Reader: Home & Browse

* Home page
* Featured content
* Browse page
* Article cards
* Categories
* Search UI
* Filter UI
* Published article listing
* Responsive design

#### Khushi Aggarwal — Author: Article Management

* Article creation
* Article editor
* Draft management
* Article editing
* Article submission
* Article detail page
* Author information
* Author article status
* Integration with article APIs

#### Nisha Gupta — Reader/Author: Authentication & Profile

* Login page
* Registration page
* User profile
* Profile editing
* Role-based UI handling
* Form validation
* Authentication-related UI
* Responsive design

#### Dablu Kumar — Author & Reader: Quiz Module

* Author quiz creation UI
* Add/edit/delete quiz questions
* Quiz options and correct answer selection
* Quiz management for Authors
* Quiz interface for Readers
* Quiz navigation
* Quiz submission
* Quiz result screen
* Integration with quiz APIs

### Integration & Testing

#### Nandini Agarwal — Integration & Testing

* Frontend and backend API integration
* Connect modules and shared functionality
* Test Reader workflow
* Test Author workflow
* Test Admin workflow
* Identify and fix integration issues
* Test authentication and role-based access
* Verify complete end-to-end workflows

## Role Coverage

### Reader Workflow

```text
Login
  ↓
Home / Browse
  ↓
Search / Filter
  ↓
View Article
  ↓
Attempt Quiz
  ↓
Submit Quiz
  ↓
View Result
  ↓
Profile / Notifications
```

### Author Workflow

```text
Login
  ↓
Create Article
  ↓
Save Draft
  ↓
Edit Article
  ↓
Create Quiz
  ↓
Submit Article
  ↓
Wait for Admin Review
  ↓
Approved / Changes Requested / Rejected
  ↓
Receive Notification
```

### Admin Workflow

```text
Login
  ↓
Admin Dashboard
  ↓
Review Queue
  ↓
View Submitted Article
  ↓
Approve / Reject / Request Changes
  ↓
Update Content Status
  ↓
Author Notification
```

## Responsibility Summary

| Member                       | Primary Responsibility                     |
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


