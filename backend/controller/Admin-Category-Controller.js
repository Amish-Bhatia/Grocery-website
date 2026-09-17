const Category = require("../Models/Admin-Category-Model");
const fs = require("fs");
const path = require("path");

// Helper to build full image URL for category images
const buildCategoryImageUrl = (filename) => {
  if (!filename) return "";
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  return `http://localhost:3000/uploads/categories/${filename}`;
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const newCategory = new Category({
      name,
      image: req.file ? req.file.filename : null,
    });

    await newCategory.save();

    const obj = newCategory.toObject();
    obj.image = buildCategoryImageUrl(obj.image);

    return res.status(201).json({
      message: "Category added successfully",
      category: obj,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    // Build full image URLs before sending
    const categoriesWithUrls = categories.map((cat) => {
      const obj = cat.toObject();
      obj.image = buildCategoryImageUrl(obj.image);
      return obj;
    });

    return res.status(200).json({ categories: categoriesWithUrls });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getSingleCategory = async (req, res) => {
  try {
    // Fixed bug: was `const category = await category.findById(...)` which shadowed the model import
    const found = await Category.findById(req.params.id);
    if (!found) {
      return res.status(404).json({ message: "Category not found" });
    }
    const obj = found.toObject();
    obj.image = buildCategoryImageUrl(obj.image);
    return res.status(200).json({ category: obj });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });

    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({
        message: "Category name already exists",
      });
    }

    const updateData = { name };

    // Only update image if a new image was uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const obj = updatedCategory.toObject();
    obj.image = buildCategoryImageUrl(obj.image);

    return res.status(200).json({
      message: "Category updated successfully",
      category: obj,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete category image from uploads folder
    if (deletedCategory.image) {
      const imagePath = path.join(__dirname, "../uploads/categories", deletedCategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = { addCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory };