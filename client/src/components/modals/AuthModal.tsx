"use client";

import React from "react";

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  authForm: {
    name: string;
    email: string;
    password: string;
    role: "student" | "instructor" | "admin";
  };
  setAuthForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      password: string;
      role: "student" | "instructor" | "admin";
    }>
  >;
  handleAuthSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function AuthModal({
  show,
  onClose,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  handleAuthSubmit,
  isLoading,
}: AuthModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl transition-colors duration-200">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {authMode === "login" ? "Sign In to Learner LMS" : "Create LMS Account"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-3.5">
          {authMode === "register" && (
            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Email Address</label>
            <input
              type="email"
              required
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Password</label>
            <input
              type="password"
              required
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {authMode === "register" && (
            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Account Role (RBAC)</label>
              <select
                value={authForm.role}
                onChange={(e) =>
                  setAuthForm({
                    ...authForm,
                    role: e.target.value as "student" | "instructor" | "admin",
                  })
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer shadow-md"
          >
            {isLoading ? "Processing..." : authMode === "login" ? "Sign In" : "Register Account"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          {authMode === "login" ? (
            <span>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setAuthMode("register")}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button
                onClick={() => setAuthMode("login")}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
