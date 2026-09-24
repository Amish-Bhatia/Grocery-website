import { useState } from "react";
import {
  Ticket,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Copy,
  Check,
  Percent,
  DollarSign,
  Calendar,
} from "lucide-react";

export default function CouponTable({
  coupons,
  loading,
  search,
  statusFilter,
  typeFilter,
  onOpenCreate,
  onOpenEdit,
  onToggleStatus,
  onDeleteCoupon,
  togglingId,
  getCouponStatus,
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderStatusBadge = (coupon) => {
    const status = getCouponStatus(coupon);
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#019D3E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#019D3E] animate-pulse" />
            Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Inactive
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Expired
          </span>
        );
      case "exhausted":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Limit Reached
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-2 shadow-xs">
        <RefreshCw size={26} className="animate-spin text-[#019D3E]" />
        <span>Loading coupon database...</span>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-3 shadow-xs">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#019D3E]">
          <Ticket size={32} />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-base">No coupons found</p>
          <p className="text-xs text-slate-400 mt-0.5 max-w-sm">
            {search || statusFilter !== "all" || typeFilter !== "all"
              ? "No coupon matches your current filter or search criteria."
              : "No promo coupons created yet. Create your first code to boost sales!"}
          </p>
        </div>
        {!search && statusFilter === "all" && typeFilter === "all" && (
          <button
            type="button"
            onClick={onOpenCreate}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#019D3E] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#008d37] transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Create First Coupon</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-base">
          Available Coupons ({coupons.length})
        </h3>
        <span className="text-xs font-medium text-[#019D3E] bg-emerald-50 px-3 py-1 rounded-full">
          Real-time Sync
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Coupon Code</th>
              <th className="px-6 py-3.5">Discount</th>
              <th className="px-6 py-3.5">Min / Max Rules</th>
              <th className="px-6 py-3.5">Usage / Limit</th>
              <th className="px-6 py-3.5">Validity Period</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-center">Toggle Active</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {coupons.map((coupon) => {
              const startDateStr = coupon.startDate
                ? new Date(coupon.startDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Immediate";

              const endDateStr = coupon.endDate
                ? new Date(coupon.endDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "No expiry";

              const usageLimitStr =
                coupon.usageLimit && coupon.usageLimit !== Infinity ? coupon.usageLimit : "∞";

              const usagePercent =
                coupon.usageLimit && coupon.usageLimit > 0
                  ? Math.min(100, Math.round(((coupon.usageCount || 0) / coupon.usageLimit) * 100))
                  : 0;

              return (
                <tr key={coupon._id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs tracking-wider">
                        {coupon.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(coupon.code)}
                        className="p-1 rounded-md text-slate-400 hover:text-[#019D3E] hover:bg-emerald-50 transition cursor-pointer"
                        title="Copy coupon code"
                      >
                        {copiedCode === coupon.code ? (
                          <Check size={14} className="text-[#019D3E]" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs truncate" title={coupon.description}>
                      {coupon.description}
                    </p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.discountType === "percentage" ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs font-bold text-[#019D3E]">
                        <Percent size={12} />
                        {coupon.discountValue}% OFF
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                        <DollarSign size={12} />
                        ${Number(coupon.discountValue || 0).toFixed(2)} OFF
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <div className="text-slate-800 font-medium">
                      Min: {coupon.minimumOrderAmount ? `$${coupon.minimumOrderAmount}` : "None"}
                    </div>
                    <div className="text-slate-400">
                      Max: {coupon.maximumDiscountAmount && coupon.maximumDiscountAmount !== Infinity ? `$${coupon.maximumDiscountAmount}` : "Unlimited"}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span>{coupon.usageCount || 0}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-500">{usageLimitStr}</span>
                    </div>
                    {coupon.usageLimit && coupon.usageLimit !== Infinity && (
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${usagePercent >= 90 ? "bg-rose-500" : "bg-[#019D3E]"}`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <div className="font-medium text-slate-800 flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{startDateStr}</span>
                      <span className="text-slate-400">→</span>
                      <span>{endDateStr}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(coupon)}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      disabled={togglingId === coupon._id}
                      onClick={() => onToggleStatus(coupon)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                        coupon.isActive ? "bg-[#019D3E]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          coupon.isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenEdit(coupon)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                        title="Edit Coupon"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCoupon(coupon)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
