"use client";

import { useMemo, useState, useEffect } from "react";
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
  Plus,
  RefreshCw,
  Phone,
  Mail,
  Building2,
  User,
  Edit3,
  Trash2,
  Check,
  Clock,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Types - matching your database schema
type Sponsor = {
  id: number;
  name: string;
  secteur_activite: string | null;
  phone: string | null;
  email: string | null;
  called: boolean;
  comments: string | null;
  created_at: string;
};

// Small UI helpers
function clsx(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [deleteModal, setDeleteModal] = useState<Sponsor | null>(null); // Add delete modal state
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form state (create)
  const [name, setName] = useState("");
  const [secteur_activite, setSecteurActivite] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/nx-admin/dashboard", icon: Grid },
    { name: "Events", href: "/nx-admin/events", icon: CalendarDays },
    { name: "Projects", href: "/nx-admin/projects", icon: FolderKanban },
    { name: "Members", href: "/nx-admin/members", icon: Users },
    { name: "Sponsors", href: "/nx-admin/sponsors", icon: Building2 },
  ];

  const handleLogout = () => {
    // Clear any stored authentication data
    document.cookie =
      "nexus_administrateur=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  // Fetch sponsors from API
  const fetchSponsors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/sponsors", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to fetch sponsors: ${response.status}`);
      }
      const data: Sponsor[] = await response.json();
      setSponsors(data);
      console.log(`✅ Loaded ${data.length} sponsors`);
    } catch (err) {
      console.error("❌ Error fetching sponsors:", err);
      setError(err instanceof Error ? err.message : "Failed to load sponsors");
    } finally {
      setLoading(false);
    }
  };

  // Load sponsors on component mount
  useEffect(() => {
    fetchSponsors();
  }, []);

  const resetCreateForm = () => {
    setName("");
    setSecteurActivite("");
    setPhone("");
    setEmail("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          secteur_activite: secteur_activite.trim() || null,
          phone: phone.trim() || null,
          email: email.trim() || null,
          called: false,
          comments: null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create sponsor");
      }

      const newSponsor: Sponsor = await response.json();
      setSponsors((prev) => [newSponsor, ...prev]);
      resetCreateForm();
      console.log(`✅ Created sponsor: ${newSponsor.name}`);
    } catch (err) {
      console.error("❌ Error creating sponsor:", err);
      setError(err instanceof Error ? err.message : "Failed to create sponsor");
    } finally {
      setCreating(false);
    }
  };

  // Updated handleDelete to use modal confirmation
  const handleDelete = async (sponsor: Sponsor) => {
    setDeletingId(sponsor.id);
    setError(null);

    try {
      const response = await fetch(`/api/sponsors?id=${sponsor.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete sponsor");
      }

      setSponsors((prev) => prev.filter((s) => s.id !== sponsor.id));
      setDeleteModal(null); // Close modal on success
      console.log(`✅ Deleted sponsor: ${sponsor.name}`);
    } catch (err) {
      console.error("❌ Error deleting sponsor:", err);
      setError(err instanceof Error ? err.message : "Failed to delete sponsor");
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuickToggleCall = async (sponsor: Sponsor) => {
    try {
      const response = await fetch(`/api/sponsors?id=${sponsor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          called: !sponsor.called,
          comments: sponsor.comments,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update sponsor");
      }

      const updatedSponsor: Sponsor = await response.json();
      setSponsors((prev) =>
        prev.map((s) => (s.id === updatedSponsor.id ? updatedSponsor : s))
      );
      console.log(`✅ Updated sponsor call status: ${updatedSponsor.name}`);
    } catch (err) {
      console.error("❌ Error updating sponsor:", err);
      setError(err instanceof Error ? err.message : "Failed to update sponsor");
    }
  };

  const handleUpdate = async (patch: Partial<Sponsor>) => {
    if (!editing) return;
    setError(null);

    try {
      const response = await fetch(`/api/sponsors?id=${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update sponsor");
      }

      const updatedSponsor: Sponsor = await response.json();
      setSponsors((prev) =>
        prev.map((s) => (s.id === updatedSponsor.id ? updatedSponsor : s))
      );
      setEditing(updatedSponsor);
      console.log(`✅ Updated sponsor: ${updatedSponsor.name}`);
    } catch (err) {
      console.error("❌ Error updating sponsor:", err);
      setError(err instanceof Error ? err.message : "Failed to update sponsor");
    }
  };

  const total = sponsors.length;
  const calledCount = useMemo(
    () => sponsors.filter((s) => s.called).length,
    [sponsors]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 transition-all duration-300 shadow-xl z-50 ${
          collapsed ? "w-20" : "w-72"
        } ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed h-full left-0 top-0 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Nexus Admin
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-all duration-200 hidden lg:block"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-all duration-200 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group ${
                pathname === href
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon
                size={20}
                className={
                  pathname === href
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                }
              />
              {!collapsed && <span>{name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-sm flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-700 dark:text-slate-200 p-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-all duration-200"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Nexus Admin
            </span>
          </div>
          <div className="w-10" />
        </div>

        {/* Page Content */}
        <div className="min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
            <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Sponsors Management
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Manage and track sponsor relationships
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="hidden sm:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                    <Users size={16} className="text-slate-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {total} Total
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                    <Check size={16} className="text-green-600" />
                    <span className="font-medium text-green-700 dark:text-green-400">
                      {calledCount} Called
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-2 rounded-lg">
                    <Clock size={16} className="text-orange-600" />
                    <span className="font-medium text-orange-700 dark:text-orange-400">
                      {total - calledCount} Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-6 py-8 grid gap-8 lg:grid-cols-5">
            {/* Create Panel */}
            <section className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-900/5">
                <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Plus size={18} className="text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Add New Sponsor
                    </h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                    Create a new sponsor entry in the system
                  </p>
                </div>

                <form onSubmit={handleCreate} className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <User size={16} />
                      <span>Company Name *</span>
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="e.g., Sonatrach, Condor Electronics..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <Building2 size={16} />
                      <span>Secteur d&apos;Activité</span>
                    </label>
                    <input
                      value={secteur_activite}
                      onChange={(e) => setSecteurActivite(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      placeholder="e.g., Technology, Energy, Banking..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                        <Phone size={16} />
                        <span>Phone</span>
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="+213 555 123 456"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                        <Mail size={16} />
                        <span>Email</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="contact@company.dz"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={creating || !name.trim()}
                    className={clsx(
                      "w-full rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2",
                      creating || !name.trim()
                        ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
                    )}
                  >
                    {creating ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Adding Sponsor...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Add Sponsor</span>
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-2">
                        <X size={16} />
                        <span>{error}</span>
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </section>

            {/* List Panel */}
            <section className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-900/5">
                <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Users size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Sponsors Directory
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
                        {total} sponsors in database
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={fetchSponsors}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium"
                  >
                    <RefreshCw
                      size={16}
                      className={loading ? "animate-spin" : ""}
                    />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="p-12 text-center">
                      <RefreshCw
                        size={32}
                        className="animate-spin mx-auto text-slate-400 mb-4"
                      />
                      <p className="text-slate-600 dark:text-slate-400">
                        Loading sponsors...
                      </p>
                    </div>
                  ) : sponsors.length === 0 ? (
                    <div className="p-12 text-center">
                      <Building2
                        size={48}
                        className="mx-auto text-slate-300 dark:text-slate-600 mb-4"
                      />
                      <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">
                        No sponsors yet
                      </p>
                      <p className="text-slate-500 dark:text-slate-500 text-sm">
                        Add your first sponsor using the form on the left
                      </p>
                    </div>
                  ) : (
                    <div className="min-w-full">
                      {sponsors.map((s, index) => (
                        <div
                          key={s.id}
                          className={clsx(
                            "p-6 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-200",
                            index === sponsors.length - 1 && "border-b-0"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Building2
                                  size={20}
                                  className="text-slate-600 dark:text-slate-400"
                                />
                              </div>

                              <div className="flex-1 min-w-0 space-y-3">
                                {/* Header with name and status */}
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                                    {s.name}
                                  </h3>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleQuickToggleCall(s)}
                                      className={clsx(
                                        "inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer hover:shadow-md",
                                        s.called
                                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                                          : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                                      )}
                                      title={
                                        s.called
                                          ? "Mark as pending"
                                          : "Mark as called"
                                      }
                                    >
                                      {s.called ? (
                                        <Check size={12} />
                                      ) : (
                                        <Clock size={12} />
                                      )}
                                      <span>
                                        {s.called ? "Called" : "Pending"}
                                      </span>
                                    </button>
                                  </div>
                                </div>

                                {/* Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                                    <Building2 size={14} />
                                    <span>{s.secteur_activite || "—"}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                                    <Phone size={14} />
                                    <span>{s.phone || "—"}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                                    <Mail size={14} />
                                    <span className="truncate">
                                      {s.email || "—"}
                                    </span>
                                  </div>
                                </div>

                                {/* Comments - Always visible when present */}
                                {s.comments && (
                                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-indigo-500">
                                    <div className="flex items-start space-x-2">
                                      <MessageSquare
                                        size={14}
                                        className="text-indigo-500 mt-0.5 flex-shrink-0"
                                      />
                                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {s.comments}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                              <button
                                onClick={() => setEditing(s)}
                                className="p-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                                title="Edit sponsor"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteModal(s)} // Updated to use modal
                                disabled={deletingId === s.id}
                                className={clsx(
                                  "p-2 rounded-xl border transition-all",
                                  deletingId === s.id
                                    ? "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                    : "border-slate-300 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                                )}
                                title="Delete sponsor"
                              >
                                {deletingId === s.id ? (
                                  <RefreshCw
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Edit Drawer */}
      {editing && (
        <EditDrawer
          sponsor={editing}
          onClose={() => setEditing(null)}
          onSave={async (patch) => {
            await handleUpdate(patch);
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          sponsor={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={() => handleDelete(deleteModal)}
          isDeleting={deletingId === deleteModal.id}
        />
      )}
    </div>
  );
}

// Delete Modal Component
function DeleteModal({
  sponsor,
  onClose,
  onConfirm,
  isDeleting,
}: {
  sponsor: Sponsor;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 w-full max-w-md mx-4 transform transition-all">
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Delete Sponsor
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                {sponsor.name}
              </span>
              ?
            </p>
            {sponsor.comments && (
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                This sponsor has call notes that will also be permanently
                deleted.
              </p>
            )}
          </div>

          {/* Sponsor Details Preview */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center">
                <Building2
                  size={18}
                  className="text-slate-600 dark:text-slate-400"
                />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {sponsor.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {sponsor.secteur_activite || "No sector specified"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <Phone size={12} />
                <span>{sponsor.phone || "—"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail size={12} />
                <span className="truncate">{sponsor.email || "—"}</span>
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-2">
              <div
                className={clsx(
                  "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                  sponsor.called
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                )}
              >
                {sponsor.called ? <Check size={10} /> : <Clock size={10} />}
                <span>{sponsor.called ? "Called" : "Pending"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={clsx(
              "flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2",
              isDeleting
                ? "bg-red-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
            )}
          >
            {isDeleting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Sponsor</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Enhanced Drawer component for editing ALL sponsor details
function EditDrawer({
  sponsor,
  onClose,
  onSave,
}: {
  sponsor: Sponsor;
  onClose: () => void;
  onSave: (patch: Partial<Sponsor>) => Promise<void>;
}) {
  // All editable fields
  const [name, setName] = useState<string>(sponsor.name);
  const [secteurActivite, setSecteurActivite] = useState<string>(
    sponsor.secteur_activite || ""
  );
  const [phone, setPhone] = useState<string>(sponsor.phone || "");
  const [email, setEmail] = useState<string>(sponsor.email || "");
  const [called, setCalled] = useState<boolean>(sponsor.called);
  const [comments, setComments] = useState<string>(sponsor.comments || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await onSave({
      name: name.trim(),
      secteur_activite: secteurActivite.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      called,
      comments: comments.trim() || null,
    });

    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-l border-slate-200/50 dark:border-slate-700/50 overflow-y-auto">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Edit3 size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Edit Sponsor
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
                Update sponsor information and call status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              Company Information
            </h4>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <User size={16} />
                <span>Company Name *</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="Company name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <Building2 size={16} />
                <span>Secteur d&apos;Activité</span>
              </label>
              <input
                value={secteurActivite}
                onChange={(e) => setSecteurActivite(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="e.g., Technology, Energy, Banking..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                  <Phone size={16} />
                  <span>Phone Number</span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="+213 555 123 456"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="contact@company.dz"
                />
              </div>
            </div>
          </div>

          {/* Call Status */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              Contact Status
            </h4>

            <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Phone size={16} />
                  <span>Contact Status</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Mark if the sponsor has been contacted
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCalled((v) => !v)}
                className={clsx(
                  "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 border-2",
                  called
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-500 shadow-lg shadow-green-500/25"
                    : "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                )}
              >
                <span
                  className={clsx(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200",
                    called ? "translate-x-5" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              Notes & Comments
            </h4>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <MessageSquare size={16} />
                <span>Call Notes & Comments</span>
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                placeholder="Record call details, sponsor feedback, next steps, meeting schedules, or any relevant information..."
              />
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Document important details from your conversation with the
                sponsor
              </p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 -mx-6 px-6 pb-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl px-6 py-3 text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className={clsx(
                "flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2",
                saving || !name.trim()
                  ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
              )}
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
