"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { api, User, Course, Enrollment } from "../../lib/api";
import VideoPlayer from "./VideoPlayer";
import LessonContentTabs from "./LessonContentTabs";
import SyllabusSidebar from "./SyllabusSidebar";

interface InteractiveCoursePlayerProps {
  currentUser?: User | null;
  onNavigateTab?: (tab: any) => void;
  onToggleCompletion?: () => void;
  onOpenAuth?: () => void;
  /** Pass a specific course to play; if omitted, loads the featured CS-702 course */
  course?: Course | null;
}

export default function InteractiveCoursePlayer({
  currentUser,
  onNavigateTab = () => {},
  onToggleCompletion,
  onOpenAuth,
  course: propCourse,
}: InteractiveCoursePlayerProps = {}) {
  const [course, setCourse] = useState<Course | null>(propCourse || null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeModuleIdx, setActiveModuleIdx] = useState<number>(3); // default Module 4
  const [activeLessonIdx, setActiveLessonIdx] = useState<number>(2); // default Lesson 4.3
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggling, setToggling] = useState<boolean>(false);

  // Fetch featured course from DB (CS-702 distributed systems)
  useEffect(() => {
    if (propCourse) {
      setCourse(propCourse);
      return;
    }
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const res = await api.getCourses("Architecture", "", "Advanced");
        // Pick the distributed systems course (CS-702)
        const featured =
          res.courses.find((c) =>
            c.title.toLowerCase().includes("distributed") ||
            c.slug.includes("distributed") ||
            c.slug.includes("cs-702")
          ) || res.courses[0];
        if (featured) setCourse(featured);
      } catch {
        // Silently use fallback static content if API unavailable
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [propCourse]);

  // Fetch enrollment for this course when user is logged in
  useEffect(() => {
    if (!currentUser || !course) return;
    api
      .getMyEnrollments()
      .then((res) => {
        const enr = res.enrollments.find((e) => e.course._id === course._id);
        if (enr) setEnrollment(enr);
      })
      .catch(() => {});
  }, [currentUser, course?._id]);

  const activeModule = course?.modules[activeModuleIdx];
  const activeLesson = activeModule?.lessons[activeLessonIdx];

  const isLessonCompleted =
    enrollment?.completedLessons?.includes(activeLesson?._id || "") ?? false;

  const totalLessons = course?.modules.reduce((s, m) => s + m.lessons.length, 0) || 0;
  const completedCount = enrollment?.completedLessons?.length || 0;
  const progressPct = enrollment?.progressPercentage ?? 0;

  const handleToggleLesson = async () => {
    if (!currentUser || !course || !activeLesson?._id) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    setToggling(true);
    try {
      const res = await api.toggleLesson(course._id, activeLesson._id);
      setEnrollment((prev) =>
        prev
          ? { ...prev, completedLessons: res.completedLessons, progressPercentage: res.progressPercentage }
          : prev
      );
      if (onToggleCompletion) onToggleCompletion();
    } catch {}
    setToggling(false);
  };

  const handleNextLesson = () => {
    if (!course) return;
    const mod = course.modules[activeModuleIdx];
    if (mod && activeLessonIdx < mod.lessons.length - 1) {
      setActiveLessonIdx((i) => i + 1);
    } else if (activeModuleIdx < course.modules.length - 1) {
      setActiveModuleIdx((i) => i + 1);
      setActiveLessonIdx(0);
    } else {
      onNavigateTab("quiz");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-32 gap-3 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm font-medium">Loading course from database…</span>
      </div>
    );
  }

  const courseTitle = course?.title ?? "CS-702: Advanced Distributed Systems & Event Streaming";
  const moduleName = activeModule?.title ?? "Module 4: High-Throughput Partitioning & Replication";
  const lessonTitle = activeLesson?.title ?? "Lesson 4.3: Kafka Partitions, Consumer Groups & High-Throughput Replication";
  const lessonDuration = activeLesson?.duration ?? "18 min";
  const lessonContent = activeLesson?.content ?? "";
  const lessonResources = activeLesson?.resources ?? [];
  const lessonVideo = activeLesson?.videoUrl ?? "";
  const instructorName = course?.instructorName ?? "Dr. Elena Rostova";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. BREADCRUMBS & LESSON HEADER ROW */}
      <div className="flex flex-col gap-3">
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400 overflow-x-auto">
          <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">
            {course?.category ?? "Architecture"}
          </span>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => onNavigateTab("catalog")}
            className="text-slate-400 hover:text-slate-200 cursor-pointer truncate max-w-[160px]"
          >
            {courseTitle.length > 30 ? courseTitle.slice(0, 30) + "…" : courseTitle}
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 truncate max-w-[140px]">
            {activeModule ? `MODULE ${activeModuleIdx + 1}` : "MODULE 4"}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-bold truncate max-w-[120px]">
            {activeLesson ? `LESSON ${activeModuleIdx + 1}.${activeLessonIdx + 1}` : "4.3"}
          </span>
        </div>

        {/* Title & Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pt-1">
          <div className="space-y-2 flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {lessonTitle}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                HIGH PRIORITY
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{lessonDuration} runtime</span>
              </div>
              {progressPct > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{completedCount} / {totalLessons} lessons • {progressPct}% complete</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab("catalog")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Catalog</span>
            </button>

            {/* Auto-advance switch */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <button
                onClick={() => setAutoAdvance(!autoAdvance)}
                className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                  autoAdvance ? "bg-indigo-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all duration-200 ${
                    autoAdvance ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </button>
              <span className="text-slate-300 font-medium">Auto-advance</span>
            </div>

            {/* Mark as complete */}
            <button
              onClick={handleToggleLesson}
              disabled={toggling}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-lg cursor-pointer disabled:opacity-60 ${
                isLessonCompleted
                  ? "bg-emerald-700 text-emerald-100 border border-emerald-600 shadow-emerald-900/30"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25"
              }`}
            >
              {toggling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span>{isLessonCompleted ? "Lesson Completed ✓" : "Mark Lesson as Complete"}</span>
            </button>

            {/* Next lesson */}
            <button
              onClick={handleNextLesson}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              <span>Next Lesson</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN VIEW */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: VIDEO PLAYER + CONTENT TABS */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <VideoPlayer videoUrl={lessonVideo} lessonTitle={lessonTitle} />
          <LessonContentTabs
            lessonContent={lessonContent}
            lessonResources={lessonResources}
            courseId={course?._id}
            lessonTitle={lessonTitle}
          />
        </div>

        {/* RIGHT COLUMN: CURRICULUM SYLLABUS */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <SyllabusSidebar
            course={course}
            enrollment={enrollment}
            activeModuleIdx={activeModuleIdx}
            activeLessonIdx={activeLessonIdx}
            onSelectLesson={(modIdx, lesIdx) => {
              setActiveModuleIdx(modIdx);
              setActiveLessonIdx(lesIdx);
            }}
            onNavigateTab={onNavigateTab}
            instructorName={instructorName}
          />
        </div>
      </div>
    </div>
  );
}
