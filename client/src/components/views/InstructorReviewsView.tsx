"use client";

import React from "react";
import {
  Layers,
  Code2,
  ExternalLink,
} from "lucide-react";
import { Submission } from "../../lib/api";

interface InstructorReviewsViewProps {
  instructorSubmissions: Submission[];
  reviewingSubmissionId: string | null;
  setReviewingSubmissionId: (id: string | null) => void;
  reviewScore: number;
  setReviewScore: (score: number) => void;
  reviewFeedback: string;
  setReviewFeedback: (feedback: string) => void;
  handleReviewSubmission: (submissionId: string) => void;
}

export default function InstructorReviewsView({
  instructorSubmissions,
  reviewingSubmissionId,
  setReviewingSubmissionId,
  reviewScore,
  setReviewScore,
  reviewFeedback,
  setReviewFeedback,
  handleReviewSubmission,
}: InstructorReviewsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Submission Reviews</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Grade student assignment projects and provide tailored qualitative feedback.
        </p>
      </div>

      {instructorSubmissions.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
          <Layers className="h-10 w-10 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-medium text-slate-900 dark:text-white">No pending submissions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            When enrolled students submit assignments, they will appear here for grading.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {instructorSubmissions.map((sub) => (
            <div
              key={sub._id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-violet-400">
                    {sub.type} Submission
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{sub.targetTitle}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Student: {sub.student?.name || "Student"} ({sub.student?.email}) •{" "}
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    sub.status === "Reviewed"
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400"
                      : "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400"
                  }`}
                >
                  Status: {sub.status}
                </span>
              </div>

              {/* Student Answers / Links */}
              <div className="space-y-2 text-xs">
                {sub.githubUrl && (
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-slate-400" />
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>{sub.githubUrl}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {sub.liveUrl && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <a
                      href={sub.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>Live Deployment: {sub.liveUrl}</span>
                    </a>
                  </div>
                )}

                {sub.submissionText && (
                  <p className="text-slate-700 dark:text-slate-300 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    {sub.submissionText}
                  </p>
                )}
              </div>

              {/* Grading & Review Form */}
              {reviewingSubmissionId === sub._id ? (
                <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-slate-950/80 border border-purple-200 dark:border-violet-800/40 space-y-3">
                  <h4 className="text-xs font-bold text-purple-900 dark:text-violet-300">
                    Enter Marks &amp; Qualitative Feedback (FR-12)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-600 dark:text-slate-400">
                        Score (out of {sub.totalPoints})
                      </label>
                      <input
                        type="number"
                        value={reviewScore}
                        onChange={(e) => setReviewScore(Number(e.target.value))}
                        className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-slate-600 dark:text-slate-400">Instructor Feedback</label>
                      <input
                        type="text"
                        value={reviewFeedback}
                        onChange={(e) => setReviewFeedback(e.target.value)}
                        className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setReviewingSubmissionId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReviewSubmission(sub._id)}
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      Submit Grade &amp; Feedback
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Current Score: <span className="font-bold text-slate-900 dark:text-white">{sub.score}</span> /{" "}
                    {sub.totalPoints}
                  </div>
                  <button
                    onClick={() => {
                      setReviewingSubmissionId(sub._id);
                      setReviewScore(sub.score || 85);
                      setReviewFeedback(sub.feedback || "Good job on completing the requirements!");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-violet-600/20 hover:bg-purple-600 hover:text-white text-purple-700 dark:text-violet-300 border border-purple-200 dark:border-violet-500/30 text-xs font-medium transition cursor-pointer"
                  >
                    Grade / Review Submission
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
