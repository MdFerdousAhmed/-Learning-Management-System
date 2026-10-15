"use client";

import React from "react";
import { Users, BookOpen, Trash2, Shield } from "lucide-react";
import { PlatformStats, User, Course } from "../../lib/api";

interface AdminDashboardViewProps {
  adminStats: PlatformStats | null;
  adminUsers: User[];
  courses: Course[];
  handleUpdateUserRole: (userId: string, newRole: string) => void;
  handleDeleteUser: (userId: string) => void;
  handleCourseStatusToggle: (courseId: string, newStatus: string) => void;
}

export default function AdminDashboardView({
  adminStats,
  adminUsers,
  courses,
  handleUpdateUserRole,
  handleDeleteUser,
  handleCourseStatusToggle,
}: AdminDashboardViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-500" />
          <span>Platform Administration &amp; Control Tower</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          System-level telemetry, RBAC delegation, and course catalog moderation.
        </p>
      </div>

      {/* Admin Platform Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-medium">Total Users</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{adminStats?.totalUsers || 0}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-medium">Students</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{adminStats?.totalStudents || 0}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-medium">Instructors</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-violet-400">{adminStats?.totalInstructors || 0}</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-medium">Total Enrollments</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{adminStats?.totalEnrollments || 0}</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="h-4 w-4 text-amber-500" />
          <span>User Directory &amp; Role Delegation (RBAC)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {adminUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-medium text-slate-900 dark:text-white">{u.name}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateUserRole(u._id!, e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-900 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id!)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition cursor-pointer"
                      title="Delete User"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Moderation Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-amber-500" />
          <span>Course Moderation &amp; Status</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Course Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Students</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {courses.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-medium text-slate-900 dark:text-white">{c.title}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{c.category}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{c.enrolledStudentsCount || 0}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.status === "Published"
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400"
                          : c.status === "Draft"
                          ? "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {c.status || "Published"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={c.status || "Published"}
                      onChange={(e) => handleCourseStatusToggle(c._id, e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-900 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
