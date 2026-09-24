import { FileText, CheckCircle2, Sliders, Plus, Check, Trash2 } from "lucide-react";

export default function ProductDetailsTabs({
  activeTab,
  setActiveTab,
  description,
  setDescription,
  features,
  setFeatures,
  newFeature,
  setNewFeature,
  price,
  setPrice,
  discount,
  setDiscount,
  stock,
  setStock,
  unit,
  setUnit,
}) {
  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature("");
  };

  const handleRemoveFeature = (idx) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  return (
    <>
      <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === "description" ? "border-[#019D3E] text-[#019D3E]" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText size={16} />
          <span>Product Description</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("features")}
          className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === "features" ? "border-[#019D3E] text-[#019D3E]" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <CheckCircle2 size={16} />
          <span>Dynamic Features ({features.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("inventory")}
          className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === "inventory" ? "border-[#019D3E] text-[#019D3E]" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sliders size={16} />
          <span>Pricing &amp; Specs</span>
        </button>
      </div>

      {activeTab === "description" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Detailed Product Description (Displayed on Customer Product Page)
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter rich details about origin, flavor profile, and cooking recommendations..."
              className="w-full border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-[#019D3E]"
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Customer View Preview</h4>
            <p className="text-sm text-slate-700 leading-relaxed italic">"{description || "No description provided."}"</p>
          </div>
        </div>
      )}

      {activeTab === "features" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Add Dynamic Feature / Highlight
            </label>
            <form onSubmit={handleAddFeature} className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g. 100% Pesticide-Free, Farm Fresh Picked"
                className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#019D3E]"
              />
              <button
                type="submit"
                className="bg-[#019D3E] hover:bg-[#018635] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <Plus size={15} />
                <span>Add</span>
              </button>
            </form>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Features &amp; Highlights
            </label>
            {features.length === 0 ? (
              <p className="text-sm text-slate-400 py-3 italic">No features added yet. Add one above!</p>
            ) : (
              features.map((feat, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2.5 text-sm text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-[#019D3E] flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-red-600 transition p-1 rounded hover:bg-red-50 cursor-pointer"
                    title="Remove feature"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Unit Price ($)</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#019D3E]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Discount Percentage (%)</label>
            <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#019D3E]" />
            {price > 0 && Number(discount) > 0 && (
              <p className="mt-1 text-xs font-medium text-emerald-600">
                Selling price: ${(Number(price) * (1 - Number(discount) / 100)).toFixed(2)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Stock Quantity</label>
            <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#019D3E]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Packaging Unit</label>
            <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg" className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#019D3E]" />
          </div>
        </div>
      )}
    </>
  );
}
