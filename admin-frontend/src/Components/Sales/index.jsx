import { useState, useEffect, useMemo, useCallback } from "react";
import { Flame, Plus, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";
import SaleStats from "./SaleStats";
import SaleFilters from "./SaleFilters";
import SaleTable from "./SaleTable";
import AddEditModal from "./AddEditModal";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apimethods.getApi("/getSales");
      setSales(Array.isArray(res?.sales) ? res.sales : []);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
      Swal.fire({
        icon: "error",
        title: "Error Loading Sales",
        text: error?.message || "Could not retrieve sale campaigns from server.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Toggle Sale Live Switch
  const handleToggleLive = async (sale) => {
    const updatedStatus = !sale.isLive;
    setTogglingId(sale._id);
    try {
      await apimethods.patchApi(`/toggleSaleLive/${sale._id}`);
      setSales((prev) =>
        prev.map((item) =>
          item._id === sale._id ? { ...item, isLive: updatedStatus } : item
        )
      );

      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
      }).fire({
        icon: updatedStatus ? "success" : "info",
        title: `Sale "${sale.saleName}" is now ${updatedStatus ? "Live" : "Disabled"}`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Status Update Failed",
        text: error?.message || "Could not toggle sale live status.",
      });
    } finally {
      setTogglingId(null);
    }
  };

  // Delete Sale Campaign
  const handleDeleteSale = async (sale) => {
    const result = await Swal.fire({
      title: `Delete "${sale.saleName}"?`,
      text: "This sale campaign and promotional discount will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Delete Campaign",
    });

    if (!result.isConfirmed) return;

    try {
      await apimethods.deleteApi(`/deleteSale/${sale._id}`);
      setSales((prev) => prev.filter((item) => item._id !== sale._id));
      Swal.fire({
        icon: "success",
        title: "Campaign Deleted",
        text: `"${sale.saleName}" has been removed.`,
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error?.message || "Could not delete sale campaign.",
      });
    }
  };

  const getComputedStatus = (sale) => {
    if (!sale.isLive || sale.initialStatus === "draft") return "inactive";
    const now = new Date();
    if (sale.startDate && new Date(sale.startDate) > now) return "scheduled";
    if (sale.endDate && new Date(sale.endDate) < now) return "expired";
    return "active";
  };

  // Filtering Logic
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (sale.saleName && sale.saleName.toLowerCase().includes(q)) ||
        (sale.description && sale.description.toLowerCase().includes(q));

      const status = getComputedStatus(sale);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && status === "active") ||
        (statusFilter === "scheduled" && status === "scheduled") ||
        (statusFilter === "expired" && status === "expired") ||
        (statusFilter === "inactive" && status === "inactive");

      const matchesTarget =
        targetFilter === "all" ||
        (targetFilter === "all_products" && sale.applyOn === "all") ||
        (targetFilter === "category" && sale.applyOn === "category") ||
        (targetFilter === "products" && sale.applyOn === "products");

      return matchesSearch && matchesStatus && matchesTarget;
    });
  }, [sales, search, statusFilter, targetFilter]);

  return (
    <div className="w-full space-y-6">
      {/* Top Header Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Flame className="text-[#019D3E]" size={26} />
            Sale Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create promotional flash sales, manage validity windows, and control live campaign discounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSales}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSaleToEdit(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#019D3E] to-[#00491B] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:opacity-95 cursor-pointer"
          >
            <Plus size={17} />
            <span>Create Sale</span>
          </button>
        </div>
      </section>

      {/* Sale Stats */}
      <SaleStats sales={sales} />

      {/* Search & Dropdown Filters */}
      <SaleFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        targetFilter={targetFilter}
        setTargetFilter={setTargetFilter}
      />

      {/* Sales Table Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
            All Sale Campaigns ({filteredSales.length})
          </h3>
        </div>

        <SaleTable
          sales={filteredSales}
          loading={loading}
          togglingId={togglingId}
          onToggleLive={handleToggleLive}
          onEditSale={(sale) => {
            setSaleToEdit(sale);
            setIsModalOpen(true);
          }}
          onDeleteSale={handleDeleteSale}
        />
      </div>

      {/* Add / Edit Sale Modal */}
      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSaleToEdit(null);
        }}
        saleToEdit={saleToEdit}
        onSaved={fetchSales}
      />
    </div>
  );
}
