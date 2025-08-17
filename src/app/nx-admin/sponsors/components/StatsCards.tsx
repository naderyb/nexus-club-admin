import { Users, Check, Send, Clock } from "lucide-react";
import type { Stats } from "../types";

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center space-x-2">
          <Users size={16} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Total
          </span>
        </div>
        <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
          {stats.total}
        </p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center space-x-2">
          <Check size={16} className="text-green-600" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Called
          </span>
        </div>
        <p className="text-lg font-bold text-green-900 dark:text-green-300 mt-1">
          {stats.called}
        </p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center space-x-2">
          <Send size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
            Emailed
          </span>
        </div>
        <p className="text-lg font-bold text-blue-900 dark:text-blue-300 mt-1">
          {stats.emailSent}
        </p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-orange-600" />
          <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
            Pending
          </span>
        </div>
        <p className="text-lg font-bold text-orange-900 dark:text-orange-300 mt-1">
          {stats.pending}
        </p>
      </div>
    </div>
  );
}
