import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu } from "lucide-react";

export default function MainHeader({
  search,
  onSearchChange,
  onSearchSubmit,
  wishlistCount,
  cartCount,
  cartTotal,
  onOpenMobileMenu,
  onOpenCartDrawer,
}) {
  return (
    <div className="w-full bg-white py-5 border-b border-gray-100 lg:border-b-0">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-6">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center shrink-0 min-w-auto lg:min-w-[160px] gap-2">
            <button
              type="button"
              className="lg:hidden p-1.5 -ml-1.5 text-gray-800 hover:text-[#00B207] cursor-pointer transition-colors"
              onClick={onOpenMobileMenu}
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>

            <Link to="/" className="flex items-center" aria-label="Ecobazar Home">
              <img
                src="/Logo.svg"
                alt="Ecobazar"
                className="h-8 sm:h-9 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML =
                    '<span style="font-size:24px;font-weight:700;color:#002603;display:flex;align-items:center;gap:6px;"><span style="color:#00B207">🌿</span>Ecobazar</span>';
                }}
              />
            </Link>
          </div>

          {/* Center: Search Box */}
          <div className="order-3 lg:order-none w-full lg:w-auto lg:flex-1 max-w-full lg:max-w-[540px] mx-auto">
            <form
              onSubmit={onSearchSubmit}
              className="flex items-center w-full border border-gray-200 rounded-md bg-white focus-within:border-[#00B207] focus-within:ring-1 focus-within:ring-[#00B207] transition-all overflow-hidden"
              role="search"
            >
              <div className="relative flex items-center flex-1">
                <span className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center">
                  <Search size={18} />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={onSearchChange}
                  placeholder="Search"
                  className="w-full h-11 pl-10 pr-3 text-sm text-[#1A1A1A] placeholder-gray-400 bg-transparent border-none outline-none"
                  aria-label="Search products"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-6 sm:px-7 bg-[#00B207] hover:bg-[#009606] text-white text-sm font-semibold transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right: Wishlist & Cart */}
          <div className="flex items-center gap-4 shrink-0 min-w-auto lg:min-w-[160px] justify-end ml-auto lg:ml-0">
            <Link
              to="/wishlist"
              className="relative p-1 text-[#1A1A1A] hover:text-[#00B207] transition-all hover:scale-105 cursor-pointer flex items-center justify-center"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart size={28} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-[18px] h-[18px] rounded-full bg-[#00B207] text-white text-[10px] font-semibold flex items-center justify-center border-[1.5px] border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <div className="w-px h-7 bg-gray-200" />

            <button
              type="button"
              onClick={onOpenCartDrawer}
              className="flex items-center gap-3 select-none group cursor-pointer bg-transparent border-0 p-0 text-left"
              aria-label="Open Shopping Cart Drawer"
            >
              <div className="relative flex items-center justify-center text-[#1A1A1A] group-hover:text-[#00B207] transition-colors">
                <ShoppingBag size={28} strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1.5 w-[18px] h-[18px] rounded-full bg-[#2C742F] text-white text-[10px] font-semibold flex items-center justify-center border-[1.5px] border-white">
                  {cartCount}
                </span>
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="text-[11px] text-gray-500 font-normal">Shopping cart:</span>
                <span className="text-sm text-[#1A1A1A] font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
