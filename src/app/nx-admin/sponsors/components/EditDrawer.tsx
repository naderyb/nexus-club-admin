import { useState } from "react";
import {
  X,
  Save,
  Building2,
  Briefcase,
  User,
  UserCheck,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import type { Sponsor } from "../types";

interface EditDrawerProps {
  sponsor: Sponsor;
  onClose: () => void;
  onSave: (patch: Partial<Sponsor>) => void;
}

export function EditDrawer({ sponsor, onClose, onSave }: EditDrawerProps) {
  const [formData, setFormData] = useState({
    name: sponsor.name || "",
    secteur_activite: sponsor.secteur_activite || "",
    phone: sponsor.phone || "",
    email: sponsor.email || "",
    contact_person: sponsor.contact_person || "",
    contact_position: sponsor.contact_position || "",
    comments: sponsor.comments || "",
    called: sponsor.called,
    email_sent: sponsor.email_sent || false,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave({
        name: formData.name.trim(),
        secteur_activite: formData.secteur_activite.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        contact_person: formData.contact_person.trim() || null,
        contact_position: formData.contact_position.trim() || null,
        comments: formData.comments.trim() || null,
        called: formData.called,
        email_sent: formData.email_sent,
      });
    } catch (error) {
      console.error("Failed to update sponsor:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Edit Sponsor
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Update sponsor information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <Building2 size={16} />
              <span>Company Name *</span>
            </label>
            <input
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="e.g., Sonatrach, Condor Electronics..."
              required
            />
          </div>

          {/* Sector */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <Briefcase size={16} />
              <span>Secteur d&apos;Activité</span>
            </label>
            <input
              value={formData.secteur_activite}
              onChange={(e) => updateField("secteur_activite", e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              placeholder="e.g., Technology, Energy..."
            />
          </div>

          {/* Contact Person & Position */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <User size={16} />
                <span>Contact Person</span>
              </label>
              <input
                value={formData.contact_person}
                onChange={(e) => updateField("contact_person", e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="Ahmed Benali"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <UserCheck size={16} />
                <span>Position</span>
              </label>
              <input
                value={formData.contact_position}
                onChange={(e) =>
                  updateField("contact_position", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="Marketing Director"
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <Phone size={16} />
                <span>Phone</span>
              </label>
              <input
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="+213 555 123 456"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <Mail size={16} />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="contact@company.dz"
              />
            </div>
          </div>

          {/* Status Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-green-600" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Called Status
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Mark if sponsor has been contacted by phone
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.called}
                  onChange={(e) => updateField("called", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Email Status
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Mark if email has been sent to sponsor
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.email_sent}
                  onChange={(e) => updateField("email_sent", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <MessageSquare size={16} />
              <span>Comments</span>
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => updateField("comments", e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              placeholder="Additional notes about the sponsor..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.name.trim()}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                saving || !formData.name.trim()
                  ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg"
              }`}
            >
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
