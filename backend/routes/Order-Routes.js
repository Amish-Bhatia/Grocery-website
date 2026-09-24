const express = require("express");
const { middleware, optionalMiddleware } = require("../middleware/auth");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/Order-Controller");

const router = express.Router();

router.post("/place-order", optionalMiddleware, placeOrder);
router.get("/my-orders", middleware, getMyOrders);
router.get("/all-orders", getAllOrders);
router.put("/update-order-status/:id", updateOrderStatus);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
