export default function EmptyState({ icon: Icon, title, description, children, className = "" }) {
  return (
    <div className={`flex min-h-64 flex-col items-center justify-center px-5 text-center ${className}`}>
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#019D3E]">
          <Icon size={25} />
        </div>
      )}
      <h2 className="mt-4 text-sm font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {children}
    </div>
  );
}
