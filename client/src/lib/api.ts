const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  bio?: string;
  phone?: string;
  skills?: string[];
  avatarUrl?: string;
}

export interface Lesson {
  _id?: string;
  title: string;
  duration: string;
  content: string;
  videoUrl?: string;
  resources?: string[];
}

export interface CourseModule {
  _id?: string;
  title: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
}

export interface Quiz {
  _id?: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Assignment {
  _id?: string;
  title: string;
  instructions: string;
  deadline?: string;
  totalMarks: number;
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  instructorName?: string;
  price: number;
  duration: string;
  status: "Draft" | "Published" | "Archived";
  learningObjectives?: string[];
  requirements?: string[];
  modules: CourseModule[];
  quizzes: Quiz[];
  assignments: Assignment[];
  enrolledStudentsCount: number;
  rating?: number;
  createdAt?: string;
}

export interface Enrollment {
  _id: string;
  student: string;
  course: Course;
  completedLessons: string[];
  progressPercentage: number;
  status: "Not Started" | "In Progress" | "Completed";
  enrolledAt: string;
  lastAccessedAt: string;
}

export interface Submission {
  _id: string;
  student?: { _id: string; name: string; email: string };
  course?: { _id: string; title: string; slug: string; thumbnail?: string };
  type: "quiz" | "assignment";
  targetTitle: string;
  score?: number;
  totalPoints: number;
  percentage?: number;
  passingStatus?: "Passed" | "Failed";
  answers?: number[];
  submissionText?: string;
  githubUrl?: string;
  liveUrl?: string;
  feedback?: string;
  status: "Pending" | "Submitted" | "Late" | "Reviewed" | "Graded";
  submittedAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalAssignments: number;
  totalQuizzes: number;
  totalSubmissions: number;
  activeUsers: number;
}

// Token helper
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auspify_auth_token");
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auspify_auth_token", token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auspify_auth_token");
  }
};

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    throw new Error(data.message || `API error: ${res.statusText || res.status}`);
  }
  return data;
}

export const api = {
  // System Status
  getSystemStatus: () => fetcher<{ success: boolean; server: string; database: any }>("/api/system-status"),
  getHealth: () => fetcher<{ status: string; database: string }>("/health"),

  // Auth
  register: (body: { name: string; email: string; password: string; role?: string }) =>
    fetcher<{ success: boolean; token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    fetcher<{ success: boolean; token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getMe: () => fetcher<{ success: boolean; user: User }>("/api/auth/me"),

  // User Profile
  updateProfile: (id: string, data: Partial<User>) =>
    fetcher<{ success: boolean; user: User }>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Courses
  getCourses: (category?: string, search?: string, difficulty?: string) => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (difficulty && difficulty !== "All") params.append("difficulty", difficulty);
    if (search) params.append("search", search);
    return fetcher<{ success: boolean; courses: Course[] }>(`/api/courses?${params.toString()}`);
  },
  getCourse: (idOrSlug: string) => fetcher<{ success: boolean; course: Course }>(`/api/courses/${idOrSlug}`),
  createCourse: (course: Partial<Course>) =>
    fetcher<{ success: boolean; course: Course }>("/api/courses", {
      method: "POST",
      body: JSON.stringify(course),
    }),
  updateCourse: (id: string, course: Partial<Course>) =>
    fetcher<{ success: boolean; course: Course }>(`/api/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(course),
    }),
  deleteCourse: (id: string) =>
    fetcher<{ success: boolean; message: string }>(`/api/courses/${id}`, {
      method: "DELETE",
    }),
  seedCourses: () =>
    fetcher<{ success: boolean; message: string; demoAccounts?: any }>("/api/courses/seed", {
      method: "POST",
    }),

  // Enrollments & Real-time Progress (FR-05 & FR-07)
  getMyEnrollments: () => fetcher<{ success: boolean; enrollments: Enrollment[] }>("/api/enrollments/my-courses"),
  enroll: (courseId: string) =>
    fetcher<{ success: boolean; enrollment: Enrollment }>("/api/enrollments/" + courseId, {
      method: "POST",
    }),
  toggleLesson: (courseId: string, lessonId: string) =>
    fetcher<{ success: boolean; progressPercentage: number; status: string; completedLessons: string[] }>(
      `/api/enrollments/${courseId}/lesson/${lessonId}/toggle`,
      { method: "POST" }
    ),

  // Submissions (Quizzes & Assignments - FR-09, FR-11, FR-12)
  submitQuiz: (courseId: string, quizIndex: number, answers: number[]) =>
    fetcher<{
      success: boolean;
      message: string;
      result: { score: number; totalPoints: number; percentage: number; passingStatus: string; feedback: string };
    }>(`/api/submissions/${courseId}/quiz/${quizIndex}`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
  submitAssignment: (
    courseId: string,
    assignmentIndex: number,
    data: { submissionText?: string; githubUrl?: string; liveUrl?: string }
  ) =>
    fetcher<{ success: boolean; message: string; submission: Submission }>(
      `/api/submissions/${courseId}/assignment/${assignmentIndex}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),
  getMySubmissions: () => fetcher<{ success: boolean; submissions: Submission[] }>("/api/submissions/my-submissions"),
  getInstructorSubmissions: () =>
    fetcher<{ success: boolean; submissions: Submission[] }>("/api/submissions/instructor"),
  reviewSubmission: (id: string, data: { score: number; feedback: string; status?: string }) =>
    fetcher<{ success: boolean; submission: Submission }>(`/api/submissions/${id}/review`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Admin APIs (Section 19 & Section 3.1)
  getAdminStats: () => fetcher<{ success: boolean; stats: PlatformStats }>("/api/admin/stats"),
  getAdminUsers: (role?: string) => {
    const params = new URLSearchParams();
    if (role && role !== "all") params.append("role", role);
    return fetcher<{ success: boolean; users: User[] }>(`/api/admin/users?${params.toString()}`);
  },
  updateUserRole: (id: string, role: string) =>
    fetcher<{ success: boolean; user: User }>(`/api/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  deleteUser: (id: string) =>
    fetcher<{ success: boolean; message: string }>(`/api/admin/users/${id}`, {
      method: "DELETE",
    }),
  updateCourseStatus: (id: string, status: string) =>
    fetcher<{ success: boolean; course: Course }>(`/api/admin/courses/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
