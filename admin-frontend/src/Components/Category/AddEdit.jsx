import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apimethods, { API_BASE_URL } from "../../Methods/ApiClient";

const emptyForm = {
  name: "",
  image: null,
};

export default function AddEdit({ showForm, setShowForm }) {
  const [formData, setFormData] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await apimethods.getApi("/get-category");

      setCategories(data.categories || []);
    } catch (error) {
      Swal.fire({
        title: "Failed to load categories",
        text: error.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "image" ? files?.[0] || null : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const body = new FormData();

      body.append("name", formData.name);

      if (formData.image) {
        body.append("image", formData.image);
      }

      await apimethods.postApi("/add-category", body);

      await loadCategories();

      setFormData(emptyForm);

      setShowForm(false);

      Swal.fire({
        title: "Category Added Successfully",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Failed to Add Category",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Delete category?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await apimethods.deleteApi(`/delete-category/${id}`);

      await loadCategories();

      Swal.fire({
        title: "Deleted",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Delete failed",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div>

      {showForm && (
        <div className="mb-8 flex justify-center">

          <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-slate-900">Add Category</h3>
                <p className="mt-1 text-sm text-slate-500">Create a new product category.</p>
              </div>

              <button type="button" onClick={() => setShowForm(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600">×</button>

            </div>

            <div className="mb-5">

              <label htmlFor="category-name" className="mb-2 block text-sm font-medium text-slate-700">Category Name</label>

              <input id="category-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter category name" required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />

            </div>

            <div className="mb-6">

              <label htmlFor="category-image" className="mb-2 block text-sm font-medium text-slate-700">Category Image</label>

              <input id="category-image" type="file" name="image" accept="image/jpeg,image/png,image/webp" onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-700" />

            </div>

            <div className="flex gap-3">

              <button type="button" onClick={() => setShowForm(false)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>

              <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Saving..." : "Add Category"}</button>

            </div>

          </form>

        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {categories.length > 0 ? categories.map((item) => (
          <div key={item._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            {item.image ? <img src={`${API_BASE_URL}/uploads/categories/${item.image}`} alt={item.name} className="h-44 w-full object-cover" /> : <div className="flex h-44 items-center justify-center bg-slate-100 text-sm text-slate-400">No image</div>}

            <div className="flex items-center justify-between gap-3 p-4">

              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">{item.name}</p>
              </div>

              <button type="button" onClick={() => deleteCategory(item._id)} className="shrink-0 text-sm font-medium text-red-600 transition hover:text-red-800">Delete</button>

            </div>

          </div>
        )) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 sm:col-span-2 lg:col-span-3 xl:col-span-4">No categories found.</div>
        )}

      </div>

    </div>
  );
}