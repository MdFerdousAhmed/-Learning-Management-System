"use client";

import React from "react";
import {
  Award,
  Code2,
} from "lucide-react";
import { Submission } from "../../lib/api";

interface SubmissionsViewProps {
  submissions: Submission[];
}

export default function SubmissionsView({ submissions }: SubmissionsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Assessment Results &amp; Feedback</h2>
        <p className="text-xs text-slate-400">
          Automated quiz evaluations and reviewed assignment scores.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <Award className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-medium text-white">No submissions recorded yet</h3>
          <p className="text-xs text-slate-400">
            Complete quizzes or submit assignments within your enrolled courses to see grades.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map((sub) => (
            <div
              key={sub._id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400">
                  {sub.type}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{sub.targetTitle}</h3>

              <div className="flex items-center gap-4 text-xs">
                <div className="font-semibold text-emerald-400">
                  Score: {sub.score} / {sub.totalPoints} ({sub.percentage}%)
                </div>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full ${
                    sub.passingStatus === "Passed"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {sub.passingStatus || sub.status}
                </span>
              </div>

              {sub.githubUrl && (
                <div className="text-xs flex items-center gap-1.5 text-indigo-300">
                  <Code2 className="h-3.5 w-3.5" />
                  <a
                    href={sub.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline truncate"
                  >
                    {sub.githubUrl}
                  </a>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                <span className="font-semibold text-indigo-300">Feedback: </span>
                {sub.feedback}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
