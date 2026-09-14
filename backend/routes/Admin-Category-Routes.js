const categoryRoutes = require("../controller/Admin-Category-Controller");
const express = require("express");
const { middleware, authorize } = require("../middleware/auth");
const router = express.Router();

const upload = require("../middleware/categoryUpload");

router.use(middleware);

router.post( "/add-category", authorize("categories", "create"), upload.single("image"),  categoryRoutes.addCategory);

router.get( "/get-category", authorize("categories", "read"), categoryRoutes.getAllCategory);

router.get( "/get-category/:id", authorize("categories", "read"), categoryRoutes.getSingleCategory);

router.put( "/update-category/:id", authorize("categories", "edit"), upload.single("image"), categoryRoutes.updateCategory);

router.delete( "/delete-category/:id", authorize("categories", "delete"), categoryRoutes.deleteCategory);

module.exports = router;
