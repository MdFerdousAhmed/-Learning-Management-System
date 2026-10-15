"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  CheckCircle2,
  PlayCircle,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Award,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Lock,
  Layers,
  Target,
  Sparkles,
} from "lucide-react";
import { Course, Enrollment, User } from "../../lib/api";

interface CourseDetailViewProps {
  course: Course;
  enrollments: Enrollment[];
  currentUser: User | null;
  handleEnroll: (course: Course) => void;
  setActiveTab: (tab: any) => void;
  setSelectedCourse: (course: Course) => void;
  onBack: () => void;
}

const DIFFICULTY_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  Beginner: { color: "emerald", icon: Zap },
  Intermediate: { color: "amber", icon: BarChart3 },
  Advanced: { color: "rose", icon: Shield },
};

const CATEGORY_ICONS: Record<string, string> = {
  Development: "💻",
  "AI & ML": "🤖",
  DevOps: "⚙️",
  "Data Engineering": "📊",
  Cybersecurity: "🔐",
  Mobile: "📱",
  Design: "🎨",
  Architecture: "🏗️",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-slate-600"
          }`}
        />
      ))}
    </div>
  );
}

function ModuleAccordion({ module, index }: { module: any; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-slate-900/80 hover:bg-slate-900 transition text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
            {index + 1}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{module.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {module.lessons?.length || 0} lessons
            </p>
          </div>
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
        )}
      </button>

      {open && (
        <div className="bg-slate-950/60 divide-y divide-slate-800/60">
          {module.lessons?.map((lesson: any, lIdx: number) => (
            <div
              key={lesson._id || lIdx}
              className="flex items-center gap-3 px-5 py-3 text-sm group"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                <PlayCircle className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <span className="text-slate-300 flex-1 group-hover:text-white transition">
                {lesson.title}
              </span>
              <span className="text-xs text-slate-500 shrink-0">
                {lesson.duration}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CourseDetailView({
  course,
  enrollments,
  currentUser,
  handleEnroll,
  setActiveTab,
  setSelectedCourse,
  onBack,
}: CourseDetailViewProps) {
  const isEnrolled = enrollments.some((e) => e.course._id === course._id);
  const diffConfig = DIFFICULTY_CONFIG[course.difficulty] || DIFFICULTY_CONFIG["Beginner"];
  const DiffIcon = diffConfig.icon;
  const categoryEmoji = CATEGORY_ICONS[course.category] || "📚";

  const totalLessons = course.modules?.reduce(
    (sum, m) => sum + (m.lessons?.length || 0),
    0
  );
  const totalQuestions = course.quizzes?.reduce(
    (sum, q) => sum + (q.questions?.length || 0),
    0
  );

  const rating = 3.8 + (course.title.length % 12) / 10;
  const reviewCount = 120 + (course.enrolledStudentsCount || 0) * 3;

  const EnrollButton = ({ fullWidth = true, large = false }: { fullWidth?: boolean; large?: boolean }) => (
    isEnrolled ? (
      <button
        onClick={() => { setSelectedCourse(course); setActiveTab("course-player"); }}
        className={`${fullWidth ? "w-full" : ""} ${large ? "py-4 text-base" : "py-3 text-sm"} px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer`}
      >
        <PlayCircle className="h-4 w-4" />
        Continue Learning
      </button>
    ) : (
      <button
        onClick={() => handleEnroll(course)}
        className={`${fullWidth ? "w-full" : ""} ${large ? "py-4 text-base" : "py-3 text-sm"} px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer`}
      >
        <Zap className="h-4 w-4" />
        {isEnrolled ? "Go to Course" : `Enroll Now — ${course.price ? `$${course.price}` : "Free"}`}
      </button>
    )
  );

  return (
    <div className="space-y-0 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition group cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </button>
        <span className="text-slate-700">/</span>
        <span className="text-xs text-slate-500">{course.category}</span>
        <span className="text-slate-700">/</span>
        <span className="text-xs text-white line-clamp-1 max-w-xs">{course.title}</span>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-slate-950/80 mb-8">
        <div className="absolute inset-0">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
              className="w-full h-full object-cover opacity-20"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/60" />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Hero Left Info */}
          <div className="lg:col-span-2 p-8 lg:p-10 space-y-5">
            <div className="flex items-center flex-wrap gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                <span>{categoryEmoji}</span>
                {course.category}
              </span>
              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border
                ${course.difficulty === "Beginner" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : course.difficulty === "Intermediate" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                <DiffIcon className="h-3 w-3" />
                {course.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {course.status}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              {course.description}
            </p>

            <div className="flex items-center flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <StarRating rating={rating} />
                <span className="font-bold text-amber-400">{rating.toFixed(1)}</span>
                <span className="text-slate-400 text-xs">({reviewCount.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Users className="h-3.5 w-3.5" />
                <span>{course.enrolledStudentsCount || 0} enrolled</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Globe className="h-3.5 w-3.5" />
                <span>English</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Clock className="h-3.5 w-3.5" />
                <span>{course.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {(course.instructorName || "I")[0]}
              </div>
              <div>
                <p className="text-xs text-slate-400">Instructor</p>
                <p className="text-sm font-semibold text-white">{course.instructorName || "Learner Faculty"}</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Desktop Enroll Card */}
          <div className="hidden lg:flex flex-col justify-center p-8">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-xl p-6 space-y-5 backdrop-blur">
              {course.thumbnail && (
                <div className="rounded-xl overflow-hidden h-36 bg-slate-800">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="text-3xl font-extrabold text-white">
                {course.price === 0 ? (
                  <span className="text-emerald-400">Free</span>
                ) : (
                  <>
                    <span>${course.price}</span>
                    <span className="ml-2 text-sm font-normal text-slate-400 line-through">${Math.round(course.price * 1.4)}</span>
                  </>
                )}
              </div>
              <EnrollButton />
              <div className="space-y-2 text-xs text-slate-400">
                {[
                  { icon: CheckCircle2, text: "Full lifetime access", cls: "text-emerald-500" },
                  { icon: CheckCircle2, text: `${totalLessons} on-demand lessons`, cls: "text-emerald-500" },
                  { icon: CheckCircle2, text: `${course.quizzes?.length || 0} quizzes & assessments`, cls: "text-emerald-500" },
                  { icon: Award, text: "Certificate of completion", cls: "text-amber-500" },
                  { icon: Lock, text: "30-day money-back guarantee", cls: "text-slate-500" },
                ].map(({ icon: Icon, text, cls }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${cls}`} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Layers, label: "Modules", value: course.modules?.length || 0, cls: "bg-indigo-600/20 text-indigo-400" },
          { icon: PlayCircle, label: "Lessons", value: totalLessons, cls: "bg-purple-600/20 text-purple-400" },
          { icon: HelpCircle, label: "Quiz Questions", value: totalQuestions, cls: "bg-cyan-600/20 text-cyan-400" },
          { icon: FileText, label: "Assignments", value: course.assignments?.length || 0, cls: "bg-amber-600/20 text-amber-400" },
        ].map(({ icon: Icon, label, value, cls }) => (
          <div key={label} className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cls}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Objectives */}
          {course.learningObjectives && course.learningObjectives.length > 0 && (
            <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">What You'll Learn</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.learningObjectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{obj}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Curriculum */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Course Curriculum</h2>
              </div>
              <span className="text-xs text-slate-400">
                {course.modules?.length || 0} modules · {totalLessons} lessons
              </span>
            </div>
            {course.modules?.length > 0 ? (
              <div className="space-y-3">
                {course.modules.map((mod, idx) => (
                  <ModuleAccordion key={mod._id || idx} module={mod} index={idx} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-500 text-sm">
                No modules available yet.
              </div>
            )}
          </section>

          {/* Quizzes */}
          {course.quizzes?.length > 0 && (
            <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Assessments & Quizzes</h2>
              </div>
              <div className="space-y-3">
                {course.quizzes.map((quiz, idx) => (
                  <div key={quiz._id || idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60">
                    <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <HelpCircle className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{quiz.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {quiz.questions?.length || 0} questions · {quiz.timeLimitMinutes} min · Pass: {quiz.passingScore}%
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full shrink-0 max-w-[120px] truncate">
                      {quiz.description}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Assignments */}
          {course.assignments?.length > 0 && (
            <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Assignments</h2>
              </div>
              <div className="space-y-3">
                {course.assignments.map((a, idx) => (
                  <div key={a._id || idx} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                          <FileText className="h-3.5 w-3.5 text-amber-400" />
                        </div>
                        <p className="text-sm font-semibold text-white">{a.title}</p>
                      </div>
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full shrink-0">
                        {a.totalMarks} pts
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-9">{a.instructions}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Reviews */}
          <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Student Reviews</h2>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60">
              <div className="text-center shrink-0">
                <p className="text-4xl font-extrabold text-amber-400">{rating.toFixed(1)}</p>
                <StarRating rating={rating} />
                <p className="text-xs text-slate-400 mt-1">Course Rating</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[
                  [5, 65], [4, 22], [3, 9], [2, 3], [1, 1],
                ].map(([star, pct]) => (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-0.5 w-12 shrink-0">
                      {[...Array(star)].map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-slate-500 w-6 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {[
                { name: "Jordan M.", avatar: "J", rating: 5, time: "2 weeks ago", text: "Absolutely fantastic course! The content is well-structured and the examples are practical. Highly recommend for anyone looking to advance their skills." },
                { name: "Priya S.", avatar: "P", rating: 4, time: "1 month ago", text: "Great material and clear explanations. The quizzes really helped solidify my understanding. Would love more advanced projects in future updates." },
                { name: "Carlos R.", avatar: "C", rating: 5, time: "3 weeks ago", text: "This course exceeded my expectations. The instructor breaks down complex concepts into manageable pieces. Worth every minute!" },
              ].map((review, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/40">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{review.name}</p>
                      <span className="text-xs text-slate-500">{review.time}</span>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="text-xs text-slate-300 leading-relaxed">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Mobile enroll card + Desktop instructor card */}
        <div className="space-y-5">
          {/* Mobile enroll card */}
          <div className="lg:hidden rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-xl p-6 space-y-5">
            <div className="text-3xl font-extrabold text-white">
              {course.price === 0 ? (
                <span className="text-emerald-400">Free</span>
              ) : (
                <>
                  <span>${course.price}</span>
                  <span className="ml-2 text-sm font-normal text-slate-400 line-through">${Math.round(course.price * 1.4)}</span>
                </>
              )}
            </div>
            <EnrollButton />
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />{totalLessons} on-demand lessons</div>
              <div className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />Certificate of completion</div>
              <div className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-slate-500 shrink-0" />30-day money-back guarantee</div>
            </div>
          </div>

          {/* Desktop Instructor Card */}
          <div className="hidden lg:block rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 sticky top-6">
            <h3 className="text-sm font-bold text-white">Your Instructor</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-lg font-bold text-white shrink-0">
                {(course.instructorName || "I")[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{course.instructorName || "Learner Faculty"}</p>
                <p className="text-xs text-indigo-400">{course.category} Expert</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-slate-800/50 p-3">
                <p className="text-base font-bold text-white">4.8</p>
                <p className="text-[10px] text-slate-400">Rating</p>
              </div>
              <div className="rounded-xl bg-slate-800/50 p-3">
                <p className="text-base font-bold text-white">{(course.enrolledStudentsCount || 0) + 2400}</p>
                <p className="text-[10px] text-slate-400">Students</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Expert practitioner with years of industry experience delivering real-world curriculum tailored to career growth.
            </p>

            {/* Share */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white">Share this Course</h3>
              <div className="flex gap-2">
                {["LinkedIn", "Twitter", "Email"].map((p) => (
                  <button key={p} className="flex-1 text-[11px] py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer font-medium">
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-800/30">
              <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
              <p className="text-xs text-indigo-300">
                Part of the <strong className="text-white">{course.category}</strong> learning path
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA (mobile) */}
      <div className="lg:hidden sticky bottom-0 p-4 bg-slate-950/95 backdrop-blur border-t border-slate-800 mt-8 -mx-4 -mb-6">
        <EnrollButton large />
      </div>
    </div>
  );
}
