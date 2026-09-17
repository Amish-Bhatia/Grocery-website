import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext(null);

const WISHLIST_KEY = "grocery_wishlist";

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist]);

  // Toggle a product in/out of wishlist
  const toggleWishlist = (productOrId) => {
    const id = typeof productOrId === "object" ? productOrId._id || productOrId.id : productOrId;
    if (!id) return;

    setWishlist((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item !== id));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  // Check if a specific product is wishlisted
  const isWishlisted = (productOrId) => {
    const id = typeof productOrId === "object" ? productOrId._id || productOrId.id : productOrId;
    return wishlist.includes(id);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
