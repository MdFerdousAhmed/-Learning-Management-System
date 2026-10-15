"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Lock,
  HelpCircle,
  FileText,
  PlayCircle,
  BookOpen,
} from "lucide-react";
import { Course, Enrollment } from "../../lib/api";

interface SyllabusSidebarProps {
  course?: Course | null;
  enrollment?: Enrollment | null;
  activeModuleIdx?: number;
  activeLessonIdx?: number;
  onSelectLesson?: (moduleIdx: number, lessonIdx: number) => void;
  onNavigateTab: (tab: any) => void;
  instructorName?: string;
}

export default function SyllabusSidebar({
  course,
  enrollment,
  activeModuleIdx = 3,
  activeLessonIdx = 2,
  onSelectLesson,
  onNavigateTab,
  instructorName,
}: SyllabusSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<{ [idx: number]: boolean }>(() => {
    const defaults: { [idx: number]: boolean } = {};
    defaults[activeModuleIdx] = true;
    return defaults;
  });

  const toggleModule = (idx: number) => {
    setExpandedModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isLessonCompleted = (lessonId?: string): boolean =>
    !!lessonId && (enrollment?.completedLessons?.includes(lessonId) ?? false);

  const totalLessons = course?.modules.reduce((s, m) => s + m.lessons.length, 0) || 0;
  const completedCount = enrollment?.completedLessons?.length || 0;
  const progressPct = enrollment?.progressPercentage ?? 0;

  const displayName = instructorName ?? "Dr. Elena Rostova";
  const initials = displayName
    .split(" ")
    .filter((w) => w.length > 1 && w[0] === w[0].toUpperCase())
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="flex flex-col gap-6">
      {/* CURRICULUM PROGRESS CARD */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            CURRICULUM PROGRESS
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
              progressPct >= 80
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : progressPct >= 40
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                : "bg-slate-700/60 text-slate-400 border-slate-600"
            }`}
          >
            {progressPct}%
          </span>
        </div>

        <div className="text-lg font-bold text-white truncate">
          {course?.title || "Course Progress"}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <p className="text-xs text-slate-400">
          {completedCount} of {totalLessons} items complete
          {enrollment?.status && (
            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-600/20 text-indigo-300 border border-indigo-500/25">
              {enrollment.status}
            </span>
          )}
        </p>
      </div>

      {/* SYLLABUS ACCORDION */}
      <div className="space-y-3">
        {course && course.modules.length > 0 ? (
          course.modules.map((mod, modIdx) => {
            const isActive = modIdx === activeModuleIdx;
            const isExpanded = expandedModules[modIdx] ?? isActive;
            const modLessons = mod.lessons;
            const completedInModule = modLessons.filter((l) => isLessonCompleted(l._id)).length;
            const isModuleCompleted = completedInModule === modLessons.length && modLessons.length > 0;

            return (
              <div
                key={mod._id || modIdx}
                className={`rounded-xl border overflow-hidden ${
                  isActive
                    ? "bg-slate-900 border-2 border-indigo-500/50 shadow-lg shadow-indigo-950/40"
                    : isModuleCompleted
                    ? "bg-slate-900/80 border-slate-700/60"
                    : "bg-slate-900/60 border-slate-800/60"
                }`}
              >
                <button
                  onClick={() => toggleModule(modIdx)}
                  className={`w-full p-3.5 flex items-center justify-between text-left transition cursor-pointer ${
                    isActive
                      ? "bg-indigo-950/40 border-b border-indigo-900/40"
                      : "hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isModuleCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : isActive ? (
                      <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {modIdx + 1}
                      </div>
                    ) : (
                      <BookOpen className="h-4 w-4 text-slate-500 shrink-0" />
                    )}
                    <div>
                      <div
                        className={`text-[10px] uppercase font-bold ${
                          isActive
                            ? "text-indigo-300"
                            : isModuleCompleted
                            ? "text-emerald-500"
                            : "text-slate-500"
                        }`}
                      >
                        MODULE {modIdx + 1}
                        {isModuleCompleted
                          ? " • COMPLETED"
                          : isActive
                          ? ` • ${completedInModule}/${modLessons.length} COMPLETED`
                          : completedInModule > 0
                          ? ` • ${completedInModule}/${modLessons.length}`
                          : ""}
                      </div>
                      <div
                        className={`text-xs font-semibold ${
                          isActive ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {mod.title}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    } ${isActive ? "text-indigo-300" : "text-slate-400"}`}
                  />
                </button>

                {isExpanded && (
                  <div className="p-2 space-y-1 bg-slate-950/60 text-xs">
                    {mod.lessons.map((lesson, lesIdx) => {
                      const isCurrentLesson = modIdx === activeModuleIdx && lesIdx === activeLessonIdx;
                      const lessonDone = isLessonCompleted(lesson._id);

                      return (
                        <div
                          key={lesson._id || lesIdx}
                          onClick={() => onSelectLesson && onSelectLesson(modIdx, lesIdx)}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                            isCurrentLesson
                              ? "bg-indigo-600/25 border border-indigo-500/40 text-white font-medium shadow-sm"
                              : lessonDone
                              ? "hover:bg-slate-800/60 text-slate-300"
                              : "hover:bg-slate-800/60 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isCurrentLesson ? (
                              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-ping shrink-0" />
                            ) : lessonDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <PlayCircle className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {lesson.duration && (
                              <span className="text-[11px] text-slate-500">{lesson.duration}</span>
                            )}
                            {isCurrentLesson && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-500/30 text-indigo-300">
                                PLAYING
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Quiz navigation button for active module */}
                    {isActive && course.quizzes && course.quizzes.length > 0 && (
                      <div
                        onClick={() => onNavigateTab("quiz")}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/60 text-slate-300 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
                          <span className="text-amber-300 font-medium">
                            Quiz: {course.quizzes[0].title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {course.quizzes[0].questions.length} Questions
                        </span>
                      </div>
                    )}

                    {/* Assignment navigation button for active module */}
                    {isActive && course.assignments && course.assignments.length > 0 && (
                      <div
                        onClick={() => onNavigateTab("submissions")}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/60 text-slate-300 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-indigo-400" />
                          <span className="text-slate-300">
                            {course.assignments[0].title}
                          </span>
                        </div>
                        {course.assignments[0].deadline && (
                          <span className="text-[10px] text-slate-500">
                            Due {new Date(course.assignments[0].deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // Fallback static content when course not loaded
          <>
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 flex items-center gap-3 animate-pulse">
                <div className="h-4 w-4 rounded-full bg-slate-700" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 w-20 bg-slate-700 rounded" />
                  <div className="h-3 w-36 bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* INSTRUCTOR CARD */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 shrink-0">
            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-white">
              {initials || "ER"}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{displayName}</h4>
            <p className="text-[11px] text-slate-400">Lead Author • Course Instructor</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
          &ldquo;Pay close attention to the replication diagrams — you&apos;ll implement the exact
          partition failover configuration in the lab assignment!&rdquo;
        </div>
      </div>
    </div>
  );
}
