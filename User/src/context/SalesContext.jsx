import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apimethods from "../services/api";

const SalesContext = createContext(null);

export function SalesProvider({ children }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apimethods.getApi("/getSales");
      const list = Array.isArray(res?.sales) ? res.sales : [];
      setSales(list);
    } catch (err) {
      console.warn("SalesContext: Could not fetch sales campaigns:", err.message);
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Compute active sales (isLive === true, not draft, within date range if specified)
  const activeSales = sales.filter((s) => {
    if (s.isLive === false || s.initialStatus === "draft") return false;
    const now = new Date();
    if (s.startDate && new Date(s.startDate) > now) return false;
    if (s.endDate && new Date(s.endDate) < now) return false;
    return true;
  });

  const getBannerSale = (slotKey) => {
    const patterns = {
      hero: { img: "banner.jpg", terms: ["hero", "organic food", "fresh"] },
      topRight: { img: "topRight", terms: ["summer sale", "top right", "fruit & vegetable"] },
      bottomRight: { img: "bottomRight", terms: ["special products", "deal of the month", "best deal"] },
      monthSale: { img: "SaleOfTheMonth", terms: ["sale of the month", "month sale"] },
      lowFat: { img: "Low-FatMeat", terms: ["low-fat", "low fat", "meat"] },
      freshFruit: { img: "100%FreshFruit", terms: ["fresh fruit", "100%"] },
      wideSummer: { img: "summersale", terms: ["wide summer", "37%", "summer promo"] },
    };

    const target = patterns[slotKey];
    if (!target) return null;

    // 1. Priority: Live active sale with matching banner image
    let match = activeSales.find(
      (s) =>
        s.bannerImage &&
        s.bannerImage.toLowerCase().includes(target.img.toLowerCase())
    );
    if (match) return match;

    // 2. Priority: Live active sale with matching title keyword
    match = activeSales.find((s) => {
      const name = (s.saleName || "").toLowerCase();
      return target.terms.some((t) => name.includes(t.toLowerCase()));
    });
    if (match) return match;

    // 3. Fallback: Any sale configured with that banner image even if date is broad
    match = sales.find(
      (s) =>
        s.isLive !== false &&
        s.bannerImage &&
        s.bannerImage.toLowerCase().includes(target.img.toLowerCase())
    );
    if (match) return match;

    return null;
  };

  /**
   * Helper to calculate whether an active sale provides an extra discount for a product
   */
  const getProductSaleDiscount = (product) => {
    if (!product || activeSales.length === 0) return 0;
    let maxDiscount = 0;
    const prodId = String(product._id || product.id || "");
    const prodCat = (product.category || "").toLowerCase().trim();

    for (const sale of activeSales) {
      let applies = false;
      if (sale.applyOn === "all") {
        applies = true;
      } else if (sale.applyOn === "category" && Array.isArray(sale.targetCategories)) {
        applies = sale.targetCategories.some(
          (c) => (c || "").toLowerCase().trim() === prodCat
        );
      } else if (sale.applyOn === "products" && Array.isArray(sale.targetProducts)) {
        applies = sale.targetProducts.some((p) => {
          const id = String(typeof p === "object" ? p._id || p.id : p);
          return id === prodId;
        });
      }

      if (applies) {
        let disc = 0;
        if (sale.discountType === "percentage") {
          disc = Number(sale.discountValue) || 0;
        } else if (sale.discountType === "fixed" && Number(product.price) > 0) {
          disc = Math.round(
            ((Number(sale.discountValue) || 0) / Number(product.price)) * 100
          );
        }
        if (disc > maxDiscount) maxDiscount = disc;
      }
    }
    return maxDiscount;
  };

  return (
    <SalesContext.Provider
      value={{
        sales,
        activeSales,
        loading,
        refetchSales: fetchSales,
        getBannerSale,
        getProductSaleDiscount,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const ctx = useContext(SalesContext);
  if (!ctx) {
    return {
      sales: [],
      activeSales: [],
      loading: false,
      refetchSales: () => {},
      getBannerSale: () => null,
      getProductSaleDiscount: () => 0,
    };
  }
  return ctx;
}
