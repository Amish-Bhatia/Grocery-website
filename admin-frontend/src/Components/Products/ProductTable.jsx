import { Eye, ImageOff, Pencil, Trash2 } from "lucide-react";

const headings = ["Product", "Category", "Price", "Discount", "Stock", "Actions"];

export default function ProductTable({ products, getStockLabel, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left">
        <thead className="border-b border-slate-100 bg-slate-50">
          <tr>
            {headings.map((heading) => (
              <th key={heading} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${heading === "Actions" ? "text-right" : ""}`}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => {
            const stock = getStockLabel(product.stock);
            return (
              <tr key={product.id} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-400">
                      {product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : <ImageOff size={18} />}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{product.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{product.category || "Uncategorized"}</td>
                <td className="px-5 py-4 text-sm font-medium text-slate-800">${Number(product.price).toFixed(2)}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{product.discount ? `${product.discount}%` : "-"}</td>
                <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${stock.className}`}>{stock.label}</span></td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => onView(product)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600" title="View product"><Eye size={17} /></button>
                    <button type="button" onClick={() => onEdit(product)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-[#019D3E]" title="Edit product"><Pencil size={17} /></button>
                    <button type="button" onClick={() => onDelete(product.id)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600" title="Delete product"><Trash2 size={17} /></button>
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