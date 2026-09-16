const Product = require("../Models/Product-Model");

const getAllProducts = async (req, res) => {
  try {
    const { category, search, popular } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (popular === "true") {
      filter.isPopular = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ products });
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
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, category, price, discount, stock, image, rating, description } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: "Name, category, and price are required" });
    }

    const newProduct = new Product({
      name,
      category,
      price: Number(price),
      discount: Number(discount) || 0,
      stock: Number(stock) || 0,
      image: image || "",
      rating: Number(rating) || 5,
      description: description || "",
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, discount, stock, image, rating, description } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = Number(price);
    if (discount !== undefined) updateData.discount = Number(discount);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (image !== undefined) updateData.image = image;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (description !== undefined) updateData.description = description;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
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
