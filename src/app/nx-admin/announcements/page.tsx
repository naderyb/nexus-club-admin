"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  visible: boolean;
  created_at: string;
}

const navItems = [
  { name: "Events", href: "/nx-admin/events", icon: CalendarDays },
  { name: "Projects", href: "/nx-admin/projects", icon: FolderKanban },
  { name: "Members", href: "/nx-admin/members", icon: Users },
  { name: "Announcements", href: "/nx-admin/announcements", icon: Megaphone },
  { name: "Account", href: "/nx-admin/account", icon: Settings },
  { name: "Logs", href: "/nx-admin/logs", icon: FileClock },
];

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<
    number | null
  >(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/nx-admin");
  };

  // Collapse sidebar on small screens
  useEffect(() => {
    if (window.innerWidth < 640) setCollapsed(true);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcement");
      const data = await res.json();
      setAnnouncements(data);
    } catch {
      console.error("Failed to fetch announcements");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, visible }),
      });
      if (res.ok) {
        toast.success("Announcement created and SMS sent.");
        setTitle("");
        setContent("");
        setVisible(true);
        fetchAnnouncements();
      }
    } catch {
      toast.error("Failed to create announcement.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (a: Announcement) => {
    setEditing(a);
    setTitle(a.title);
    setContent(a.content);
    setVisible(a.visible);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/announcement?id=${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, visible }),
      });
      if (res.ok) {
        toast.success("Announcement updated and SMS sent.");
        setEditing(null);
        setTitle("");
        setContent("");
        setVisible(true);
        fetchAnnouncements();
      } else {
        toast.error("Failed to update announcement.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setAnnouncementToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteAnnouncement = async () => {
    if (announcementToDelete === null) return;
    try {
      const res = await fetch(`/api/announcement?id=${announcementToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Announcement deleted and SMS sent.");
        fetchAnnouncements();
      } else {
        toast.error("Failed to delete announcement.");
      }
    } catch {
      toast.error("Error deleting announcement.");
    } finally {
      setShowDeleteModal(false);
      setAnnouncementToDelete(null);
    }
  };

  return (
    <div className="flex justify-center p-6 max-w-5xl mx-auto">
      <div className="w-full">
        <h1 className="text-4xl font-semibold mb-8 text-gray-900 dark:text-white">
          Announcements
        </h1>

        {/* Sidebar */}
        <aside
          className={`bg-[#1f1f1f] text-white h-full transition-all duration-300 shadow-lg ${
            collapsed ? "w-16" : "w-64"
          } flex flex-col fixed left-0 top-0 z-40`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            {!collapsed && (
              <span className="text-lg font-semibold tracking-wide">
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
          <nav className="flex-1 px-2 py-4 space-y-2">
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
            onClick={handleLogout}
            className="w-full px-4 py-3 text-sm flex items-center justify-center border-t border-gray-700 hover:bg-gray-800 transition"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </button>
        </aside>

        {/* Form */}
        <div className=" p-6 rounded-xl shadow-lg mb-8 border">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {editing ? "Edit Announcement" : "Create Announcement"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg "
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg "
          />
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={visible}
              onChange={() => setVisible(!visible)}
              className="mr-2"
            />
            <label className="text-gray-800 dark:text-white">
              Visible to members
            </label>
          </div>
          <button
            onClick={editing ? handleUpdate : handleSubmit}
            disabled={loading}
            className="border text-white px-6 py-3 rounded-xl hover:bg-amber-50 hover:text-black "
          >
            {loading
              ? "Sending..."
              : editing
              ? "Update Announcement"
              : "Create Announcement"}
          </button>
        </div>

        {/* Announcements list */}
        <div className="space-y-6">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="p-6 rounded-lg shadow-md border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {a.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {a.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(a)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="border p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="my-4">
              Are you sure you want to delete this announcement?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={deleteAnnouncement}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
