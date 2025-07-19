"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
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
import toast, { Toaster } from "react-hot-toast";

type User = {
  nom: string;
  prenom: string;
  email: string;
  role: string;
};

type QuickAddType = "event" | "project" | "member";

const inputClass =
  "w-full border border-gray-300 p-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500";

const navItems = [
  { name: "Events", href: "/nx-admin/events", icon: CalendarDays },
  { name: "Projects", href: "/nx-admin/projects", icon: FolderKanban },
  { name: "Members", href: "/nx-admin/members", icon: Users },
  { name: "Announcements", href: "/nx-admin/announcements", icon: Megaphone },
  { name: "Account", href: "/nx-admin/account", icon: Settings },
  { name: "Logs", href: "/nx-admin/logs", icon: FileClock },
];

export default function AdminDashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const [showForm, setShowForm] = useState<QuickAddType | null>(null);

  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
  });
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
  });
  const [memberData, setMemberData] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Collapse sidebar on small screens
  useEffect(() => {
    if (window.innerWidth < 640) setCollapsed(true);
  }, []);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/nx-admin");

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
      router.push("/nx-admin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/nx-admin");
  };

  const handleQuickAdd = async (
    e: FormEvent<HTMLFormElement>,
    type: QuickAddType
  ) => {
    e.preventDefault();
    console.log("Sending data to API:", memberData); // Add this line to log member data
    const payload =
      type === "event"
        ? { type, ...eventData }
        : type === "project"
        ? { type, ...projectData }
        : { type, ...memberData };

    const toastId = toast.loading(`Adding ${type}...`);

    try {
      const res = await fetch("/api/quick-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success(`${type[0].toUpperCase() + type.slice(1)} added!`, {
        id: toastId,
      });
      setShowForm(null);
      setEventData({ name: "", date: "", location: "" });
      setProjectData({ title: "", description: "" });
      setMemberData({ name: "", email: "", role: "" });
    } catch {
      toast.error(`Error adding ${type}`, { id: toastId });
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-xl">
          You must log in to access the admin panel
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Toaster position="top-right" />
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
        onClick={handleLogout}
        className="w-full px-4 py-3 text-sm flex items-center justify-center border-t border-gray-700 hover:bg-gray-800 transition"
      >
        <LogOut className="w-4 h-4" />
        {!collapsed && <span className="ml-2">Logout</span>}
      </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-6 bg-gray-50 dark:bg-zinc-800 transition-all duration-300 ${
      collapsed ? "ml-16" : "ml-56"
      }`}>
      <div className="flex justify-center mb-6">
        <Image
        src="/logo-nexus.png"
        alt="Nexus Club Logo"
        width={256}
        height={80}
        className="w-64"
        priority
        />
      </div>

      <header className="text-xl font-bold mb-2">
        Welcome, {user.nom} {user.prenom}{" "}
        <span className="text-sm text-gray-500">({user.role})</span>
      </header>

      <h1 className="text-4xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {["Events", "Projects", "Members"].map((label, i) => (
        <div
          key={label}
          className="bg-white dark:bg-zinc-900 shadow-lg p-5 rounded-xl transition"
        >
          <h3 className="text-base font-semibold text-gray-600 dark:text-gray-400 mb-1">{`Total ${label}`}</h3>
          <p className="text-3xl font-bold text-black dark:text-white">
          {[12, 8, 24][i]}
          </p>
        </div>
        ))}
      </div>

      {/* Quick Add Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowForm(showForm === "event" ? null : "event")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow transition"
          >
            <PlusCircle size={18} /> Add Event
          </button>
          <button
            onClick={() =>
              setShowForm(showForm === "project" ? null : "project")
            }
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow transition"
          >
            <PlusCircle size={18} /> Add Project
          </button>
          <button
            onClick={() => setShowForm(showForm === "member" ? null : "member")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition"
          >
            <PlusCircle size={18} /> Add Member
          </button>
        </div>

        {/* Conditional Forms */}
        {showForm === "event" && (
          <form
            onSubmit={(e) => handleQuickAdd(e, "event")}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-5 rounded-xl shadow-md mb-6 space-y-4"
          >
            <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              Add Event
            </h4>
            <input
              value={eventData.name}
              onChange={(e) =>
                setEventData({ ...eventData, name: e.target.value })
              }
              className={inputClass}
              placeholder="Event Name"
              required
            />
            <input
              type="date"
              value={eventData.date}
              onChange={(e) =>
                setEventData({ ...eventData, date: e.target.value })
              }
              className={inputClass}
              required
            />
            <input
              value={eventData.location}
              onChange={(e) =>
                setEventData({ ...eventData, location: e.target.value })
              }
              className={inputClass}
              placeholder="Event Location"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Submit Event
            </button>
          </form>
        )}

        {showForm === "project" && (
          <form
          onSubmit={(e) => handleQuickAdd(e, 'project')}
          className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-5 rounded-xl shadow-md mb-6 space-y-4"
        >
            <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">Add Project</h4>
            <input
              value={projectData.title}
              onChange={(e) =>
                setProjectData({ ...projectData, title: e.target.value })
              }
              className={inputClass}
              placeholder="Project Title"
              required
            />
            <textarea
              value={projectData.description}
              onChange={(e) =>
                setProjectData({ ...projectData, description: e.target.value })
              }
              className={inputClass}
              placeholder="Project Description"
              rows={3}
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit Project
            </button>
          </form>
        )}

        {showForm === "member" && (
          <form
          onSubmit={(e) => handleQuickAdd(e, 'event')}
          className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-5 rounded-xl shadow-md mb-6 space-y-4"
        >
            <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">Add Member</h4>
            <input
              value={memberData.name}
              onChange={(e) =>
                setMemberData({ ...memberData, name: e.target.value })
              }
              className={inputClass}
              placeholder="Member Name"
              required
            />
            <input
              value={memberData.email}
              onChange={(e) =>
                setMemberData({ ...memberData, email: e.target.value })
              }
              className={inputClass}
              placeholder="Member Email"
              required
            />
            <input
              value={memberData.role}
              onChange={(e) =>
                setMemberData({ ...memberData, role: e.target.value })
              }
              className={inputClass}
              placeholder="Member Role"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Member
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
