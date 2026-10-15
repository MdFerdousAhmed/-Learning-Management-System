"use client";

import React from "react";
import {
  Clock,
  Award,
  HelpCircle,
} from "lucide-react";
import { Course } from "../../lib/api";

interface QuizEngineViewProps {
  selectedCourse: Course | null;
  courses: Course[];
  activeQuizIndex: number;
  quizResult: {
    score: number;
    totalPoints: number;
    percentage: number;
    passingStatus: string;
    feedback: string;
  } | null;
  quizAnswers: { [qIdx: number]: number };
  setQuizAnswers: React.Dispatch<React.SetStateAction<{ [qIdx: number]: number }>>;
  setQuizResult: (res: any) => void;
  handleSubmitQuiz: () => void;
  isLoading: boolean;
  setActiveTab: (tab: any) => void;
  setSelectedCourse: (course: Course) => void;
}

export default function QuizEngineView({
  selectedCourse,
  courses,
  activeQuizIndex,
  quizResult,
  quizAnswers,
  setQuizAnswers,
  setQuizResult,
  handleSubmitQuiz,
  isLoading,
  setActiveTab,
  setSelectedCourse,
}: QuizEngineViewProps) {
  // Fallback to first course if selectedCourse is null
  const currentCourse = selectedCourse || courses[0] || null;

  if (!currentCourse || !currentCourse.quizzes || currentCourse.quizzes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto w-full p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
        <HelpCircle className="h-10 w-10 text-slate-600 mx-auto" />
        <h3 className="text-base font-semibold text-white">No active quiz selected</h3>
        <p className="text-xs text-slate-400">
          Please select a course from the catalog to take its evaluation quizzes.
        </p>
        <button
          onClick={() => setActiveTab("catalog")}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow cursor-pointer"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  const currentQuiz = currentCourse.quizzes[activeQuizIndex] || currentCourse.quizzes[0];

  return (
    <div className="max-w-3xl mx-auto w-full bg-slate-900/95 rounded-2xl border border-slate-800 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-400">
            Assessment Engine (FR-11)
          </span>
          <h2 className="text-xl font-bold text-white">
            {currentQuiz.title || "Course Quiz"}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          <span>
            Limit: {currentQuiz.timeLimitMinutes || 15} mins • Passing:{" "}
            {currentQuiz.passingScore || 70}%
          </span>
        </div>
      </div>

      {/* Quiz Result View */}
      {quizResult ? (
        <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-4">
          <div
            className={`h-16 w-16 mx-auto rounded-full flex items-center justify-center ${
              quizResult.passingStatus === "Passed"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
            }`}
          >
            <Award className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{quizResult.percentage}% Score</h3>
            <div
              className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                quizResult.passingStatus === "Passed"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              Status: {quizResult.passingStatus}
            </div>
            <p className="text-sm text-slate-300 mt-2">
              Score: {quizResult.score} / {quizResult.totalPoints} points
            </p>
            <p className="text-xs text-indigo-300 mt-2 font-medium">{quizResult.feedback}</p>
          </div>
          <div className="flex justify-center gap-3 pt-3">
            <button
              onClick={() => {
                setQuizResult(null);
                setQuizAnswers({});
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition cursor-pointer"
            >
              View All Grades &amp; Feedback
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {currentQuiz.questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3"
            >
              <div className="flex justify-between items-start text-xs text-slate-400">
                <span className="font-semibold text-indigo-400">Question {qIdx + 1}</span>
                <span>{q.points} Points</span>
              </div>
              <p className="text-sm font-medium text-white">{q.questionText}</p>

              <div className="grid grid-cols-1 gap-2 pt-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = quizAnswers[qIdx] === oIdx;
                  return (
                    <div
                      key={oIdx}
                      onClick={() =>
                        setQuizAnswers((prev) => ({
                          ...prev,
                          [qIdx]: oIdx,
                        }))
                      }
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 text-white font-medium"
                          : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-indigo-500 bg-indigo-600" : "border-slate-600"
                        }`}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmitQuiz}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            Submit Quiz for Automated Evaluation (FR-11)
          </button>
        </div>
      )}
    </div>
  );
}
