import { Menu } from "lucide-react";
import Image from "next/image";

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  return (
    <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-700 dark:text-slate-200 p-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-30">
      <button
        onClick={onMenuToggle}
        className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-all duration-200"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center space-x-3">
        <Image
          src="/logo-nexus.svg"
          alt="Nexus Logo"
          width={24}
          height={24}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Sponsors
        </span>
      </div>
      <div className="w-10" />
    </div>
  );
}
