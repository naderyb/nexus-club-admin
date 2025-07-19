"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const EventsPage = () => {
  type EventType = {
    id: number;
    title: string;
    date: string;
    location: string;
    image_urls?: string[];
    video_url?: string;
  };

  const [events, setEvents] = useState<EventType[]>([]);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    imageFile: [] as File[],
    videoFile: null as File | null,
  });

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch {
      toast.error("Failed to load events");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && name === "imageFile") {
      setForm({ ...form, imageFile: Array.from(files) });
    } else if (files && name === "videoFile") {
      setForm({ ...form, videoFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      date: "",
      location: "",
      imageFile: [],
      videoFile: null,
    });
    setFormMode("add");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (formMode === "edit") formData.append("id", String(editingId));
    formData.append("title", form.title);
    formData.append("date", form.date);
    formData.append("location", form.location);

    if (form.imageFile.length > 0) {
      form.imageFile.forEach((file) => formData.append("images", file));
    }

    if (form.videoFile) {
      formData.append("video", form.videoFile);
    }

    const method = formMode === "add" ? "POST" : "PUT";
    const endpoint =
      formMode === "add" ? "/api/events" : `/api/events?id=${editingId}`;

    try {
      const res = await fetch(endpoint, {
        method,
        body: formData,
      });
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        fetchEvents();
        resetForm();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleEdit = (event: EventType) => {
    setFormMode("edit");
    setEditingId(event.id);
    setForm({
      title: event.title,
      date: event.date.split("T")[0],
      location: event.location,
      imageFile: [],
      videoFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (eventToDelete === null) return;

    try {
      const res = await fetch(`/api/events?id=${eventToDelete}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        fetchEvents();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const openDeleteModal = (id: number) => {
    setEventToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setEventToDelete(null);
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-[#0e0e0e] text-white h-full transition-all duration-300 shadow-lg ${
          collapsed ? "w-16" : "w-56"
        } flex flex-col fixed left-0 top-0 z-40`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          {!collapsed && (
            <span className="text-base font-semibold tracking-wide">Nexus Admin</span>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="hover:scale-110 transition">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
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
    <div className="p-6 max-w-6xl mx-auto text-white">
      <Toaster />
      <h1 className="text-3xl font-bold text-indigo-500 mb-4 tracking-widest">
        {formMode === "add" ? "Add New Event" : "Edit Event"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-zinc-900 border border-indigo-500/30 p-6 rounded-2xl shadow-lg"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleInputChange}
          placeholder="Event Title"
          required
          className="inputClass"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleInputChange}
          required
          className="inputClass"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleInputChange}
          placeholder="Location"
          required
          className="inputClass"
        />
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="inputClass"
        />
        <input
          type="file"
          name="videoFile"
          accept="video/*"
          onChange={handleInputChange}
          className="inputClass"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {formMode === "add" ? "Create Event" : "Update Event"}
          </button>
          {formMode === "edit" && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-semibold mt-10 text-indigo-400">
        Existing Events
      </h2>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-2xl shadow-lg p-4 transition hover:shadow-indigo-500/30 hover:scale-[1.02]"
            >
              <h3 className="text-xl font-bold text-indigo-400">
                {event.title}
              </h3>
              <p className="text-sm text-zinc-400">
                📅 {event.date.split("T")[0]}
              </p>
              <p className="text-sm text-zinc-400">📍 {event.location}</p>

              {Array.isArray(event.image_urls) &&
                event.image_urls.length > 0 && (
                  <>
                    {event.image_urls.map((url: string, index: number) => (
                      <Image
                        key={index}
                        src={url}
                        alt={`Event Image ${index}`}
                        width={200}
                        height={150}
                        className="rounded-md hover:scale-105 transition-transform duration-300 shadow-md"
                        style={{ objectFit: "cover" }}
                      />
                    ))}
                  </>
                )}

              {event.video_url && (
                <video
                  src={event.video_url}
                  controls
                  className="mt-4 w-full rounded-lg shadow-md"
                />
              )}

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(event)}
                  className="px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => openDeleteModal(event.id)}
                  className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg w-96 border border-red-500/50">
            <h3 className="text-lg font-semibold text-red-500">Delete Event</h3>
            <p className="mt-2 text-white">
              Are you sure you want to delete this event?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default EventsPage;
