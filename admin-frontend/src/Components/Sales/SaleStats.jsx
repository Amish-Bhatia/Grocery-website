import { Flame, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function SaleStats({ sales = [] }) {
  const stats = sales.reduce(
    (acc, sale) => {
      const status = sale.status || "active";
      if (sale.isLive && status === "active") acc.active += 1;
      else if (sale.isLive && status === "scheduled") acc.scheduled += 1;
      else if (status === "expired") acc.expired += 1;
      else acc.inactive += 1;
      return acc;
    },
    { active: 0, scheduled: 0, expired: 0, inactive: 0 }
  );

  const statCards = [
    {
      label: "Active Campaigns",
      count: stats.active,
      sub: "Currently live on store",
      icon: Flame,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      iconBg: "bg-emerald-600 text-white",
    },
    {
      label: "Scheduled Sales",
      count: stats.scheduled,
      sub: "Upcoming promotions",
      icon: Clock,
      color: "text-blue-700 bg-blue-50 border-blue-200",
      iconBg: "bg-blue-600 text-white",
    },
    {
      label: "Expired / Ended",
      count: stats.expired,
      sub: "Past sale windows",
      icon: AlertCircle,
      color: "text-amber-700 bg-amber-50 border-amber-200",
      iconBg: "bg-amber-600 text-white",
    },
    {
      label: "Total Campaigns",
      count: sales.length,
      sub: "All recorded sales",
      icon: CheckCircle2,
      color: "text-slate-800 bg-white border-slate-200",
      iconBg: "bg-slate-900 text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-2xl border ${c.color} shadow-xs flex items-center justify-between transition-all`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-900">{c.count}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{c.sub}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${c.iconBg}`}>
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
