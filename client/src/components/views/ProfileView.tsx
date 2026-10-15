"use client";

import React from "react";
import { User as UserIcon } from "lucide-react";
import { User } from "../../lib/api";

interface ProfileViewProps {
  currentUser: User | null;
  profileForm: {
    name: string;
    bio: string;
    phone: string;
    skills: string;
  };
  setProfileForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      bio: string;
      phone: string;
      skills: string;
    }>
  >;
  handleSaveProfile: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function ProfileView({
  currentUser,
  profileForm,
  setProfileForm,
  handleSaveProfile,
  isLoading,
}: ProfileViewProps) {
  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto w-full bg-slate-900/95 rounded-2xl border border-slate-800 p-6 space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <div className="h-16 w-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
          <UserIcon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
          <div className="text-xs text-indigo-400 capitalize font-medium">
            {currentUser.role} Account • {currentUser.email}
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Display Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">Phone</label>
            <input
              type="text"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Bio</label>
          <textarea
            rows={3}
            value={profileForm.bio}
            onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            placeholder="Share a short bio about your learning journey or teaching expertise..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Skills (comma separated)</label>
          <input
            type="text"
            value={profileForm.skills}
            onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
            placeholder="React, Node.js, TypeScript, Cloud"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow cursor-pointer transition disabled:opacity-50"
        >
          Save Profile Updates (Section 21)
        </button>
      </form>
    </div>
  );
}
