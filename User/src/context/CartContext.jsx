import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "grocery_customer_cart";

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

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
  };

  // Total number of individual items (sum of all quantities)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
