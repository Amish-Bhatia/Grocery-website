import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "grocery_customer_cart";
const COUPON_STORAGE_KEY = "grocery_customer_coupon";

const VALID_COUPONS = {
  SAVE10: 10,
  ECOBAZAR: 10,
  SAVE20: 20,
  WELCOME15: 15,
  FRESH50: 50,
};

const initialCart = [
  {
    id: "sample-1",
    name: "Fresh Red Apples (1kg)",
    price: 15.0,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&auto=format&fit=crop&q=80",
    category: "Fresh Fruit",
  },
  {
    id: "sample-2",
    name: "Fresh Green Broccoli (500g)",
    price: 27.0,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200&auto=format&fit=crop&q=80",
    category: "Vegetables",
  },
];

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialCart;
    } catch {
      return initialCart;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save coupon to localStorage", e);
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1) => {
    const prodId = product.id || product._id;
    if (!prodId) return { success: false, message: "Invalid product" };

    const maxStock =
      product.stock !== undefined && product.stock !== null && !isNaN(product.stock)
        ? Number(product.stock)
        : 99;

    let result = { success: true, reachedLimit: false, currentQty: quantity, maxStock };

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === prodId);
      if (existing) {
        const targetQty = existing.quantity + quantity;
        const cappedQty = Math.min(targetQty, maxStock);
        if (targetQty > maxStock) {
          result = { success: false, reachedLimit: true, currentQty: existing.quantity, maxStock };
        } else {
          result = { success: true, reachedLimit: cappedQty >= maxStock, currentQty: cappedQty, maxStock };
        }

        return prevItems.map((item) =>
          item.id === prodId
            ? { ...item, quantity: cappedQty, stock: maxStock }
            : item
        );
      }

      const initialQty = Math.min(quantity, maxStock);
      result = {
        success: initialQty > 0,
        reachedLimit: initialQty >= maxStock,
        currentQty: initialQty,
        maxStock,
      };

      return [
        ...prevItems,
        {
          id: prodId,
          name: product.name,
          price: Number(product.price) || 0,
          quantity: initialQty,
          image: product.image || "",
          category: product.category || "General",
          stock: maxStock,
        },
      ];
    });

    return result;
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const maxStock =
            item.stock !== undefined && item.stock !== null && !isNaN(item.stock)
              ? Number(item.stock)
              : 99;
          const cappedQty = Math.min(quantity, maxStock);
          return { ...item, quantity: cappedQty, stock: maxStock };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (rawCode) => {
    if (!rawCode || !rawCode.trim()) {
      return { success: false, message: "Please enter a coupon code." };
    }
    const code = rawCode.trim().toUpperCase();

    // Try backend verification first
    try {
      const user = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = user._id || user.id || null;

      const response = await fetch("http://localhost:3000/verifycoupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("userToken") ? { Authorization: `Bearer ${localStorage.getItem("userToken")}` } : {}),
        },
        body: JSON.stringify({
          code,
          cartTotal,
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.coupon) {
        const couponObj = {
          code: data.coupon.code,
          discountType: data.coupon.discountType || "percentage",
          discountValue: Number(data.coupon.discountValue || 0),
          discountPercent: data.discountPercent || (data.coupon.discountType === "percentage" ? data.coupon.discountValue : 0),
          discountAmount: data.discountAmount,
          description: data.coupon.description,
        };
        setAppliedCoupon(couponObj);
        return {
          success: true,
          discountPercent: couponObj.discountPercent,
          discountAmount: data.discountAmount,
          message: data.message || `Coupon "${code}" applied successfully!`,
        };
      } else if (data && data.message) {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (e) {
      console.warn("Backend coupon verification unavailable, using fallback list:", e);
    }

    // Fallback to static coupon codes if backend is unreachable
    let discountPercent = VALID_COUPONS[code];

    if (!discountPercent && code.startsWith("SAVE")) {
      const match = code.match(/^SAVE(\d{1,2})$/);
      if (match) {
        const val = parseInt(match[1], 10);
        if (val > 0 && val <= 70) {
          discountPercent = val;
        }
      }
    }

    if (discountPercent) {
      const couponObj = {
        code,
        discountType: "percentage",
        discountValue: discountPercent,
        discountPercent,
      };
      setAppliedCoupon(couponObj);
      return {
        success: true,
        discountPercent,
        message: `Coupon "${code}" applied! You got ${discountPercent}% discount.`,
      };
    }

    return {
      success: false,
      message: `"${code}" is an invalid or expired coupon code!`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Total number of individual items (sum of all quantities)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "fixed"
      ? Math.min(cartTotal, Number(appliedCoupon.discountValue || 0))
      : Number(((cartTotal * (appliedCoupon.discountPercent || appliedCoupon.discountValue || 0)) / 100).toFixed(2))
    : 0;

  const discountPercent = appliedCoupon
    ? appliedCoupon.discountPercent || (cartTotal > 0 ? Math.round((discountAmount / cartTotal) * 100) : 0)
    : 0;

  const cartFinalTotal = Number(Math.max(0, cartTotal - discountAmount).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountPercent,
        discountAmount,
        cartFinalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
