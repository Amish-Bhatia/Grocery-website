import { useEffect, useMemo, useState } from "react";
import { Package, Plus } from "lucide-react";
import Swal from "sweetalert2";
import apimethods from "../../Methods/ApiClient";
import EmptyState from "../Common/EmptyState";
import PageHeader from "../Common/PageHeader";
import AddEdit from "./AddEdit";
import ProductDetails from "./ProductDetails";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";

const STORAGE_KEY = "grocery-admin-products";

function readProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function Products() {
  const [products, setProducts] = useState(readProducts);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState("all");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const loadProducts = async () => {
    try {
      const data = await apimethods.getApi("/get-products");
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        const formatted = data.products.map(p => ({ ...p, id: p._id || p.id }));
        setProducts(formatted);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formatted));
      }
    } catch {
      // Fallback to localStorage products
    }
  };

  useEffect(() => {
    loadProducts();
    apimethods.getApi("/get-category")
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const filteredProducts = useMemo(
    () => products.filter((product) => matchesProduct(product, search, category, stock)),
    [products, search, category, stock]
  );

  const saveProduct = async (data) => {
    try {
      if (editing?._id || (editing?.id && String(editing.id).length === 24)) {
        const prodId = editing._id || editing.id;
        await apimethods.putApi(`/update-product/${prodId}`, data);
      } else {
        await apimethods.postApi("/add-product", data);
      }
      await loadProducts();
    } catch {
      // Offline / fallback save
      setProducts((current) => editing?.id
        ? current.map((item) => item.id === editing.id ? { ...item, ...data } : item)
        : [{ ...data, id: `${Date.now()}` }, ...current]
      );
    }
    setEditing(null);
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Delete product?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        if (String(id).length === 24) {
          await apimethods.deleteApi(`/delete-product/${id}`);
        }
      } catch {
        // ignore error
      }
      setProducts((current) => current.filter((product) => (product._id || product.id) !== id));
      await Swal.fire({
        title: "Deleted",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Products"
        description="Manage your grocery products, pricing, and inventory."
        action={(
          <button type="button" onClick={() => setEditing({})} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#019D3E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008d37]">
            <Plus size={18} />
            Add Product
          </button>
        )}
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          stock={stock}
          onStockChange={setStock}
          categories={categories}
        />
        {filteredProducts.length ? (
          <ProductTable
            products={filteredProducts}
            getStockLabel={getStockLabel}
            onView={setViewing}
            onEdit={setEditing}
            onDelete={deleteProduct}
          />
        ) : (
          <EmptyState
            icon={Package}
            title={products.length ? "No matching products" : "No products yet"}
            description={products.length ? "Try changing your search or filters." : "Add your first product to start building your catalog."}
          />
        )}
      </section>

      {editing && <AddEdit product={editing.id ? editing : null} categories={categories} onSave={saveProduct} onClose={() => setEditing(null)} />}
      {viewing && (
        <ProductDetails
          product={viewing}
          onSave={async (data) => {
            const prodId = viewing._id || viewing.id;
            await saveProduct({ ...data, id: prodId, _id: prodId });
          }}
          onEdit={(p) => {
            setViewing(null);
            setEditing(p);
          }}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}

function matchesProduct(product, search, category, stock) {
  const nameMatches = (product.name || "").toLowerCase().includes(search.toLowerCase());
  const categoryMatches = category === "all" || product.category === category;
  const stockMatches = stock === "all"
    || (stock === "in-stock" && product.stock > 0)
    || (stock === "low-stock" && product.stock > 0 && product.stock <= 10)
    || (stock === "out-of-stock" && product.stock === 0);
  return nameMatches && categoryMatches && stockMatches;
}

function getStockLabel(value) {
  if (value === 0) return { label: "Out of stock", className: "bg-red-50 text-red-700" };
  if (value <= 10) return { label: `${value} low`, className: "bg-amber-50 text-amber-700" };
  return { label: `${value} in stock`, className: "bg-emerald-50 text-emerald-700" };
}
