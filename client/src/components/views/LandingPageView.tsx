"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Play,
  Sparkles,
  CheckCircle2,
  Star,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Code2,
  HelpCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  MonitorPlay,
  Compass,
  FileCheck,
  Check,
  Laptop,
  GraduationCap,
  Flame,
  Zap,
  Globe,
  Lock,
  Search,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { Course, User } from "../../lib/api";
import { useTheme } from "../../lib/theme";

interface LandingPageViewProps {
  courses: Course[];
  currentUser: User | null;
  setActiveTab: (tab: any) => void;
  setSelectedCourse: (course: Course) => void;
  setPreviewCourse: (course: Course) => void;
  handleDemoSwitch: (role: "student" | "instructor" | "admin") => void;
  onOpenAuth: () => void;
}

// Curated fallbacks in case courses are still loading or empty
const FALLBACK_COURSES: Partial<Course>[] = [
  {
    _id: "demo-course-1",
    title: "Next.js 15 & React 19 Full-Stack Mastery",
    slug: "nextjs-15-react-19-mastery",
    description:
      "Build enterprise SaaS applications with Turbopack, Server Actions, Parallel Routes, and production performance optimizations.",
    category: "Development",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=800&auto=format&fit=crop",
    duration: "18h 45m",
    price: 0,
    status: "Published",
    enrolledStudentsCount: 14250,
    instructorName: "Dr. Elena Rostova",
    modules: [
      {
        title: "Architecture & Tooling",
        lessons: [
          { title: "Turbopack Compilation & Hydration", duration: "18m", content: "" },
          { title: "React Server Components Deep Dive", duration: "25m", content: "" },
        ],
      },
    ],
  },
  {
    _id: "demo-course-2",
    title: "Applied Generative AI & LLM Systems Engineering",
    slug: "generative-ai-systems-engineering",
    description:
      "Architect multi-agent workflows, vector databases, RAG pipelines, and fine-tuned open-source models with Python & LangChain.",
    category: "AI & ML",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop",
    duration: "24h 10m",
    price: 49,
    status: "Published",
    enrolledStudentsCount: 11840,
    instructorName: "Marcus Vance",
    modules: [
      {
        title: "Vector Search & Embeddings",
        lessons: [{ title: "HNSW Indexes and Similarity Metrics", duration: "32m", content: "" }],
      },
    ],
  },
  {
    _id: "demo-course-3",
    title: "Distributed Systems & Cloud Architecture",
    slug: "distributed-systems-cloud-architecture",
    description:
      "Design fault-tolerant microservices, high-throughput message buses with Kafka, Redis caches, and resilient Kubernetes deployments.",
    category: "Architecture",
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    duration: "20h 30m",
    price: 0,
    status: "Published",
    enrolledStudentsCount: 9620,
    instructorName: "Sarah Chen",
    modules: [
      {
        title: "Event-Driven Messaging",
        lessons: [{ title: "Kafka Partitions and Consumer Groups", duration: "28m", content: "" }],
      },
    ],
  },
];

export default function LandingPageView({
  courses,
  currentUser,
  setActiveTab,
  setSelectedCourse,
  setPreviewCourse,
  handleDemoSwitch,
  onOpenAuth,
}: LandingPageViewProps) {
  const { theme, toggleTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeRoleTab, setActiveRoleTab] = useState<"student" | "instructor" | "admin">("student");
  const [emailInput, setEmailInput] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Select courses to display (real or fallback)
  const displayCourses = courses && courses.length > 0 ? courses : (FALLBACK_COURSES as Course[]);

  const filteredCourses = displayCourses.filter((course) => {
    if (selectedCategory === "All") return true;
    return course.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const categories = ["All", "Development", "AI & ML", "Architecture", "DevOps", "Design"];

  const handleLaunchCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveTab("course-player");
  };

  const handleViewCourseDetail = (course: Course) => {
    setPreviewCourse(course);
    setActiveTab("course-detail");
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setNewsletterSubscribed(true);
      setEmailInput("");
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  // Navigates user to their role-appropriate dashboard
  const handleGoToMyDashboard = () => {
    if (currentUser?.role === "admin") {
      setActiveTab("admin-dashboard");
    } else if (currentUser?.role === "instructor") {
      setActiveTab("instructor-studio");
    } else {
      setActiveTab("student-dashboard");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-indigo-100/80 dark:bg-gradient-to-r dark:from-indigo-950 dark:via-purple-900 dark:to-indigo-950 border-b border-indigo-200 dark:border-indigo-800/40 px-4 py-2 text-center text-xs font-medium text-indigo-900 dark:text-indigo-200 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span>
          <strong className="text-indigo-950 dark:text-white">Learner 2.0 Live:</strong> Role-Based Access Control, Dark/Light Mode &amp; Interactive Player.
        </span>
        <button
          onClick={() => setActiveTab("course-player")}
          className="ml-2 underline text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white transition font-semibold cursor-pointer"
        >
          Try Live Demo &rarr;
        </button>
      </div>

      {/* 2. DEDICATED LANDING NAVBAR */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("landing")}
              className="flex items-center gap-2.5 hover:opacity-95 transition text-left cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                    Learner
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    Enterprise LMS
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition">
              Features
            </a>
            <a href="#courses" className="hover:text-slate-900 dark:hover:text-white transition">
              Courses
            </a>
            <a href="#experience" className="hover:text-slate-900 dark:hover:text-white transition">
              Experience
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition">
              How it Works
            </a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition">
              Pricing
            </a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition">
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dark & Light Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </button>

            {currentUser ? (
              <button
                onClick={handleGoToMyDashboard}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
              >
                <MonitorPlay className="h-4 w-4" />
                <span>
                  {currentUser.role === "admin"
                    ? "Dashboard"
                    : currentUser.role === "instructor"
                    ? "Instructor Studio"
                    : "Student Dashboard"}
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab("student-dashboard")}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Launch Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-pink-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Next-Gen Real-Time Learning Platform</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-indigo-800 dark:text-indigo-200">v2.4 Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Master Tech Skills with{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                Interactive, Hands-On
              </span>{" "}
              Courses.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Go beyond passive video tutorials. Experience synchronized syllabus video players, real-time code
              evaluation, automated quizzes, and role-gated curriculum authoring.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
              <button
                onClick={() => setActiveTab("catalog")}
                className="px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition transform hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
              >
                <Compass className="h-5 w-5" />
                <span>Explore 120+ Courses</span>
              </button>

              <button
                onClick={() => setActiveTab("course-player")}
                className="px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/60 shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
              >
                <Play className="h-4 w-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                <span>Try Interactive Player</span>
              </button>

              <button
                onClick={handleGoToMyDashboard}
                className="px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition flex items-center gap-2 cursor-pointer"
              >
                <MonitorPlay className="h-4 w-4 text-slate-500" />
                <span>My Dashboard</span>
              </button>
            </div>

            {/* Trust Pill / Social Proof */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] text-white font-bold">
                    AJ
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] text-white font-bold">
                    SC
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] text-white font-bold">
                    MV
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] text-white font-bold">
                    ER
                  </div>
                </div>
                <span>
                  <strong className="text-slate-900 dark:text-white">48,000+</strong> active learners
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
                <span>
                  <strong className="text-slate-900 dark:text-white">4.9/5</strong> rating
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>
                  <strong className="text-slate-900 dark:text-white">96%</strong> completion rate
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Player Visual Mockup Showcase */}
          <div className="mt-12 md:mt-16 max-w-5xl mx-auto relative group">
            {/* Glow frame */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-35 transition duration-1000"></div>

            <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-colors duration-200">
              {/* Mockup Window Controls */}
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
                    Learner Interactive Course Player &bull; Lesson 04: Turbopack Server Actions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Telemetry
                  </span>
                  <button
                    onClick={() => setActiveTab("course-player")}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Launch Live <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Mockup Player Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-white min-h-[380px] sm:min-h-[440px]">
                {/* Left: Video Player Area */}
                <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 relative bg-gradient-to-b from-slate-950 to-slate-900">
                  <div className="flex items-center justify-between gap-2 z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                        HD 1080p
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800/80 text-slate-300">
                        Playback 1.25x
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/50 flex items-center gap-1">
                      <Flame className="h-3 w-3 text-amber-400" />
                      14-Day Streak
                    </span>
                  </div>

                  <div className="my-auto py-8 text-center flex flex-col items-center justify-center relative">
                    <button
                      onClick={() => setActiveTab("course-player")}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 hover:scale-105 transition shadow-xl shadow-indigo-600/40 flex items-center justify-center text-white cursor-pointer group/play"
                    >
                      <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-white translate-x-0.5 group-hover/play:scale-110 transition" />
                    </button>
                    <p className="mt-4 text-sm font-semibold text-white">
                      Full-Stack Next.js 15: Optimizing Server Component Streams
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Instructor: Dr. Elena Rostova &bull; 18m 42s</p>
                  </div>

                  <div className="space-y-2 z-10 pt-2">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer relative">
                      <div className="bg-gradient-to-r from-indigo-500 to-violet-400 h-full w-[65%] rounded-full relative">
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>12:15 / 18:42</span>
                      <div className="flex items-center gap-3">
                        <span className="hover:text-white cursor-pointer">Closed Captions [CC]</span>
                        <span className="hover:text-white cursor-pointer">Speed (1.25x)</span>
                        <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">Full Screen</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Synced Syllabus & Live Quiz preview */}
                <div className="lg:col-span-4 bg-slate-900/95 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Course Curriculum
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                        65% Complete
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span className="text-slate-300 line-through">01. Setup & Turbopack Core</span>
                        </div>
                        <span className="text-[10px] text-slate-500">14m</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-950/40 border border-indigo-700/50 text-xs">
                        <div className="flex items-center gap-2">
                          <Play className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400 shrink-0" />
                          <span className="text-indigo-200 font-semibold">02. Server Actions & Mutations</span>
                        </div>
                        <span className="text-[10px] text-indigo-300 font-mono">Playing</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800 text-xs opacity-80">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                          <span className="text-slate-400">03. Partial Prerendering (PPR)</span>
                        </div>
                        <span className="text-[10px] text-slate-500">22m</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/70 to-purple-950/70 border border-indigo-800/40 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-200 flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
                        Automated Assessment
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                        100% Score
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      &quot;Which directive tells React to treat a module as a client component?&quot;
                    </p>
                    <div className="p-1.5 rounded bg-slate-900/80 font-mono text-[10px] text-emerald-300 border border-emerald-800/40">
                      &apos;use client&apos;; &bull; Verified Answer
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("course-player")}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/30"
                  >
                    <span>Open Interactive Player</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY METRICS STATS BAR */}
      <section className="border-y border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 py-10 relative transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                48,000+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                Active Tech Learners
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
                120+
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                Interactive Courses
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                96%
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                Course Completion Rate
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-pink-600 dark:text-pink-400 tracking-tight">
                4.9 / 5
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                Student Satisfaction
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-900 text-center">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              Learners and Engineering Teams Trust Learner From
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70 grayscale hover:grayscale-0 transition duration-300">
              <span className="font-bold text-sm sm:text-base tracking-wider text-slate-700 dark:text-slate-300">GOOGLE</span>
              <span className="font-bold text-sm sm:text-base tracking-wider text-slate-700 dark:text-slate-300">MICROSOFT</span>
              <span className="font-bold text-sm sm:text-base tracking-wider text-slate-700 dark:text-slate-300">AMAZON AWS</span>
              <span className="font-bold text-sm sm:text-base tracking-wider text-slate-700 dark:text-slate-300">STRIPE</span>
              <span className="font-bold text-sm sm:text-base tracking-wider text-slate-700 dark:text-slate-300">VERCEL</span>
              <span className="font-bold text-sm sm:text-base tracking-wider text-slate-700 dark:text-slate-300">META</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE FEATURES (BENTO GRID) */}
      <section id="features" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/40">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for Serious Technical Learning
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Everything you need to master advanced engineering disciplines from foundational fundamentals to
              enterprise scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5 group-hover:scale-110 transition">
                  <MonitorPlay className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Interactive Course Player</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Real-time video player with synced syllabus progress, chapter scrubbing, lesson bookmarking, and
                  telemetry that saves your spot across devices.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("course-player")}
                className="mt-6 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                Experience Player <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-md transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5 group-hover:scale-110 transition">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Automated Assessment Engine</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Instant evaluation with detailed passing criteria, granular score feedback, and question-level
                  explanations to reinforce complex concepts.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("quiz")}
                className="mt-6 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                Take a Quiz <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-pink-500/50 hover:shadow-md transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 dark:bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-5 group-hover:scale-110 transition">
                  <Laptop className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Curriculum Authoring Studio</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Empower instructors with a modern studio to design modular courses, upload lesson media, configure
                  pass thresholds, and craft assignment rubrics.
                </p>
              </div>
              <button
                onClick={() => {
                  if (currentUser?.role === "student") handleDemoSwitch("instructor");
                  setActiveTab("instructor-studio");
                }}
                className="mt-6 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                Explore Studio <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:scale-110 transition">
                  <FileCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Submission Review Hub</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Instructors can grade assignments, review GitHub repositories, verify live deployment links, and
                  provide actionable, personalized feedback.
                </p>
              </div>
              <button
                onClick={() => {
                  if (currentUser?.role === "student") handleDemoSwitch("instructor");
                  setActiveTab("instructor-reviews");
                }}
                className="mt-6 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                Review Workflow <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 group-hover:scale-110 transition">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Role-Based Governance</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Complete role separation for Students, Instructors, and Enterprise Admins with user management,
                  course approval switches, and platform telemetry.
                </p>
              </div>
              <button
                onClick={() => {
                  if (currentUser?.role !== "admin") handleDemoSwitch("admin");
                  setActiveTab("admin-dashboard");
                }}
                className="mt-6 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                Dashboard <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-md transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-5 group-hover:scale-110 transition">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Verified Digital Certificates</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Earn cryptographically verifiable credentials upon 100% course completion and passing required
                  quizzes, ready to share on LinkedIn and portfolios.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("student-dashboard")}
                className="mt-6 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                View Credentials <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED COURSES SECTION */}
      <section id="courses" className="py-20 bg-slate-100/60 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/40">
                Curated Masterclasses
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Featured Technical Courses
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
                Explore hand-crafted curriculums designed by industry veterans with hands-on modules and projects.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.slice(0, 6).map((course) => (
              <div
                key={course._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                    <img
                      src={
                        course.thumbnail ||
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/60">
                        {course.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                          course.difficulty === "Beginner"
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/60"
                            : course.difficulty === "Intermediate"
                            ? "bg-amber-950/80 text-amber-300 border-amber-800/60"
                            : "bg-rose-950/80 text-rose-300 border-rose-800/60"
                        }`}
                      >
                        {course.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/70">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration || "12h 30m"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {(course.enrolledStudentsCount || 850).toLocaleString()} learners
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        4.9
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleViewCourseDetail(course)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800 text-xs font-semibold transition cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleLaunchCourse(course)}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="h-3 w-3 fill-white" />
                    <span>Start Learning</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setActiveTab("catalog")}
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm transition inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Explore All 120+ Courses in Catalog</span>
              <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE ROLE EXPERIENCE SHOWCASE */}
      <section id="experience" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800/40">
              Role-Tailored Workflows
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              One Unified System for Every Persona
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Each user only accesses their designated dashboard with strictly guarded roles.
            </p>

            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold mt-4">
              <button
                onClick={() => setActiveRoleTab("student")}
                className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                  activeRoleTab === "student"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                For Students
              </button>
              <button
                onClick={() => setActiveRoleTab("instructor")}
                className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                  activeRoleTab === "instructor"
                    ? "bg-purple-600 text-white shadow"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                For Instructors
              </button>
              <button
                onClick={() => setActiveRoleTab("admin")}
                className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                  activeRoleTab === "admin"
                    ? "bg-amber-600 text-white shadow"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                For Enterprise Admins
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg">
            {activeRoleTab === "student" && (
              <>
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    <GraduationCap className="h-4 w-4" />
                    <span>LEARNER EXPERIENCE</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Personalized Mastery &amp; Interactive Practice
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Track your daily study streaks, pick up right where you stopped, submit assignments with GitHub
                    links, and take automatic quizzes that test your practical knowledge.
                  </p>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Custom dashboard with active enrollments &amp; progress gauges</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Interactive video player with lesson notes and resources</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Automated quiz evaluation with score percentages</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      handleDemoSwitch("student");
                      setActiveTab("student-dashboard");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Open Student Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="lg:col-span-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Student Progress Overview</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Active Session</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">Courses Enrolled</span>
                      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">4 Active</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">Quizzes Passed</span>
                      <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">12 / 12</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-indigo-900 dark:text-indigo-200">Full-Stack Next.js 15</span>
                      <span className="text-indigo-700 dark:text-indigo-300 font-bold">78%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[78%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeRoleTab === "instructor" && (
              <>
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold">
                    <Laptop className="h-4 w-4" />
                    <span>CURRICULUM STUDIO</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Publish Courses &amp; Evaluate Submissions
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Build multi-chapter syllabi, embed high-definition video resources, attach assessment questions,
                    and provide feedback on student project submissions with numerical scoring.
                  </p>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0" />
                      <span>Intuitive course creation studio with instant publishing</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0" />
                      <span>Dedicated submission review desk for assignments</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0" />
                      <span>Real-time enrollment counts &amp; student engagement metrics</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      handleDemoSwitch("instructor");
                      setActiveTab("instructor-studio");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-md transition inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Launch Curriculum Studio</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="lg:col-span-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Instructor Studio Feed</span>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">Authoring Active</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">Pending Assignment Reviews</span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                        3 Awaiting
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Alex Johnson submitted &quot;Server Actions Capstone&quot; (GitHub repo + live link)
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Total Enrolled in Your Tracks</span>
                      <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">2,480 Students</p>
                    </div>
                    <span className="text-purple-700 dark:text-purple-300 font-bold bg-purple-100 dark:bg-purple-900/60 px-2 py-1 rounded">
                      +18% this month
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeRoleTab === "admin" && (
              <>
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    <Shield className="h-4 w-4" />
                    <span>ADMIN CONTROL TOWER</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Platform Telemetry &amp; System Governance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Manage users, promote students to instructors, approve or archive courses, and track platform-wide
                    analytics including completions, quizzes taken, and active sessions.
                  </p>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Global platform statistics &amp; user distribution</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Role access control (Student / Instructor / Admin)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Course status publishing and archival controls</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      handleDemoSwitch("admin");
                      setActiveTab("admin-dashboard");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm shadow-md transition inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Open Admin Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="lg:col-span-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Enterprise Health Telemetry</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">&bull; Systems Normal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">Users</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-1">48.2K</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">Courses</span>
                      <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-1">124</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">Submissions</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">9.8K</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-amber-800 dark:text-amber-200">Role-Based Access Control</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Strict dashboard guard enforced</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-semibold text-[10px]">
                      Enforced
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS (3 STEPS) */}
      <section id="how-it-works" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/40">
              Simple 3-Step Pathway
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How You Accelerate Your Career
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Designed from the ground up to minimize friction and maximize technical retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30 text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enroll in Masterclass Tracks</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose specialized courses in Full-Stack, AI Engineering, Cloud Architecture, or Systems Programming
                tailored to your current skill level.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 font-extrabold flex items-center justify-center border border-purple-200 dark:border-purple-500/30 text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Learn with Interactive Player</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stream chapters with synchronized syllabus notes, complete hands-on quizzes, and submit verified code
                repositories.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30 text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Earn Verified Credentials</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive proof of mastery with shareable digital certificates and build production-ready projects for
                your engineering portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section id="testimonials" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-3 py-1 rounded-full border border-pink-200 dark:border-pink-800/40">
              Learner Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trusted by Ambitious Engineers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Read how developers used Learner to master complex systems and transition into high-impact roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &quot;The interactive course player with immediate assessment feedback completely changed how I learn.
                  I landed a Senior Full-Stack role within 3 months.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                  DK
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">David Kim</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Senior Engineer at FinTech Corp</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &quot;As an instructor, the Curriculum Studio makes structuring modules and grading assignments a
                  breeze. My students retain twice as much information.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center font-bold text-white text-xs">
                  ER
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Dr. Elena Rostova</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Staff Systems Architect &amp; Author</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &quot;The distributed systems masterclass is unmatched. It covered Kafka, microservices, and live
                  evaluation that mirror real enterprise production incidents.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-xs">
                  SL
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Sophia Liu</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Cloud Infrastructure Lead</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TRANSPARENT PRICING PLANS */}
      <section id="pricing" className="py-20 bg-slate-100/60 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
              Transparent Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Simple, Predictable Plans
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Start for free today, or unlock unrestricted access to all 120+ masterclasses and curriculum studios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Free Starter */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Free Tier</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ forever</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Great for exploring fundamentals and previewing tracks.</p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>Access to introductory courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>Interactive video player</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>Basic quiz evaluation</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("student-dashboard")}
                className="mt-8 w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Learner (Highlighted) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-indigo-50/90 to-white dark:from-indigo-950/80 dark:to-slate-950 border-2 border-indigo-500 flex flex-col justify-between relative shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                Most Popular
              </div>
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Pro All-Access</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$19</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-indigo-200">Full unrestricted access to every course, quiz, and studio.</p>
                <div className="pt-4 border-t border-indigo-200 dark:border-indigo-800/40 space-y-3 text-xs text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>All 120+ masterclasses unlocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Automated quizzes &amp; assignment reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Verified completion certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Instructor feedback on capstone code</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("catalog")}
                className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                Start Pro Membership
              </button>
            </div>

            {/* Enterprise Teams */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Enterprise Team</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$49</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ seat / mo</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">For engineering departments and university cohorts.</p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>Admin dashboard &amp; user governance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>Internal course authoring studio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>Team telemetry &amp; skill gradebooks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>Custom domain &amp; SSO integration</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  handleDemoSwitch("admin");
                  setActiveTab("admin-dashboard");
                }}
                className="mt-8 w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              >
                Explore Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION */}
      <section id="faq" className="py-20 md:py-28 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/40">
              Questions &amp; Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Have questions? We have answers. If you need anything else, feel free to contact us.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the Interactive Course Player work?",
                a: "The player syncs video playback with lesson syllabi, code snippets, and automated assessments. It tracks your progress in real-time, bookmarks lessons automatically, and allows speed adjustment up to 2x.",
              },
              {
                q: "Are the completion certificates verifiable by employers?",
                a: "Yes. When you complete 100% of the lessons in a published course and pass the required assessment quizzes, the system generates a verified digital certificate with unique hashes for your portfolio and LinkedIn.",
              },
              {
                q: "How is dashboard access controlled between roles?",
                a: "Each account role (Student, Instructor, Admin) has strictly isolated workspace permissions. Students cannot access course authoring or admin controls; instructors manage their own curriculum and reviews, and admins govern platform telemetry.",
              },
              {
                q: "How does assignment submission and grading work?",
                a: "Students can submit GitHub links and live URLs for assignments. Instructors access their Review Desk to examine the work, apply numerical scores, and write detailed feedback.",
              },
              {
                q: "Can I switch between Dark and Light mode anytime?",
                a: "Yes! Use the theme toggle button in the top navigation bar or sidebar to switch between sleek Obsidian Dark mode and crisp Modern Light mode.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 overflow-hidden transition shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white text-sm sm:text-base cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-300 transition"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      activeFaq === idx ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. HIGH-IMPACT BOTTOM CTA BANNER */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 border border-indigo-700/60 p-8 sm:p-14 text-center space-y-6 shadow-2xl overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              Accelerate Your Engineering Career
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
              Ready to Master Your Next Skill?
            </h2>

            <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto">
              Join 48,000+ developers, designers, and students already leveling up with Learner Enterprise LMS.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab("student-dashboard")}
                className="px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-white text-slate-950 hover:bg-slate-100 shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                Get Started Free
              </button>
              <button
                onClick={() => setActiveTab("course-player")}
                className="px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-indigo-950/80 hover:bg-indigo-900 text-white border border-indigo-400/40 transition cursor-pointer"
              >
                Try Interactive Player
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 13. RICH FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-slate-100/80 dark:bg-slate-950 pt-16 pb-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center text-white shadow-md">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Learner</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                Next-generation interactive learning platform with real-time course player, automated assessment
                engines, instructor curriculum studios, and verified certifications.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All Systems Operational &bull; RBAC Guard Active</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Learning Tracks</h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => setActiveTab("catalog")} className="hover:text-indigo-600 dark:hover:text-white transition">
                    Full-Stack Next.js 15
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("catalog")} className="hover:text-indigo-600 dark:hover:text-white transition">
                    Generative AI &amp; LLMs
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("catalog")} className="hover:text-indigo-600 dark:hover:text-white transition">
                    Cloud &amp; Distributed Systems
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("catalog")} className="hover:text-indigo-600 dark:hover:text-white transition">
                    DevOps &amp; Docker / K8s
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <button onClick={() => setActiveTab("course-player")} className="hover:text-indigo-600 dark:hover:text-white transition">
                    Interactive Player
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("quiz")} className="hover:text-indigo-600 dark:hover:text-white transition">
                    Assessment Engine
                  </button>
                </li>
                <li>
                  <button onClick={() => {
                    if (currentUser?.role === "student") handleDemoSwitch("instructor");
                    setActiveTab("instructor-studio");
                  }} className="hover:text-indigo-600 dark:hover:text-white transition">
                    Curriculum Studio
                  </button>
                </li>
                <li>
                  <button onClick={() => {
                    if (currentUser?.role !== "admin") handleDemoSwitch("admin");
                    setActiveTab("admin-dashboard");
                  }} className="hover:text-indigo-600 dark:hover:text-white transition">
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Stay Updated</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Get notified about new courses, features, and workshops.</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer shadow"
                >
                  Subscribe
                </button>
              </form>
              {newsletterSubscribed && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">✓ You are subscribed to updates!</p>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} Learner LMS Platform. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer">Cookie Settings</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
