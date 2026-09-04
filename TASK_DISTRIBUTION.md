# TASK DISTRIBUTION

## Content Management System (CMS)

This document defines the responsibilities of each team member for the development, testing, integration, and delivery of the Content Management System.

---

## 1. Team Distribution

| Member       | Module / Responsibility                       | Frontend | Backend             |
| ------------ | --------------------------------------------- | -------- | ------------------- |
| **Nandini**  | Comment & Discussion                          | ✅        | ✅                   |
| **Harsh**    | User Profile                                  | ✅        | ✅                   |
| **Ritik**    | Search                                        | ✅        | ✅                   |
| **Nikhitha** | Author Subscription                           | ✅        | ✅                   |
| **Dablu**    | Personal Chat                                 | ✅        | ✅                   |
| **Sunil**    | Notification + Admin User & Report Management | ✅        | Integration/Support |
| **Khushi**   | Quiz Attempt & Result                         | ✅        | ✅                   |
| **Nisha**    | Admin Content Management                      | ✅        | Integration/Support |
| **Zaid**     | PR Review, Testing & Integration              | ❌        | ❌                   |

> **Note:** Backend developers should implement the APIs and database logic required for their assigned modules. Admin frontend owners will integrate the relevant admin APIs with support from the respective backend owners.

---

# 2. Detailed Responsibilities

## 2.1 Nandini — Comment & Discussion Module

### Frontend

* Display comments on articles
* Add new comments
* Reply to comments
* Display nested replies
* Edit own comments
* Delete own comments
* Display commenter information
* Comment interaction UI
* Report comment UI
* Loading states
* Empty states
* Error handling
* Responsive design
* Backend API integration

### Backend

* Create Comment model
* Create reply relationship/structure
* Comment CRUD APIs
* Reply APIs
* Comment reporting API
* User-comment relationship
* Article-comment relationship
* Ownership validation
* Authentication and authorization
* Input validation
* Error handling

### Deliverable

Complete comment, reply, and discussion functionality.

---

# 3. Harsh — User Profile Module

### Frontend

* My Profile page
* Other User Profile page
* Display profile information
* Display published articles
* Profile actions
* Navigate to profiles from comments
* Navigate to profiles from search
* Loading states
* Error handling
* Responsive UI
* API integration

### Backend

* Get own profile API
* Get other user profile API
* Update profile API
* Published articles API
* Profile data handling
* Authentication
* Authorization
* Validation
* Error handling

### Deliverable

Complete user profile system for viewing and managing profiles.

---

# 4. Ritik — Search Module

### Frontend

* Global search interface
* Search articles
* Search authors
* Search users
* Keyword search
* Category filtering
* Tag filtering
* Search result pages
* Pagination
* Empty search state
* Error handling
* Result navigation
* API integration

### Backend

* Search API
* Article search
* Author search
* User search
* Keyword filtering
* Category filtering
* Tag filtering
* Pagination
* Search query optimization
* Validation
* Error handling

### Deliverable

Unified search functionality for articles, authors, and users.

---

# 5. Nikhitha — Author Subscription Module

### Frontend

* Subscribe button
* Unsubscribe button
* Subscription status
* Subscribe/unsubscribe confirmation where required
* My Subscriptions page
* List subscribed authors
* Author subscription information
* Loading states
* Error handling
* API integration

### Backend

* Subscription model
* Subscribe API
* Unsubscribe API
* Subscription status API
* Get user subscriptions API
* Subscriber-author relationship
* Duplicate subscription prevention
* Authentication
* Authorization
* Validation
* Error handling

### Deliverable

Complete author subscription system.

---

# 6. Dablu — Personal Chat Module

### Frontend

* Chat list
* One-to-one chat interface
* Message display
* Message input
* Send message
* Receive messages
* Message timestamps
* Chat history
* Unread message indicators
* User search/selection for chat
* Loading states
* Error handling
* API integration
* Real-time UI if required

### Backend

* Conversation model
* Message model
* Create/get conversation APIs
* Send message API
* Get message history API
* Unread message handling
* User-to-user relationship
* Private conversation authorization
* Authentication
* Validation
* Error handling
* Real-time messaging support if required

### Deliverable

Complete private one-to-one messaging system.

---

# 7. Sunil — Notification + Admin User & Report Management

## A. Notification Module

### Frontend

* Notification icon
* Notification badge
* Notification list
* Notification page
* Read/unread status
* Mark notification as read
* Notification navigation
* Notification types
* Loading states
* Empty states
* Error handling
* API integration

### Backend Support / Integration

* Integrate notification APIs
* Handle notification API responses
* Handle unread/read status
* Verify notification triggers
* Handle API errors
* Coordinate with backend owners responsible for notification generation

---

## B. Admin User Management

### Frontend

* Admin user list
* Search users
* Filter users
* View user details
* Display user status
* User management actions
* Block/unblock UI where required
* User status updates
* Confirmation dialogs
* Loading and error states
* API integration

### Backend Support

* Integrate existing user-management APIs
* Verify API contracts
* Coordinate with the User Profile/User Management backend owner
* Report missing API requirements
* Validate frontend-backend integration

---

## C. Admin Report Management

### Frontend

* Reports list
* Report details
* Report filtering
* Review report UI
* Resolve report
* Reject/dismiss report
* Report status
* Confirmation dialogs
* Loading and error states
* API integration

### Backend Support

* Integrate report APIs
* Verify report API responses
* Coordinate with backend developer responsible for report handling
* Validate report status updates

### Deliverable

Complete notification interface and admin user/report management interface.

---

# 8. Khushi — Quiz Attempt & Result Module

### Frontend

* Display approved quizzes
* Quiz instructions
* Display questions
* Display answer options
* Question navigation
* Select answers
* Submit quiz
* Confirmation before submission
* Score display
* Result page
* Correct/incorrect answers where required
* Attempt history
* Loading states
* Error handling
* API integration

### Backend

* Quiz attempt model
* Create attempt API
* Submit quiz API
* Answer validation
* Score calculation
* Result API
* Attempt history API
* User-attempt relationship
* Quiz-attempt relationship
* Approved quiz validation
* Authentication
* Authorization
* Error handling

### Deliverable

Complete quiz attempt, scoring, result, and attempt-history functionality.

---

# 9. Nisha — Admin Content Management

Nisha will focus on **content-related administration**, while Sunil handles **admin users and reports**.

## A. Admin Dashboard

### Frontend

* Admin dashboard layout
* Platform statistics
* Article statistics
* Quiz statistics
* Comment/content statistics
* Content status
* Pending content indicators
* Dashboard cards/tables
* Loading and error states

### Backend Integration

* Integrate dashboard APIs
* Display API-driven statistics
* Handle API errors
* Coordinate with relevant backend module owners

---

## B. Admin Article Management

### Frontend

* Article list
* Pending article list
* Article details
* Article review page
* Approve article
* Reject article
* Request changes
* Published article management
* Article status
* Search/filter articles
* Confirmation dialogs
* Loading/error states
* API integration

### Backend Integration

* Integrate article management APIs
* Coordinate with Article backend owner
* Verify approve/reject/request-change flows
* Verify article status updates

---

## C. Admin Quiz Management

### Frontend

* Quiz list
* Quiz details
* Quiz review
* Approve quiz
* Reject quiz
* Quiz status
* Search/filter quizzes
* Confirmation dialogs
* Loading/error states
* API integration

### Backend Integration

* Integrate quiz management APIs
* Coordinate with Quiz backend owner
* Verify approval/rejection flow
* Verify quiz status updates

---

## D. Admin Comment Management

### Frontend

* Reported comments list
* Comment details
* Review reported comments
* Remove/manage comments where authorized
* Comment status
* Filtering
* Confirmation dialogs
* Loading/error states
* API integration

### Backend Integration

* Integrate comment moderation APIs
* Coordinate with Comment backend owner
* Verify moderation actions

---

## E. Admin Subscription Management

### Frontend

* Subscription overview
* Subscriber information
* Author subscription information
* Subscription statistics
* Subscription management interface
* Loading/error states
* API integration

### Backend Integration

* Integrate subscription APIs
* Coordinate with Subscription backend owner
* Verify subscription data

### Deliverable

Complete admin content-management interface covering articles, quizzes, comments, subscriptions, and dashboard content.

---

# 10. Zaid — PR Review, Testing & Integration

Zaid will **not own a development module**. His responsibility is to ensure that all modules are properly reviewed, tested, and integrated.

## A. PR Review

For every PR:

* Check whether the implementation follows the PRD
* Review frontend code
* Review backend code
* Check API integration
* Check database integration where applicable
* Check authentication/authorization
* Check validation and error handling
* Check whether required functionality is complete
* Check code quality
* Check branch and commit practices
* Check UI against Figma
* Identify missing functionality
* Request changes when necessary
* Approve PR only after requirements are satisfied

---

## B. Testing

### Functional Testing

* Test every assigned module
* Test main user flows
* Test admin flows
* Test success scenarios
* Test failure scenarios
* Test edge cases

### Frontend Testing

* UI functionality
* Navigation
* Forms
* Buttons/actions
* Responsive behaviour
* Loading states
* Empty states
* Error states

### Backend Testing

* API endpoints
* Request/response handling
* Validation
* Authentication
* Authorization
* Database operations
* Error responses

### Integration Testing

* Frontend ↔ Backend
* Backend ↔ Database
* Authentication across modules
* API communication
* Cross-module functionality

---

## C. Integration Management

* Keep `develop` integration-ready
* Verify merged features
* Identify merge conflicts
* Check module compatibility
* Verify API contracts
* Verify navigation between modules
* Verify shared authentication
* Verify shared components
* Run regression testing
* Coordinate fixes with module owners
* Perform final integration testing

> Zaid identifies and reports issues. The respective module owner is responsible for fixing them.

### Deliverable

Stable, tested, integrated `develop` branch ready for final release.

---

# 11. Backend Coordination

Admin frontend owners do not need to duplicate backend functionality that is already owned by another module developer.

Backend support should be coordinated as follows:

| Backend Area      | Primary Owner                                 |
| ----------------- | --------------------------------------------- |
| Comment APIs      | Nandini                                       |
| User/Profile APIs | Harsh                                         |
| Search APIs       | Ritik                                         |
| Subscription APIs | Nikhitha                                      |
| Chat APIs         | Dablu                                         |
| Notification APIs | Nikhitha / relevant backend owner             |
| Quiz APIs         | Khushi                                        |
| Article APIs      | Relevant article/backend owner                |
| Report APIs       | Relevant backend owner                        |
| Admin APIs        | Coordinated between respective backend owners |

Admin frontend developers **Nisha and Sunil** consume these APIs and coordinate with the corresponding backend owner whenever an API is missing or needs modification.

---

# 12. Shared Responsibilities

Every development member must:

* Understand the PRD
* Follow the Figma design
* Complete both frontend and backend responsibilities where assigned
* Follow the existing project structure
* Use reusable components
* Implement proper validation
* Handle loading states
* Handle empty states
* Handle errors
* Follow authentication and authorization requirements
* Test their own work before creating a PR
* Keep code clean and readable
* Avoid unnecessary changes outside their module
* Communicate API dependencies early
* Fix issues identified during PR review
* Fix integration issues related to their module

---

# 13. Git Branch Strategy

### Main Branches

```text
main
└── develop
    ├── feature/comment-discussion
    ├── feature/user-profile
    ├── feature/search
    ├── feature/author-subscription
    ├── feature/personal-chat
    ├── feature/notification-admin-users-reports
    ├── feature/quiz-attempt-result
    └── feature/admin-content-management
```

### Development Flow

```text
develop
   ↓
Create feature branch
   ↓
Development
   ↓
Self Testing
   ↓
Push Feature Branch
   ↓
Create PR → develop
   ↓
Zaid reviews PR
   ↓
Fix review issues
   ↓
PR Approval
   ↓
Merge into develop
   ↓
Integration Testing
   ↓
Bug Fixes
   ↓
Final Testing
   ↓
Merge/Release to main
```

---

# 14. Branch Naming

Use:

```text
feature/<module-name>
```

Examples:

```text
feature/comment-discussion
feature/user-profile
feature/search
feature/author-subscription
feature/personal-chat
feature/notification-admin
feature/quiz-attempt-result
feature/admin-content-management
```

For bug fixes:

```text
fix/<short-description>
```

Example:

```text
fix/comment-api-error
fix/quiz-result-display
fix/admin-article-status
```

---

# 15. Commit Guidelines

Use meaningful commit messages.

Examples:

```text
feat: implement comment creation
feat: add user profile page
feat: implement article search
feat: add author subscription
feat: implement private chat
feat: add notification list
feat: implement quiz result page
feat: add admin article management
fix: resolve comment API error
fix: correct quiz score calculation
```

Avoid:

```text
update
changes
final
done
test
new code
```

---

# 16. Pull Request Requirements

Every PR must include:

* Clear PR title
* Module name
* Description of changes
* Frontend changes
* Backend changes, if applicable
* API changes, if applicable
* Database changes, if applicable
* Testing performed
* Screenshots for UI changes
* Known issues, if any

### Example

```text
feat: implement author subscription module
```

PR description should mention:

```text
Module:
Author Subscription

Frontend:
- Subscribe/unsubscribe UI
- Subscription list

Backend:
- Subscription model
- Subscribe/unsubscribe APIs

Testing:
- Tested subscribe
- Tested unsubscribe
- Tested duplicate subscription
- Tested API errors
```

---

# 17. Testing Requirements

Each module must be tested for:

* Functional correctness
* UI correctness
* API correctness
* Database operations
* Authentication
* Authorization
* Input validation
* Error handling
* Loading states
* Empty states
* Responsive design
* Frontend-backend integration
* Cross-module integration
* Regression issues

---

# 18. Definition of Done

A module is considered complete only when:

* [ ] Frontend is completed
* [ ] Backend is completed where assigned
* [ ] Database integration is completed where required
* [ ] APIs are implemented
* [ ] APIs are integrated with frontend
* [ ] Authentication is working
* [ ] Authorization is working
* [ ] Validation is implemented
* [ ] Error handling is implemented
* [ ] Loading and empty states are handled
* [ ] Self-testing is completed
* [ ] PR is created
* [ ] PR is reviewed
* [ ] Review issues are fixed
* [ ] Module is merged into `develop`
* [ ] Integration testing is completed
* [ ] Regression issues are resolved
* [ ] Final functionality works with the complete CMS

---

# 19. Final Balanced Assignment

| Member       | Primary Responsibility                                                 |
| ------------ | ---------------------------------------------------------------------- |
| **Nandini**  | Comment & Discussion — Frontend + Backend                              |
| **Harsh**    | User Profile — Frontend + Backend                                      |
| **Ritik**    | Search — Frontend + Backend                                            |
| **Nikhitha** | Author Subscription — Frontend + Backend                               |
| **Dablu**    | Personal Chat — Frontend + Backend                                     |
| **Sunil**    | Notification + Admin User & Report Management — Frontend + Integration |
| **Khushi**   | Quiz Attempt & Result — Frontend + Backend                             |
| **Nisha**    | Admin Content Management — Frontend + Integration                      |
| **Zaid**     | PR Review + Testing + Integration                                      |

## Team Goal

All members must complete their assigned responsibilities, maintain communication with dependent modules, follow the Git workflow, and ensure that the final CMS is fully integrated, tested, and ready for release.
