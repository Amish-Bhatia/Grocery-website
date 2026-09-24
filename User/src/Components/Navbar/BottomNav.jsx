import { Link } from "react-router-dom";
import { ChevronDown, PhoneCall } from "lucide-react";

export default function BottomNav({ categories = [] }) {
  return (
    <nav className="hidden lg:block w-full bg-[#333333]" aria-label="Main Navigation">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[52px]">
          <ul className="flex items-center gap-7 list-none m-0 p-0">
            {/* Home */}
            <li className="relative group">
              <Link to="/" className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-white transition-colors cursor-pointer">
                <span>Home</span>
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 text-gray-300" />
              </Link>
              <div className="absolute top-full left-0 bg-white rounded-md shadow-xl border border-gray-100 min-w-[190px] py-2 z-50 hidden group-hover:block">
                <Link to="/" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">Home Modern</Link>
                <Link to="/shop" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">Featured Products</Link>
              </div>
            </li>

            {/* Shop with Categories */}
            <li className="relative group">
              <Link to="/shop" className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors cursor-pointer">
                <span>Shop</span>
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 text-gray-400 group-hover:text-gray-300" />
              </Link>
              <div className="absolute top-full left-0 bg-white rounded-md shadow-xl border border-gray-100 min-w-[200px] py-2 z-50 hidden group-hover:block">
                <Link to="/shop" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">All Products</Link>
                {categories.length > 0 ? (
                  categories.slice(0, 5).map((cat) => (
                    <Link key={cat._id} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <>
                    <Link to="/shop?category=Fresh%20Fruit" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">Fresh Fruits</Link>
                    <Link to="/shop?category=Vegetables" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">Fresh Vegetables</Link>
                  </>
                )}
                <Link to="/cart" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">View Cart</Link>
              </div>
            </li>

            {/* Pages */}
            <li className="relative group">
              <button type="button" className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors cursor-pointer bg-transparent border-0">
                <span>Pages</span>
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 text-gray-400 group-hover:text-gray-300" />
              </button>
              <div className="absolute top-full left-0 bg-white rounded-md shadow-xl border border-gray-100 min-w-[200px] py-2 z-50 hidden group-hover:block">
                <Link to="/account/dashboard" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">Dashboard</Link>
                <Link to="/account/order-history" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">Order History</Link>
                <Link to="/account/settings" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">Account Settings</Link>
                <Link to="/faqs" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">FAQs</Link>
                <Link to="/about" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">About Us</Link>
                <Link to="/contact" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">Contact Us</Link>
                <Link to="/terms" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">Terms & Conditions</Link>
                <Link to="/privacy" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">Privacy Policy</Link>
              </div>
            </li>

            {/* Blog */}
            <li className="relative group">
              <Link to="/about" className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors cursor-pointer">
                <span>Blog</span>
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 text-gray-400 group-hover:text-gray-300" />
              </Link>
              <div className="absolute top-full left-0 bg-white rounded-md shadow-xl border border-gray-100 min-w-[190px] py-2 z-50 hidden group-hover:block">
                <Link to="/about" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">Healthy Eating</Link>
                <Link to="/about" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207]">Fresh Farming Tips</Link>
              </div>
            </li>

            {/* About & Contact */}
            <li>
              <Link to="/about" className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors">Contact Us</Link>
            </li>
          </ul>

          <p href="tel:2195550114" className="flex items-center gap-2 text-white hover:text-[#a3e635] text-sm font-medium transition-colors whitespace-nowrap">
            <PhoneCall size={18} className="shrink-0 text-white" />
            <span>(219) 555-0114</span>
          </p>
        </div>
      </div>
    </nav>
  );
}
