import { useState } from "react";
import AddEditCategory from "./AddEdit";
const Category = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-[#333] sm:text-[22px]">
         Category
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="h-[36px] w-full rounded-[6px] bg-[#00491B] px-4 text-[12px] font-semibold text-white transition hover:bg-[#019D3E] sm:w-auto"
        >
          Add Category
        </button>
      </div>
      <AddEditCategory
        showForm={showForm}
        setShowForm={setShowForm}
      />
    </>
  );
};
export default Category;
