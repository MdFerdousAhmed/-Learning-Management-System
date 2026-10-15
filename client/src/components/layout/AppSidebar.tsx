"use client";

import React from "react";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  BarChart3,
  Calendar,
  Layers,
  Shield,
  FileCheck,
  Sun,
  Moon,
} from "lucide-react";
import { User } from "../../lib/api";
import { useTheme } from "../../lib/theme";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentUser: User | null;
  onStatusMessage: (msg: string) => void;
}

export default function AppSidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onStatusMessage,
}: AppSidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const currentRole = currentUser?.role || "student";

  return (
    <aside className="w-56 xl:w-60 shrink-0 bg-white/95 dark:bg-slate-950/90 border-r border-slate-200 dark:border-slate-800/80 p-4 flex flex-col justify-between hidden lg:flex transition-colors duration-200">
      <div className="space-y-6">
        {/* WORKSPACE NAVIGATION */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 px-3 py-1">
            {currentRole === "admin"
              ? "ADMIN PORTAL"
              : currentRole === "instructor"
              ? "INSTRUCTOR DESK"
              : "USER WORKSPACE"}
          </div>
          
          <button
            onClick={() => setActiveTab("landing")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "landing"
                ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home &amp; Landing</span>
          </button>

          {/* USER (STUDENT) ONLY: Admin CANNOT access student user role */}
          {currentRole === "student" && (
            <>
              <button
                onClick={() => setActiveTab("student-dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === "student-dashboard"
                    ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Student Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("quiz")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === "quiz"
                    ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Assessments &amp; Quizzes</span>
              </button>

              <button
                onClick={() => setActiveTab("submissions")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === "submissions"
                    ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>My Submissions</span>
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab("catalog")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "catalog"
                ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>{currentRole === "admin" ? "Course Moderation" : "Course Catalog"}</span>
          </button>

          {currentRole === "student" && (
            <button
              onClick={() => onStatusMessage("Schedule updated: 2 modules pending for this week.")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule &amp; Deadlines</span>
            </button>
          )}
        </div>

        {/* INSTRUCTOR AUTHORING: STRICTLY FOR INSTRUCTORS ONLY */}
        {currentRole === "instructor" && (
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400 px-3 py-1">
              CURRICULUM STUDIO
            </div>
            <button
              onClick={() => setActiveTab("instructor-studio")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "instructor-studio"
                  ? "bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-purple-500" />
                <span>Course Builder</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                STUDIO
              </span>
            </button>

            <button
              onClick={() => setActiveTab("instructor-reviews")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "instructor-reviews"
                  ? "bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <FileCheck className="h-4 w-4 text-purple-500" />
              <span>Review Submissions</span>
            </button>
          </div>
        )}

        {/* ADMINISTRATION: STRICTLY FOR ADMINS ONLY (Users cannot access Admin Panel) */}
        {currentRole === "admin" && (
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 px-3 py-1">
              ADMINISTRATION
            </div>
            <button
              onClick={() => setActiveTab("admin-dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "admin-dashboard"
                  ? "bg-amber-50 dark:bg-amber-600/20 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <Shield className="h-4 w-4 text-amber-500" />
              <span>Dashboard</span>
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM PINNED TELEMETRY & THEME TOGGLE BOX */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
        {/* Role & Telemetry card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/90 text-xs space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Active Role</span>
            <span
              className={`font-bold text-[10px] uppercase px-1.5 py-0.5 rounded ${
                currentRole === "admin"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : currentRole === "instructor"
                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                  : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              }`}
            >
              {currentRole === "student" ? "USER (STUDENT)" : currentRole}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Access Guard</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Strict RBAC</span>
          </div>
        </div>

        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="h-3.5 w-3.5 text-indigo-400" />
            ) : (
              <Sun className="h-3.5 w-3.5 text-amber-500" />
            )}
            <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Toggle</span>
        </button>
      </div>
    </aside>
  );
}
