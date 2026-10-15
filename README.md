# Auspify LMS — Full-Stack Learning Management System

> **Task 6 (Advanced) — Learning Management System (LMS)**  
> **Author Organization:** Auspify Tech  
> **Target Stack:** Node.js / Express / MongoDB (Mongoose) / React (Next.js) / Tailwind CSS

---

## 1. System Overview & Architecture

Auspify LMS is an enterprise-grade Learning Management System with complete role-based access for **Administrators**, **Instructors**, and **Students**.

```
                ┌───────────────────────────────────┐
                │        Client Tier (React)        │
                │     Next.js / Tailwind CSS        │
                └─────────────────┬─────────────────┘
                                  │ HTTP / REST API (JWT)
                                  ▼
                ┌───────────────────────────────────┐
                │        API Gateway (Node.js)      │
                │         Express REST API          │
                └─────────────────┬─────────────────┘
                                  │ Mongoose ORM
                                  ▼
                ┌───────────────────────────────────┐
                │          Database Tier            │
                │       MongoDB (Local/Atlas)       │
                └───────────────────────────────────┘
```

---

## 2. Key Features & Functional Modules

| Module | Requirement | Description |
|---|---|---|
| **Authentication & RBAC** | `FR-01`, `FR-02`, `FR-03` | JWT stateless auth, password hashing with bcrypt (cost factor 12), role enforcement (`student`, `instructor`, `admin`). |
| **Course Management** | `FR-04`, `Section 7-8` | Course creation, multi-module curriculums, lessons with duration & content, difficulty levels, pricing. |
| **Course Enrollment** | `FR-05`, `Section 9` | 1-click enrollment, prevention of duplicate enrollment, auto-initialization of progress to 0%. |
| **Student Dashboard** | `FR-06`, `FR-07` | Real-time computed progress bars (`Total Lessons / Completed`), in-progress vs completed filters. |
| **Quizzes & Automated Grading**| `FR-10`, `FR-11` | Multiple-choice questions, timed quiz sessions, instant automatic scoring, passing status calculation. |
| **Assignments & Submissions** | `FR-08`, `FR-09` | Submission notes, GitHub repository links, live project URLs, and instructor feedback tracking. |
| **Instructor Review Studio** | `FR-12`, `Section 18`| Submissions review portal where instructors award marks, set statuses, and provide qualitative feedback. |
| **Admin Control Center** | `Section 19`, `Section 3.1` | Platform statistics, active user directory with live role switching, and course moderation. |
| **User Profile** | `Section 21` | Profile manager for name, phone, bio, and skills tags. |

---

## 3. Demo Accounts & Pre-Seeded Personas

You can log in with these pre-configured credentials or click the **"Seed DB"** button in the web navigation bar to seed them automatically:

| Persona | Role | Email | Password |
|---|---|---|---|
| **Platform Administrator** | `admin` | `admin@auspify.com` | `password123` |
| **Dr. Sarah Jenkins** | `instructor` | `instructor@auspify.com` | `password123` |
| **Alex Johnson** | `student` | `student@auspify.com` | `password123` |

*Tip: You can also use the one-click persona switcher buttons directly in the top right header (`Student`, `Instructor`, `Admin`).*

---

## 4. API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student, instructor, or admin account.
- `POST /api/auth/login` — Authenticate and receive a JWT token.
- `GET /api/auth/me` — Retrieve profile of currently authenticated user.

### Courses (`/api/courses`)
- `GET /api/courses` — Search and filter courses by category, difficulty, or keyword.
- `GET /api/courses/:id` — Retrieve full course outline, modules, lessons, quizzes, and assignments.
- `POST /api/courses` — Create a course (Instructors & Admins).
- `PATCH /api/courses/:id` — Update course details.
- `DELETE /api/courses/:id` — Remove course.
- `POST /api/courses/seed` — Seed demo curriculum and accounts.

### Enrollments (`/api/enrollments`)
- `GET /api/enrollments/my-courses` — Retrieve enrolled courses with real-time completion percentages.
- `POST /api/enrollments/:courseId` — Enroll student in course.
- `POST /api/enrollments/:courseId/lesson/:lessonId/toggle` — Mark lesson completed and recompute progress %.

### Submissions & Assessments (`/api/submissions`)
- `POST /api/submissions/:courseId/quiz/:quizIndex` — Submit quiz answers for automated evaluation and scoring.
- `POST /api/submissions/:courseId/assignment/:assignmentIndex` — Submit project milestone (text, GitHub URL, live demo).
- `GET /api/submissions/my-submissions` — View graded quizzes, assignment marks, and feedback.
- `GET /api/submissions/instructor` — Instructor view of submissions across their courses.
- `PATCH /api/submissions/:id/review` — Instructor grades assignment with marks and qualitative feedback.

### Administration (`/api/admin`)
- `GET /api/admin/stats` — Platform metrics (total users, students, instructors, courses, enrollments).
- `GET /api/admin/users` — Directory of all registered users.
- `PATCH /api/admin/users/:id/role` — Update user role (RBAC delegation).
- `DELETE /api/admin/users/:id` — Delete user account.
- `PATCH /api/admin/courses/:id/status` — Approve, draft, or archive course.

---

## 5. Getting Started & Running Locally

### Step 1: Start the Backend Server
```powershell
cd "e:\intern\Learning Management System\server"
npm run dev
```
*Server runs on `http://localhost:5000` with hot-reloading via `tsx`.*

### Step 2: Start the Frontend Client
```powershell
cd "e:\intern\Learning Management System\client"
npm run dev
```
*Client runs on `http://localhost:3000`.*

### Step 3: Seed & Explore
1. Open `http://localhost:3000` in your browser.
2. Click **"Seed DB"** in the top bar to populate default courses and accounts into MongoDB.
3. Switch between **Student**, **Instructor**, and **Admin** modes in the top right to verify all acceptance criteria!
