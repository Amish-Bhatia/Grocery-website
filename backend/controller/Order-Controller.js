const Order = require("../Models/Order-Model");
const Product = require("../Models/Product-Model");

// Place a new order — supports COD, Credit/Debit Card, PayPal, and stock deductions
const placeOrder = async (req, res) => {
  try {
    const {
      items,
      products,
      subtotal,
      discount = 0,
      couponCode = "",
      shipping,
      total,
      totalAmount,
      paymentMethod = "COD",
      paymentStatus,
      paymentDetails,
      customerName,
      customerEmail,
      shippingAddress,
    } = req.body;

    const rawItems = items || products || [];

    // Validate items
    if (!rawItems || rawItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Add products before placing an order." });
    }

    const calculatedTotal = Number(total ?? totalAmount ?? subtotal ?? 0);
    const calculatedShipping = Number(shipping ?? 0);
    const calculatedDiscount = Number(discount ?? 0);
    const calculatedSubtotal = Number(subtotal ?? (calculatedTotal + calculatedDiscount - calculatedShipping)) || calculatedTotal;

    const resolvedCustomerName =
      customerName ||
      shippingAddress?.customerName ||
      (req.user && req.user.name) ||
      "Ecobazar Customer";

    const resolvedCustomerEmail =
      customerEmail ||
      shippingAddress?.email ||
      (req.user && req.user.email) ||
      "customer@ecobazar.com";

    const userId = req.user ? req.user._id : null;
    const userName = resolvedCustomerName;
    const userEmail = resolvedCustomerEmail;

    // Validate stock for all items before placing order
    for (const item of rawItems) {
      const prodId = item.id || item._id || item.productId;
      if (prodId) {
        try {
          const dbProd = await Product.findById(prodId);
          if (dbProd && dbProd.stock !== undefined && dbProd.stock !== null) {
            if (dbProd.stock < Number(item.quantity)) {
              return res.status(400).json({
                message: `Sorry, "${dbProd.name}" only has ${dbProd.stock} pieces left in stock.`,
              });
            }
          }
        } catch (e) {
          // If not a valid ObjectId (e.g. sample items), continue
        }
      }
    }

    const orderPaymentStatus = paymentStatus || (paymentMethod === "COD" ? "pending" : "pending");
    const orderStatus = orderPaymentStatus === "paid" ? "processing" : "pending";

    // Create the order
    const newOrder = new Order({
      userId,
      userName,
      userEmail,
      paymentMethod,
      paymentStatus: orderPaymentStatus,
      paymentDetails: paymentDetails || {},
      shippingAddress: shippingAddress || {},
      items: rawItems.map((item) => ({
        productId: String(item.id || item._id || item.productId || "item"),
        name: item.name || item.title || "Product",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || "",
        category: item.category || "",
      })),
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      couponCode: couponCode || "",
      shipping: calculatedShipping,
      total: calculatedTotal,
      status: orderStatus,
    });

    await newOrder.save();

    // Deduct stock for ordered products
    for (const item of rawItems) {
      const prodId = item.id || item._id || item.productId;
      if (prodId) {
        try {
          await Product.findByIdAndUpdate(prodId, {
            $inc: { stock: -Number(item.quantity) },
          });
        } catch (e) {
          // Ignore non-database items
        }
      }
    }

    // Increment coupon usage if applied
    if (couponCode && String(couponCode).trim()) {
      try {
        const Coupon = require("../Models/couponModel");
        const formattedCode = String(couponCode).trim().toUpperCase();
        await Coupon.findOneAndUpdate(
          { code: { $regex: new RegExp(`^${formattedCode}$`, 'i') } },
          {
            $inc: { usageCount: 1 },
            ...(userId ? { $addToSet: { usedBy: userId } } : {})
          }
        );
      } catch (couponErr) {
        console.error("Failed to update coupon usage stats:", couponErr);
      }
    }

    return res.status(201).json({
      message: `Order placed successfully using ${paymentMethod}! Thank you for shopping at Ecobazar.`,
      orderId: newOrder._id,
      order: newOrder,
    });
  } catch (error) {
    console.log("Order error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get orders for the logged-in user
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all orders (for admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update order status (simplest logic)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status: status.toLowerCase().trim() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
