"use client";

import React from "react";
import {
  BookOpen,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Shield,
  Layers,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";
import { User } from "../../lib/api";
import { useTheme } from "../../lib/theme";

interface TopNavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentUser: User | null;
  handleDemoSwitch: (role: "student" | "instructor" | "admin") => void;
  notifications: string[];
  handleLogout: () => void;
  onOpenAuth: () => void;
}

export default function TopNavbar({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  currentUser,
  handleDemoSwitch,
  notifications,
  handleLogout,
  onOpenAuth,
}: TopNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const currentRole = currentUser?.role || "student";

  return (
    <header className="border-b border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-6 py-2.5 transition-colors duration-200">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("landing")}
            className="flex items-center gap-2.5 hover:opacity-90 transition cursor-pointer text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Learner
              </span>
            </div>
          </button>
        </div>

        {/* Center: Strict Role-Gated Top Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("landing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "landing"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900/60"
            }`}
          >
            Home / Landing
          </button>

          {/* Student Tabs: ONLY for student role (User cannot access Admin Panel) */}
          {currentRole === "student" && (
            <>
              <button
                onClick={() => setActiveTab("student-dashboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "student-dashboard"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900/60"
                }`}
              >
                Student Portal
              </button>
              <button
                onClick={() => setActiveTab("course-player")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "course-player"
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900/60"
                }`}
              >
                Interactive Player
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "quiz"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900/60"
                }`}
              >
                Assessments
              </button>
              <button
                onClick={() => setActiveTab("catalog")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "catalog"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900/60"
                }`}
              >
                Course Catalog
              </button>
            </>
          )}

          {/* Instructor Tabs: ONLY for instructor role */}
          {currentRole === "instructor" && (
            <>
              <button
                onClick={() => setActiveTab("instructor-studio")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "instructor-studio"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900/60"
                }`}
              >
                Curriculum Studio
              </button>
              <button
                onClick={() => setActiveTab("instructor-reviews")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "instructor-reviews"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900/60"
                }`}
              >
                Reviews Desk
              </button>
              <button
                onClick={() => setActiveTab("catalog")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "catalog"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900/60"
                }`}
              >
                Course Catalog
              </button>
            </>
          )}

          {/* Admin Tabs: STRICTLY for Admin (Admin CANNOT access User role) */}
          {currentRole === "admin" && (
            <>
              <button
                onClick={() => setActiveTab("admin-dashboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "admin-dashboard"
                    ? "bg-amber-600 text-white shadow-sm font-bold"
                    : "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("catalog")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === "catalog"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900/60"
                }`}
              >
                Course Moderation
              </button>
            </>
          )}
        </div>

        {/* Right: Search, Persona Toggle, Theme Switcher, Notifications & Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search */}
          <div className="relative hidden xl:block w-44 2xl:w-56">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search lessons..."
              className="w-full bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Role Switcher Pill — switch between Student / Instructor / Admin views */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-950/70 p-0.5 border border-slate-200 dark:border-slate-800 text-[11px] font-bold gap-0.5">
            <button
              onClick={() => handleDemoSwitch("student")}
              title="Switch to Student Role"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                currentRole === "student"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-900"
              }`}
            >
              <LayoutDashboard className="h-3 w-3" />
              <span className="hidden sm:inline">Student</span>
            </button>
            <button
              onClick={() => handleDemoSwitch("instructor")}
              title="Switch to Instructor Role"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                currentRole === "instructor"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-200 dark:hover:bg-slate-900"
              }`}
            >
              <Layers className="h-3 w-3" />
              <span className="hidden sm:inline">Instructor</span>
            </button>
            <button
              onClick={() => handleDemoSwitch("admin")}
              title="Switch to Admin Role"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                currentRole === "admin"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-900"
              }`}
            >
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => alert(`Notifications:\n• ${notifications.join("\n• ")}`)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>
          </div>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow">
                  {currentUser.name ? currentUser.name.charAt(0) : "U"}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline-block max-w-[90px] truncate">
                  {currentUser.name || "User"}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
