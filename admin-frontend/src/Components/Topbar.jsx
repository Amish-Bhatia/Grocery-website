const Topbar = ({ adminName = "Amish Bhatia", adminRole = "Admin" }) => {
  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex h-[64px] items-center justify-end bg-linear-to-r from-[#019D3E] to-[#00491B] px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-[#8e6b48]">
          {initials}
        </div>
        <div className="text-right leading-tight">
          <p className="text-[13px] font-semibold text-white">{adminName}</p>
          <p className="text-[11px] text-white/70">{adminRole}</p>
        </div>
        <span className="text-[10px] text-white/80">▾</span>
      </div>
    </div>
  );
};

export default Topbar;