const express = require("express");
const { middleware, authorize } = require("../middleware/auth");
const productController = require("../controller/Product-Controller");
const upload = require("../middleware/productUpload");

const router = express.Router();

// Public product read endpoints (for storefront & admin)
router.get("/get-products", productController.getAllProducts);
router.get("/get-products/:id", productController.getSingleProduct);

// Protected admin/staff product management endpoints
router.post(
  "/add-product",
  middleware,
  authorize("products", "edit"),
  upload.single("image"),
  productController.addProduct
);
router.put(
  "/update-product/:id",
  middleware,
  authorize("products", "edit"),
  upload.single("image"),
  productController.updateProduct
);
router.delete(
  "/delete-product/:id",
  middleware,
  authorize("products", "delete"),
  productController.deleteProduct
);

module.exports = router;