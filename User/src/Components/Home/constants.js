// Local fallback mapping for category images
export const localCategoryMap = {
  "fresh fruits": "/categories/1788851171610-266493087.png",
  "fresh vegetables": "/categories/1788941762355-972498302.png",
  "meat & fish": "/categories/1788941780756-586862599.png",
  "snacks": "/categories/snacks.png",
  "beverages": "/categories/1789543346593-215389198.png",
  "beauty & health": "/categories/Beauty&Health.png",
  "bread & bakery": "/categories/Bread&Bakery.png",
  "baking needs": "/categories/BakingNeeds.png",
  "cooking": "/categories/Cooking.png",
  "diabetic food": "/categories/DiabeticFood.png",
  "dish detergents": "/categories/DishDetergents.png",
  "oil": "/categories/Oil.png",
};

// Local fallback mapping for product images
export const localProductMap = {
  "green apple": "/greenApple.png",
  "fresh indian malta": "/orange.png",
  "chinese cabbage": "/ChineseCabbage.png",
  "green lettuce": "/GreenLettuce.png",
  "eggplant": "/EggPlant.png",
  "big potatoes": "/potato.png",
  "corn": "/corn.png",
  "fresh cauliflower": "/FreshCauliflower.png",
  "green capsicum": "/GreenCapsicum.png",
  "green chili": "/GreenChilli.png",
  "red chili": "/RedChilli.png",
  "red tomato": "/Red Tomato.png",
  "surjapur mango": "/Surjapur Mango.png",
};

// Exact Figma visual order for popular categories
export const categoryOrder = [
  "Fresh Fruit",
  "Fresh Vegetables",
  "Meat & Fish",
  "Snacks",
  "Beverages",
  "Beauty & Health",
  "Bread & Bakery",
  "Baking Needs",
  "Cooking",
  "Diabetic Food",
  "Dish Detergents",
  "Oil",
];

// Fallback Figma data to ensure all 12 categories render seamlessly
export const figmaCategories = [
  { name: "Fresh Fruit", image: "/categories/1788851171610-266493087.png" },
  { name: "Fresh Vegetables", image: "/categories/1788941762355-972498302.png" },
  { name: "Meat & Fish", image: "/categories/1788941780756-586862599.png" },
  { name: "Snacks", image: "/categories/snacks.png" },
  { name: "Beverages", image: "/categories/1789543346593-215389198.png" },
  { name: "Beauty & Health", image: "/categories/Beauty&Health.png" },
  { name: "Bread & Bakery", image: "/categories/Bread&Bakery.png" },
  { name: "Baking Needs", image: "/categories/BakingNeeds.png" },
  { name: "Cooking", image: "/categories/Cooking.png" },
  { name: "Diabetic Food", image: "/categories/DiabeticFood.png" },
  { name: "Dish Detergents", image: "/categories/DishDetergents.png" },
  { name: "Oil", image: "/categories/Oil.png" },
];

// Product visual sequence matching Figma screenshots
export const figmaProductOrder = [
  "Green Apple",
  "Fresh Indian Malta",
  "Chinese cabbage",
  "Green lettuce",
  "Eggplant",
  "Big Potatoes",
  "Corn",
  "Fresh Cauliflower",
  "Green Capsicum",
  "Green Chili",
  "Red Chili",
  "Red Tomato",
  "Surjapur Mango",
];

export const figmaDefaultProducts = [
  { _id: "f1", name: "Green Apple", price: 14.99, originalPrice: 20.99, discount: 50, rating: 4, image: "/greenApple.png" },
  { _id: "f2", name: "Fresh Indian Malta", price: 20.00, originalPrice: null, discount: 0, rating: 5, image: "/orange.png" },
  { _id: "f3", name: "Chinese cabbage", price: 12.00, originalPrice: 24.00, discount: 50, rating: 5, image: "/ChineseCabbage.png" },
  { _id: "f4", name: "Green lettuce", price: 9.00, originalPrice: null, discount: 0, rating: 4, image: "/GreenLettuce.png" },
  { _id: "f5", name: "Eggplant", price: 34.00, originalPrice: null, discount: 0, rating: 5, image: "/EggPlant.png" },
  { _id: "f6", name: "Big Potatoes", price: 20.00, originalPrice: null, discount: 0, rating: 4, image: "/potato.png" },
  { _id: "f7", name: "Corn", price: 20.00, originalPrice: null, discount: 0, rating: 5, image: "/corn.png" },
  { _id: "f8", name: "Fresh Cauliflower", price: 12.00, originalPrice: null, discount: 0, rating: 4, image: "/FreshCauliflower.png" },
  { _id: "f9", name: "Green Capsicum", price: 9.00, originalPrice: 20.99, discount: 50, rating: 4, image: "/GreenCapsicum.png" },
  { _id: "f10", name: "Green Chili", price: 34.00, originalPrice: null, discount: 0, rating: 4, image: "/GreenChilli.png" },
  { _id: "f11", name: "Red Chili", price: 12.00, originalPrice: null, discount: 0, rating: 5, image: "/RedChilli.png" },
  { _id: "f12", name: "Red Tomato", price: 9.00, originalPrice: 20.99, discount: 50, rating: 4, image: "/Red Tomato.png" },
  { _id: "f13", name: "Surjapur Mango", price: 34.00, originalPrice: null, discount: 0, rating: 5, image: "/Surjapur Mango.png" },
];

export const defaultClientTestimonials = [
  {
    _id: "t1",
    name: "Robert Fox",
    role: "Customer",
    feedback:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
    rating: 5,
    image: "/Robert.png",
    order: 1,
  },
  {
    _id: "t2",
    name: "Dianne Russell",
    role: "Customer",
    feedback:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
    rating: 5,
    image: "/Dennie.png",
    order: 2,
  },
  {
    _id: "t3",
    name: "Eleanor Pena",
    role: "Customer",
    feedback:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
    rating: 5,
    image: "/eleanor.png",
    order: 3,
  },
];

// Static countdown timers matching Figma designs
export const dealTime = {
  days: 1,
  hours: 23,
  minutes: 34,
  seconds: 57,
};

export const monthSaleTime = {
  days: 0,
  hours: 2,
  minutes: 18,
  seconds: 46,
};

// Helper to get image URL for category with local fallback
export const getCategoryImageUrl = (category) => {
  if (category.image && category.image.trim()) {
    return category.image;
  }
  const clean = category.name?.toLowerCase().replace(/s$/, "").trim();
  return localCategoryMap[clean] || "";
};

// Helper to get image URL for product with local fallback
export const getProductImageUrl = (product) => {
  if (product.image && product.image.trim()) {
    return product.image;
  }
  const clean = product.name?.toLowerCase().trim();
  return localProductMap[clean] || "";
};

// Universal pricing helper that ensures selling price, strikethrough price, and discount % are always accurate
export const getProductPricing = (product) => {
  if (!product) {
    return { price: 0, originalPrice: null, discount: 0, onSale: false, salePercent: 0 };
  }

  const rawPrice = Number(product.price) || 0;
  const rawOriginalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const discount = Number(product.discount) || 0;

  // Case 1: Product has an explicit discount % from admin (1 - 99%)
  if (discount > 0 && discount < 100) {
    const basePrice = (rawOriginalPrice && rawOriginalPrice > rawPrice)
      ? rawOriginalPrice
      : rawPrice;

    const sellingPrice = Number((basePrice * (1 - discount / 100)).toFixed(2));

    return {
      price: sellingPrice,
      originalPrice: basePrice,
      discount,
      onSale: true,
      salePercent: discount,
    };
  }

  // Case 2: No explicit discount %, but originalPrice > price
  if (rawOriginalPrice && rawOriginalPrice > rawPrice) {
    const calculatedDiscount = Math.round(((rawOriginalPrice - rawPrice) / rawOriginalPrice) * 100);
    return {
      price: rawPrice,
      originalPrice: rawOriginalPrice,
      discount: calculatedDiscount,
      onSale: true,
      salePercent: calculatedDiscount,
    };
  }

  // Case 3: No discount
  return {
    price: rawPrice,
    originalPrice: null,
    discount: 0,
    onSale: false,
    salePercent: 0,
  };
};
