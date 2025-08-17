import { TrendingUp, Users, CheckCircle, Send, Clock } from "lucide-react";
import type { Stats } from "../types";

interface SponsorsHeaderProps {
  stats: Stats;
}

export function SponsorsHeader({ stats }: SponsorsHeaderProps) {
  return (
    <header className="hidden lg:block bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Sponsors Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Track and manage sponsor relationships
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">Progress</span>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl mb-2">
                  <Users
                    size={20}
                    className="text-slate-600 dark:text-slate-400"
                  />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {stats.total}
                </p>
                <p className="text-xs text-slate-500">Total</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl mb-2">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <p className="text-lg font-bold text-green-900 dark:text-green-300">
                  {stats.called}
                </p>
                <p className="text-xs text-green-600">Called</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-2">
                  <Send size={20} className="text-blue-600" />
                </div>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
                  {stats.emailSent}
                </p>
                <p className="text-xs text-blue-600">Emailed</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl mb-2">
                  <Clock size={20} className="text-orange-600" />
                </div>
                <p className="text-lg font-bold text-orange-900 dark:text-orange-300">
                  {stats.pending}
                </p>
                <p className="text-xs text-orange-600">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
