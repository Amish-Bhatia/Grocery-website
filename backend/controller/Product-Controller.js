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

const addProduct = async (req, res) => {
  try {
    const { name, category, price, originalPrice, discount, stock, rating, description, features, tags, unit, weight } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: "Name, category, and price are required" });
    }

    // If an image was uploaded via multer, use the filename
    const imageFilename = req.file ? req.file.filename : (req.body.image || "");

    const newProduct = new Product({
      name,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      discount: Number(discount) || 0,
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

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = Number(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (discount !== undefined) updateData.discount = Number(discount);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (rating !== undefined) updateData.rating = Number(rating);
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = Array.isArray(features) ? features : [features];
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [tags];
    if (unit !== undefined) updateData.unit = unit;
    if (weight !== undefined) updateData.weight = weight;

    // Only update image if a new file was uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

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
