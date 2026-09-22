import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  ChevronDown,
  Search,
  Heart,
  ShoppingBag,
  PhoneCall,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import apimethods from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, cartTotal, removeFromCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isLoggedIn, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("Eng");
  const [currency, setCurrency] = useState("USD");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const [categories, setCategories] = useState([]);

  const langRef = useRef(null);
  const currRef = useRef(null);

  const languages = [
    { code: "Eng", label: "English" },
    { code: "Hin", label: "Hindi" },
    { code: "Fra", label: "Français" },
    { code: "Ger", label: "Deutsch" },
  ];

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "INR", symbol: "₹" },
  ];

  // Fetch live categories from backend
  useEffect(() => {
    apimethods
      .getApi("/get-category")
      .then((data) => {
        if (data && data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch categories from backend:", err.message);
      });
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (currRef.current && !currRef.current.contains(event.target)) {
        setIsCurrOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const toggleMobileSubmenu = (menu) => {
    setMobileSubmenu(mobileSubmenu === menu ? null : menu);
  };

  return (
    <header className="w-full font-sans bg-white relative z-50 shadow-xs">
      {/* ============================================================
          1. TOP UTILITY BAR
          ============================================================ */}
      <div className="w-full bg-white border-b border-gray-200 text-xs text-gray-500">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[42px] gap-4 max-sm:justify-end">
            {/* Left: Location */}
            <div className="hidden sm:flex items-center gap-1.5 text-gray-500 text-xs truncate">
              <MapPin size={15} className="text-gray-400 shrink-0" />
              <span className="truncate">Store Location: Lincoln- 344, Illinois, Chicago, USA</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <div className="relative inline-flex items-center" ref={langRef}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 bg-transparent text-xs text-gray-500 hover:text-gray-900 cursor-pointer py-1 transition-colors"
                  onClick={() => {
                    setIsLangOpen(!isLangOpen);
                    setIsCurrOpen(false);
                  }}
                  aria-expanded={isLangOpen}
                  aria-label="Select Language"
                >
                  <span>{language}</span>
                  <ChevronDown size={12} />
                </button>

                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg min-w-[110px] z-50 py-1">
                    {languages.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        className={`block w-full px-3.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                          language === item.code
                            ? "bg-gray-50 text-[#00B207] font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={() => {
                          setLanguage(item.code);
                          setIsLangOpen(false);
                        }}
                      >
                        {item.code} ({item.label})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              
              <div className="relative inline-flex items-center" ref={currRef}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 bg-transparent text-xs text-gray-500 hover:text-gray-900 cursor-pointer py-1 transition-colors"
                  onClick={() => {
                    setIsCurrOpen(!isCurrOpen);
                    setIsLangOpen(false);
                  }}
                  aria-expanded={isCurrOpen}
                  aria-label="Select Currency"
                >
                  <span>{currency}</span>
                  <ChevronDown size={12} />
                </button>

                {isCurrOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg min-w-[110px] z-50 py-1">
                    {currencies.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        className={`block w-full px-3.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                          currency === item.code
                            ? "bg-gray-50 text-[#00B207] font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={() => {
                          setCurrency(item.code);
                          setIsCurrOpen(false);
                        }}
                      >
                        {item.code} ({item.symbol})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-gray-300 select-none font-light">|</span>

              
              {isLoggedIn ? (
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1 text-[#1A1A1A] font-medium text-xs">
                    <UserIcon size={13} className="text-[#00B207]" />
                    {user?.name || "Account"}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-xs text-gray-500 hover:text-rose-600 transition-colors cursor-pointer bg-transparent border-0 p-0"
                  >
                    (Logout)
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs text-gray-600 hover:text-[#00B207] font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <span className="text-gray-300 select-none">/</span>
                  <Link
                    to="/signup"
                    className="text-xs text-[#00B207] hover:underline font-semibold transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. MAIN HEADER BAR (WHITE)
          ============================================================ */}
      <div className="w-full bg-white py-5 border-b border-gray-100 lg:border-b-0">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-6">
            {/* Left: Brand Logo & Mobile Toggle */}
            <div className="flex items-center shrink-0 min-w-auto lg:min-w-[160px] gap-2">
              <button
                type="button"
                className="lg:hidden p-1.5 -ml-1.5 text-gray-800 hover:text-[#00B207] cursor-pointer transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
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
                onSubmit={handleSearchSubmit}
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
                    onChange={(e) => setSearch(e.target.value)}
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
              {/* Wishlist */}
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

              {/* Shopping Cart Trigger */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
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

      {/* ============================================================
          3. BOTTOM CHARCOAL NAVIGATION BAR
          ============================================================ */}
      <nav className="hidden lg:block w-full bg-[#333333]" aria-label="Main Navigation">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[52px]">
            {/* Left: Navigation Links */}
            <ul className="flex items-center gap-7 list-none m-0 p-0">
              {/* Home */}
              <li className="relative group">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-white hover:text-white transition-colors cursor-pointer"
                >
                  <span>Home</span>
                  <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 text-gray-300" />
                </Link>
                <div className="absolute top-full left-0 bg-white rounded-md shadow-xl border border-gray-100 min-w-[190px] py-2 z-50 hidden group-hover:block">
                  <Link to="/" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                    Home Modern
                  </Link>
                  <Link to="/shop" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                    Featured Products
                  </Link>
                </div>
              </li>

              {/* Shop (with live categories from backend) */}
              <li className="relative group">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors cursor-pointer"
                >
                  <span>Shop</span>
                  <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 text-gray-400 group-hover:text-gray-300" />
                </Link>
                <div className="absolute top-full left-0 bg-white rounded-md shadow-xl border border-gray-100 min-w-[200px] py-2 z-50 hidden group-hover:block">
                  <Link to="/shop" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                    All Products
                  </Link>
                  {categories.length > 0 ? (
                    categories.slice(0, 5).map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link to="/shop?category=Fresh%20Fruit" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                        Fresh Fruits
                      </Link>
                      <Link to="/shop?category=Vegetables" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                        Fresh Vegetables
                      </Link>
                    </>
                  )}
                  <Link to="/cart" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                    View Cart
                  </Link>
                </div>
              </li>

              {/* Pages */}
              <li className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors cursor-pointer bg-transparent border-0"
                >
                  <span>Pages</span>
                  <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 text-gray-400 group-hover:text-gray-300" />
                </button>
                <div className="absolute top-full left-0 bg-white rounded-md shadow-xl border border-gray-100 min-w-[190px] py-2 z-50 hidden group-hover:block">
                  <Link to="/about" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                    About Us
                  </Link>
                  <Link to="/contact" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                    Contact Us
                  </Link>
                  <Link to="/terms" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                    Terms & Conditions
                  </Link>
                  <Link to="/privacy" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                    Privacy Policy
                  </Link>
                </div>
              </li>

              {/* Blog */}
              <li className="relative group">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors cursor-pointer"
                >
                  <span>Blog</span>
                  <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 text-gray-400 group-hover:text-gray-300" />
                </Link>
                <div className="absolute top-full left-0 bg-white rounded-md shadow-xl border border-gray-100 min-w-[190px] py-2 z-50 hidden group-hover:block">
                  <Link to="/about" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                    Healthy Eating
                  </Link>
                  <Link to="/about" className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 hover:text-[#00B207] transition-colors">
                    Fresh Farming Tips
                  </Link>
                </div>
              </li>

              {/* About Us */}
              <li className="relative">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span>About Us</span>
                </Link>
              </li>

              {/* Contact Us */}
              <li className="relative">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>

            {/* Right: Phone Number Contact */}
            <a
              href="tel:2195550114"
              className="flex items-center gap-2 text-white hover:text-[#a3e635] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              <PhoneCall size={18} className="shrink-0 text-white" />
              <span>(219) 555-0114</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ============================================================
          4. MOBILE RESPONSIVE DRAWER
          ============================================================ */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src="/Logo.svg"
                  alt="Ecobazar"
                  className="h-7 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                className="p-1 text-gray-700 hover:text-[#00B207] cursor-pointer transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer Body Links */}
            <div className="flex-1 overflow-y-auto p-4">
              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                {/* Home */}
                <li className="border-b border-gray-100 pb-2">
                  <Link
                    to="/"
                    className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Home</span>
                  </Link>
                </li>

                {/* Shop */}
                <li className="border-b border-gray-100 pb-2">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors bg-transparent border-0 cursor-pointer"
                    onClick={() => toggleMobileSubmenu("shop")}
                  >
                    <span>Shop</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        mobileSubmenu === "shop" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileSubmenu === "shop" && (
                    <ul className="my-1 ml-3 pl-3 border-l-2 border-[#00B207] flex flex-col gap-1.5 list-none">
                      <li>
                        <Link
                          to="/shop"
                          className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          All Products
                        </Link>
                      </li>
                      {categories.map((cat) => (
                        <li key={cat._id}>
                          <Link
                            to={`/shop?category=${encodeURIComponent(cat.name)}`}
                            className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207] transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to="/cart"
                          className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Shopping Cart ({cartCount})
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Pages */}
                <li className="border-b border-gray-100 pb-2">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors bg-transparent border-0 cursor-pointer"
                    onClick={() => toggleMobileSubmenu("pages")}
                  >
                    <span>Pages</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        mobileSubmenu === "pages" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileSubmenu === "pages" && (
                    <ul className="my-1 ml-3 pl-3 border-l-2 border-[#00B207] flex flex-col gap-1.5 list-none">
                      <li>
                        <Link
                          to="/about"
                          className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/contact"
                          className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Contact Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/terms"
                          className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Terms & Conditions
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/privacy"
                          className="block py-1 text-[13px] text-gray-600 hover:text-[#00B207] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Privacy Policy
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* About Us */}
                <li className="border-b border-gray-100 pb-2">
                  <Link
                    to="/about"
                    className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>About Us</span>
                  </Link>
                </li>

                {/* Contact Us */}
                <li className="border-b border-gray-100 pb-2">
                  <Link
                    to="/contact"
                    className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Contact Us</span>
                  </Link>
                </li>

                {/* Cart link */}
                <li className="border-b border-gray-100 pb-2">
                  <Link
                    to="/cart"
                    className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Cart (${cartTotal.toFixed(2)})</span>
                  </Link>
                </li>

                {/* Auth link */}
                <li className="border-b border-gray-100 pb-2">
                  {isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between text-[15px] font-medium text-rose-600 hover:text-rose-700 py-2 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      <span>Logout ({user?.name || "User"})</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 py-2">
                      <Link
                        to="/login"
                        className="text-[15px] font-medium text-gray-900 hover:text-[#00B207] transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <span className="text-gray-300">/</span>
                      <Link
                        to="/signup"
                        className="text-[15px] font-semibold text-[#00B207] hover:underline transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </li>

                {/* Mobile Wishlist link */}
                <li className="border-b border-gray-100 pb-2">
                  <Link
                    to="/wishlist"
                    className="w-full flex items-center justify-between text-[15px] font-medium text-gray-900 hover:text-[#00B207] py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Heart size={18} className="text-[#00B207]" />
                      <span>My Wishlist</span>
                    </span>
                    {wishlistCount > 0 && (
                      <span className="bg-[#00B207] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Drawer Footer Contact */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col gap-3">
              <a href="tel:2195550114" className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
                <PhoneCall size={18} className="text-[#00B207]" />
                <span>(219) 555-0114</span>
              </a>
              <div className="text-xs text-gray-500">
                Lincoln- 344, Illinois, Chicago, USA
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          5. MINI CART SLIDE-OUT DRAWER (Screenshot 1)
          ============================================================ */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity duration-300 animate-fadeIn"
            onClick={() => setIsCartDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out">
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>Shopping Cart</span>
                  <span className="text-[#00B207]">({cartCount})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Close Shopping Cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-600">Your shopping cart is empty.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigate("/shop");
                      }}
                      className="mt-4 inline-block text-xs font-semibold text-[#00B207] hover:underline"
                    >
                      Start Shopping &rarr;
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-3 first:pt-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center p-1">
                          <img
                            src={item.image || "/greenApple.png"}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = "/greenApple.png";
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.quantity} {item.unit || "kg"} x <span className="font-semibold text-gray-900">${Number(item.price).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 rounded-full border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-300 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                        title="Remove from cart"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                    <span className="text-gray-500 font-normal">
                      {cartItems.length} {cartItems.length === 1 ? "Product" : "Products"}
                    </span>
                    <span className="text-lg font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigate("/checkout");
                    }}
                    className="w-full bg-[#00B207] hover:bg-[#009606] text-white py-3.5 rounded-full font-semibold text-sm transition-colors text-center shadow-xs cursor-pointer"
                  >
                    Checkout
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigate("/cart");
                    }}
                    className="w-full bg-[#EBF7EB] hover:bg-[#d8edd8] text-[#00B207] py-3.5 rounded-full font-semibold text-sm transition-colors text-center cursor-pointer"
                  >
                    Go To Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
