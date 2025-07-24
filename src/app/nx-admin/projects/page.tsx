"use client";

import { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  CalendarDays,
  FolderKanban,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Grid,
  Menu,
  X,
  Plus,
  ExternalLink,
  Activity,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import Footer from "@/app/component/footer";
import { AnimatePresence, motion } from "framer-motion";

type Project = {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  image_url: string;
  site_url: string;
};

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  type ProjectFormData = {
    name: string;
    description: string;
    status: string;
    start_date: string;
    end_date: string;
    image: File | null;
    siteUrl: string;
  };

  type ProjectFormDataKey = keyof ProjectFormData;

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "",
    start_date: "",
    end_date: "",
    image: null,
    siteUrl: "",
  });

  const pathname = usePathname();
  const router = useRouter();

  // Toast functions
  const showToast = (type: ToastType, title: string, message: string) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const navItems = [
    { name: "Dashboard", href: "/nx-admin/dashboard", icon: Grid },
    { name: "Events", href: "/nx-admin/events", icon: CalendarDays },
    { name: "Projects", href: "/nx-admin/projects", icon: FolderKanban },
    { name: "Members", href: "/nx-admin/members", icon: Users },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects);
      } catch {
        showToast("error", "Load Failed", "Failed to load projects.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "",
      start_date: "",
      end_date: "",
      image: null,
      siteUrl: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, status, start_date, end_date, image } = formData;

    if (!name || !status || !start_date || !end_date) {
      showToast(
        "warning",
        "Missing Fields",
        "Please fill in all required fields."
      );
      return;
    }

    setSubmitting(true);
    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      const k = key === "siteUrl" ? "site_url" : key;
      if (val instanceof Blob) form.append(k, val);
      else if (typeof val === "string") form.append(k, val);
    });

    if (editingId) {
      if (image) {
        form.append("image", image);
      }
      form.append("id", String(editingId));
    }

    try {
      const res = await fetch("/api/projects", {
        method: editingId ? "PUT" : "POST",
        body: form,
      });

      if (!res.ok) throw new Error();
      const updatedProject = await res.json();

      setProjects((prev) =>
        editingId
          ? prev.map((p) => (p.id === editingId ? updatedProject : p))
          : [...prev, updatedProject]
      );

      showToast(
        "success",
        editingId ? "Project Updated" : "Project Added",
        editingId
          ? `${updatedProject.name} has been updated successfully!`
          : `${updatedProject.name} has been added to your projects!`
      );
      resetForm();
    } catch {
      showToast(
        "error",
        "Save Failed",
        "Failed to save project. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (project: Project) => {
    setDeleteTarget(project);
    setConfirmingDelete(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: deleteTarget.name }),
      });

      if (!res.ok) throw new Error();

      setProjects((prev) => prev.filter((p) => p.name !== deleteTarget.name));
      showToast(
        "success",
        "Project Deleted",
        `${deleteTarget.name} has been deleted successfully.`
      );
    } catch {
      showToast(
        "error",
        "Delete Failed",
        "Failed to delete project. Please try again."
      );
    } finally {
      setConfirmingDelete(false);
      setDeleteTarget(null);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      start_date: project.start_date.slice(0, 10),
      end_date: project.end_date.slice(0, 10),
      image: null,
      siteUrl: project.site_url,
    });
    setShowForm(true);
    showToast("info", "Editing Project", `Now editing ${project.name}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              Projects Dashboard
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage your projects and track their progress.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity size={24} className="text-indigo-400" />
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (editingId) resetForm();
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center gap-2"
              >
                <Plus size={20} />
                Add New Project
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-zinc-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FolderKanban size={24} className="text-indigo-400" />
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-2xl p-6 shadow-lg">
                <form
                  onSubmit={handleSubmit}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {[
                    ["Project Name *", "name", "text"],
                    ["Description *", "description", "textarea"],
                    ["Status *", "status", "select"],
                    ["Start Date *", "start_date", "date"],
                    ["End Date *", "end_date", "date"],
                    ["Upload Image", "image", "file"],
                    ["Project URL", "siteUrl", "url"],
                  ].map(([label, key, type]) => (
                    <div
                      key={key as string}
                      className={
                        type === "textarea"
                          ? "col-span-full"
                          : "col-span-full sm:col-span-1"
                      }
                    >
                      <label className="text-sm font-medium text-indigo-300 block mb-2">
                        {label}
                      </label>
                      {type === "textarea" ? (
                        <textarea
                          rows={4}
                          className="w-full p-3 bg-zinc-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                          placeholder="Enter project description..."
                          value={
                            typeof formData[key as ProjectFormDataKey] ===
                            "string"
                              ? (formData[key as ProjectFormDataKey] as string)
                              : ""
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [key as ProjectFormDataKey]: e.target.value,
                            })
                          }
                        />
                      ) : type === "select" ? (
                        <select
                          className="w-full p-3 bg-zinc-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                        >
                          <option value="">Select status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <input
                          type={type}
                          className="w-full p-3 bg-zinc-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
                          placeholder={
                            type === "url"
                              ? "https://example.com"
                              : `Enter ${label.toLowerCase()}`
                          }
                          accept={type === "file" ? "image/*" : undefined}
                          value={
                            type === "file"
                              ? undefined
                              : (formData[
                                  key as ProjectFormDataKey
                                ] as string) || ""
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [key]:
                                type === "file"
                                  ? e.target.files?.[0]
                                  : e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  ))}

                  <div className="col-span-full flex gap-4 mt-6">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white p-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      {submitting
                        ? editingId
                          ? "Updating..."
                          : "Creating..."
                        : editingId
                        ? "Update Project"
                        : "Create Project"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FolderKanban size={24} className="text-indigo-400" />
              All Projects ({filteredProjects.length})
            </h2>

            {loading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-zinc-800 rounded-2xl p-6 animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-16 bg-gray-700 rounded"></div>
                      <div className="h-8 w-16 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <FolderKanban
                  size={64}
                  className="mx-auto text-gray-500 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  {searchTerm || statusFilter
                    ? "No projects found"
                    : "No projects yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || statusFilter
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first project to get started"}
                </p>
                {!searchTerm && !statusFilter && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center gap-2 mx-auto"
                  >
                    <Plus size={20} />
                    Add Your First Project
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] group"
                  >
                    {project.image_url && (
                      <div className="relative overflow-hidden">
                        <Image
                          src={project.image_url}
                          alt={project.name}
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                          unoptimized={false}
                          priority={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-lg border ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      <div className="text-xs text-gray-400 space-y-1 mb-6">
                        <p className="flex items-center gap-2">
                          <CalendarDays size={14} />
                          <span>
                            {new Date(project.start_date).toLocaleDateString(
                              "en-GB"
                            )}{" "}
                            -{" "}
                            {new Date(project.end_date).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                        >
                          <FiEdit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project)}
                          className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                        >
                          <FiTrash2 size={14} />
                          Delete
                        </button>
                        {project.site_url && (
                          <a
                            href={project.site_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors"
                          >
                            <ExternalLink size={14} />
                            Visit
                          </a>
                        )}
                      </div>
                    </div>
                    {/* i wanna add the footer component */}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Footer />
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmingDelete && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-red-500/30 text-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <FiTrash2 size={24} />
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-white">{deleteTarget.name}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmingDelete(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
