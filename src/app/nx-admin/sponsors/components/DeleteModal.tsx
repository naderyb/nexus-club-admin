import { AlertTriangle, Trash2 } from "lucide-react";
import type { Sponsor } from "../types";

interface DeleteModalProps {
  sponsor: Sponsor;
  onClose: () => void;
  onConfirm: (sponsor: Sponsor) => void;
  isDeleting: boolean;
}

export function DeleteModal({
  sponsor,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Delete Sponsor
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{sponsor.name}</span>? This will
              permanently remove all sponsor information including contact
              details and history.
            </p>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle
                  size={18}
                  className="text-red-600 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Warning: This action is irreversible
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    All data associated with this sponsor will be permanently
                    lost.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-slate-200/60 dark:border-slate-700/60 flex space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(sponsor)}
              disabled={isDeleting}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                isDeleting
                  ? "bg-red-400 text-white cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              <Trash2 size={16} />
              <span>{isDeleting ? "Deleting..." : "Delete Sponsor"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
