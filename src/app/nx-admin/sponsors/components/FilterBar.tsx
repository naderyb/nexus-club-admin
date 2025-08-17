import {
  Search,
  Filter,
  Send,
  CheckCircle,
  Building,
} from "lucide-react";
import type { CallFilter, EmailFilter } from "../types";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  callFilter: CallFilter;
  setCallFilter: (filter: CallFilter) => void;
  emailFilter: EmailFilter;
  setEmailFilter: (filter: EmailFilter) => void;
  secteurFilter: string;
  setSecteurFilter: (filter: string) => void;
  uniqueSectors: string[];
  isMobile: boolean;
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  callFilter,
  setCallFilter,
  emailFilter,
  setEmailFilter,
  secteurFilter,
  setSecteurFilter,
  uniqueSectors,
  isMobile,
}: FilterBarProps) {
  const containerClass = isMobile
    ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4"
    : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6";

  return (
    <div className={containerClass}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Filter size={14} className="text-white" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Filters & Search
        </h3>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sponsors, contacts, sectors..."
            className={`w-full pl-10 pr-4 ${
              isMobile ? "py-2.5" : "py-3"
            } rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all`}
          />
        </div>

        {/* Filters Grid */}
        <div
          className={`grid ${
            isMobile ? "grid-cols-1 gap-3" : "grid-cols-4 gap-4"
          }`}
        >
          {/* Call Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <CheckCircle size={12} />
              <span>Call Status</span>
            </label>
            <select
              value={callFilter}
              onChange={(e) => setCallFilter(e.target.value as CallFilter)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            >
              <option value="all">All Status</option>
              <option value="called">Called</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Email Status Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <Send size={12} />
              <span>Email Status</span>
            </label>
            <select
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value as EmailFilter)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            >
              <option value="all">All Status</option>
              <option value="sent">Email Sent</option>
              <option value="not_sent">Not Sent</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <Building size={12} />
              <span>Sector</span>
            </label>
            <select
              value={secteurFilter}
              onChange={(e) => setSecteurFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            >
              <option value="all">All Sectors</option>
              {uniqueSectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <span className="invisible">Clear</span>
            </label>
            <button
              onClick={() => {
                setSearchQuery("");
                setCallFilter("all");
                setEmailFilter("all");
                setSecteurFilter("all");
              }}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
