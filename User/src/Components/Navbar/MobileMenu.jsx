import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronDown, Heart, PhoneCall } from "lucide-react";

export default function MobileMenu({
  isOpen,
  onClose,
  categories = [],
  cartCount = 0,
  cartTotal = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  user = null,
  logout,
}) {
  const [mobileSubmenu, setMobileSubmenu] = useState(null);

  if (!isOpen) return null;

  const toggleMobileSubmenu = (menu) => {
    setMobileSubmenu(mobileSubmenu === menu ? null : menu);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose}>
      <div
        className="fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link to="/" onClick={onClose}>
            <img src="/Logo.svg" alt="Ecobazar" className="h-7 w-auto object-contain" />
          </Link>
          <button type="button" className="p-1 text-gray-700 hover:text-[#00B207] cursor-pointer" onClick={onClose} aria-label="Close Menu">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ul className="flex flex-col gap-2 list-none m-0 p-0">
            <li className="border-b border-gray-100 pb-2">
              <Link to="/" className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors" onClick={onClose}>
                <span>Home</span>
              </Link>
            </li>

            <li className="border-b border-gray-100 pb-2">
              <button type="button" className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors bg-transparent border-0 cursor-pointer" onClick={() => toggleMobileSubmenu("shop")}>
                <span>Shop</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileSubmenu === "shop" ? "rotate-180" : ""}`} />
              </button>
              {mobileSubmenu === "shop" && (
                <ul className="my-1 ml-3 pl-3 border-l-2 border-[#00B207] flex flex-col gap-1.5 list-none">
                  <li><Link to="/shop" className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>All Products</Link></li>
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                  <li><Link to="/cart" className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>Shopping Cart ({cartCount})</Link></li>
                </ul>
              )}
            </li>

            <li className="border-b border-gray-100 pb-2">
              <button type="button" className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors bg-transparent border-0 cursor-pointer" onClick={() => toggleMobileSubmenu("pages")}>
                <span>Pages</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileSubmenu === "pages" ? "rotate-180" : ""}`} />
              </button>
              {mobileSubmenu === "pages" && (
                <ul className="my-1 ml-3 pl-3 border-l-2 border-[#00B207] flex flex-col gap-1.5 list-none">
                  <li><Link to="/account/dashboard" className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>Dashboard</Link></li>
                  <li><Link to="/account/order-history" className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>Order History</Link></li>
                  <li><Link to="/account/settings" className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>Settings</Link></li>
                  <li><Link to="/faqs" className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>FAQs</Link></li>
                  <li><Link to="/about" className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>About Us</Link></li>
                  <li><Link to="/contact" className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>Contact Us</Link></li>
                  <li><Link to="/terms" className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>Terms & Conditions</Link></li>
                  <li><Link to="/privacy" className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207]" onClick={onClose}>Privacy Policy</Link></li>
                </ul>
              )}
            </li>

            <li className="border-b border-gray-100 pb-2">
              <Link to="/about" className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors" onClick={onClose}>About Us</Link>
            </li>
            <li className="border-b border-gray-100 pb-2">
              <Link to="/contact" className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors" onClick={onClose}>Contact Us</Link>
            </li>
            <li className="border-b border-gray-100 pb-2">
              <Link to="/cart" className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors" onClick={onClose}>
                <span>Cart (${cartTotal.toFixed(2)})</span>
              </Link>
            </li>

            <li className="border-b border-gray-100 pb-2">
              {isLoggedIn ? (
                <button type="button" onClick={() => { logout(); onClose(); }} className="w-full flex items-center justify-between text-[15px] font-medium text-rose-600 hover:text-rose-700 py-2 transition-colors bg-transparent border-0 cursor-pointer">
                  <span>Logout ({user?.name || "User"})</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 py-2">
                  <Link to="/login" className="text-[15px] font-medium text-gray-900 hover:text-[#00B207]" onClick={onClose}>Sign In</Link>
                  <span className="text-gray-300">/</span>
                  <Link to="/signup" className="text-[15px] font-semibold text-[#00B207] hover:underline" onClick={onClose}>Sign Up</Link>
                </div>
              )}
            </li>

            <li className="border-b border-gray-100 pb-2">
              <Link to="/wishlist" className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors" onClick={onClose}>
                <span className="flex items-center gap-2">
                  <Heart size={18} className="text-[#00B207]" />
                  <span>My Wishlist</span>
                </span>
                {wishlistCount > 0 && <span className="bg-[#00B207] text-white text-xs px-2 py-0.5 rounded-full font-bold">{wishlistCount}</span>}
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col gap-3">
          <a href="tel:2195550114" className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
            <PhoneCall size={18} className="text-[#00B207]" />
            <span>(219) 555-0114</span>
          </a>
          <div className="text-xs text-gray-500">Lincoln- 344, Illinois, Chicago, USA</div>
        </div>
      </div>
    </div>
  );
}
