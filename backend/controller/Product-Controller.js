const Product = require("../Models/Product-Model");

// Helper to build the full image URL from just a filename
const buildImageUrl = (filename) => {
  if (!filename) return "";
  // If already a full URL, return as-is
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  return `http://localhost:3000/uploads/products/${filename}`;
};

const getAllProducts = async (req, res) => {
  try {
    const { category, search, popular } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (popular === "true") {
      filter.isPopular = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Build full image URLs before sending
    const productsWithUrls = products.map((p) => {
      const obj = p.toObject();
      obj.image = buildImageUrl(obj.image);
      return obj;
    });

    return res.status(200).json({ products: productsWithUrls });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const obj = product.toObject();
    obj.image = buildImageUrl(obj.image);
    return res.status(200).json({ product: obj });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Helper to calculate correct selling price and original price based on discount
const calculatePricing = (inputPrice, inputDiscount, inputOriginalPrice) => {
  const numPrice = Number(inputPrice) || 0;
  const numDiscount = Number(inputDiscount) || 0;

  if (numDiscount > 0 && numDiscount < 100) {
    // If an originalPrice already exists and is greater than price, that's the base price.
    // Otherwise, the price submitted by the admin is the base price.
    const basePrice = (inputOriginalPrice && Number(inputOriginalPrice) > numPrice)
      ? Number(inputOriginalPrice)
      : numPrice;

    const finalSellingPrice = Number((basePrice * (1 - numDiscount / 100)).toFixed(2));
    return {
      price: finalSellingPrice,
      originalPrice: basePrice,
      discount: numDiscount,
    };
  } else {
    // No discount
    const basePrice = (inputOriginalPrice && Number(inputOriginalPrice) > numPrice)
      ? Number(inputOriginalPrice)
      : numPrice;
    return {
      price: basePrice,
      originalPrice: null,
      discount: 0,
    };
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, category, price, originalPrice, discount, stock, rating, description, features, tags, unit, weight } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: "Name, category, and price are required" });
    }

    // If an image was uploaded via multer, use the filename
    const imageFilename = req.file ? req.file.filename : (req.body.image || "");

    const pricing = calculatePricing(price, discount, originalPrice);

    const newProduct = new Product({
      name,
      category,
      price: pricing.price,
      originalPrice: pricing.originalPrice,
      discount: pricing.discount,
      stock: Number(stock) || 0,
      image: imageFilename,
      rating: Number(rating) || 5,
      description: description || "",
      features: Array.isArray(features) ? features : (features ? [features] : []),
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      unit: unit || "kg",
      weight: weight || "1 kg",
    });

    await newProduct.save();

    const obj = newProduct.toObject();
    obj.image = buildImageUrl(obj.image);

    return res.status(201).json({
      message: "Product added successfully",
      product: obj,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, originalPrice, discount, stock, rating, description, features, tags, unit, weight } = req.body;

    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (rating !== undefined) updateData.rating = Number(rating);
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = Array.isArray(features) ? features : [features];
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [tags];
    if (unit !== undefined) updateData.unit = unit;
    if (weight !== undefined) updateData.weight = weight;

    // Recalculate price and discount if price or discount is provided
    if (price !== undefined || discount !== undefined || originalPrice !== undefined) {
      const p = price !== undefined ? price : (currentProduct.originalPrice || currentProduct.price);
      const d = discount !== undefined ? discount : currentProduct.discount;
      const op = originalPrice !== undefined ? originalPrice : currentProduct.originalPrice;
      const pricing = calculatePricing(p, d, op);

      updateData.price = pricing.price;
      updateData.originalPrice = pricing.originalPrice;
      updateData.discount = pricing.discount;
    }

    // Only update image if a new file was uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    const obj = updatedProduct.toObject();
    obj.image = buildImageUrl(obj.image);

    return res.status(200).json({
      message: "Product updated successfully",
      product: obj,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
