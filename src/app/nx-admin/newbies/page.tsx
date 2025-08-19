"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Search,
  Mail,
  Phone,
  Instagram,
  MessageCircle,
  ChevronDown,
  Heart,
  Target,
  StickyNote,
  Calendar,
} from "lucide-react";
import { Sidebar } from "@/app/component/Sidebar";
import Footer from "@/app/component/footer";

interface Newbie {
  id: number;
  nom: string;
  prenom: string;
  classe: string;
  hobbies: string | null;
  motivation: string | null;
  additional_notes: string | null;
  email: string | null;
  number: string | null;
  instagram: string | null;
  discord: string | null;
  status: string;
  created_at: string;
}

// Add interface for API response
interface ApiNewbie {
  id: number;
  nom: string;
  prenom: string;
  classe: string;
  hobbies: string | null;
  motivation: string | null;
  additional_notes: string | null;
  email: string | null;
  number?: string | null;
  num?: string | null; // Alternative field name from API
  instagram: string | null;
  discord: string | null;
  status: string;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}

const statusConfig = {
  pending: {
    color: "bg-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  accepted: {
    color: "bg-green-500",
    text: "text-green-400",
    bg: "bg-green-500/10",
  },
  declined: {
    color: "bg-red-500",
    text: "text-red-400",
    bg: "bg-red-500/10",
  },
};

// Toast Component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {message}
    </motion.div>
  );
};

// Delete Modal
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  name,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-red-500/30 rounded-xl p-6 max-w-sm w-full"
      >
        <h3 className="text-lg font-semibold text-white mb-2">
          Delete Application
        </h3>
        <p className="text-gray-300 mb-4">
          Are you sure you want to delete {name}&apos;s application? This cannot
          be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Contact Item Component
const ContactItem = ({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  action?: () => void;
}) => (
  <div
    className={`flex items-center gap-3 p-2 rounded-lg bg-gray-800 ${
      action ? "cursor-pointer hover:bg-gray-700" : ""
    }`}
    onClick={action}
  >
    <Icon size={16} className="text-gray-400 flex-shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-white truncate">{value}</p>
    </div>
  </div>
);

// Text Section Component
const TextSection = ({
  icon: Icon,
  title,
  content,
  color,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  content: string;
  color: string;
}) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} className={`text-${color}-400`} />
      <h4 className={`text-sm font-medium text-${color}-400`}>{title}</h4>
    </div>
    <div className="bg-gray-800 rounded-lg p-3">
      <p className="text-sm text-gray-300 leading-relaxed break-words whitespace-pre-wrap overflow-hidden">
        {content.length > 200 ? content.substring(0, 200) + "..." : content}
      </p>
    </div>
  </div>
);

// Newbie Card Component
const NewbieCard = ({
  newbie,
  onUpdateStatus,
  onDelete,
}: {
  newbie: Newbie;
  onUpdateStatus: (id: number, status: "accepted" | "declined") => void;
  onDelete: (newbie: Newbie) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = statusConfig[newbie.status as keyof typeof statusConfig];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-indigo-400" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 ${config.color} rounded-full border-2 border-zinc-800`}
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {newbie.nom} {newbie.prenom}
              </h3>
              <p className="text-sm text-gray-400">{newbie.classe}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(newbie)}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
          >
            {newbie.status === "pending" && <Clock size={12} />}
            {newbie.status === "accepted" && <CheckCircle size={12} />}
            {newbie.status === "declined" && <XCircle size={12} />}
            {newbie.status.charAt(0).toUpperCase() + newbie.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {newbie.email && (
            <ContactItem
              icon={Mail}
              label="Email"
              value={newbie.email}
              action={() => window.open(`mailto:${newbie.email}`)}
            />
          )}
          {newbie.number && (
            <ContactItem
              icon={Phone}
              label="Phone"
              value={newbie.number}
              action={() => window.open(`tel:${newbie.number}`)}
            />
          )}
          {newbie.instagram && (
            <ContactItem
              icon={Instagram}
              label="Instagram"
              value={`@${newbie.instagram}`}
              action={() =>
                window.open(
                  `https://instagram.com/${
                    newbie.instagram?.replace("@", "") || ""
                  }`
                )
              }
            />
          )}
          {newbie.discord && (
            <ContactItem
              icon={MessageCircle}
              label="Discord"
              value={newbie.discord}
              action={() => navigator.clipboard.writeText(newbie.discord || "")}
            />
          )}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-700 pt-4 space-y-4">
                {newbie.hobbies && (
                  <TextSection
                    icon={Heart}
                    title="Hobbies"
                    content={newbie.hobbies}
                    color="purple"
                  />
                )}
                {newbie.motivation && (
                  <TextSection
                    icon={Target}
                    title="Motivation"
                    content={newbie.motivation}
                    color="orange"
                  />
                )}
                {newbie.additional_notes && (
                  <TextSection
                    icon={StickyNote}
                    title="Additional Notes"
                    content={newbie.additional_notes}
                    color="blue"
                  />
                )}

                {/* Timeline */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={12} />
                  Applied {new Date(newbie.created_at).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {newbie.status === "pending" && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => onUpdateStatus(newbie.id, "accepted")}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle size={14} />
              Accept
            </button>
            <button
              onClick={() => onUpdateStatus(newbie.id, "declined")}
              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <XCircle size={14} />
              Decline
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function NewbiesPage() {
  const [newbies, setNewbies] = useState<Newbie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "accepted" | "declined"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    newbie: Newbie | null;
  }>({
    isOpen: false,
    newbie: null,
  });

  // Sidebar state
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const calculateStats = (data: Newbie[]): Stats => ({
    total: data.length,
    pending: data.filter((n) => n.status === "pending").length,
    accepted: data.filter((n) => n.status === "accepted").length,
    declined: data.filter((n) => n.status === "declined").length,
  });

  const fetchNewbies = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching newbies...");

      const response = await fetch("/api/newbies", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiNewbie[] = await response.json();
      console.log("✅ Received newbies data:", data);

      // Map the API response to match our interface
      const mappedData: Newbie[] = data.map((newbie: ApiNewbie) => ({
        ...newbie,
        number: newbie.number || newbie.num || null, // Handle both field names
      }));

      setNewbies(mappedData);
      showToast(`Loaded ${mappedData.length} applications`, "success");
    } catch (error) {
      console.error("❌ Error fetching newbies:", error);
      showToast("Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Update status via API
  const updateStatus = async (id: number, status: "accepted" | "declined") => {
    try {
      console.log(`📝 Updating newbie ${id} status to ${status}...`);

      const response = await fetch("/api/newbies", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setNewbies((prev) =>
          prev.map((newbie) =>
            newbie.id === id ? { ...newbie, status } : newbie
          )
        );

        const newbie = newbies.find((n) => n.id === id);
        showToast(
          `${newbie?.nom} ${newbie?.prenom} has been ${status}`,
          "success"
        );
        console.log("✅ Status updated successfully");
      } else {
        throw new Error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      showToast("Failed to update status", "error");
    }
  };

  // Delete newbie via API
  const deleteNewbie = async () => {
    if (!deleteModal.newbie) return;

    try {
      console.log(`🗑️ Deleting newbie ${deleteModal.newbie.id}...`);

      const response = await fetch(`/api/newbies?id=${deleteModal.newbie.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setNewbies((prev) =>
          prev.filter((newbie) => newbie.id !== deleteModal.newbie!.id)
        );

        showToast(
          `${deleteModal.newbie.nom} ${deleteModal.newbie.prenom}'s application deleted`,
          "success"
        );
        console.log("✅ Newbie deleted successfully");
      } else {
        throw new Error(result.error || "Failed to delete application");
      }
    } catch (error) {
      console.error("❌ Error deleting newbie:", error);
      showToast("Failed to delete application", "error");
    } finally {
      setDeleteModal({ isOpen: false, newbie: null });
    }
  };

  const filteredNewbies = newbies.filter((newbie) => {
    const matchesSearch = [
      newbie.nom,
      newbie.prenom,
      newbie.classe,
      newbie.email,
      newbie.number,
      newbie.instagram,
      newbie.discord,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filter === "all" || newbie.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = calculateStats(newbies);

  useEffect(() => {
    fetchNewbies();
  }, [fetchNewbies]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-indigo-400" size={20} />
          <span className="text-gray-300">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, newbie: null })}
        onConfirm={deleteNewbie}
        name={
          deleteModal.newbie
            ? `${deleteModal.newbie.nom} ${deleteModal.newbie.prenom}`
            : ""
        }
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        pathname={pathname}
        onLogout={() => {
          document.cookie =
            "nexus_administrateur=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          router.push("/");
        }}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <main className="p-4 sm:p-6 lg:p-8 text-white min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Club Applications
              </h1>
              <p className="text-gray-400">
                Manage membership applications and review candidates
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total",
                  value: stats.total,
                  color: "bg-indigo-600",
                },
                {
                  label: "Pending",
                  value: stats.pending,
                  color: "bg-amber-600",
                },
                {
                  label: "Accepted",
                  value: stats.accepted,
                  color: "bg-green-600",
                },
                {
                  label: "Declined",
                  value: stats.declined,
                  color: "bg-red-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-lg p-4 shadow-sm"
                >
                  <div className={`w-8 h-8 ${stat.color} rounded-lg mb-2`} />
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) =>
                      setFilter(
                        e.target.value as
                          | "all"
                          | "pending"
                          | "accepted"
                          | "declined"
                      )
                    }
                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                  </select>
                  <button
                    onClick={fetchNewbies}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Applications */}
            {filteredNewbies.length === 0 ? (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-lg p-12 text-center">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No applications found
                </h3>
                <p className="text-gray-400">
                  {newbies.length === 0
                    ? "No applications have been submitted yet"
                    : "Try adjusting your search or filters"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredNewbies.map((newbie) => (
                  <NewbieCard
                    key={newbie.id}
                    newbie={newbie}
                    onUpdateStatus={updateStatus}
                    onDelete={(newbie) => setDeleteModal({ isOpen: true, newbie })}
                  />
                ))}
              </div>
            )}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
