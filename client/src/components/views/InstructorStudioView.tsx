"use client";

import React from "react";

interface InstructorStudioViewProps {
  newCourse: {
    title: string;
    description: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    price: number;
    duration: string;
    learningObjectives: string;
    moduleTitle: string;
    lessonTitle: string;
    lessonDuration: string;
    lessonContent: string;
    quizTitle: string;
    quizQuestion: string;
    quizOptions: string[];
    quizAnswerIndex: number;
    assignmentTitle: string;
    assignmentInstructions: string;
  };
  setNewCourse: React.Dispatch<React.SetStateAction<any>>;
  handleCreateCourse: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function InstructorStudioView({
  newCourse,
  setNewCourse,
  handleCreateCourse,
  isLoading,
}: InstructorStudioViewProps) {
  return (
    <div className="max-w-3xl mx-auto w-full bg-white dark:bg-slate-900/95 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm transition-colors duration-200">
      <div>
        <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-violet-400">
          Instructor Studio (FR-04)
        </span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create &amp; Publish a Full Course</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Compose multi-module courses with embedded lessons, quizzes, and assignments.
        </p>
      </div>

      <form onSubmit={handleCreateCourse} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Course Title</label>
            <input
              type="text"
              required
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              placeholder="e.g., Advanced Microservices with Docker"
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Category</label>
            <input
              type="text"
              required
              value={newCourse.category}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
              placeholder="e.g., Development, Cloud"
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Difficulty Level</label>
            <select
              value={newCourse.difficulty}
              onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value as any })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Price ($)</label>
            <input
              type="number"
              value={newCourse.price}
              onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Duration</label>
            <input
              type="text"
              value={newCourse.duration}
              onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Course Description</label>
          <textarea
            required
            rows={2}
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            placeholder="Outline course scope, target students, and key learning outcomes..."
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Module & Lesson Authoring */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Module &amp; Lesson Definition</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newCourse.moduleTitle}
              onChange={(e) => setNewCourse({ ...newCourse, moduleTitle: e.target.value })}
              placeholder="Module Title"
              className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <input
              type="text"
              value={newCourse.lessonTitle}
              onChange={(e) => setNewCourse({ ...newCourse, lessonTitle: e.target.value })}
              placeholder="Lesson Title"
              className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
          <textarea
            rows={2}
            value={newCourse.lessonContent}
            onChange={(e) => setNewCourse({ ...newCourse, lessonContent: e.target.value })}
            placeholder="Lesson instructions and text content..."
            className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Embedded Assessment Quiz Authoring */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Embedded Quiz Definition</h4>
          <input
            type="text"
            value={newCourse.quizTitle}
            onChange={(e) => setNewCourse({ ...newCourse, quizTitle: e.target.value })}
            placeholder="Quiz Title"
            className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
          <input
            type="text"
            value={newCourse.quizQuestion}
            onChange={(e) => setNewCourse({ ...newCourse, quizQuestion: e.target.value })}
            placeholder="Multiple-choice question text"
            className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Embedded Assignment Authoring */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Embedded Assignment Milestone</h4>
          <input
            type="text"
            value={newCourse.assignmentTitle}
            onChange={(e) => setNewCourse({ ...newCourse, assignmentTitle: e.target.value })}
            placeholder="Assignment Title"
            className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
          <textarea
            rows={2}
            value={newCourse.assignmentInstructions}
            onChange={(e) => setNewCourse({ ...newCourse, assignmentInstructions: e.target.value })}
            placeholder="Submission instructions, rubric, and GitHub submission requirements..."
            className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/20 cursor-pointer"
        >
          Publish Full Course with Curriculum
        </button>
      </form>
    </div>
  );
}
