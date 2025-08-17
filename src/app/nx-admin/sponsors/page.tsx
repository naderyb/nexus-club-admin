"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SponsorsHeader } from "./components/SponsorsHeader";
import { CreateSponsorPanel } from "./components/CreateSponsorPanel";
import { SponsorsListPanel } from "./components/SponsorsListPanel";
import { EditDrawer } from "./components/EditDrawer";
import { DeleteModal } from "./components/DeleteModal";
import { Sidebar } from "../../component/Sidebar";
import { MobileHeader } from "./components/MobileHeader";
import { FilterBar } from "./components/FilterBar";
import { StatsCards } from "./components/StatsCards";
import type { Sponsor, CallFilter, EmailFilter } from "./types";

export default function SponsorsPage() {
  // State management
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

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    secteur_activite: "",
    phone: "",
    email: "",
    contact_person: "",
    contact_position: "",
  });

  const pathname = usePathname();
  const router = useRouter();

  // Computed values
  const uniqueSectors = useMemo(() => {
    const sectors = sponsors
      .map((s) => s.secteur_activite)
      .filter(
        (sector): sector is string => sector !== null && sector !== undefined
      )
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return sectors;
  }, [sponsors]);

  const filteredSponsors = useMemo(() => {
    return sponsors.filter((sponsor) => {
      if (callFilter === "called" && !sponsor.called) return false;
      if (callFilter === "pending" && sponsor.called) return false;
      if (emailFilter === "sent" && !sponsor.email_sent) return false;
      if (emailFilter === "not_sent" && sponsor.email_sent) return false;
      if (secteurFilter !== "all" && sponsor.secteur_activite !== secteurFilter)
        return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchFields = [
          sponsor.name,
          sponsor.secteur_activite,
          sponsor.contact_person,
          sponsor.contact_position,
          sponsor.email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchFields.includes(query)) return false;
      }

      return true;
    });
  }, [sponsors, callFilter, emailFilter, secteurFilter, searchQuery]);

  const stats = useMemo(
    () => ({
      total: sponsors.length,
      called: sponsors.filter((s) => s.called).length,
      emailSent: sponsors.filter((s) => s.email_sent).length,
      pending: sponsors.filter((s) => !s.called).length,
    }),
    [sponsors]
  );

  // API functions
  const fetchSponsors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/sponsors", { cache: "no-store" });
      if (!response.ok)
        throw new Error(`Failed to fetch sponsors: ${response.status}`);
      const data: Sponsor[] = await response.json();
      setSponsors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sponsors");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          secteur_activite: formData.secteur_activite.trim() || null,
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null,
          contact_person: formData.contact_person.trim() || null,
          contact_position: formData.contact_position.trim() || null,
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
      setFormData({
        name: "",
        secteur_activite: "",
        phone: "",
        email: "",
        contact_person: "",
        contact_position: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create sponsor");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (sponsor: Sponsor) => {
    setDeletingId(sponsor.id);
    try {
      const response = await fetch(`/api/sponsors?id=${sponsor.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete sponsor");

      setSponsors((prev) => prev.filter((s) => s.id !== sponsor.id));
      setDeleteModal(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sponsor");
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuickToggle = async (
    sponsor: Sponsor,
    field: "called" | "email_sent"
  ) => {
    try {
      const response = await fetch(`/api/sponsors?id=${sponsor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !sponsor[field] }),
      });

      if (!response.ok) throw new Error("Failed to update sponsor");

      const updatedSponsor: Sponsor = await response.json();
      setSponsors((prev) =>
        prev.map((s) => (s.id === updatedSponsor.id ? updatedSponsor : s))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update sponsor");
    }
  };

  const handleUpdate = async (patch: Partial<Sponsor>) => {
    if (!editing) return;
    try {
      const response = await fetch(`/api/sponsors?id=${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (!response.ok) throw new Error("Failed to update sponsor");

      const updatedSponsor: Sponsor = await response.json();
      setSponsors((prev) =>
        prev.map((s) => (s.id === updatedSponsor.id ? updatedSponsor : s))
      );
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update sponsor");
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

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
          collapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Mobile Header */}
        <MobileHeader onMenuToggle={() => setMobileMenuOpen(true)} />

        <div className="min-h-screen">
          {/* Desktop Header */}
          <SponsorsHeader stats={stats} />

          {/* Mobile Stats Cards */}
          <div className="lg:hidden px-4 py-4">
            <StatsCards stats={stats} />
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden px-4 pb-4 space-y-4">
            {/* Mobile Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              callFilter={callFilter}
              setCallFilter={setCallFilter}
              emailFilter={emailFilter}
              setEmailFilter={setEmailFilter}
              secteurFilter={secteurFilter}
              setSecteurFilter={setSecteurFilter}
              uniqueSectors={uniqueSectors}
              isMobile={true}
            />

            {/* Mobile Create Panel */}
            <CreateSponsorPanel
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreate}
              creating={creating}
              error={error}
              isMobile={true}
            />

            {/* Mobile Sponsors List */}
            <SponsorsListPanel
              sponsors={filteredSponsors}
              loading={loading}
              onRefresh={fetchSponsors}
              onEdit={setEditing}
              onDelete={setDeleteModal}
              onQuickToggle={handleQuickToggle}
              isMobile={true}
            />
          </div>

          {/* Desktop Layout */}
          <main className="hidden lg:grid mx-auto max-w-7xl px-6 py-8 gap-8 lg:grid-cols-5">
            <CreateSponsorPanel
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreate}
              creating={creating}
              error={error}
              isMobile={false}
            />

            <div className="lg:col-span-3 space-y-6">
              <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                callFilter={callFilter}
                setCallFilter={setCallFilter}
                emailFilter={emailFilter}
                setEmailFilter={setEmailFilter}
                secteurFilter={secteurFilter}
                setSecteurFilter={setSecteurFilter}
                uniqueSectors={uniqueSectors}
                isMobile={false}
              />

              <SponsorsListPanel
                sponsors={filteredSponsors}
                loading={loading}
                onRefresh={fetchSponsors}
                onEdit={setEditing}
                onDelete={setDeleteModal}
                onQuickToggle={handleQuickToggle}
                isMobile={false}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      {editing && (
        <EditDrawer
          sponsor={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteModal && (
        <DeleteModal
          sponsor={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDelete}
          isDeleting={deletingId === deleteModal.id}
        />
      )}
    </div>
  );
}
