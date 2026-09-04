const categoryRoutes = require("../controller/Admin-Category-Controller");
const express = require("express");
const { middleware } = require("../middleware/auth");
const router = express.Router();

const upload = require("../middleware/categoryUpload");

router.use(middleware);

router.post( "/add-category", upload.single("image"),  categoryRoutes.addCategory);

router.get( "/get-category",  categoryRoutes.getAllCategory);

router.get( "/get-category/:id",  categoryRoutes.getSingleCategory);

router.put( "/update-category/:id", upload.single("image"), categoryRoutes.updateCategory);

router.delete( "/delete-category/:id",categoryRoutes.deleteCategory);

module.exports = router;
