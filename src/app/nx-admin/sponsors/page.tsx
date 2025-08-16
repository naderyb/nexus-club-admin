// Enhanced Drawer component for editing ALL sponsor details including new fields
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
  AlertTriangle,
  Filter,
  Search,
  Send,
  UserCheck,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Enhanced Types - matching your database schema with new fields
type Sponsor = {
  id: number;
  name: string;
  secteur_activite: string | null;
  phone: string | null;
  email: string | null;
  called: boolean;
  comments: string | null;
  created_at: string;
  // New fields
  contact_person?: string | null;
  contact_position?: string | null;
  email_sent?: boolean;
};

// Filter types
type CallFilter = "all" | "called" | "pending";
type EmailFilter = "all" | "sent" | "not_sent";

// Small UI helpers
function clsx(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

// EditDrawer Component
function EditDrawer({ 
  sponsor, 
  onClose, 
  onSave 
}: { 
  sponsor: Sponsor; 
  onClose: () => void; 
  onSave: (patch: Partial<Sponsor>) => Promise<void>; 
}) {
  const [editForm, setEditForm] = useState({
    name: sponsor.name,
    secteur_activite: sponsor.secteur_activite || "",
    phone: sponsor.phone || "",
    email: sponsor.email || "",
    contact_person: sponsor.contact_person || "",
    contact_position: sponsor.contact_position || "",
    called: sponsor.called,
    email_sent: sponsor.email_sent || false,
    comments: sponsor.comments || "",
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        name: editForm.name.trim(),
        secteur_activite: editForm.secteur_activite.trim() || null,
        phone: editForm.phone.trim() || null,
        email: editForm.email.trim() || null,
        contact_person: editForm.contact_person.trim() || null,
        contact_position: editForm.contact_position.trim() || null,
        called: editForm.called,
        email_sent: editForm.email_sent,
        comments: editForm.comments.trim() || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Edit3 size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Edit Sponsor
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Update sponsor information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Company Name
              </label>
              <input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Secteur d&apos;Activité
              </label>
              <input
                value={editForm.secteur_activite}
                onChange={(e) => setEditForm(prev => ({ ...prev, secteur_activite: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Contact Person
                </label>
                <input
                  value={editForm.contact_person}
                  onChange={(e) => setEditForm(prev => ({ ...prev, contact_person: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Position
                </label>
                <input
                  value={editForm.contact_position}
                  onChange={(e) => setEditForm(prev => ({ ...prev, contact_position: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Phone
                </label>
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Called Status</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Mark if this sponsor has been contacted</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditForm(prev => ({ ...prev, called: !prev.called }))}
                  className={clsx(
                    "w-12 h-6 rounded-full transition-all relative",
                    editForm.called ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                  )}
                >
                  <div
                    className={clsx(
                      "w-5 h-5 bg-white rounded-full transition-all absolute top-0.5",
                      editForm.called ? "left-6" : "left-0.5"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Send size={20} className="text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Email Sent</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Mark if email has been sent to this sponsor</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditForm(prev => ({ ...prev, email_sent: !prev.email_sent }))}
                  className={clsx(
                    "w-12 h-6 rounded-full transition-all relative",
                    editForm.email_sent ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                  )}
                >
                  <div
                    className={clsx(
                      "w-5 h-5 bg-white rounded-full transition-all absolute top-0.5",
                      editForm.email_sent ? "left-6" : "left-0.5"
                    )}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Comments
              </label>
              <textarea
                value={editForm.comments}
                onChange={(e) => setEditForm(prev => ({ ...prev, comments: e.target.value }))}
                rows={4}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                placeholder="Add any notes or comments about this sponsor..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-6">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editForm.name.trim()}
                className={clsx(
                  "flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all flex items-center justify-center space-x-2",
                  saving || !editForm.name.trim()
                    ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [deleteModal, setDeleteModal] = useState<Sponsor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter states
  const [callFilter, setCallFilter] = useState<CallFilter>("all");
  const [emailFilter, setEmailFilter] = useState<EmailFilter>("all");
  const [secteurFilter, setSecteurFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced form state (create)
  const [name, setName] = useState("");
  const [secteur_activite, setSecteurActivite] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPosition, setContactPosition] = useState("");

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
    document.cookie =
      "nexus_administrateur=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  // Get unique sectors for filter dropdown
  const uniqueSectors = useMemo(() => {
    const sectors = sponsors
      .map(s => s.secteur_activite)
      .filter((sector): sector is string => sector !== null && sector !== undefined)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return sectors;
  }, [sponsors]);

  // Enhanced filtering logic
  const filteredSponsors = useMemo(() => {
    return sponsors.filter(sponsor => {
      // Call status filter
      if (callFilter === "called" && !sponsor.called) return false;
      if (callFilter === "pending" && sponsor.called) return false;

      // Email status filter
      if (emailFilter === "sent" && !sponsor.email_sent) return false;
      if (emailFilter === "not_sent" && sponsor.email_sent) return false;

      // Sector filter
      if (secteurFilter !== "all" && sponsor.secteur_activite !== secteurFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = sponsor.name.toLowerCase().includes(query);
        const matchesSector = sponsor.secteur_activite?.toLowerCase().includes(query);
        const matchesPerson = sponsor.contact_person?.toLowerCase().includes(query);
        const matchesPosition = sponsor.contact_position?.toLowerCase().includes(query);
        const matchesEmail = sponsor.email?.toLowerCase().includes(query);
        
        if (!matchesName && !matchesSector && !matchesPerson && !matchesPosition && !matchesEmail) {
          return false;
        }
      }

      return true;
    });
  }, [sponsors, callFilter, emailFilter, secteurFilter, searchQuery]);

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

  useEffect(() => {
    fetchSponsors();
  }, []);

  const resetCreateForm = () => {
    setName("");
    setSecteurActivite("");
    setPhone("");
    setEmail("");
    setContactPerson("");
    setContactPosition("");
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
          contact_person: contactPerson.trim() || null,
          contact_position: contactPosition.trim() || null,
          called: false,
          email_sent: false,
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
      setDeleteModal(null);
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

  const handleQuickToggleEmail = async (sponsor: Sponsor) => {
    try {
      const response = await fetch(`/api/sponsors?id=${sponsor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_sent: !sponsor.email_sent,
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
      console.log(`✅ Updated sponsor email status: ${updatedSponsor.name}`);
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
  const calledCount = useMemo(() => sponsors.filter((s) => s.called).length, [sponsors]);
const emailSentCount = useMemo(() => sponsors.filter((s) => s.email_sent).length, [sponsors]);

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
            />
        )}

        {/* Continue with existing content... */}
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
      <div className={`transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-72"}`}>
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
                  <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                    <Send size={16} className="text-blue-600" />
                    <span className="font-medium text-blue-700 dark:text-blue-400">
                      {emailSentCount} Emailed
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
                      <Building2 size={16} />
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
                      <Briefcase size={16} />
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
                        <User size={16} />
                        <span>Contact Person</span>
                      </label>
                      <input
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="Ahmed Benali"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                        <UserCheck size={16} />
                        <span>Position</span>
                      </label>
                      <input
                        value={contactPosition}
                        onChange={(e) => setContactPosition(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        placeholder="Marketing Director"
                      />
                    </div>
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

            {/* List Panel with Filters */}
            <section className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-900/5">
                <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
                                      <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Users size={18} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                          Sponsors Directory
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
                          {filteredSponsors.length} of {total} sponsors shown
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={fetchSponsors}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium"
                    >
                      <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* Enhanced Filters */}
                  <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search sponsors, contacts, sectors..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    {/* Filter Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Call Status Filter */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide flex items-center space-x-1">
                          <Phone size={12} />
                          <span>Call Status</span>
                        </label>
                        <select
                          value={callFilter}
                          onChange={(e) => setCallFilter(e.target.value as CallFilter)}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        >
                          <option value="all">All Sponsors</option>
                          <option value="called">Called</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>

                      {/* Email Status Filter */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide flex items-center space-x-1">
                          <Mail size={12} />
                          <span>Email Status</span>
                        </label>
                        <select
                          value={emailFilter}
                          onChange={(e) => setEmailFilter(e.target.value as EmailFilter)}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        >
                          <option value="all">All Statuses</option>
                          <option value="sent">Email Sent</option>
                          <option value="not_sent">Not Sent</option>
                        </select>
                      </div>

                      {/* Sector Filter */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide flex items-center space-x-1">
                          <Briefcase size={12} />
                          <span>Sector</span>
                        </label>
                        <select
                          value={secteurFilter}
                          onChange={(e) => setSecteurFilter(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        >
                          <option value="all">All Sectors</option>
                          {uniqueSectors.map((sector) => (
                            <option key={sector} value={sector}>
                              {sector}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Active Filters Display */}
                    {(callFilter !== "all" || emailFilter !== "all" || secteurFilter !== "all" || searchQuery.trim()) && (
                      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Filter size={14} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active filters:</span>
                        
                        {callFilter !== "all" && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            Call: {callFilter}
                            <button
                              onClick={() => setCallFilter("all")}
                              className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        )}
                        
                        {emailFilter !== "all" && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            Email: {emailFilter === "sent" ? "Sent" : "Not Sent"}
                            <button
                              onClick={() => setEmailFilter("all")}
                              className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        )}
                        
                        {secteurFilter !== "all" && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                            Sector: {secteurFilter}
                            <button
                              onClick={() => setSecteurFilter("all")}
                              className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        )}
                        
                        {searchQuery.trim() && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                            Search: &quot;{searchQuery}&quot;
                            <button
                              onClick={() => setSearchQuery("")}
                              className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        )}
                        
                        <button
                          onClick={() => {
                            setCallFilter("all");
                            setEmailFilter("all");
                            setSecteurFilter("all");
                            setSearchQuery("");
                          }}
                          className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 underline ml-2"
                        >
                          Clear all
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                
                                  {/* Sponsors List */}
                                  <div className="p-6 space-y-4">
                                    {loading ? (
                                      <div className="flex items-center justify-center py-12">
                                        <RefreshCw size={24} className="animate-spin text-slate-400" />
                                      </div>
                                    ) : filteredSponsors.length === 0 ? (
                                      <div className="text-center py-12">
                                        <Users size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400">No sponsors found</p>
                                      </div>
                                    ) : (
                                      filteredSponsors.map((sponsor) => (
                                        <div
                                          key={sponsor.id}
                                          className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {sponsor.name}
                                              </h3>
                                              {sponsor.secteur_activite && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                  {sponsor.secteur_activite}
                                                </p>
                                              )}
                                              {sponsor.contact_person && (
                                                <p className="text-sm text-slate-500 dark:text-slate-500">
                                                  Contact: {sponsor.contact_person}
                                                  {sponsor.contact_position && ` (${sponsor.contact_position})`}
                                                </p>
                                              )}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <button
                                                onClick={() => handleQuickToggleCall(sponsor)}
                                                className={clsx(
                                                  "p-2 rounded-lg transition-all",
                                                  sponsor.called
                                                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                                                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                                )}
                                              >
                                                <Phone size={16} />
                                              </button>
                                              <button
                                                onClick={() => handleQuickToggleEmail(sponsor)}
                                                className={clsx(
                                                  "p-2 rounded-lg transition-all",
                                                  sponsor.email_sent
                                                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                                )}
                                              >
                                                <Send size={16} />
                                              </button>
                                              <button
                                                onClick={() => setEditing(sponsor)}
                                                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                                              >
                                                <Edit3 size={16} />
                                              </button>
                                              <button
                                                onClick={() => setDeleteModal(sponsor)}
                                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                                              >
                                                <Trash2 size={16} />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </section>
                            </main>
                
                            {/* Edit Drawer */}
                            {editing && (
                              <EditDrawer
                                sponsor={editing}
                                onClose={() => setEditing(null)}
                                onSave={handleUpdate}
                              />
                            )}
                
                            {/* Delete Modal */}
                            {deleteModal && (
                              <div className="fixed inset-0 z-50">
                                <div
                                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                  onClick={() => setDeleteModal(null)}
                                />
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                                  <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                      <AlertTriangle size={20} className="text-red-600" />
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Delete Sponsor
                                      </h3>
                                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        This action cannot be undone
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-slate-700 dark:text-slate-300 mb-6">
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold">{deleteModal.name}</span>?
                                  </p>
                                  <div className="flex space-x-3">
                                    <button
                                      onClick={() => setDeleteModal(null)}
                                      className="flex-1 px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleDelete(deleteModal)}
                                      disabled={deletingId === deleteModal.id}
                                      className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all"
                                    >
                                      {deletingId === deleteModal.id ? "Deleting..." : "Delete"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }