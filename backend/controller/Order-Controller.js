const Order = require("../Models/Order-Model");
const Product = require("../Models/Product-Model");

// Place a new order — supports COD, Credit/Debit Card, PayPal, and stock deductions
const placeOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      shipping,
      total,
      paymentMethod = "COD",
      customerName,
      customerEmail,
      shippingAddress,
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Add products before placing an order." });
    }

    const userId = req.user ? req.user._id : null;
    const userName = (req.user && req.user.name) || customerName || "Ecobazar Customer";
    const userEmail = (req.user && req.user.email) || customerEmail || "customer@ecobazar.com";

    // Validate stock for all items before placing order
    for (const item of items) {
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

    // Create the order
    const newOrder = new Order({
      userId,
      userName,
      userEmail,
      paymentMethod,
      shippingAddress: shippingAddress || {},
      items: items.map((item) => ({
        productId: String(item.id || item._id || item.productId || "item"),
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || "",
        category: item.category || "",
      })),
      subtotal: Number(subtotal) || 0,
      shipping: Number(shipping) || 0,
      total: Number(total) || 0,
      status: "pending",
    });

    await newOrder.save();

    // Deduct stock for ordered products
    for (const item of items) {
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

module.exports = { placeOrder, getMyOrders, getAllOrders };
