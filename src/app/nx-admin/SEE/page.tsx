"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Sidebar } from "@/app/component/Sidebar";
import Footer from "@/app/component/footer";

type RegistrationStatus = "pending" | "confirmed" | "cancelled";

interface Registration {
  id: number;
  full_name: string;
  classe: string;
  email: string;
  phone: string;
  study_place: string;
  motivation: string;
  extra: string | null;
  status: RegistrationStatus;
  registeredAt: string; // ISO date
}

interface SeeRegistrationApiRow {
  id: number;
  full_name: string;
  classe: string;
  email: string;
  phone: string;
  study_place: string;
  motivation: string;
  extra: string | null;
  status?: RegistrationStatus;
  created_at: string;
}

export default function SEEPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | RegistrationStatus>(
    "all",
  );
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/see", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to fetch registrations: ${res.status}`);
        }

        const data: SeeRegistrationApiRow[] = await res.json();

        const mapped: Registration[] = data.map((row) => ({
          id: row.id,
          full_name: row.full_name,
          classe: row.classe,
          email: row.email,
          phone: row.phone,
          study_place: row.study_place,
          motivation: row.motivation,
          extra: row.extra ?? null,
          status: (row.status as RegistrationStatus) ?? "confirmed",
          registeredAt: row.created_at,
        }));

        setRegistrations(mapped);
      } catch (err) {
        console.error("Error fetching SEE registrations:", err);
        setError("Impossible de charger les inscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const updateStatus = async (id: number, status: RegistrationStatus) => {
    try {
      setUpdatingId(id);
      setError(null);

      const res = await fetch("/api/see", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update status: ${res.status}`);
      }

      const updated: SeeRegistrationApiRow = await res.json();

      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: (updated.status as RegistrationStatus) ?? status,
              }
            : r,
        ),
      );
    } catch (err) {
      console.error("Error updating SEE registration status:", err);
      setError("Impossible de mettre à jour le statut");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesStatus =
        statusFilter === "all" || reg.status === statusFilter;

      const term = search.toLowerCase().trim();
      const matchesSearch =
        !term ||
        [
          reg.full_name,
          reg.classe,
          reg.email,
          reg.phone,
          reg.study_place,
          reg.motivation,
          reg.extra ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [registrations, statusFilter, search]);

  const stats = useMemo(
    () => ({
      total: registrations.length,
      confirmed: registrations.filter((r) => r.status === "confirmed").length,
      pending: registrations.filter((r) => r.status === "pending").length,
      cancelled: registrations.filter((r) => r.status === "cancelled").length,
    }),
    [registrations],
  );

  return (
    <div className="min-h-screen bg-gray-900">
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
        <main className="p-4 sm:p-6 lg:p-8 text-white min-h-screen">
          <div className="max-w-7xl mx-auto">
            {loading && (
              <div className="mb-4 rounded-lg border border-indigo-500/40 bg-zinc-900/70 px-4 py-3 text-sm text-gray-200">
                Chargement des inscriptions en cours...
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-medium text-indigo-300/80 uppercase tracking-wide mb-2">
                  <Calendar size={14} />
                  Sortie en entreprise
                </p>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  SEE – Sortie en entreprise registrations
                </h1>
                <p className="text-gray-400 max-w-2xl">
                  Manage all registrations for the official Nexus Club sortie en
                  entreprise: track confirmed spots, waiting list and
                  cancellations.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-300">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/80 border border-gray-700">
                  <Calendar size={16} className="text-indigo-300" />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p>15 Mars 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/80 border border-gray-700">
                  <MapPin size={16} className="text-emerald-300" />
                  <div>
                    <p className="text-xs text-gray-400">Lieu</p>
                    <p>Tunis – Entreprise partenaire</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-lg p-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 mb-3 flex items-center justify-center">
                  <Users size={18} className="text-indigo-300" />
                </div>
                <p className="text-sm text-gray-400">Total inscrits</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-emerald-500/30 rounded-lg p-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/30 mb-3 flex items-center justify-center">
                  <CheckCircle size={18} className="text-emerald-300" />
                </div>
                <p className="text-sm text-gray-400">Confirmés</p>
                <p className="text-2xl font-bold text-white">
                  {stats.confirmed}
                </p>
              </div>

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-amber-500/30 rounded-lg p-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-500/30 mb-3 flex items-center justify-center">
                  <Clock size={18} className="text-amber-300" />
                </div>
                <p className="text-sm text-gray-400">En attente</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>

              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-red-500/30 rounded-lg p-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-red-600/30 mb-3 flex items-center justify-center">
                  <XCircle size={18} className="text-red-300" />
                </div>
                <p className="text-sm text-gray-400">Annulés</p>
                <p className="text-2xl font-bold text-white">
                  {stats.cancelled}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-lg p-4 mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par nom, classe, email..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <Filter size={14} /> Statut
                  </span>
                  {["all", "confirmed", "pending", "cancelled"].map((value) => {
                    const v = value as "all" | RegistrationStatus;
                    const labelMap: Record<string, string> = {
                      all: "Tous",
                      confirmed: "Confirmés",
                      pending: "En attente",
                      cancelled: "Annulés",
                    };

                    const isActive = statusFilter === v;

                    return (
                      <button
                        key={value}
                        onClick={() => setStatusFilter(v)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          isActive
                            ? "bg-indigo-600 border-indigo-400 text-white"
                            : "border-gray-700 text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        {labelMap[value]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Registrations list */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Liste des inscriptions
                </h2>
                <p className="text-xs text-gray-400">
                  {filteredRegistrations.length} participant(s) affiché(s)
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredRegistrations.map((reg) => {
                  const statusStyles: Record<RegistrationStatus, string> = {
                    confirmed:
                      "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40",
                    pending:
                      "bg-amber-500/15 text-amber-300 border border-amber-500/40",
                    cancelled:
                      "bg-red-500/15 text-red-300 border border-red-500/40",
                  };

                  const statusLabel: Record<RegistrationStatus, string> = {
                    confirmed: "Confirmé(e)",
                    pending: "En attente",
                    cancelled: "Annulé(e)",
                  };

                  const expanded = expandedIds.includes(reg.id);

                  return (
                    <div
                      key={reg.id}
                      className="rounded-lg border border-gray-800 bg-gray-900/70 p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">
                            {reg.full_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {reg.classe} • #{reg.id.toString().padStart(3, "0")}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {reg.study_place}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${statusStyles[reg.status]}`}
                        >
                          {reg.status === "confirmed" && (
                            <CheckCircle size={11} />
                          )}
                          {reg.status === "pending" && <Clock size={11} />}
                          {reg.status === "cancelled" && <XCircle size={11} />}
                          {statusLabel[reg.status]}
                        </span>
                      </div>

                      <div className="text-xs text-gray-300 space-y-1">
                        <p>{reg.email}</p>
                        {reg.phone && (
                          <p className="text-gray-400">{reg.phone}</p>
                        )}
                        <p className="text-gray-500 mt-1">
                          Inscrit le{" "}
                          {new Date(reg.registeredAt).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedIds((prev) =>
                            prev.includes(reg.id)
                              ? prev.filter((id) => id !== reg.id)
                              : [...prev, reg.id],
                          )
                        }
                        className="mt-1 inline-flex items-center gap-2 text-[11px] text-indigo-300 hover:text-indigo-200"
                      >
                        <ChevronDown
                          size={12}
                          className={`transition-transform ${
                            expanded ? "rotate-180" : "rotate-0"
                          }`}
                        />
                        {expanded
                          ? "Masquer les détails"
                          : "Voir la motivation & extra"}
                      </button>

                      {expanded && (
                        <div className="mt-1 space-y-2 border-t border-gray-800 pt-2 text-xs text-gray-200">
                          <p className="text-gray-300 whitespace-pre-wrap break-words">
                            <span className="font-semibold">
                              Motivation:&nbsp;
                            </span>
                            {reg.motivation}
                          </p>
                          <p className="text-gray-300 whitespace-pre-wrap break-words">
                            <span className="font-semibold">Extra:&nbsp;</span>
                            {reg.extra || "-"}
                          </p>
                        </div>
                      )}

                      <div className="mt-2">
                        <select
                          value={reg.status}
                          disabled={updatingId === reg.id}
                          onChange={(e) =>
                            updateStatus(
                              reg.id,
                              e.target.value as RegistrationStatus,
                            )
                          }
                          className="w-full rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-[11px] text-gray-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="confirmed">Confirmé(e)</option>
                          <option value="pending">En attente</option>
                          <option value="cancelled">Annulé(e)</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
