const categoryRoutes = require("../controller/Admin-Category-Controller");
const express = require("express");
const { middleware, authorize } = require("../middleware/auth");
const router = express.Router();

const upload = require("../middleware/categoryUpload");

// Public category read endpoints (for storefront & admin)
router.get("/get-category", categoryRoutes.getAllCategory);
router.get("/get-category/:id", categoryRoutes.getSingleCategory);

// Protected admin/staff category management endpoints
router.post("/add-category", middleware, authorize("categories", "create"), upload.single("image"), categoryRoutes.addCategory);
router.put("/update-category/:id", middleware, authorize("categories", "edit"), upload.single("image"), categoryRoutes.updateCategory);
router.delete("/delete-category/:id", middleware, authorize("categories", "delete"), categoryRoutes.deleteCategory);

module.exports = router;
