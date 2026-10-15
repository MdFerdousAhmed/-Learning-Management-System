"use client";

import React, { useState, useEffect } from "react";
import {
  api,
  User,
  Course,
  Enrollment,
  Submission,
  PlatformStats,
  setToken,
  removeToken,
  getToken,
} from "../lib/api";
import { signIn, signUp, signOut } from "../lib/auth-client";
import { Sparkles, ShieldAlert } from "lucide-react";

// Modularized UI Components
import TopNavbar from "./layout/TopNavbar";
import AppSidebar from "./layout/AppSidebar";
import AuthModal from "./modals/AuthModal";
import InteractiveCoursePlayer from "./InteractiveCoursePlayer";
import StudentDashboardView from "./views/StudentDashboardView";
import CourseCatalogView from "./views/CourseCatalogView";
import QuizEngineView from "./views/QuizEngineView";
import SubmissionsView from "./views/SubmissionsView";
import InstructorStudioView from "./views/InstructorStudioView";
import InstructorReviewsView from "./views/InstructorReviewsView";
import AdminDashboardView from "./views/AdminDashboardView";
import ProfileView from "./views/ProfileView";
import CourseDetailView from "./views/CourseDetailView";
import LandingPageView from "./views/LandingPageView";

export default function LMSDashboard() {
  // Navigation tabs - default to public landing page
  const [activeTab, setActiveTab] = useState<
    | "landing"
    | "student-dashboard"
    | "catalog"
    | "course-detail"
    | "course-player"
    | "quiz"
    | "submissions"
    | "instructor-studio"
    | "instructor-reviews"
    | "admin-dashboard"
    | "profile"
  >("landing");

  // Course detail preview (before enrollment)
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  // User & Global State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [instructorSubmissions, setInstructorSubmissions] = useState<Submission[]>([]);
  const [adminStats, setAdminStats] = useState<PlatformStats | null>(null);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);

  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  // Course Player State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Quiz State
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    totalPoints: number;
    percentage: number;
    passingStatus: string;
    feedback: string;
  } | null>(null);

  // Instructor Review State
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<string | null>(null);
  const [reviewScore, setReviewScore] = useState<number>(90);
  const [reviewFeedback, setReviewFeedback] = useState<string>("Great submission!");

  // System Status & UI feedback
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [notifications, setNotifications] = useState<string[]>([
    "🔔 Welcome to Auspify Enterprise LMS",
    "🔔 Check your enrolled courses for new modules",
  ]);

  // Auth Modal State
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authForm, setAuthForm] = useState({
    name: "Alex Johnson",
    email: "student@auspify.com",
    password: "password123",
    role: "student" as "student" | "instructor" | "admin",
  });

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    phone: "",
    skills: "",
  });

  // Instructor Course Authoring Form
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "Development",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    price: 49,
    duration: "10 hours",
    learningObjectives: "Master end-to-end full stack architecture",
    moduleTitle: "Module 1: Foundations",
    lessonTitle: "1.1 Introduction",
    lessonDuration: "20 min",
    lessonContent: "Core architectural principles and best practices.",
    quizTitle: "Module 1 Assessment",
    quizQuestion: "What is the primary purpose of an API Gateway?",
    quizOptions: ["Routing and auth", "Database storage", "Video editing", "Hardware driver"],
    quizAnswerIndex: 0,
    assignmentTitle: "Hands-on Project Milestone",
    assignmentInstructions: "Implement the REST API service and submit your GitHub URL.",
  });

  // Main data loader
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load courses with filters
      const courseRes = await api
        .getCourses(selectedCategory, searchTerm, selectedDifficulty)
        .catch(() => ({ success: false, courses: [] }));
      setCourses(courseRes.courses || []);

      // If user has token, fetch user profile & associated data
      if (getToken()) {
        const meRes = await api.getMe().catch(() => null);
        if (meRes?.user) {
          setCurrentUser(meRes.user);
          setProfileForm({
            name: meRes.user.name || "",
            bio: meRes.user.bio || "",
            phone: meRes.user.phone || "",
            skills: meRes.user.skills ? meRes.user.skills.join(", ") : "",
          });

          // Student Enrollments
          const enrollRes = await api.getMyEnrollments().catch(() => ({ success: false, enrollments: [] }));
          setEnrollments(enrollRes.enrollments || []);

          // Student Submissions
          const subRes = await api.getMySubmissions().catch(() => ({ success: false, submissions: [] }));
          setSubmissions(subRes.submissions || []);

          // Instructor Submissions
          if (meRes.user.role === "instructor" || meRes.user.role === "admin") {
            const instRes = await api.getInstructorSubmissions().catch(() => ({ success: false, submissions: [] }));
            setInstructorSubmissions(instRes.submissions || []);
          }

          // Admin Stats & Users
          if (meRes.user.role === "admin") {
            const statsRes = await api.getAdminStats().catch(() => null);
            if (statsRes?.stats) setAdminStats(statsRes.stats);
            const usersRes = await api.getAdminUsers().catch(() => ({ success: false, users: [] }));
            setAdminUsers(usersRes.users || []);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedDifficulty]);

  // Seed demo database
  const handleSeed = async () => {
    try {
      setIsLoading(true);
      setStatusMessage("Seeding database with full-stack courses & accounts...");
      const res = await api.seedCourses();
      setStatusMessage(res.message);
      setNotifications((prev) => ["🔔 Seeded demo courses & accounts into MongoDB!", ...prev]);
      await loadData();
      setTimeout(() => setStatusMessage(""), 4000);
    } catch (err: any) {
      setStatusMessage(`Seeding error: ${err.message}`);
      setTimeout(() => setStatusMessage(""), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Handlers – Unified Better Auth & MongoDB API
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (authMode === "login") {
        let loggedInUser: User | null = null;

        // 1. Primary: API login to MongoDB Atlas
        try {
          const res = await api.login({ email: authForm.email, password: authForm.password });
          setToken(res.token);
          loggedInUser = res.user;
          setCurrentUser(res.user);
        } catch (apiErr: any) {
          // 2. Fallback: Better Auth session sign-in
          const { data, error } = await signIn.email({
            email: authForm.email,
            password: authForm.password,
          });
          if (error) {
            throw new Error(apiErr.message || error.message || "Invalid email or password");
          }
          if (data?.user) {
            loggedInUser = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: ((data.user as any).role as User["role"]) || "student",
            };
            setCurrentUser(loggedInUser);
          }
        }

        if (loggedInUser) {
          setShowAuthModal(false);
          setStatusMessage(`Welcome back, ${loggedInUser.name} (${loggedInUser.role})!`);
          if (loggedInUser.role === "admin") setActiveTab("admin-dashboard");
          else if (loggedInUser.role === "instructor") setActiveTab("instructor-studio");
          else setActiveTab("student-dashboard");

          // Keep Better Auth cookie in sync in background
          signIn.email({ email: authForm.email, password: authForm.password }).catch(() => {});
        }
      } else {
        // Register mode
        let registeredUser: User | null = null;

        // 1. Primary: API register to MongoDB Atlas
        try {
          const res = await api.register(authForm);
          setToken(res.token);
          registeredUser = res.user;
          setCurrentUser(res.user);
        } catch (apiErr: any) {
          // 2. Fallback: Better Auth sign-up
          const { data, error } = await signUp.email({
            email: authForm.email,
            password: authForm.password,
            name: authForm.name,
            // @ts-ignore
            role: authForm.role,
          });
          if (error) {
            throw new Error(apiErr.message || error.message || "Registration failed");
          }
          if (data?.user) {
            registeredUser = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: ((data.user as any).role as User["role"]) || "student",
            };
            setCurrentUser(registeredUser);
          }
        }

        if (registeredUser) {
          setShowAuthModal(false);
          setStatusMessage(`Account created! Welcome, ${registeredUser.name}!`);
          if (registeredUser.role === "admin") setActiveTab("admin-dashboard");
          else if (registeredUser.role === "instructor") setActiveTab("instructor-studio");
          else setActiveTab("student-dashboard");

          // Keep Better Auth in sync
          signUp.email({ email: authForm.email, password: authForm.password, name: authForm.name }).catch(() => {});
        }
      }

      setTimeout(() => setStatusMessage(""), 4000);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch demo persona with navigation restriction guard
  const handleDemoSwitch = async (role: "student" | "instructor" | "admin") => {
    try {
      setIsLoading(true);
      const email = `${role}@auspify.com`;
      const name =
        role === "student" ? "Alex Student" : role === "instructor" ? "Dr. Elena Rostova" : "Platform Administrator";

      // Sign out current session
      await signOut().catch(() => {});
      removeToken();

      let res;
      try {
        res = await api.login({ email, password: "password123" });
      } catch {
        res = await api.register({ name, email, password: "password123", role });
      }

      setToken(res.token);
      setCurrentUser(res.user);
      setStatusMessage(`Active persona: ${res.user.name} [${res.user.role.toUpperCase()}]`);

      // Sync Better Auth in background
      signIn.email({ email, password: "password123" }).catch(() => {});

      if (role === "admin") setActiveTab("admin-dashboard");
      else if (role === "instructor") setActiveTab("instructor-studio");
      else setActiveTab("student-dashboard");

      setTimeout(() => setStatusMessage(""), 3500);
      await loadData();
    } catch {
      // Offline fallback:
      const fallbackUser: User = {
        _id: `demo-${role}`,
        name: role === "student" ? "Alex Student" : role === "instructor" ? "Dr. Elena Rostova" : "System Administrator",
        email: `${role}@auspify.com`,
        role,
      };
      setCurrentUser(fallbackUser);
      setStatusMessage(`Active persona: ${fallbackUser.name} [${role.toUpperCase()}]`);
      if (role === "admin") setActiveTab("admin-dashboard");
      else if (role === "instructor") setActiveTab("instructor-studio");
      else setActiveTab("student-dashboard");
      setTimeout(() => setStatusMessage(""), 3500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut().catch(() => {});
    removeToken();
    setCurrentUser(null);
    setEnrollments([]);
    setSubmissions([]);
    setActiveTab("landing");
    setStatusMessage("Logged out successfully");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Course Enrollment
  const handleEnroll = async (course: Course) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    try {
      setIsLoading(true);
      await api.enroll(course._id);
      setStatusMessage(`Enrolled in "${course.title}"!`);
      setNotifications((prev) => [`🔔 Enrolled in ${course.title}`, ...prev]);
      setTimeout(() => setStatusMessage(""), 3000);
      await loadData();
      setSelectedCourse(course);
      setActiveTab("course-player");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Quiz submission & auto grading
  const handleSubmitQuiz = async () => {
    if (!selectedCourse || !currentUser) return;
    const currentQuiz = selectedCourse.quizzes[activeQuizIndex];
    if (!currentQuiz) return;

    const answersArray = currentQuiz.questions.map((_, idx) => quizAnswers[idx] ?? -1);

    try {
      setIsLoading(true);
      const res = await api.submitQuiz(selectedCourse._id, activeQuizIndex, answersArray);
      setQuizResult(res.result);
      setNotifications((prev) => [
        `🔔 Quiz graded: ${res.result.percentage}% (${res.result.passingStatus})`,
        ...prev,
      ]);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Instructor Review submission
  const handleReviewSubmission = async (id: string) => {
    try {
      setIsLoading(true);
      await api.reviewSubmission(id, {
        score: Number(reviewScore),
        feedback: reviewFeedback,
        status: "Reviewed",
      });
      setStatusMessage("Submission graded and feedback sent to student!");
      setReviewingSubmissionId(null);
      setTimeout(() => setStatusMessage(""), 3500);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin User Role Change
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      setStatusMessage(`User role updated to ${newRole}`);
      setTimeout(() => setStatusMessage(""), 3000);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Admin Delete User
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    try {
      await api.deleteUser(userId);
      setStatusMessage("User removed from platform");
      setTimeout(() => setStatusMessage(""), 3000);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Admin Course Status toggle
  const handleCourseStatusToggle = async (courseId: string, newStatus: string) => {
    try {
      await api.updateCourseStatus(courseId, newStatus);
      setStatusMessage(`Course status set to ${newStatus}`);
      setTimeout(() => setStatusMessage(""), 3000);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const skillsArray = profileForm.skills.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await api.updateProfile(currentUser._id || currentUser.id!, {
        name: profileForm.name,
        bio: profileForm.bio,
        phone: profileForm.phone,
        skills: skillsArray,
      });
      setCurrentUser(res.user);
      setStatusMessage("Profile updated successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Course Authoring
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      setIsLoading(true);
      await api.createCourse({
        title: newCourse.title,
        description: newCourse.description,
        category: newCourse.category,
        difficulty: newCourse.difficulty,
        price: Number(newCourse.price),
        duration: newCourse.duration,
        learningObjectives: [newCourse.learningObjectives],
        modules: [
          {
            title: newCourse.moduleTitle,
            lessons: [
              {
                title: newCourse.lessonTitle,
                duration: newCourse.lessonDuration,
                content: newCourse.lessonContent,
              },
            ],
          },
        ],
        quizzes: [
          {
            title: newCourse.quizTitle,
            description: "Automated evaluation quiz",
            timeLimitMinutes: 10,
            passingScore: 70,
            questions: [
              {
                questionText: newCourse.quizQuestion,
                options: newCourse.quizOptions,
                correctAnswerIndex: newCourse.quizAnswerIndex,
                points: 25,
              },
            ],
          },
        ],
        assignments: [
          {
            title: newCourse.assignmentTitle,
            instructions: newCourse.assignmentInstructions,
            totalMarks: 100,
          },
        ],
      });
      setStatusMessage(`Course "${newCourse.title}" successfully published!`);
      setNotifications((prev) => [`🔔 New course authored: ${newCourse.title}`, ...prev]);
      setTimeout(() => setStatusMessage(""), 4000);
      await loadData();
      setActiveTab("catalog");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Dynamic Status / Feedback Bar */}
      {statusMessage && (
        <div className="bg-indigo-50 dark:bg-gradient-to-r dark:from-indigo-900/90 dark:to-purple-900/90 border-b border-indigo-200 dark:border-indigo-700/50 px-4 py-2 text-center text-xs font-semibold text-indigo-900 dark:text-indigo-200 flex items-center justify-center gap-2 animate-fade-in shadow-inner">
          <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Body: Full-width Landing Page OR Workspace with Sidebar */}
      {activeTab === "landing" ? (
        <LandingPageView
          courses={courses}
          currentUser={currentUser}
          setActiveTab={setActiveTab}
          setSelectedCourse={setSelectedCourse}
          setPreviewCourse={setPreviewCourse}
          handleDemoSwitch={handleDemoSwitch}
          onOpenAuth={() => setShowAuthModal(true)}
        />
      ) : (
        <>
          {/* Top Navigation Bar */}
          <TopNavbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentUser={currentUser}
            handleDemoSwitch={handleDemoSwitch}
            notifications={notifications}
            handleLogout={handleLogout}
            onOpenAuth={() => setShowAuthModal(true)}
          />

          {/* Body: Left Workspace Sidebar + Main Content Views */}
          <div className="flex-1 flex w-full">
            <AppSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              onStatusMessage={(msg) => {
                setStatusMessage(msg);
                setTimeout(() => setStatusMessage(""), 3000);
              }}
            />

            {/* Main Content Area */}
            <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full max-w-[1600px] mx-auto flex flex-col gap-6">
              {activeTab === "course-player" && (
                <InteractiveCoursePlayer
                  currentUser={currentUser}
                  course={selectedCourse}
                  onNavigateTab={setActiveTab}
                  onToggleCompletion={loadData}
                  onOpenAuth={() => setShowAuthModal(true)}
                />
              )}

              {/* Student Portal: Protected from Admin access */}
              {activeTab === "student-dashboard" && (
                currentUser?.role === "admin" ? (
                  <AccessRestrictedGuard
                    requiredRole="student"
                    currentRole={currentUser?.role}
                    onSwitchRole={handleDemoSwitch}
                    onGoBack={() => setActiveTab("admin-dashboard")}
                  />
                ) : (
                  <StudentDashboardView
                    enrollments={enrollments}
                    setActiveTab={setActiveTab}
                    setSelectedCourse={setSelectedCourse}
                  />
                )
              )}

              {activeTab === "catalog" && (
                <CourseCatalogView
                  courses={courses}
                  enrollments={enrollments}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedDifficulty={selectedDifficulty}
                  setSelectedDifficulty={setSelectedDifficulty}
                  loadData={loadData}
                  handleSeed={handleSeed}
                  handleEnroll={handleEnroll}
                  setSelectedCourse={(course) => {
                    setPreviewCourse(course);
                    setActiveTab("course-detail");
                  }}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === "course-detail" && previewCourse && (
                <CourseDetailView
                  course={previewCourse}
                  enrollments={enrollments}
                  currentUser={currentUser}
                  handleEnroll={handleEnroll}
                  setActiveTab={setActiveTab}
                  setSelectedCourse={setSelectedCourse}
                  onBack={() => setActiveTab("catalog")}
                />
              )}

              {/* Quiz Engine: Protected from Admin access */}
              {activeTab === "quiz" && (
                currentUser?.role === "admin" ? (
                  <AccessRestrictedGuard
                    requiredRole="student"
                    currentRole={currentUser?.role}
                    onSwitchRole={handleDemoSwitch}
                    onGoBack={() => setActiveTab("admin-dashboard")}
                  />
                ) : (
                  <QuizEngineView
                    selectedCourse={selectedCourse}
                    courses={courses}
                    activeQuizIndex={activeQuizIndex}
                    quizResult={quizResult}
                    quizAnswers={quizAnswers}
                    setQuizAnswers={setQuizAnswers}
                    setQuizResult={setQuizResult}
                    handleSubmitQuiz={handleSubmitQuiz}
                    isLoading={isLoading}
                    setActiveTab={setActiveTab}
                    setSelectedCourse={setSelectedCourse}
                  />
                )
              )}

              {/* Submissions: Protected from Admin access */}
              {activeTab === "submissions" && (
                currentUser?.role === "admin" ? (
                  <AccessRestrictedGuard
                    requiredRole="student"
                    currentRole={currentUser?.role}
                    onSwitchRole={handleDemoSwitch}
                    onGoBack={() => setActiveTab("admin-dashboard")}
                  />
                ) : (
                  <SubmissionsView submissions={submissions} />
                )
              )}

              {/* Instructor Studio: Strictly Protected for Instructors */}
              {activeTab === "instructor-studio" && (
                currentUser?.role === "instructor" ? (
                  <InstructorStudioView
                    newCourse={newCourse}
                    setNewCourse={setNewCourse}
                    handleCreateCourse={handleCreateCourse}
                    isLoading={isLoading}
                  />
                ) : (
                  <AccessRestrictedGuard
                    requiredRole="instructor"
                    currentRole={currentUser?.role}
                    onSwitchRole={handleDemoSwitch}
                    onGoBack={() =>
                      setActiveTab(
                        currentUser?.role === "admin" ? "admin-dashboard" : "student-dashboard"
                      )
                    }
                  />
                )
              )}

              {/* Instructor Reviews: Strictly Protected for Instructors */}
              {activeTab === "instructor-reviews" && (
                currentUser?.role === "instructor" ? (
                  <InstructorReviewsView
                    instructorSubmissions={instructorSubmissions}
                    reviewingSubmissionId={reviewingSubmissionId}
                    setReviewingSubmissionId={setReviewingSubmissionId}
                    reviewScore={reviewScore}
                    setReviewScore={setReviewScore}
                    reviewFeedback={reviewFeedback}
                    setReviewFeedback={setReviewFeedback}
                    handleReviewSubmission={handleReviewSubmission}
                  />
                ) : (
                  <AccessRestrictedGuard
                    requiredRole="instructor"
                    currentRole={currentUser?.role}
                    onSwitchRole={handleDemoSwitch}
                    onGoBack={() =>
                      setActiveTab(
                        currentUser?.role === "admin" ? "admin-dashboard" : "student-dashboard"
                      )
                    }
                  />
                )
              )}

              {/* Admin Dashboard: Strictly Protected for Admins */}
              {activeTab === "admin-dashboard" && (
                currentUser?.role === "admin" ? (
                  <AdminDashboardView
                    adminStats={adminStats}
                    adminUsers={adminUsers}
                    courses={courses}
                    handleUpdateUserRole={handleUpdateUserRole}
                    handleDeleteUser={handleDeleteUser}
                    handleCourseStatusToggle={handleCourseStatusToggle}
                  />
                ) : (
                  <AccessRestrictedGuard
                    requiredRole="admin"
                    currentRole={currentUser?.role}
                    onSwitchRole={handleDemoSwitch}
                    onGoBack={() =>
                      setActiveTab(
                        currentUser?.role === "instructor" ? "instructor-studio" : "student-dashboard"
                      )
                    }
                  />
                )
              )}

              {activeTab === "profile" && (
                <ProfileView
                  currentUser={currentUser}
                  profileForm={profileForm}
                  setProfileForm={setProfileForm}
                  handleSaveProfile={handleSaveProfile}
                  isLoading={isLoading}
                />
              )}
            </main>
          </div>
        </>
      )}

      {/* Auth Modal with Better Auth support */}
      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuthSubmit={handleAuthSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

// Access Restricted Guard Component for Role-Based Isolation
function AccessRestrictedGuard({
  requiredRole,
  currentRole,
  onSwitchRole,
  onGoBack,
}: {
  requiredRole: "student" | "instructor" | "admin";
  currentRole?: string;
  onSwitchRole: (role: "student" | "instructor" | "admin") => void;
  onGoBack: () => void;
}) {
  const roleTitle =
    requiredRole === "admin"
      ? "Dashboard"
      : requiredRole === "instructor"
      ? "Instructor Curriculum Studio"
      : "Student Learner Desk";

  const allowedTitle =
    currentRole === "admin"
      ? "Dashboard"
      : currentRole === "instructor"
      ? "Curriculum Studio"
      : "Student Portal";

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-5 shadow-xl transition-colors duration-200">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Access Restricted: {roleTitle}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            You cannot access this area with your current{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-200 uppercase">
              {currentRole || "Student"}
            </span>{" "}
            account. This section requires{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
              {requiredRole}
            </span>{" "}
            privileges.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onGoBack}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            Return to {allowedTitle}
          </button>
          <button
            onClick={() => onSwitchRole(requiredRole)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
          >
            Switch to {requiredRole.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
