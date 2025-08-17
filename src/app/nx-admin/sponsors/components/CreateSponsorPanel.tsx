import {
  Plus,
  RefreshCw,
  Building2,
  Briefcase,
  User,
  UserCheck,
  Phone,
  Mail,
  X,
} from "lucide-react";
import type { FormData } from "../types";

interface CreateSponsorPanelProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  creating: boolean;
  error: string | null;
  isMobile: boolean;
}

export function CreateSponsorPanel({
  formData,
  setFormData,
  onSubmit,
  creating,
  error,
  isMobile,
}: CreateSponsorPanelProps) {
  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const containerClass = isMobile
    ? "rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg"
    : "lg:col-span-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-900/5";

  return (
    <section className={containerClass}>
      <div className="p-4 lg:p-6 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg lg:rounded-xl flex items-center justify-center">
            <Plus size={isMobile ? 14 : 18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base lg:text-lg font-semibold text-slate-900 dark:text-white">
              Add New Sponsor
            </h2>
            <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Create a new sponsor entry
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="space-y-2">
          <label className="text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
            <Building2 size={14} />
            <span>Company Name *</span>
          </label>
          <input
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full rounded-lg lg:rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 lg:px-4 py-2 lg:py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            placeholder="e.g., Sonatrach, Condor Electronics..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
            <Briefcase size={14} />
            <span>Secteur d&apos;Activité</span>
          </label>
          <input
            value={formData.secteur_activite}
            onChange={(e) => updateField("secteur_activite", e.target.value)}
            className="w-full rounded-lg lg:rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 lg:px-4 py-2 lg:py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            placeholder="e.g., Technology, Energy..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          <div className="space-y-2">
            <label className="text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <User size={14} />
              <span>Contact Person</span>
            </label>
            <input
              value={formData.contact_person}
              onChange={(e) => updateField("contact_person", e.target.value)}
              className="w-full rounded-lg lg:rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 lg:px-4 py-2 lg:py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="Ahmed Benali"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <UserCheck size={14} />
              <span>Position</span>
            </label>
            <input
              value={formData.contact_position}
              onChange={(e) => updateField("contact_position", e.target.value)}
              className="w-full rounded-lg lg:rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 lg:px-4 py-2 lg:py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="Marketing Director"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          <div className="space-y-2">
            <label className="text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <Phone size={14} />
              <span>Phone</span>
            </label>
            <input
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full rounded-lg lg:rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 lg:px-4 py-2 lg:py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="+213 555 123 456"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <Mail size={14} />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full rounded-lg lg:rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 lg:px-4 py-2 lg:py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="contact@company.dz"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={creating || !formData.name.trim()}
          className={`w-full rounded-lg lg:rounded-xl px-4 lg:px-6 py-3 lg:py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            creating || !formData.name.trim()
              ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
          }`}
        >
          {creating ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Add Sponsor</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-3 lg:p-4 rounded-lg lg:rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-2">
              <X size={16} />
              <span>{error}</span>
            </p>
          </div>
        )}
      </form>
    </section>
  );
}
