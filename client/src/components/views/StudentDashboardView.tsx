"use client";

import React from "react";
import {
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { Enrollment, Course } from "../../lib/api";

interface StudentDashboardViewProps {
  enrollments: Enrollment[];
  setActiveTab: (tab: any) => void;
  setSelectedCourse: (course: Course) => void;
}

export default function StudentDashboardView({
  enrollments,
  setActiveTab,
  setSelectedCourse,
}: StudentDashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Enrolled Courses
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{enrollments.length}</div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">Active curriculums</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Completed Courses
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {enrollments.filter((e) => e.progressPercentage === 100).length}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">100% completion verified</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Courses In Progress
          </div>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {enrollments.filter((e) => e.progressPercentage > 0 && e.progressPercentage < 100).length}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">Ongoing learning</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Average Progress
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {enrollments.length > 0
              ? Math.round(
                  enrollments.reduce((acc, curr) => acc + curr.progressPercentage, 0) /
                    enrollments.length
                )
              : 0}
            %
          </div>
          <div className="text-xs text-cyan-600 dark:text-cyan-400 mt-2">Computed in real time</div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span>My Courses &amp; Progression</span>
          </h2>
          <button
            onClick={() => setActiveTab("catalog")}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
          >
            Browse Course Catalog &rarr;
          </button>
        </div>

        {enrollments.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
            <BookOpen className="h-10 w-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">No courses enrolled yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Explore our course catalog to start learning. You can enroll in 1 click!
              </p>
            </div>
            <button
              onClick={() => setActiveTab("catalog")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow cursor-pointer"
            >
              Browse Course Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((enr) => (
              <div
                key={enr._id}
                className="group rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition overflow-hidden flex flex-col shadow-sm"
              >
                <div className="h-36 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {enr.course.thumbnail ? (
                    <img
                      src={enr.course.thumbnail}
                      alt={enr.course.title}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : null}
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center -z-10 absolute inset-0">
                    <BookOpen className="h-10 w-10 text-slate-400 dark:text-slate-600" />
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur text-white border border-slate-700">
                    {enr.course.difficulty || "Beginner"}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                      {enr.course.category}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug line-clamp-1">
                      {enr.course.title}
                    </h3>
                  </div>

                  {/* Progression Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Completion Status</span>
                      <span className="font-bold text-slate-900 dark:text-white">{enr.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
                        style={{ width: `${enr.progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-500">
                      <span>{enr.completedLessons.length} lessons finished</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {enr.progressPercentage === 100
                          ? "Completed"
                          : enr.progressPercentage > 0
                          ? "In Progress"
                          : "Not Started"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourse(enr.course);
                      setActiveTab("course-player");
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white border border-indigo-200 dark:border-indigo-500/30 hover:border-transparent text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Resume Learning</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
