import { useState, useEffect } from "react";
import { X, Percent, IndianRupee, Image, Calendar, Tag, Layers, Check, Search } from "lucide-react";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";

// Real storefront banner images used in the User view
export const presetBanners = [
  {
    label: "Main Hero Food",
    url: "/banner.jpg",
    sub: "Fresh & Healthy Organic (30% OFF)",
  },
  {
    label: "Summer Sale 75%",
    url: "/topRight.png",
    sub: "Fruit & Veggies Promo",
  },
  {
    label: "Special Deal Month",
    url: "/bottomRight.jpg",
    sub: "Deal of the Month Dark Banner",
  },
  {
    label: "Sale of the Month",
    url: "/SaleOfTheMonth.png",
    sub: "Live Countdown Banner",
  },
  {
    label: "Low-Fat Meat",
    url: "/Low-FatMeat.png",
    sub: "Meat & Poultry Promo",
  },
  {
    label: "100% Fresh Fruit",
    url: "/100%FreshFruit.png",
    sub: "Up to 64% OFF Fruits",
  },
  {
    label: "Wide Summer Sale",
    url: "/summersale37%off.jpg",
    sub: "Wide Summer Promo 37% OFF",
  },
];

export default function AddEditModal({
  isOpen,
  onClose,
  saleToEdit,
  onSaved,
}) {
  const [categories, setCategories] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const [formData, setFormData] = useState({
    saleName: "",
    initialStatus: "active",
    description: "",
    discountType: "percentage",
    discountValue: "",
    applyOn: "all",
    targetCategories: [],
    targetProducts: [],
    startDate: "",
    endDate: "",
    bannerImage: "/banner.jpg",
    isLive: true,
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch categories and products for target selectors
  useEffect(() => {
    if (!isOpen) return;
    setLoadingOptions(true);
    Promise.all([
      apimethods.getApi("/get-category").catch(() => ({})),
      apimethods.getApi("/get-products").catch(() => ({})),
    ])
      .then(([catRes, prodRes]) => {
        if (catRes?.categories) setCategories(catRes.categories);
        if (prodRes?.products) setProductsList(prodRes.products);
      })
      .finally(() => setLoadingOptions(false));
  }, [isOpen]);

  // Set form data when editing or creating
  useEffect(() => {
    if (saleToEdit) {
      const formatDT = (d) => {
        if (!d) return "";
        const dt = new Date(d);
        const pad = (n) => String(n).padStart(2, "0");
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
      };

      setFormData({
        saleName: saleToEdit.saleName || "",
        initialStatus: saleToEdit.initialStatus || "active",
        description: saleToEdit.description || "",
        discountType: saleToEdit.discountType || "percentage",
        discountValue: saleToEdit.discountValue !== undefined ? saleToEdit.discountValue : "",
        applyOn: saleToEdit.applyOn || "all",
        targetCategories: saleToEdit.targetCategories || [],
        targetProducts: saleToEdit.targetProducts || [],
        startDate: formatDT(saleToEdit.startDate),
        endDate: formatDT(saleToEdit.endDate),
        bannerImage: saleToEdit.bannerImage || "/banner.jpg",
        isLive: saleToEdit.isLive !== undefined ? saleToEdit.isLive : true,
      });
    } else {
      // Defaults: Start Now, End in 7 days
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const pad = (n) => String(n).padStart(2, "0");
      const fmt = (d) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

      setFormData({
        saleName: "",
        initialStatus: "active",
        description: "",
        discountType: "percentage",
        discountValue: "",
        applyOn: "all",
        targetCategories: [],
        targetProducts: [],
        startDate: fmt(now),
        endDate: fmt(nextWeek),
        bannerImage: "/banner.jpg",
        isLive: true,
      });
    }
  }, [saleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.saleName.trim()) {
      return Swal.fire({ icon: "warning", title: "Missing Information", text: "Sale Name is required." });
    }

    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      return Swal.fire({ icon: "warning", title: "Missing Information", text: "Please enter a valid Discount Value." });
    }

    if (!formData.startDate || !formData.endDate) {
      return Swal.fire({ icon: "warning", title: "Missing Information", text: "Start and End Dates are required." });
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return Swal.fire({ icon: "warning", title: "Invalid Dates", text: "End Date & Time must be after Start Date & Time." });
    }

    setSubmitting(true);
    try {
      if (saleToEdit) {
        await apimethods.putApi(`/updateSale/${saleToEdit._id}`, formData);
        Swal.fire({
          icon: "success",
          title: "Sale Updated",
          text: `"${formData.saleName}" has been updated successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await apimethods.postApi("/addSale", formData);
        Swal.fire({
          icon: "success",
          title: "Sale Created",
          text: `"${formData.saleName}" has been launched successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }

      onSaved();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: error?.message || "Could not save sale campaign.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryToggle = (catName) => {
    setFormData((prev) => {
      const exists = prev.targetCategories.includes(catName);
      return {
        ...prev,
        targetCategories: exists
          ? prev.targetCategories.filter((c) => c !== catName)
          : [...prev.targetCategories, catName],
      };
    });
  };

  const handleProductToggle = (prodId) => {
    setFormData((prev) => {
      const exists = prev.targetProducts.includes(prodId);
      return {
        ...prev,
        targetProducts: exists
          ? prev.targetProducts.filter((p) => p !== prodId)
          : [...prev.targetProducts, prodId],
      };
    });
  };

  const filteredProducts = productsList.filter((p) =>
    (p.name || "").toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {saleToEdit ? "Edit Sale Campaign" : "Create New Sale Campaign"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage live discounts, target items, validity windows, and storefront banners.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-xs sm:text-sm">
          
          {/* Row 1: Sale Name & Initial Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1.5">
                Sale Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.saleName}
                onChange={(e) => setFormData({ ...formData, saleName: e.target.value })}
                placeholder="e.g. Summer Mega Flash Sale"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-[#019D3E] transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Initial Status
              </label>
              <select
                value={formData.initialStatus}
                onChange={(e) => setFormData({ ...formData, initialStatus: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none focus:border-[#019D3E] transition cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Row 2: Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a short highlight for customers about this sale..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-[#019D3E] transition resize-none"
            />
          </div>

          {/* Row 3: Discount Type* & Discount Value */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
              Discount Configuration <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Percentage % Radio Button */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, discountType: "percentage" })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-xs transition cursor-pointer ${
                  formData.discountType === "percentage"
                    ? "bg-[#019D3E] text-white border-[#019D3E] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <Percent size={15} />
                <span>Percentage %</span>
              </button>

              {/* Fixed Amount (Rs) Radio Button */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, discountType: "fixed" })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-xs transition cursor-pointer ${
                  formData.discountType === "fixed"
                    ? "bg-[#019D3E] text-white border-[#019D3E] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <IndianRupee size={15} />
                <span>Fixed Amount (₹)</span>
              </button>

              {/* Discount Value Input Field */}
              <div>
                <input
                  type="number"
                  min="0"
                  max={formData.discountType === "percentage" ? "100" : undefined}
                  step="any"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder={formData.discountType === "percentage" ? "e.g. 20 (for 20%)" : "e.g. 150 (for ₹150)"}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none focus:border-[#019D3E] font-bold text-slate-900 transition"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Apply on / Targets */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Apply on Target
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { id: "all", label: "All Products" },
                { id: "category", label: "Specific Category" },
                { id: "products", label: "Specific Products" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, applyOn: t.id })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                    formData.applyOn === t.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* If Category is selected */}
            {formData.applyOn === "category" && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-medium text-slate-500 block">Select Categories:</span>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                  {categories.map((cat) => {
                    const cName = cat.name || cat;
                    const isSelected = formData.targetCategories.includes(cName);
                    return (
                      <button
                        key={cName}
                        type="button"
                        onClick={() => handleCategoryToggle(cName)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
                          isSelected
                            ? "bg-[#019D3E] text-white border-[#019D3E]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        {cName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* If Products is selected */}
            {formData.applyOn === "products" && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    Select Products ({formData.targetProducts.length} selected):
                  </span>
                  <div className="relative">
                    <Search size={12} className="absolute left-2 top-2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-6 pr-2 py-1 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-[#019D3E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pt-1">
                  {filteredProducts.slice(0, 30).map((prod) => {
                    const prodId = prod._id || prod.id || prod.name;
                    const isSelected = formData.targetProducts.includes(prodId);
                    return (
                      <button
                        key={prodId}
                        type="button"
                        onClick={() => handleProductToggle(prodId)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left border transition cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50 text-[#019D3E] border-[#019D3E] font-medium"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] shrink-0 ${
                            isSelected
                              ? "bg-[#019D3E] border-[#019D3E] text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                        <span className="truncate">{prod.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Row 5: Start Date & Time and End Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Start Date &amp; Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-[#019D3E] transition cursor-pointer bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                End Date &amp; Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-[#019D3E] transition cursor-pointer bg-white"
              />
            </div>
          </div>

          {/* Row 6: Banner background Image (storefront images or custom) */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-700">
              Banner Background Image
            </label>
            <input
              type="text"
              value={formData.bannerImage}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
              placeholder="/banner.jpg or https://..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-[#019D3E] transition"
            />

            {/* Quick Banner Presets from Storefront */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Choose from Front-End Storefront Banners:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {presetBanners.map((p, idx) => {
                  const isSelected = formData.bannerImage === p.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, bannerImage: p.url })}
                      className={`relative rounded-xl border p-1.5 text-left transition cursor-pointer overflow-hidden group ${
                        isSelected
                          ? "bg-emerald-50/80 border-[#019D3E] ring-2 ring-[#019D3E]/30"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="h-14 rounded-lg overflow-hidden bg-slate-100 mb-1 relative">
                        <img
                          src={p.url}
                          alt={p.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-[#019D3E] text-white p-0.5 rounded-full shadow-xs">
                            <Check size={10} />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                        {p.label}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {p.url}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Banner Card Preview */}
            {formData.bannerImage && (
              <div className="mt-3 relative rounded-2xl overflow-hidden h-32 border border-slate-200 shadow-md">
                <img
                  src={formData.bannerImage}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent flex items-center justify-between p-5 text-white">
                  <div className="max-w-xs">
                    <span className="bg-[#EA4B48] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      {formData.discountType === "percentage"
                        ? `${formData.discountValue || 0}% OFF`
                        : `₹${formData.discountValue || 0} FLAT OFF`}
                    </span>
                    <h5 className="font-extrabold text-lg mt-1 text-white leading-tight drop-shadow-sm line-clamp-1">
                      {formData.saleName || "Campaign Preview"}
                    </h5>
                    <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                      {formData.description || "Special limited time discount on your favorite grocery items."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#019D3E] hover:bg-[#007A30] text-white font-bold transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? "Saving Campaign..." : saleToEdit ? "Update Campaign" : "Launch Sale Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
