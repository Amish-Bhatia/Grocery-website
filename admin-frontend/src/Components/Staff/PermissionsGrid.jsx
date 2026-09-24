export const permissionSections = [
  { key: "products", label: "Products", actions: ["read", "edit", "delete"] },
  { key: "categories", label: "Categories", actions: ["read", "create", "edit", "delete"] },
  { key: "orders", label: "Orders", actions: ["read", "edit", "delete"] },
  { key: "customers", label: "Customers", actions: ["read", "edit", "delete"] },
];

export default function PermissionsGrid({ permissions, onPermissionChange }) {
  return (
    <section className="mt-8 border-t border-slate-100 pt-6">
      <h2 className="text-lg font-semibold text-slate-900">Permissions</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {permissionSections.map((section) => (
          <div key={section.key} className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-medium text-slate-800">{section.label}</h3>
            <div className="mt-3 flex flex-wrap gap-5">
              {section.actions.map((action) => (
                <label key={action} className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name={action}
                    data-section={section.key}
                    checked={Boolean(permissions[section.key]?.[action])}
                    onChange={onPermissionChange}
                    className="h-4 w-4 rounded border-slate-300 text-[#019D3E] focus:ring-emerald-200"
                  />
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
