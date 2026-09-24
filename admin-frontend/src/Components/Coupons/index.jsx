import { useState, useEffect, useMemo, useCallback } from "react";
import { Ticket, Plus, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";
import AddEditModal from "./AddEditModal";
import CouponStats from "./CouponStats";
import CouponFilters from "./CouponFilters";
import CouponTable from "./CouponTable";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apimethods.getApi("/getCoupon");
      setCoupons(Array.isArray(res?.coupons) ? res.coupons : []);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      Swal.fire({ icon: "error", title: "Error Loading Coupons", text: error?.message || "Could not retrieve coupons." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleToggleStatus = async (coupon) => {
    const updatedStatus = !coupon.isActive;
    setTogglingId(coupon._id);
    try {
      await apimethods.putApi(`/updateCoupon/${coupon._id}`, { isActive: updatedStatus });
      setCoupons((prev) => prev.map((item) => (item._id === coupon._id ? { ...item, isActive: updatedStatus } : item)));
      Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 1500 }).fire({
        icon: updatedStatus ? "success" : "info",
        title: `Coupon "${coupon.code}" is now ${updatedStatus ? "Active" : "Inactive"}`,
      });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Status Update Failed", text: error?.message || "Could not update status." });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteCoupon = async (coupon) => {
    const result = await Swal.fire({
      title: `Delete "${coupon.code}"?`,
      text: "This promotional code will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apimethods.deleteApi(`/deleteCoupon/${coupon._id}`);
      setCoupons((prev) => prev.filter((item) => item._id !== coupon._id));
      Swal.fire({ icon: "success", title: "Deleted", text: `Coupon "${coupon.code}" removed.`, timer: 1400, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Delete Failed", text: error?.message || "Could not delete coupon." });
    }
  };

  const getCouponStatus = (coupon) => {
    if (!coupon.isActive) return "inactive";
    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) return "upcoming";
    if (coupon.endDate && new Date(coupon.endDate) < now) return "expired";
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return "exhausted";
    return "active";
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const q = search.toLowerCase();
      const matchesSearch = !search || coupon.code?.toLowerCase().includes(q) || coupon.description?.toLowerCase().includes(q);
      const status = getCouponStatus(coupon);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && status === "active") ||
        (statusFilter === "inactive" && status === "inactive") ||
        (statusFilter === "expired" && (status === "expired" || status === "exhausted")) ||
        (statusFilter === "upcoming" && status === "upcoming");
      const matchesType = typeFilter === "all" || coupon.discountType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, search, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => getCouponStatus(c) === "active").length;
    const totalUses = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);
    const pct = coupons.filter((c) => c.discountType === "percentage");
    const avgDiscount = pct.length > 0 ? Math.round(pct.reduce((sum, c) => sum + Number(c.discountValue || 0), 0) / pct.length) : 0;
    return { total, active, totalUses, avgDiscount };
  }, [coupons]);

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Ticket className="text-[#019D3E]" size={26} />
            Coupon Codes & Discounts
          </h1>
          <p className="mt-1 text-sm text-slate-500">Dynamically create, customize, and manage promo codes.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={fetchCoupons} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer disabled:opacity-50">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button type="button" onClick={() => { setCouponToEdit(null); setIsModalOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#019D3E] to-[#00491B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 cursor-pointer">
            <Plus size={18} />
            <span>Create Coupon</span>
          </button>
        </div>
      </section>

      <CouponStats stats={stats} />
      <CouponFilters search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} typeFilter={typeFilter} setTypeFilter={setTypeFilter} />
      <CouponTable
        coupons={filteredCoupons}
        loading={loading}
        search={search}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onOpenCreate={() => { setCouponToEdit(null); setIsModalOpen(true); }}
        onOpenEdit={(c) => { setCouponToEdit(c); setIsModalOpen(true); }}
        onToggleStatus={handleToggleStatus}
        onDeleteCoupon={handleDeleteCoupon}
        togglingId={togglingId}
        getCouponStatus={getCouponStatus}
      />

      <AddEditModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setCouponToEdit(null); }} couponToEdit={couponToEdit} onSaved={fetchCoupons} />
    </div>
  );
}