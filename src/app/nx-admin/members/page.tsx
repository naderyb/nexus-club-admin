"use client";

import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
import Link from "next/link";
import Footer from "../../component/footer";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  FolderKanban,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Grid,
  Menu,
  X,
  // Plus,
  Edit3,
  Trash2,
  Mail,
  Phone,
  UserPlus,
  Filter,
  Search,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Member = {
  id: number;
  nom: string;
  email: string;
  role: string;
  profile_picture_url: string | null;
  phone: string;
};

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
};

const roles = [
  "president",
  "vice-president",
  "general secretary",
  "respo com",
  "respo logistics",
  "respo marketing",
  "respo dev",
  "respo rel-ex",
  "membre comm",
  "membre logistics",
  "membre dev",
  "membre marketing",
  "membre rel-ex",
  "alumni",
];

const roleColors: { [key: string]: string } = {
  president: "from-red-600 to-red-700",
  "vice-president": "from-orange-600 to-orange-700",
  "general secretary": "from-blue-600 to-blue-700",
  "respo com": "from-purple-600 to-purple-700",
  "respo logistics": "from-green-600 to-green-700",
  "respo marketing": "from-pink-600 to-pink-700",
  "respo dev": "from-indigo-600 to-indigo-700",
  "respo rel-ex": "from-yellow-600 to-yellow-700",
  alumni: "from-amber-400 to-amber-800",
  "membre comm": "from-purple-500 to-purple-600",
  "membre logistics": "from-green-500 to-green-600",
  "membre dev": "from-indigo-500 to-indigo-600",
  "membre marketing": "from-pink-500 to-pink-600",
  "membre rel-ex": "from-yellow-500 to-yellow-600",
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
          <X size={18} />
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
  memberName,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
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
            <h3 className="text-xl font-semibold text-white">Delete Member</h3>
            <p className="text-gray-400 text-sm">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-300">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">{memberName}</span> from
            the club?
          </p>
          <p className="text-gray-400 text-sm mt-2">
            This will permanently remove their profile and all associated data.
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

export default function MembersAdminPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    member: Member | null;
  }>({
    isOpen: false,
    member: null,
  });

  const navItems = [
    { name: "Dashboard", href: "/nx-admin/dashboard", icon: Grid },
    { name: "Events", href: "/nx-admin/events", icon: CalendarDays },
    { name: "Projects", href: "/nx-admin/projects", icon: FolderKanban },
    { name: "Members", href: "/nx-admin/members", icon: Users },
  ];

  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState<Partial<Member>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast functions
  const showToast = (type: ToastType, title: string, message: string) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Filter members based on search and role filter
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then(setMembers);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    // Validate required fields
    if (!form.nom || !form.email || !form.role || !form.phone) {
      showToast(
        "error",
        "Validation Error",
        "Please fill in all required fields (Name, Email, Role, Phone)"
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast("error", "Invalid Email", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString());
      });

      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/members", {
        method,
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save member");
      }

      // Success - update the UI
      setForm({});
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowForm(false);

      setMembers((members) =>
        method === "PUT"
          ? members.map((m) => (m.id === result.id ? result : m))
          : [...members, result]
      );

      showToast(
        "success",
        method === "PUT" ? "Member Updated" : "Member Added",
        method === "PUT"
          ? `${result.nom} has been updated successfully!`
          : `${result.nom} has been added to the team!`
      );
    } catch (error) {
      console.error("Error saving member:", error);
      showToast(
        "error",
        "Save Failed",
        error instanceof Error
          ? error.message
          : "Failed to save member. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: Member) => {
    setForm(member);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(true);
    showToast("info", "Editing Member", `Now editing ${member.nom}'s profile`);
  };

  const handleDelete = async () => {
    if (!deleteModal.member) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/members?id=${deleteModal.member.id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!result.error) {
        setMembers((members) =>
          members.filter((m) => m.id !== deleteModal.member!.id)
        );
        showToast(
          "success",
          "Member Deleted",
          `${deleteModal.member.nom} has been removed from the team`
        );
      } else {
        showToast(
          "error",
          "Delete Failed",
          "Failed to delete member. Please try again."
        );
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      showToast(
        "error",
        "Delete Failed",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
      setDeleteModal({ isOpen: false, member: null });
    }
  };

  const openDeleteModal = (member: Member) => {
    setDeleteModal({ isOpen: true, member });
  };

  const resetForm = () => {
    setForm({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
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
        onClose={() => setDeleteModal({ isOpen: false, member: null })}
        onConfirm={handleDelete}
        memberName={deleteModal.member?.nom || ""}
        loading={loading}
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-[#0e0e0e] text-white transition-all duration-300 shadow-2xl z-50 ${
          collapsed ? "w-19" : "w-64"
        } ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed h-full left-0 top-0 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Nexus Admin
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-gray-800 p-2 rounded-lg transition-all duration-200 hidden lg:block"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="hover:bg-gray-800 p-2 rounded-lg transition-all duration-200 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium group ${
                pathname === href
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Icon
                size={20}
                className={
                  pathname === href
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                }
              />
              {!collapsed && <span>{name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => router.push("/")}
          className="mx-3 mb-4 px-4 py-3 text-sm flex items-center gap-3 rounded-xl border border-gray-700 hover:bg-red-600 hover:border-red-500 transition-all duration-200 text-gray-300 hover:text-white"
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden bg-[#0e0e0e] text-white p-4 flex items-center justify-between border-b border-gray-700">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="hover:bg-gray-800 p-2 rounded-lg transition-all duration-200"
          >
            <Menu size={20} />
          </button>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Nexus Admin
          </span>
          <div className="w-10" />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 text-white min-h-screen">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Team Members
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage your community members and their roles.
            </p>
          </div>

          {/* Stats and Actions Bar */}
          <div className="mb-8 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-wrap gap-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl">
                <div className="text-2xl font-bold">{members.length}</div>
                <div className="text-sm opacity-90">Total Members</div>
              </div>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-xl">
                <div className="text-2xl font-bold">
                  {new Set(members.map((m) => m.role)).size}
                </div>
                <div className="text-sm opacity-90">Active Roles</div>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <UserPlus size={20} />
              Add New Member
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
                  placeholder="Search members by name or email..."
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
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white appearance-none cursor-pointer"
                  >
                    <option value="">All Roles</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  {viewMode === "grid" ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Add/Edit Member Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 p-6 rounded-2xl shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-indigo-400 flex items-center gap-2">
                      <UserPlus size={24} />
                      {form.id ? "Edit Member" : "Add New Member"}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={form.nom || ""}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email || ""}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Role <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="role"
                        value={form.role || ""}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-indigo-500 text-white"
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone || ""}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={submitForm}
                      disabled={loading}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loading
                        ? "Saving..."
                        : form.id
                        ? "Update Member"
                        : "Add Member"}
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Members Grid/List */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Users size={24} className="text-indigo-400" />
              Club Members ({filteredMembers.length})
            </h2>

            {filteredMembers.length === 0 ? (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 p-12 rounded-2xl text-center">
                <Users size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No Members Found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || roleFilter
                    ? "Try adjusting your search criteria"
                    : "Start by adding your first team member"}
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
                {filteredMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div
                      className={`flex ${
                        viewMode === "grid" ? "flex-col" : "flex-row"
                      } gap-4`}
                    >
                      <div
                        className={`${
                          viewMode === "grid" ? "text-center" : ""
                        }`}
                      >
                        <div
                          className={`relative ${
                            viewMode === "grid" ? " mx-auto" : "w-16 h-16"
                          } mb-4`}
                        ></div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white -mt-6 mb-2">
                          {member.nom}
                        </h3>
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 bg-gradient-to-r ${
                            roleColors[member.role] ||
                            "from-gray-600 to-gray-700"
                          } text-white`}
                        >
                          {member.role.charAt(0).toUpperCase() +
                            member.role.slice(1)}
                        </div>

                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-indigo-400" />
                            <span>{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="text-green-400" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`flex ${
                          viewMode === "grid"
                            ? "justify-center gap-2"
                            : "flex-col gap-2"
                        }`}
                      >
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-all duration-200"
                          title="Edit member"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(member)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                          title="Delete member"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
