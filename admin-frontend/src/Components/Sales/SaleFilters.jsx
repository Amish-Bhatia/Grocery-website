import { Search, Filter, Layers } from "lucide-react";

export default function SaleFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  targetFilter,
  setTargetFilter,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row gap-4 items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-full lg:max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by sale name or description..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#019D3E] focus:bg-white transition"
        />
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        {/* All Status Dropdown */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          <Filter size={15} className="text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none focus:border-[#019D3E] transition cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Sales</option>
            <option value="scheduled">Scheduled / Upcoming</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive / Draft</option>
          </select>
        </div>

        {/* All Targets Dropdown */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          <Layers size={15} className="text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none focus:border-[#019D3E] transition cursor-pointer"
          >
            <option value="all">All Targets</option>
            <option value="all_products">All Store Products</option>
            <option value="category">Specific Categories</option>
            <option value="products">Specific Products</option>
          </select>
        </div>
      </div>
    </div>
  );
}
