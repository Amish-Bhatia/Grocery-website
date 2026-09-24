import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import debounce from "lodash.debounce";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import apimethods from "../services/api";
import TopBar from "./Navbar/TopBar";
import MainHeader from "./Navbar/MainHeader";
import BottomNav from "./Navbar/BottomNav";
import MobileMenu from "./Navbar/MobileMenu";
import CartDrawer from "./Navbar/CartDrawer";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, cartCount, cartTotal, removeFromCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isLoggedIn, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apimethods
      .getApi("/get-category")
      .then((data) => {
        if (data?.categories) setCategories(data.categories);
      })
      .catch((err) => {
        console.warn("Could not fetch categories:", err.message);
      });
  }, []);

  useEffect(() => {
    if (location.pathname === "/shop") {
      const currentQuery = new URLSearchParams(location.search).get("search") || "";
      setSearch(currentQuery);
    }
  }, [location.pathname, location.search]);

  const debouncedNavbarSearch = useRef(
    debounce((query) => {
      const trimmed = query ? query.trim() : "";
      if (trimmed) {
        navigate(`/shop?search=${encodeURIComponent(trimmed)}`, {
          replace: window.location.pathname === "/shop",
        });
      } else if (window.location.pathname === "/shop") {
        const params = new URLSearchParams(window.location.search);
        params.delete("search");
        const remaining = params.toString();
        navigate(`/shop${remaining ? `?${remaining}` : ""}`, { replace: true });
      }
    }, 350)
  ).current;

  useEffect(() => {
    return () => debouncedNavbarSearch.cancel();
  }, [debouncedNavbarSearch]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    debouncedNavbarSearch(val);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    debouncedNavbarSearch.cancel();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    } else if (location.pathname === "/shop") {
      const params = new URLSearchParams(location.search);
      params.delete("search");
      const remaining = params.toString();
      navigate(`/shop${remaining ? `?${remaining}` : ""}`);
    }
  };

  return (
    <header className="w-full font-sans bg-white relative z-50 shadow-xs">
      <TopBar user={user} isLoggedIn={isLoggedIn} logout={logout} />
      <MainHeader
        search={search}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenCartDrawer={() => setIsCartDrawerOpen(true)}
      />
      <BottomNav categories={categories} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        user={user}
        logout={logout}
      />
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onRemoveItem={removeFromCart}
      />
    </header>
  );
};

export default Navbar;
