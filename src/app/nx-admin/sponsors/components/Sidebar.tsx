import {
  Home,
  Users,
  Calendar,
  FolderOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  pathname: string;
  onLogout: () => void;
}

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  pathname,
  onLogout,
}: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/nx-admin" },
    { icon: Users, label: "Members", href: "/nx-admin/members" },
    { icon: Building2, label: "Sponsors", href: "/nx-admin/sponsors" },
    { icon: Calendar, label: "Events", href: "/nx-admin/events" },
    { icon: FolderOpen, label: "Projects", href: "/nx-admin/projects" },
    { icon: Settings, label: "Settings", href: "/nx-admin/settings" },
  ];

  const sidebarClass = `fixed top-0 left-0 h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60 z-50 transition-all duration-300 ${
    collapsed ? "w-20" : "w-72"
  } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`;

  return (
    <nav className={sidebarClass}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo-nexus.svg"
                alt="Nexus Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              {!collapsed && (
                <div>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                    Nexus Admin
                  </h1>
                  <p className="text-xs text-slate-500">Management Panel</p>
                </div>
              )}
            </div>

            <button
              onClick={() =>
                collapsed ? setCollapsed(false) : setCollapsed(true)
              }
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {collapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <item.icon size={20} />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut size={20} />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
