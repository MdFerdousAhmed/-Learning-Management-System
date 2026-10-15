"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Database,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  Sparkles,
  Star,
  Users,
  Clock,
  X,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
  TrendingUp,
  DollarSign,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Zap,
} from "lucide-react";
import { Course, Enrollment } from "../../lib/api";

interface CourseCatalogViewProps {
  courses: Course[];
  enrollments: Enrollment[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (diff: string) => void;
  loadData: () => void;
  handleSeed: () => void;
  handleEnroll: (course: Course) => void;
  setSelectedCourse: (course: Course) => void;
  setActiveTab: (tab: any) => void;
}

const CATEGORIES = [
  "All",
  "Architecture",
  "Development",
  "AI & ML",
  "DevOps",
  "Data Engineering",
  "Cybersecurity",
  "Mobile",
  "Design",
];

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

const SORT_OPTIONS = [
  { value: "default", label: "Default", icon: ArrowUpDown },
  { value: "popular", label: "Most Popular", icon: TrendingUp },
  { value: "newest", label: "Newest First", icon: Zap },
  { value: "price-low", label: "Price: Low → High", icon: DollarSign },
  { value: "price-high", label: "Price: High → Low", icon: DollarSign },
  { value: "name-asc", label: "Name A → Z", icon: ArrowUpDown },
];

const TAGS = [
  "React", "Node.js", "Python", "TypeScript", "Docker", "Kubernetes",
  "AWS", "Machine Learning", "NLP", "GraphQL", "MongoDB", "PostgreSQL",
  "Flutter", "Swift", "Rust", "Go", "Next.js", "Vue", "Angular",
];

// Highlight matched text in search results
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-indigo-500/30 text-indigo-300 rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Difficulty color helper
function difficultyColor(diff?: string) {
  switch (diff) {
    case "Beginner":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "Intermediate":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "Advanced":
      return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-slate-400 bg-slate-700/30 border-slate-700";
  }
}

export default function CourseCatalogView({
  courses,
  enrollments,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  loadData,
  handleSeed,
  handleEnroll,
  setSelectedCourse,
  setActiveTab,
}: CourseCatalogViewProps) {
  // ─── Local filter state ───────────────────────────────────────────────────
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [sortBy, setSortBy] = useState("default");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const catalogTopRef = useRef<HTMLDivElement>(null);

  // Debounced search — local state updates instantly, parent updates after 300ms
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const handleSearchChange = useCallback(
    (val: string) => {
      setLocalSearch(val);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearchTerm(val);
      }, 300);
    },
    [setSearchTerm]
  );

  // Close sort menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, selectedTags, priceFilter]);

  // Tag toggle
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ─── Client-side filtering & sorting ──────────────────────────────────────
  const filteredAndSorted = useMemo(() => {
    let result = [...courses];

    // Price filter (client-side)
    if (priceFilter === "free") result = result.filter((c) => !c.price || c.price === 0);
    if (priceFilter === "paid") result = result.filter((c) => c.price && c.price > 0);

    // Tag filter — match against title + description + category
    if (selectedTags.length > 0) {
      result = result.filter((c) => {
        const haystack = `${c.title} ${c.description} ${c.category}`.toLowerCase();
        return selectedTags.some((tag) => haystack.includes(tag.toLowerCase()));
      });
    }

    // Sort
    switch (sortBy) {
      case "popular":
        result.sort(
          (a, b) => (b.enrolledStudentsCount ?? 0) - (a.enrolledStudentsCount ?? 0)
        );
        break;
      case "newest":
        result.sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });
        break;
      case "price-low":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [courses, priceFilter, selectedTags, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredAndSorted.length);
  const displayedCourses = filteredAndSorted.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    catalogTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  // Active filter count (for badge)
  const activeFilterCount = [
    selectedCategory !== "All",
    selectedDifficulty !== "All",
    priceFilter !== "all",
    selectedTags.length > 0,
    sortBy !== "default",
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setLocalSearch("");
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
    setPriceFilter("all");
    setSelectedTags([]);
    setSortBy("default");
  };

  const currentSortLabel = SORT_OPTIONS.find((s) => s.value === sortBy)?.label ?? "Sort";

  return (
    <div ref={catalogTopRef} className="space-y-5">
      {/* ─── Header Row ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Course Catalog
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
              {filteredAndSorted.length} courses
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discover and enroll in industry-leading courses from our curriculum.
          </p>
        </div>

        {/* Top action row: Search + Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Instant Search */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search courses, topics, instructors…"
              className="pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 w-52 sm:w-64 transition shadow-sm dark:shadow-none"
            />
            {localSearch && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Sort dropdown */}
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setShowSortMenu((p) => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  sortBy !== "default"
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{currentSortLabel}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition cursor-pointer ${
                        sortBy === opt.value
                          ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <opt.icon className="h-3.5 w-3.5 opacity-60" />
                      {opt.label}
                      {sortBy === opt.value && (
                        <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Panel Toggle */}
            <button
              onClick={() => setShowFilters((p) => !p)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                showFilters || activeFilterCount > 0
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-rose-500 text-[9px] font-extrabold text-white flex items-center justify-center border-2 border-white dark:border-slate-950">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View mode toggle */}
            <div className="flex items-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 shadow-sm dark:shadow-none">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
                title="List view"
              >
                <LayoutList className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer shadow-sm dark:shadow-none"
              title="Reload from DB"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>

            {/* Re-seed */}
            <button
              onClick={handleSeed}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-white transition cursor-pointer font-semibold shadow-sm dark:shadow-none"
              title="Re-seed demo courses"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden sm:inline">Reset DB</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Expandable Filter Panel ──────────────────────────────────────── */}
      {showFilters && (
        <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Filter className="h-4 w-4 text-indigo-500" />
              Advanced Filters
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-500 hover:text-rose-400 font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                      selectedDifficulty === diff
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Price
              </label>
              <div className="flex gap-1.5">
                {(["all", "free", "paid"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition cursor-pointer border ${
                      priceFilter === p
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {p === "all" ? "All Prices" : p === "free" ? "🎁 Free" : "💳 Paid"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Topics / Tags (multi-select)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer border ${
                    selectedTags.includes(tag)
                      ? "bg-violet-600 text-white border-violet-500 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/80 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Category Pills Row ───────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap font-semibold border ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border-indigo-500"
                : "bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── Active Filter Chips ──────────────────────────────────────────── */}
      {(selectedCategory !== "All" ||
        selectedDifficulty !== "All" ||
        priceFilter !== "all" ||
        selectedTags.length > 0 ||
        localSearch) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active:
          </span>
          {localSearch && (
            <FilterChip
              label={`"${localSearch}"`}
              onRemove={() => handleSearchChange("")}
            />
          )}
          {selectedCategory !== "All" && (
            <FilterChip label={selectedCategory} onRemove={() => setSelectedCategory("All")} />
          )}
          {selectedDifficulty !== "All" && (
            <FilterChip label={selectedDifficulty} onRemove={() => setSelectedDifficulty("All")} />
          )}
          {priceFilter !== "all" && (
            <FilterChip
              label={priceFilter === "free" ? "🎁 Free" : "💳 Paid"}
              onRemove={() => setPriceFilter("all")}
            />
          )}
          {selectedTags.map((tag) => (
            <FilterChip key={tag} label={`#${tag}`} onRemove={() => toggleTag(tag)} />
          ))}
          <button
            onClick={clearAllFilters}
            className="text-[11px] text-rose-500 hover:text-rose-400 font-semibold transition cursor-pointer underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ─── Empty State ─────────────────────────────────────────────────── */}
      {filteredAndSorted.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <Database className="h-10 w-10 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No courses match your criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or filters, or re-seed the database with the full
            100+ course catalog.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Clear Filters
            </button>
            <button
              onClick={handleSeed}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow cursor-pointer"
            >
              Populate 100+ Demo Courses
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Pagination info bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>
                Showing{" "}
                <strong className="text-slate-900 dark:text-white">{startIndex + 1}</strong>–
                <strong className="text-slate-900 dark:text-white">{endIndex}</strong> of{" "}
                <strong className="text-slate-900 dark:text-white">
                  {filteredAndSorted.length}
                </strong>{" "}
                courses
              </span>
              {courses.length !== filteredAndSorted.length && (
                <span className="text-indigo-500 font-medium">
                  (filtered from {courses.length})
                </span>
              )}
            </div>

            {/* Items per page */}
            <div className="flex items-center gap-2">
              <span>Per page:</span>
              <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
                {[9, 12, 18, 24].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setItemsPerPage(size);
                      setCurrentPage(1);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                      itemsPerPage === size
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── GRID VIEW ── */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedCourses.map((course) => (
                <CourseGridCard
                  key={course._id}
                  course={course}
                  isEnrolled={enrollments.some((e) => e.course._id === course._id)}
                  searchQuery={localSearch}
                  onView={() => setSelectedCourse(course)}
                  onEnroll={() => handleEnroll(course)}
                  onPlay={() => {
                    setSelectedCourse(course);
                    setActiveTab("course-player");
                  }}
                />
              ))}
            </div>
          )}

          {/* ── LIST VIEW ── */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {displayedCourses.map((course) => (
                <CourseListCard
                  key={course._id}
                  course={course}
                  isEnrolled={enrollments.some((e) => e.course._id === course._id)}
                  searchQuery={localSearch}
                  onView={() => setSelectedCourse(course)}
                  onEnroll={() => handleEnroll(course)}
                  onPlay={() => {
                    setSelectedCourse(course);
                    setActiveTab("course-player");
                  }}
                />
              ))}
            </div>
          )}

          {/* ── Pagination Controls ── */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Page <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> of{" "}
                <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <div className="flex items-center gap-1">
                  {pageNumbers.map((page, idx) =>
                    page === "..." ? (
                      <span key={`e-${idx}`} className="px-2 py-1 text-xs text-slate-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={page as number}
                        onClick={() => goToPage(page as number)}
                        className={`min-w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                          page === currentPage
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-105 border border-indigo-400/40"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>

              {/* Quick jump */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Go to:</span>
                <select
                  value={currentPage}
                  onChange={(e) => goToPage(Number(e.target.value))}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <option key={p} value={p}>
                      Page {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Filter Chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-[11px] font-semibold">
      {label}
      <button onClick={onRemove} className="hover:text-rose-500 transition cursor-pointer ml-0.5">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────
function CourseGridCard({
  course,
  isEnrolled,
  searchQuery,
  onView,
  onEnroll,
  onPlay,
}: {
  course: Course;
  isEnrolled: boolean;
  searchQuery: string;
  onView: () => void;
  onEnroll: () => void;
  onPlay: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const isFree = !course.price || course.price === 0;
  const rating = (course as any).rating ?? (3.5 + Math.random() * 1.5).toFixed(1);
  const students = course.enrolledStudentsCount ?? Math.floor(Math.random() * 5000 + 100);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/40 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-950/50 transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Thumbnail */}
      <div
        className="h-44 bg-slate-100 dark:bg-slate-800 relative overflow-hidden cursor-pointer"
        onClick={onView}
      >
        {course.thumbnail && !imgError ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/80 dark:to-violet-950/80 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-indigo-500/60 dark:text-indigo-400/60" />
          </div>
        )}

        {/* Badges */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full backdrop-blur border ${difficultyColor(
            course.difficulty
          )}`}
        >
          {course.difficulty || "Beginner"}
        </span>
        <span
          className={`absolute bottom-3 left-3 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border backdrop-blur ${
            isFree
              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
              : "bg-slate-950/80 text-white border-slate-700"
          }`}
        >
          {isFree ? "🎁 Free" : `$${course.price}`}
        </span>

        {/* Enrolled badge */}
        {isEnrolled && (
          <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur">
            <CheckCircle2 className="h-3 w-3" /> Enrolled
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {course.category}
            </span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="h-3 w-3" />
              {course.duration || "8h"}
            </span>
          </div>

          <h3
            className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-300 transition"
            onClick={onView}
          >
            <HighlightText text={course.title} query={searchQuery} />
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            <HighlightText text={course.description || ""} query={searchQuery} />
          </p>
        </div>

        {/* Rating + Students */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{Number(rating).toFixed(1)}</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {students.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            {course.modules?.length ?? 0} Modules
          </span>
        </div>

        {/* Instructor */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
          by{" "}
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {course.instructorName || "Faculty"}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="pt-2 flex gap-2">
          {isEnrolled ? (
            <button
              onClick={onPlay}
              className="w-full py-2 rounded-xl bg-emerald-600/15 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Continue Learning
            </button>
          ) : (
            <div className="w-full flex gap-2">
              <button
                onClick={onView}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                Details
              </button>
              <button
                onClick={onEnroll}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                {isFree ? "Enroll Free" : "Enroll"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── List Card ────────────────────────────────────────────────────────────────
function CourseListCard({
  course,
  isEnrolled,
  searchQuery,
  onView,
  onEnroll,
  onPlay,
}: {
  course: Course;
  isEnrolled: boolean;
  searchQuery: string;
  onView: () => void;
  onEnroll: () => void;
  onPlay: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const isFree = !course.price || course.price === 0;
  const rating = (course as any).rating ?? (3.5 + Math.random() * 1.5).toFixed(1);
  const students = course.enrolledStudentsCount ?? Math.floor(Math.random() * 5000 + 100);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/40 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-950/40 transition-all duration-200 flex gap-4 overflow-hidden group p-4">
      {/* Thumbnail */}
      <div
        className="w-32 h-24 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer relative"
        onClick={onView}
      >
        {course.thumbnail && !imgError ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/80 dark:to-violet-950/80 flex items-center justify-center">
            <BookOpen className="h-7 w-7 text-indigo-500/60 dark:text-indigo-400/60" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0 space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              {course.category}
            </span>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${difficultyColor(
                course.difficulty
              )}`}
            >
              {course.difficulty || "Beginner"}
            </span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                isFree
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-400/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
              }`}
            >
              {isFree ? "🎁 Free" : `$${course.price}`}
            </span>
            {isEnrolled && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30">
                <CheckCircle2 className="h-3 w-3" /> Enrolled
              </span>
            )}
          </div>

          <h3
            className="text-sm font-bold text-slate-900 dark:text-white leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-300 transition line-clamp-1"
            onClick={onView}
          >
            <HighlightText text={course.title} query={searchQuery} />
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
            <HighlightText text={course.description || ""} query={searchQuery} />
          </p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {Number(rating).toFixed(1)}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {students.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.duration || "8h"}
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {course.modules?.length ?? 0} Modules
            </span>
            <span className="hidden sm:block text-[11px] truncate max-w-[120px]">
              by{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {course.instructorName || "Faculty"}
              </span>
            </span>
          </div>

          {/* CTA */}
          <div className="flex gap-2 shrink-0">
            {isEnrolled ? (
              <button
                onClick={onPlay}
                className="px-4 py-1.5 rounded-xl bg-emerald-600/15 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Continue
              </button>
            ) : (
              <>
                <button
                  onClick={onView}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Details
                </button>
                <button
                  onClick={onEnroll}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  {isFree ? "Enroll Free" : "Enroll"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
