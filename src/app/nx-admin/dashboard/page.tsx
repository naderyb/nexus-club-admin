"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/component/Sidebar";
import {
  CalendarDays,
  FolderKanban,
  Users,
  Menu,
  TrendingUp,
  Activity,
  BarChart as BarChartIcon,
  Building2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Footer from "../../component/footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Client-side cookie utility functions
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];

const DashboardPage = () => {
  const [stats, setStats] = useState({
    events: 0,
    projects: 0,
    members: 0,
    sponsors: 0,
  });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const chartData = [
    { name: "Events", value: stats.events, color: COLORS[0] },
    { name: "Projects", value: stats.projects, color: COLORS[1] },
    { name: "Members", value: stats.members, color: COLORS[2] },
    { name: "Sponsors", value: stats.sponsors, color: COLORS[3] },
  ];

  const pieData = [
    { name: "Events", value: stats.events, fill: COLORS[0] },
    { name: "Projects", value: stats.projects, fill: COLORS[1] },
    { name: "Members", value: stats.members, fill: COLORS[2] },
    { name: "Sponsors", value: stats.sponsors, fill: COLORS[3] },
  ];

  const quickActions = [
    {
      title: "Add Event",
      description: "Create a new community event",
      href: "/nx-admin/events",
      icon: CalendarDays,
      color: "from-blue-600 to-blue-700",
      hoverColor: "hover:from-blue-700 hover:to-blue-800",
    },
    {
      title: "Add Project",
      description: "Start a new project",
      href: "/nx-admin/projects",
      icon: FolderKanban,
      color: "from-green-600 to-green-700",
      hoverColor: "hover:from-green-700 hover:to-green-800",
    },
    {
      title: "Add Member",
      description: "Invite new team member",
      href: "/nx-admin/members",
      icon: Users,
      color: "from-purple-600 to-purple-700",
      hoverColor: "hover:from-purple-700 hover:to-purple-800",
    },
    {
      title: "Add Sponsor",
      description: "Register new sponsor",
      href: "/nx-admin/sponsors",
      icon: Building2,
      color: "from-orange-600 to-orange-700",
      hoverColor: "hover:from-orange-700 hover:to-orange-800",
    },
  ];

  const statCards = [
    {
      title: "Total Events",
      value: stats.events,
      icon: CalendarDays,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Projects",
      value: stats.projects,
      icon: FolderKanban,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Members",
      value: stats.members,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total Sponsors",
      value: stats.sponsors,
      icon: Building2,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ];

  const [admin, setAdmin] = useState<{ name?: string; role?: string } | null>(
    null
  );

  // Move getAdminName definition above its first usage
  async function getAdminName() {
    try {
      // First check if admin info is stored in cookies
      const adminCookie = getCookie("admin_info");
      if (adminCookie) {
        try {
          return JSON.parse(adminCookie);
        } catch {
          // If cookie parsing fails, continue to API call
        }
      }

      // Try to fetch admin info from API (client-side fallback)
      const res = await fetch("/api/admin-info");
      if (!res.ok) return null;
      const data = await res.json();

      // Store admin info in cookie for future use
      if (data) {
        setCookie("admin_info", JSON.stringify(data), 7); // Store for 7 days
      }

      return data;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    async function fetchAdmin() {
      const adminData = await getAdminName();
      setAdmin(adminData);

      // If no admin data is found, redirect to login
      if (!adminData) {
        console.log("No admin authentication found, redirecting to login");
        router.push("/");
      }
    }
    fetchAdmin();
  }, [router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        // Fetch dashboard counts
        const statsRes = await fetch("/api/dashboard-counts");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch recent events
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

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
          document.cookie =
            "admin_info=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Welcome back{admin?.name ? `, ${admin.name}` : ""}!{" "}
              {admin?.role ? `You are logged in as ${admin.role}.` : ""}{" "}
              Here&apos;s what’s happening with your community.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity size={24} className="text-indigo-400" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => router.push(action.href)}
                  className={`bg-gradient-to-r ${action.color} ${action.hoverColor} text-white p-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center gap-4 text-left`}
                >
                  <div className="p-3 bg-white/20 rounded-xl">
                    <action.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-indigo-400" />
              Analytics Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card) => (
                <div
                  key={card.title}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-xl ${card.bgColor}`}>
                      <card.icon size={24} className={card.color} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white mb-1">
                      {loading ? (
                        <div className="w-12 h-8 bg-gray-700 rounded animate-pulse mx-auto" />
                      ) : (
                        card.value
                      )}
                    </p>
                    <p className="text-gray-400 text-sm">{card.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChartIcon size={24} className="text-indigo-400" />
              Data Insights
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Bar Chart */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-indigo-400">
                  Overview Bar Chart
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={[
                        0,
                        (dataMax: number) => Math.ceil(dataMax / 5) * 5,
                      ]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #4F46E5",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-indigo-400">
                  Trend Line Chart
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={[
                        0,
                        (dataMax: number) => Math.ceil(dataMax / 5) * 5,
                      ]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #10B981",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-indigo-500/30 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-indigo-400">
                  Distribution Chart
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={(entry) => entry.name}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #8B5CF6",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
