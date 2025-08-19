"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Trash2,
  UserPlus,
  Filter,
  Search,
  Mail,
  BookOpen,
  MessageSquare,
  Calendar,
  Eye,
  EyeOff,
  Info,
  AlertCircle
} from "lucide-react";

interface Newbie {
  id: number;
  nom: string;
  prenom: string;
  classe: string;
  hobbies: string | null;
  motivation: string | null;
  email: string | null;
  additional_notes: string | null;
  status: string;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
};

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastColors = {
  success: "from-green-600 to-emerald-600",
  error: "from-red-600 to-rose-600",
  warning: "from-yellow-600 to-orange-600",
  info: "from-blue-600 to-indigo-600",
};

const statusColors = {
  pending: "from-yellow-600 to-orange-600",
  accepted: "from-green-600 to-emerald-600",
  declined: "from-red-600 to-rose-600",
};

// Toast Component
const ToastNotification = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) => {
  const Icon = toastIcons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={`bg-gradient-to-r ${
        toastColors[toast.type]
      } p-4 rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm max-w-sm w-full`}
    >
      <div className="flex items-start gap-3">
        <Icon size={24} className="text-white flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm mb-1">
            {toast.title}
          </h4>
          <p className="text-white/90 text-sm leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-white/70 hover:text-white transition-colors flex-shrink-0 ml-2"
        >
          <XCircle size={18} />
        </button>
      </div>
    </motion.div>
  );
};

// Deletion Modal Component
const DeletionModal = ({
  isOpen,
  onClose,
  onConfirm,
  newbieName,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newbieName: string;
  loading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Delete Application</h3>
            <p className="text-gray-400 text-sm">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-300">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">{newbieName}</span>&apos;s application?
          </p>
          <p className="text-gray-400 text-sm mt-2">
            This will permanently remove their application and all associated data.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function NewbiesPage() {
  const [newbies, setNewbies] = useState<Newbie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, accepted: 0, declined: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    newbie: Newbie | null;
  }>({
    isOpen: false,
    newbie: null,
  });

  // Toast functions
  const showToast = (type: ToastType, title: string, message: string) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Calculate stats from newbies data
  const calculateStats = (data: Newbie[]): Stats => {
    return {
      total: data.length,
      pending: data.filter(n => n.status === 'pending').length,
      accepted: data.filter(n => n.status === 'accepted').length,
      declined: data.filter(n => n.status === 'declined').length,
    };
  };

  // Fetch newbies
  const fetchNewbies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/newbies");
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setNewbies(data);
      setStats(calculateStats(data));
      showToast("success", "Data Refreshed", "Applications loaded successfully!");
    } catch (err) {
      console.error("❌ Error fetching newbies:", err);
      showToast("error", "Fetch Failed", "Error loading applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Update newbie status
  const updateStatus = async (id: number, status: "accepted" | "declined") => {
    try {
      const res = await fetch("/api/newbies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      // Update local state instead of refetching
      setNewbies(prev => {
        const updated = prev.map(newbie => 
          newbie.id === id ? { ...newbie, status } : newbie
        );
        setStats(calculateStats(updated));
        return updated;
      });

      const newbie = newbies.find(n => n.id === id);
      showToast(
        "success", 
        "Status Updated", 
        `${newbie?.nom} ${newbie?.prenom}'s application has been ${status}!`
      );

    } catch (err) {
      console.error("❌ Error updating status:", err);
      showToast("error", "Update Failed", "Error updating status. Please try again.");
    }
  };

  // Delete newbie
  const deleteNewbie = async () => {
    if (!deleteModal.newbie) return;

    try {
      const res = await fetch(`/api/newbies?id=${deleteModal.newbie.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error('Failed to delete');

      // Update local state
      setNewbies(prev => {
        const updated = prev.filter(newbie => newbie.id !== deleteModal.newbie!.id);
        setStats(calculateStats(updated));
        return updated;
      });

      showToast(
        "success", 
        "Application Deleted", 
        `${deleteModal.newbie.nom} ${deleteModal.newbie.prenom}'s application has been removed`
      );

    } catch (err) {
      console.error("❌ Error deleting newbie:", err);
      showToast("error", "Delete Failed", "Error deleting application. Please try again.");
    } finally {
      setDeleteModal({ isOpen: false, newbie: null });
    }
  };

  const openDeleteModal = (newbie: Newbie) => {
    setDeleteModal({ isOpen: true, newbie });
  };

  // Filter newbies based on search and status filter
  const filteredNewbies = newbies.filter(newbie => {
    const matchesSearch = 
      newbie.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newbie.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newbie.classe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (newbie.email && newbie.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || newbie.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchNewbies();
  }, [fetchNewbies]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="animate-spin text-indigo-400" size={24} />
          <span className="text-lg text-white">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastNotification
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Deletion Modal */}
      <DeletionModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, newbie: null })}
        onConfirm={deleteNewbie}
        newbieName={deleteModal.newbie ? `${deleteModal.newbie.nom} ${deleteModal.newbie.prenom}` : ""}
        loading={loading}
      />

      <main className="p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Club Applications
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage membership applications and review new candidates.
          </p>
        </div>

        {/* Stats and Actions Bar */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-wrap gap-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm opacity-90">Total Applications</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm opacity-90">Pending Review</div>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.accepted}</div>
              <div className="text-sm opacity-90">Accepted</div>
            </div>
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 rounded-xl">
              <div className="text-2xl font-bold">{stats.declined}</div>
              <div className="text-sm opacity-90">Declined</div>
            </div>
          </div>

          <button
            onClick={fetchNewbies}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <RefreshCw size={20} />
            Refresh Data
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 p-6 rounded-2xl">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, class, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'accepted' | 'declined')}
                  className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white appearance-none cursor-pointer"
                >
                  <option value="all">All Applications</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors"
              >
                {viewMode === "grid" ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Applications Grid/List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <UserPlus size={24} className="text-indigo-400" />
            Applications ({filteredNewbies.length})
          </h2>

          {filteredNewbies.length === 0 ? (
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 p-12 rounded-2xl text-center">
              <UserPlus size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {filter === 'all' ? 'No Applications Found' : `No ${filter} applications`}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search criteria or filters'
                  : 'New applications will appear here when submitted'}
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredNewbies.map((newbie) => (
                <motion.div
                  key={newbie.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className={`flex ${viewMode === "grid" ? "flex-col" : "flex-row"} gap-4`}>
                    {/* Header */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          {newbie.nom} {newbie.prenom}
                        </h3>
                        <button
                          onClick={() => openDeleteModal(newbie)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                          title="Delete application"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Status Badge */}
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${
                            statusColors[newbie.status as keyof typeof statusColors] || "from-gray-600 to-gray-700"
                          } text-white`}
                        >
                          {newbie.status === "pending" ? (
                            <Clock size={14} className="mr-2" />
                          ) : newbie.status === "accepted" ? (
                            <CheckCircle size={14} className="mr-2" />
                          ) : (
                            <XCircle size={14} className="mr-2" />
                          )}
                          {newbie.status === "pending" ? "Pending Review" : 
                           newbie.status === "accepted" ? "Accepted" : "Declined"}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-blue-400" />
                          <span className="font-medium">Class:</span> {newbie.classe}
                        </div>
                        
                        {newbie.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-green-400" />
                            <span className="font-medium">Email:</span> {newbie.email}
                          </div>
                        )}
                        
                        {newbie.hobbies && (
                          <div className="flex items-start gap-2">
                            <Users size={16} className="text-purple-400 mt-0.5" />
                            <div>
                              <span className="font-medium">Hobbies:</span> {newbie.hobbies}
                            </div>
                          </div>
                        )}
                        
                        {newbie.motivation && (
                          <div className="flex items-start gap-2">
                            <MessageSquare size={16} className="text-yellow-400 mt-0.5" />
                            <div>
                              <span className="font-medium">Motivation:</span> {newbie.motivation}
                            </div>
                          </div>
                        )}
                        
                        {newbie.additional_notes && (
                          <div className="flex items-start gap-2">
                            <Info size={16} className="text-cyan-400 mt-0.5" />
                            <div>
                              <span className="font-medium">Notes:</span> {newbie.additional_notes}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar size={14} />
                            <span>
                              Applied {new Date(newbie.created_at).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {newbie.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateStatus(newbie.id, "accepted")}
                                className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1"
                              >
                                <CheckCircle size={14} />
                                Accept
                              </button>
                              <button
                                onClick={() => updateStatus(newbie.id, "declined")}
                                className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1"
                              >
                                <XCircle size={14} />
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}