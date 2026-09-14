const category = require("../Models/Admin-Category-Model");
const fs = require("fs");
const path = require("path");

const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const existingCategory = await category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        const newCategory = new category({
            name,
            image: req.file ? req.file.filename : null
        });

        await newCategory.save();

        return res.status(201).json({
            message: "Category added successfully",
            category: newCategory
        });

    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};


const getAllCategory = async (req,res)=>{
    try{
        const categories = await category.find();
        return res.status(200).json({categories});
    }
    catch(e){
        return res.status(500).json({message:e.message});
    }
};

const getSingleCategory = async (req,res)=>{
    try{
        const category = await category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message:"Category not found"});
        }
        return res.status(200).json({category});
    }
    catch(e){
        return res.status(500).json({message:e.message});
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const existingCategory = await category.findOne({ name });

        if (
            existingCategory &&
            existingCategory._id.toString() !== id
        ) {
            return res.status(400).json({
                message: "Category name already exists"
            });
        }

        const updateData = {
            name
        };

        // only update image if a new image was uploaded
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedCategory = await category.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true
            }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            message: "Category updated successfully",
            category: updatedCategory
        });

    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};
 

const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await category.findByIdAndDelete(
            req.params.id
        );

        if (!deletedCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // Delete category image from uploads folder
        if (deletedCategory.image) {
            const imagePath = path.join(
                __dirname,
                "../uploads/categories",
                deletedCategory.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        return res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};


module.exports = { addCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory }; 