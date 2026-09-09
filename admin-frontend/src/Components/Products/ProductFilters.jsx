import { Search } from "lucide-react";

const selectClass = "rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-emerald-500";

export default function ProductFilters({ search, onSearchChange, category, onCategoryChange, stock, onStockChange, categories }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
      <div className="relative min-w-0 flex-1">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
          className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className={selectClass}>
        <option value="all">All Categories</option>
        {categories.map((item) => <option key={item._id || item.name} value={item.name}>{item.name}</option>)}
      </select>

      <select value={stock} onChange={(event) => onStockChange(event.target.value)} className={selectClass}>
        <option value="all">All Stock</option>
        <option value="in-stock">In stock</option>
        <option value="low-stock">Low stock</option>
        <option value="out-of-stock">Out of stock</option>
      </select>
    </div>
  );
}