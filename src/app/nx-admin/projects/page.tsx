"use client";

import { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CalendarDays,
  FolderKanban,
  Users,
  Megaphone,
  Settings,
  FileClock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    status: "",
    start_date: "",
    end_date: "",
    image: null,
    siteUrl: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects);
      } catch {
        toast.error("❌ Failed to load projects.");
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, status, start_date, end_date, image } = formData;

    if (!name || !status || !start_date || !end_date) {
      toast.warn("🚫 Please fill in all required fields.");
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
      // Only append the new image if one is provided (i.e., image has changed)
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

      toast.success(editingId ? "🔁 Project updated!" : "✅ Project added!");
      resetForm();
    } catch {
      toast.error("❌ Save failed.");
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
      toast.success("🗑️ Deleted successfully.");
    } catch {
      toast.error("❌ Delete failed.");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Events", href: "/nx-admin/events", icon: CalendarDays },
    { name: "Projects", href: "/nx-admin/projects", icon: FolderKanban },
    { name: "Members", href: "/nx-admin/members", icon: Users },
    { name: "Announcements", href: "/nx-admin/announcements", icon: Megaphone },
    { name: "Account", href: "/nx-admin/account", icon: Settings },
    { name: "Logs", href: "/nx-admin/logs", icon: FileClock },
  ];

  return (
    <div className="min-h-screen p-6 text-white font-mono">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside
          className={`bg-[#0e0e0e] text-white h-full transition-all duration-300 shadow-lg ${
            collapsed ? "w-16" : "w-56"
          } flex flex-col fixed left-0 top-0 z-40`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            {!collapsed && (
              <span className="text-base font-semibold tracking-wide">
                Nexus Admin
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hover:scale-110 transition"
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>
          <nav className="flex-1 px-1 py-3 space-y-1">
            {navItems.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-all text-sm font-medium ${
                  pathname === href ? "bg-gray-700" : ""
                }`}
              >
                <Icon size={20} />
                {!collapsed && <span>{name}</span>}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-3 text-sm flex items-center justify-center border-t border-gray-700 hover:bg-gray-800 transition"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </button>
        </aside>

        <div className="flex-1 ml-56 p-6">
          <h1 className="text-4xl mb-10 font-bold text-violet-400 drop-shadow-[0_0_10px_#9b59b6]">
            Projects Dashboard
          </h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6 rounded-2xl shadow-xl border"
          >
            {[
              ["Project Name *", "name", "text"],
              ["Description *", "description", "textarea"],
              ["Status *", "status", "select"],
              ["Start Date *", "start_date", "date"],
              ["End Date *", "end_date", "date"],
              ["Upload Image *", "image", "file"],
              ["Project URL *", "siteUrl", "url"],
            ].map(([label, key, type]) => (
              <div key={key as string} className="col-span-full sm:col-span-1">
                <label className="text-sm text-violet-300 block mb-1">
                  {label}
                </label>
                {type === "textarea" ? (
                  <textarea
                    className="w-full p-2 rounded-lg border "
                    rows={3}
                    value={formData[key as string] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                  />
                ) : type === "select" ? (
                  <select
                    className="w-full p-2 rounded-lg border bg-black bg-opacity-50 text-white "
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
                    className="w-full p-2 rounded-lg border"
                    accept={type === "file" ? "image/*" : undefined}
                    value={
                      type === "file"
                        ? undefined
                        : formData[key as string] || ""
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

            <button
              type="submit"
              disabled={submitting}
              className="col-span-full mt-4 w-full border hover:bg-amber-50 hover:text-black p-3 rounded-xl shadow-lg transition-all"
            >
              {submitting
                ? editingId
                  ? "Updating..."
                  : "Submitting..."
                : editingId
                ? "Update Project"
                : "Add Project"}
            </button>
          </form>

          {/* Projects Grid */}
          <div className="mt-10">
            {loading ? (
              <p className="text-center text-gray-400">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                🚧 No projects yet.
              </p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-[#14162f] rounded-2xl border border-violet-500/20 p-5 shadow-md hover:shadow-violet-500/40 transition-all relative"
                  >
                    {project.image_url && (
                      <img
                        src={project.image_url}
                        alt={project.name}
                        className="rounded-lg mb-4 h-48 w-full object-cover border border-violet-500/20"
                      />
                    )}
                    <h2 className="text-xl font-semibold text-violet-300 mb-1">
                      {project.name}
                    </h2>
                    <p className="text-sm text-gray-300 mb-20 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="text-xs text-gray-400 space-y-1 mb-3">
                      <p>
                        Status:{" "}
                        <span className="text-white">{project.status}</span>
                      </p>
                      <p>
                        Start:{" "}
                        {new Date(project.start_date).toLocaleDateString(
                          "en-GB"
                        )}
                      </p>
                      <p>
                        End:{" "}
                        {new Date(project.end_date).toLocaleDateString("en-GB")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-blue-700 hover:bg-blue-600"
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project)}
                        className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-red-700 hover:bg-red-600"
                      >
                        <FiTrash2 /> Delete
                      </button>
                      <a
                        href={project.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-green-700 hover:bg-green-600"
                      >
                        Visit Site
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal */}
          {confirmingDelete && deleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div className="bg-[#1f1f3d] border border-violet-500/40 text-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
                <h2 className="text-xl font-bold text-red-400 mb-4">
                  Confirm Deletion
                </h2>
                <p className="mb-6">
                  Are you sure you want to delete{" "}
                  <strong>{deleteTarget.name}</strong>?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setConfirmingDelete(false);
                      setDeleteTarget(null);
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
}
