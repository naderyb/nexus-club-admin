import {
  RefreshCw,
  Building2,
  User,
  Phone,
  Mail,
  Check,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import type { Sponsor } from "../types";

interface SponsorsListPanelProps {
  sponsors: Sponsor[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (sponsor: Sponsor) => void;
  onDelete: (sponsor: Sponsor) => void;
  onQuickToggle: (sponsor: Sponsor, field: "called" | "email_sent") => void;
  isMobile: boolean;
}

export function SponsorsListPanel({
  sponsors,
  loading,
  onRefresh,
  onEdit,
  onDelete,
  onQuickToggle,
  isMobile,
}: SponsorsListPanelProps) {
  const containerClass = isMobile
    ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden"
    : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-900/5 overflow-hidden";

  const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => (
    <div
      className={`p-4 border-b border-slate-200/60 dark:border-slate-700/60 last:border-b-0 ${
        isMobile
          ? "space-y-3 min-w-0"
          : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
      }`}
    >
      <div
        className={`${isMobile ? "block" : "flex items-start justify-between"}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2 min-w-0">
            <Building2 size={16} className="text-indigo-600 flex-shrink-0" />
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
              {sponsor.name}
            </h3>
          </div>

          {sponsor.secteur_activite && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 truncate">
              {sponsor.secteur_activite}
            </p>
          )}

          {(sponsor.contact_person || sponsor.contact_position) && (
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-2 min-w-0">
              <User size={14} className="flex-shrink-0" />
              <span className="truncate">
                {sponsor.contact_person}
                {sponsor.contact_person && sponsor.contact_position && " • "}
                {sponsor.contact_position}
              </span>
            </div>
          )}

          <div
            className={`${
              isMobile ? "space-y-2" : "flex items-center space-x-4"
            } min-w-0`}
          >
            {sponsor.phone && (
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 min-w-0">
                <Phone size={14} className="flex-shrink-0" />
                <span className="truncate">{sponsor.phone}</span>
              </div>
            )}
            {sponsor.email && (
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 min-w-0">
                <Mail size={14} className="flex-shrink-0" />
                <span className="truncate" title={sponsor.email}>
                  {sponsor.email}
                </span>
              </div>
            )}
          </div>
        </div>

        {!isMobile && (
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            <button
              onClick={() => onQuickToggle(sponsor, "called")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sponsor.called
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-green-100 dark:hover:bg-green-900/30"
              }`}
            >
              <Check size={14} />
              <span>Called</span>
            </button>

            <button
              onClick={() => onQuickToggle(sponsor, "email_sent")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sponsor.email_sent
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              }`}
            >
              <Send size={14} />
              <span>Email</span>
            </button>

            <button
              onClick={() => onEdit(sponsor)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
            >
              <Edit size={14} />
            </button>

            <button
              onClick={() => onDelete(sponsor)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {isMobile && (
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-3">
          {/* Action buttons in mobile view */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onQuickToggle(sponsor, "called")}
              className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                sponsor.called
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Check size={12} />
              <span>Called</span>
            </button>

            <button
              onClick={() => onQuickToggle(sponsor, "email_sent")}
              className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                sponsor.email_sent
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Send size={12} />
              <span>Email</span>
            </button>
          </div>

          {/* Edit and Delete buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onEdit(sponsor)}
              className="flex items-center justify-center space-x-1 px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-medium transition-all"
            >
              <Edit size={12} />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(sponsor)}
              className="flex items-center justify-center space-x-1 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium transition-all"
            >
              <Trash2 size={12} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className={containerClass}>
      <div
        className={`${
          isMobile ? "p-4" : "p-6"
        } border-b border-slate-200/60 dark:border-slate-700/60`}
      >
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 size={14} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                Sponsors List
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                {sponsors.length} sponsor{sponsors.length !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm font-medium flex-shrink-0"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {!isMobile && <span>Refresh</span>}
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto overflow-x-hidden">
        <style jsx>{`
          .max-h-96::-webkit-scrollbar {
            width: 6px;
          }
          .max-h-96::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }
          .dark .max-h-96::-webkit-scrollbar-track {
            background: #1e293b;
          }
          .max-h-96::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 3px;
          }
          .max-h-96::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%);
          }
        `}</style>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={20} className="animate-spin text-slate-400" />
            <span className="ml-2 text-slate-600 dark:text-slate-400">
              Loading...
            </span>
          </div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Building2
              size={48}
              className="mx-auto text-slate-300 dark:text-slate-600 mb-4"
            />
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              No sponsors found
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              Try adjusting your filters or add a new sponsor
            </p>
          </div>
        ) : (
          <div className="min-w-0">
            {sponsors.map((sponsor) => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
