import { Ticket, Sparkles, TrendingUp, Percent } from "lucide-react";

export default function CouponStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Coupons</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Configured promo codes</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#019D3E]">
          <Ticket size={24} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live & Active</p>
          <h3 className="text-2xl font-bold text-[#019D3E] mt-1">{stats.active}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ready for shoppers</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#019D3E]">
          <Sparkles size={24} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Redemptions</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalUses}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Times applied in orders</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <TrendingUp size={24} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg % Discount</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.avgDiscount}%</h3>
          <p className="text-xs text-slate-500 mt-0.5">Across % promo campaigns</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Percent size={24} />
        </div>
      </div>
    </div>
  );
}
