"use client";

import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Sidebar } from "@/app/component/Sidebar";
import { usePathname, useRouter } from "next/navigation";

type EventType = {
  id: number;
  title: string;
  description?: string;
  date: string;
  location: string;
  image_urls?: string[];
  video_url?: string;
};

const inputClass =
  "w-full p-3 rounded-lg bg-[#1f2937] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition-all duration-200";

// Custom Calendar Component
const CustomCalendar = ({
  selectedDate,
  onDateSelect,
  onClose,
}: {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    selectedDate ? new Date(selectedDate).getDate() : null
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    setSelectedDay(day);
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    // Fix timezone issue by using local date formatting instead of toISOString()
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${dayStr}`;
    onDateSelect(formattedDate);
    onClose();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDay === day &&
        selectedDate &&
        new Date(selectedDate).getMonth() === currentMonth.getMonth() &&
        new Date(selectedDate).getFullYear() === currentMonth.getFullYear();

      const isToday =
        new Date().toDateString() ===
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          day
        ).toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-600 hover:text-white ${
            isSelected
              ? "bg-indigo-600 text-white shadow-lg"
              : isToday
              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="absolute top-full left-0 mt-2 z-[9999] bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-xl shadow-2xl p-4 backdrop-blur-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-lg font-semibold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      {/* Close Button */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <button
          onClick={onClose}
          className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const totalPages = Math.ceil(events.length / eventsPerPage);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    imageFile: [] as File[],
    videoFile: null as File | null,
  });

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    eventId: null as number | null,
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

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

    if (files) {
      if (name === "imageFile")
        setForm({ ...form, imageFile: Array.from(files) });
      else if (name === "videoFile") setForm({ ...form, videoFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
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
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("location", form.location);

    form.imageFile.forEach((file) => formData.append("images", file));
    if (form.videoFile) formData.append("video", form.videoFile);

    const endpoint =
      formMode === "add" ? "/api/events" : `/api/events?id=${editingId}`;

    try {
      const res = await fetch(endpoint, {
        method: formMode === "add" ? "POST" : "PUT",
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
      description: event.description || "",
      date: event.date.split("T")[0],
      location: event.location,
      imageFile: [],
      videoFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (deleteModal.eventId === null) return;

    try {
      const res = await fetch(`/api/events?id=${deleteModal.eventId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        fetchEvents();
        setCurrentPage(1); // Reset to first page after delete
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setDeleteModal({ open: false, eventId: null });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Menu Overlay */}
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
          <div className="w-10" /> {/* Spacer */}
        </div>

        <main className="p-4 sm:p-6 lg:p-8 text-white min-h-screen">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #4f46e5",
              },
            }}
          />

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {formMode === "add" ? "Add New Event" : "Edit Event"}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {formMode === "add"
                ? "Create a new event for your community"
                : "Update event information"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mb-12 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-sm"
          >
            {/* Event Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-400 mb-6 flex items-center gap-2">
                <CalendarDays size={24} />
                Event Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Event Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Event Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Enter event description (optional)"
                    rows={4}
                    className="w-full p-3 rounded-lg bg-[#1f2937] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition-all duration-200 resize-none"
                  />
                </div>
                <div className="relative" ref={calendarRef}>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Event Date *
                  </label>
                  <div
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={`${inputClass} cursor-pointer flex items-center justify-between`}
                  >
                    <span
                      className={form.date ? "text-white" : "text-gray-400"}
                    >
                      {form.date
                        ? (() => {
                            // Parse date without timezone conversion
                            const dateParts = form.date.split("-");
                            const localDate = new Date(
                              parseInt(dateParts[0]),
                              parseInt(dateParts[1]) - 1,
                              parseInt(dateParts[2])
                            );
                            return localDate.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                          })()
                        : "Select event date"}
                    </span>
                    <CalendarDays size={18} className="text-gray-400" />
                  </div>
                  {showCalendar && (
                    <>
                      {/* Calendar backdrop overlay */}
                      <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setShowCalendar(false)}
                      />
                      <CustomCalendar
                        selectedDate={form.date}
                        onDateSelect={(date) => {
                          setForm({ ...form, date });
                          setShowCalendar(false);
                        }}
                        onClose={() => setShowCalendar(false)}
                      />
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Event Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleInputChange}
                    placeholder="Enter event location"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              {formMode === "edit" && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {formMode === "add" ? "Create Event" : "Update Event"}
              </button>
            </div>
          </form>

          {/* Events List Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-indigo-400 mb-2">
                  Your Events
                </h2>
                <p className="text-gray-400 text-sm">
                  Manage and organize your community events
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className="px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-full text-sm font-medium">
                  {events.length} {events.length === 1 ? "Event" : "Events"}
                </span>
              </div>
            </div>

            {/* Events Grid */}
            {events.length === 0 ? (
              <div className="text-center py-16">
                <CalendarDays
                  size={64}
                  className="mx-auto text-gray-600 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No events yet
                </h3>
                <p className="text-gray-500">
                  Create your first event to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-indigo-500/20 hover:scale-[1.02] hover:border-indigo-500/50"
                  >
                    {/* Event Content */}
                    <div className="p-5">
                      <h3
                        className="text-lg font-bold text-white mb-3 truncate"
                        title={event.title}
                      >
                        {event.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-zinc-400 flex items-center gap-2">
                          <CalendarDays size={14} />
                          {(() => {
                            // Parse date without timezone conversion
                            const eventDate = event.date.includes("T")
                              ? event.date.split("T")[0]
                              : event.date;
                            const dateParts = eventDate.split("-");
                            const localDate = new Date(
                              parseInt(dateParts[0]),
                              parseInt(dateParts[1]) - 1,
                              parseInt(dateParts[2])
                            );
                            return localDate.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                          })()}
                        </p>
                        <p className="text-sm text-zinc-400 flex items-center gap-2">
                          <span>📍</span>
                          <span className="truncate">{event.location}</span>
                        </p>
                        {event.description && (
                          <p
                            className="text-sm text-zinc-300 mt-3"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {event.description}
                          </p>
                        )}
                      </div>

                      {event.video_url && (
                        <div className="mb-4">
                          <video
                            src={event.video_url}
                            controls
                            className="w-full rounded-lg shadow-md bg-black"
                            style={{ maxHeight: "120px" }}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({ open: true, eventId: event.id })
                          }
                          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all duration-200 font-medium"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all duration-200 font-medium"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({events.length} total events)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteModal.open && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/50">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🗑️</span>
                  </div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">
                    Delete Event
                  </h3>
                  <p className="text-gray-300">
                    Are you sure you want to delete this event? This action
                    cannot be undone.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      setDeleteModal({ open: false, eventId: null })
                    }
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventsPage;
