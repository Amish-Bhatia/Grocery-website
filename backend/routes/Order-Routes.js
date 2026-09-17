const express = require("express");
const { middleware, optionalMiddleware } = require("../middleware/auth");
const { placeOrder, getMyOrders } = require("../controller/Order-Controller");

const router = express.Router();

router.post("/place-order", optionalMiddleware, placeOrder);
router.get("/my-orders", middleware, getMyOrders);

module.exports = router;
