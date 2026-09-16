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
import { useAuth } from "../context/AuthContext";
import apimethods from "../services/api";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount, cartTotal } = useCart();
  const { user, isLoggedIn, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("Eng");
  const [currency, setCurrency] = useState("USD");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        // Fallback gracefully if backend is offline
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
    <header className="ecobazar-navbar-wrapper">
      {/* ============================================================
          1. TOP UTILITY BAR
          ============================================================ */}
      <div className="nav-top-bar">
        <div className="nav-container">
          <div className="nav-top-content">
            {/* Left: Location */}
            <div className="nav-location">
              <MapPin size={15} className="nav-location-icon" />
              <span>Store Location: Lincoln- 344, Illinois, Chicago, USA</span>
            </div>

            {/* Right: Language, Currency, Auth */}
            <div className="nav-top-right">
              {/* Language Selector */}
              <div className="nav-dropdown-wrapper" ref={langRef}>
                <button
                  type="button"
                  className="nav-dropdown-trigger"
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
                  <div className="nav-dropdown-menu">
                    {languages.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        className={`nav-dropdown-item ${
                          language === item.code ? "active" : ""
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

              {/* Currency Selector */}
              <div className="nav-dropdown-wrapper" ref={currRef}>
                <button
                  type="button"
                  className="nav-dropdown-trigger"
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
                  <div className="nav-dropdown-menu">
                    {currencies.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        className={`nav-dropdown-item ${
                          currency === item.code ? "active" : ""
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

              <span className="nav-divider">|</span>

              {/* Sign In / Sign Up or Logged in User */}
              {isLoggedIn ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#1A1A1A", fontWeight: 500 }}>
                    <UserIcon size={13} color="#00B207" />
                    {user?.name || "Account"}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="nav-auth-link"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    (Logout)
                  </button>
                </div>
              ) : (
                <Link to="/login" className="nav-auth-link">
                  Sign In / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. MAIN HEADER BAR (WHITE)
          ============================================================ */}
      <div className="nav-main-header">
        <div className="nav-container">
          <div className="nav-main-content">
            {/* Left: Brand Logo & Mobile Toggle */}
            <div className="nav-brand-area">
              <button
                type="button"
                className="nav-mobile-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
              >
                <Menu size={24} />
              </button>

              <Link to="/" className="nav-logo-link" aria-label="Ecobazar Home">
                <img
                  src="/Logo.svg"
                  alt="Ecobazar"
                  className="nav-brand-logo"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.innerHTML =
                      '<span style="font-size:24px;font-weight:700;color:#002603;display:flex;align-items:center;gap:6px;"><span style="color:#00B207">🌿</span>Ecobazar</span>';
                  }}
                />
              </Link>
            </div>

            {/* Center: Search Box */}
            <div className="nav-search-area">
              <form
                onSubmit={handleSearchSubmit}
                className="nav-search-form"
                role="search"
              >
                <div className="nav-search-input-group">
                  <span className="nav-search-icon">
                    <Search size={18} />
                  </span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="nav-search-input"
                    aria-label="Search products"
                  />
                </div>
                <button type="submit" className="nav-search-btn">
                  Search
                </button>
              </form>
            </div>

            {/* Right: Wishlist & Cart */}
            <div className="nav-actions-area">
              {/* Wishlist */}
              <Link
                to="/shop"
                className="nav-wishlist-btn"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart size={28} strokeWidth={1.5} />
              </Link>

              <div className="nav-actions-divider" />

              {/* Shopping Cart (Connected to CartContext) */}
              <Link to="/cart" className="nav-cart-widget" aria-label="Shopping Cart">
                <div className="nav-cart-icon-wrap">
                  <ShoppingBag size={28} strokeWidth={1.5} />
                  <span className="nav-cart-badge">{cartCount}</span>
                </div>
                <div className="nav-cart-info">
                  <span className="nav-cart-label">Shopping cart:</span>
                  <span className="nav-cart-price">${cartTotal.toFixed(2)}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          3. BOTTOM CHARCOAL NAVIGATION BAR
          ============================================================ */}
      <nav className="nav-bottom-bar" aria-label="Main Navigation">
        <div className="nav-container">
          <div className="nav-bottom-content">
            {/* Left: Navigation Links */}
            <ul className="nav-links-list">
              {/* Home */}
              <li className="nav-link-item">
                <Link to="/" className="nav-link-btn active">
                  <span>Home</span>
                  <ChevronDown size={14} className="nav-chevron" />
                </Link>
                <div className="nav-sub-menu">
                  <Link to="/" className="nav-sub-item">
                    Home Modern
                  </Link>
                  <Link to="/shop" className="nav-sub-item">
                    Featured Products
                  </Link>
                </div>
              </li>

              {/* Shop (with live categories from backend) */}
              <li className="nav-link-item">
                <Link to="/shop" className="nav-link-btn">
                  <span>Shop</span>
                  <ChevronDown size={14} className="nav-chevron" />
                </Link>
                <div className="nav-sub-menu">
                  <Link to="/shop" className="nav-sub-item">
                    All Products
                  </Link>
                  {categories.length > 0 ? (
                    categories.slice(0, 5).map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="nav-sub-item"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link to="/shop?category=Fresh%20Fruit" className="nav-sub-item">
                        Fresh Fruits
                      </Link>
                      <Link to="/shop?category=Vegetables" className="nav-sub-item">
                        Fresh Vegetables
                      </Link>
                    </>
                  )}
                  <Link to="/cart" className="nav-sub-item">
                    View Cart
                  </Link>
                </div>
              </li>

              {/* Pages */}
              <li className="nav-link-item">
                <button type="button" className="nav-link-btn">
                  <span>Pages</span>
                  <ChevronDown size={14} className="nav-chevron" />
                </button>
                <div className="nav-sub-menu">
                  <Link to="/about" className="nav-sub-item">
                    About Us
                  </Link>
                  <Link to="/contact" className="nav-sub-item">
                    Contact Us
                  </Link>
                  <Link to="/terms" className="nav-sub-item">
                    Terms & Conditions
                  </Link>
                  <Link to="/privacy" className="nav-sub-item">
                    Privacy Policy
                  </Link>
                </div>
              </li>

              {/* Blog */}
              <li className="nav-link-item">
                <Link to="/about" className="nav-link-btn">
                  <span>Blog</span>
                  <ChevronDown size={14} className="nav-chevron" />
                </Link>
                <div className="nav-sub-menu">
                  <Link to="/about" className="nav-sub-item">
                    Healthy Eating
                  </Link>
                  <Link to="/about" className="nav-sub-item">
                    Fresh Farming Tips
                  </Link>
                </div>
              </li>

              {/* About Us */}
              <li className="nav-link-item">
                <Link to="/about" className="nav-link-btn">
                  <span>About Us</span>
                </Link>
              </li>

              {/* Contact Us */}
              <li className="nav-link-item">
                <Link to="/contact" className="nav-link-btn">
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>

            {/* Right: Phone Number Contact */}
            <a href="tel:2195550114" className="nav-contact-area">
              <PhoneCall size={18} className="nav-phone-icon" />
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
          className="nav-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="nav-mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="nav-drawer-header">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src="/Logo.svg"
                  alt="Ecobazar"
                  className="nav-brand-logo"
                  style={{ height: "28px" }}
                />
              </Link>
              <button
                type="button"
                className="nav-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer Body Links */}
            <div className="nav-drawer-body">
              <ul className="nav-mobile-links">
                {/* Home */}
                <li className="nav-mobile-link-item">
                  <Link
                    to="/"
                    className="nav-mobile-link-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Home</span>
                  </Link>
                </li>

                {/* Shop */}
                <li className="nav-mobile-link-item">
                  <button
                    type="button"
                    className="nav-mobile-link-btn"
                    onClick={() => toggleMobileSubmenu("shop")}
                  >
                    <span>Shop</span>
                    <ChevronDown
                      size={16}
                      style={{
                        transform:
                          mobileSubmenu === "shop" ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>
                  {mobileSubmenu === "shop" && (
                    <ul className="nav-mobile-sub-menu">
                      <li>
                        <Link
                          to="/shop"
                          className="nav-mobile-sub-item"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          All Products
                        </Link>
                      </li>
                      {categories.map((cat) => (
                        <li key={cat._id}>
                          <Link
                            to={`/shop?category=${encodeURIComponent(cat.name)}`}
                            className="nav-mobile-sub-item"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to="/cart"
                          className="nav-mobile-sub-item"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Shopping Cart ({cartCount})
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Pages */}
                <li className="nav-mobile-link-item">
                  <button
                    type="button"
                    className="nav-mobile-link-btn"
                    onClick={() => toggleMobileSubmenu("pages")}
                  >
                    <span>Pages</span>
                    <ChevronDown
                      size={16}
                      style={{
                        transform:
                          mobileSubmenu === "pages" ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>
                  {mobileSubmenu === "pages" && (
                    <ul className="nav-mobile-sub-menu">
                      <li>
                        <Link
                          to="/about"
                          className="nav-mobile-sub-item"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/contact"
                          className="nav-mobile-sub-item"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Contact Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/terms"
                          className="nav-mobile-sub-item"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Terms & Conditions
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/privacy"
                          className="nav-mobile-sub-item"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Privacy Policy
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* About Us */}
                <li className="nav-mobile-link-item">
                  <Link
                    to="/about"
                    className="nav-mobile-link-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>About Us</span>
                  </Link>
                </li>

                {/* Contact Us */}
                <li className="nav-mobile-link-item">
                  <Link
                    to="/contact"
                    className="nav-mobile-link-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Contact Us</span>
                  </Link>
                </li>

                {/* Cart link */}
                <li className="nav-mobile-link-item">
                  <Link
                    to="/cart"
                    className="nav-mobile-link-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Cart (${cartTotal.toFixed(2)})</span>
                  </Link>
                </li>

                {/* Auth link */}
                <li className="nav-mobile-link-item">
                  {isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="nav-mobile-link-btn"
                      style={{ color: "#e11d48" }}
                    >
                      <span>Logout ({user?.name || "User"})</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="nav-mobile-link-btn"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>Sign In / Sign Up</span>
                    </Link>
                  )}
                </li>
              </ul>
            </div>

            {/* Drawer Footer Contact */}
            <div className="nav-drawer-footer">
              <a href="tel:2195550114" className="nav-drawer-contact">
                <PhoneCall size={18} color="#00B207" />
                <span>(219) 555-0114</span>
              </a>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Lincoln- 344, Illinois, Chicago, USA
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
