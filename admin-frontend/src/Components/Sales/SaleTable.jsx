import {
  Flame,
  Clock,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  Package,
  CheckCircle,
  AlertCircle,
  Percent,
  IndianRupee,
} from "lucide-react";

export const getSaleStatusBadge = (sale) => {
  if (!sale.isLive || sale.initialStatus === "draft") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
        <AlertCircle size={12} /> Inactive / Draft
      </span>
    );
  }

  const now = new Date();
  const start = sale.startDate ? new Date(sale.startDate) : null;
  const end = sale.endDate ? new Date(sale.endDate) : null;

  if (start && start > now) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
        <Clock size={12} /> Scheduled
      </span>
    );
  }

  if (end && end < now) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
        <AlertCircle size={12} /> Expired
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
      <Flame size={12} /> Active Live
    </span>
  );
};

export default function SaleTable({
  sales,
  loading,
  togglingId,
  onToggleLive,
  onEditSale,
  onDeleteSale,
}) {
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-2">
        <div className="w-8 h-8 border-3 border-[#019D3E] border-t-transparent rounded-full animate-spin" />
        <span>Loading sales campaigns...</span>
      </div>
    );
  }

  if (!sales || sales.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">
        <Package size={44} className="mx-auto text-slate-300 mb-2" />
        <p className="font-semibold text-slate-700 text-base">No sale campaigns found</p>
        <p className="text-xs text-slate-400 mt-1">
          Create a new sale campaign or adjust your search filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3.5">Campaign Management</th>
            <th className="px-6 py-3.5">Discount</th>
            <th className="px-6 py-3.5">Apply on</th>
            <th className="px-6 py-3.5">Validity Window</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5 text-center">Live Toggle</th>
            <th className="px-6 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {sales.map((sale) => {
            const isToggling = togglingId === sale._id;
            const startStr = sale.startDate
              ? new Date(sale.startDate).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A";
            const endStr = sale.endDate
              ? new Date(sale.endDate).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A";

            let targetText = "All Products";
            if (sale.applyOn === "category") {
              targetText =
                sale.targetCategories && sale.targetCategories.length > 0
                  ? `Category: ${sale.targetCategories.join(", ")}`
                  : "Categories";
            } else if (sale.applyOn === "products") {
              targetText =
                sale.targetProducts && sale.targetProducts.length > 0
                  ? `${sale.targetProducts.length} Selected Products`
                  : "Specific Products";
            }

            return (
              <tr key={sale._id} className="hover:bg-slate-50/80 transition-colors">
                {/* 1. Campaign Management */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3.5">
                    {sale.bannerImage ? (
                      <img
                        src={sale.bannerImage}
                        alt={sale.saleName}
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0"
                        onError={(e) => {
                          e.target.src = "/banner.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-[#019D3E] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                        <Flame size={20} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                        {sale.saleName}
                      </h4>
                      {sale.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-xs">
                          {sale.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* 2. Discount */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 font-bold text-sm text-[#019D3E] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      {sale.discountType === "percentage" ? (
                        <>
                          <Percent size={13} />
                          {sale.discountValue}% OFF
                        </>
                      ) : (
                        <>
                          <IndianRupee size={13} />
                          {sale.discountValue} FLAT OFF
                        </>
                      )}
                    </span>
                  </div>
                </td>

                {/* 3. Apply on */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                    <Layers size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate max-w-[160px]" title={targetText}>
                      {targetText}
                    </span>
                  </div>
                </td>

                {/* 4. Validity Window */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar size={12} className="text-emerald-600 shrink-0" />
                      <span>{startStr}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 pl-4">
                      <span>to {endStr}</span>
                    </div>
                  </div>
                </td>

                {/* 5. Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getSaleStatusBadge(sale)}
                </td>

                {/* 6. Live Toggle */}
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={() => onToggleLive(sale)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                      sale.isLive ? "bg-[#019D3E]" : "bg-slate-300"
                    }`}
                    title={sale.isLive ? "Disable Sale" : "Make Sale Live"}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        sale.isLive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </td>

                {/* 7. Action */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEditSale(sale)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                      title="Edit Campaign"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSale(sale)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
