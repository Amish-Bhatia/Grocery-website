const Product = require("../Models/Product-Model");
const Category = require("../Models/Admin-Category-Model");
const Order = require("../Models/Order-Model");
const Users = require("../Models/userModel");


const getDashboardStats = async (req, res) => {
  try {
    // 1. Count total products
    const totalProducts = await Product.countDocuments();

    // 2. Count total orders placed
    const totalOrders = await Order.countDocuments();

    // 3. Count customers (users who are not admin or staff)
    const totalCustomers = await Users.countDocuments({
      role: { $nin: ["admin", "staff"] },
    });

    // 4. Count staff & admin accounts
    const totalStaff = await Users.countDocuments({
      role: { $in: ["admin", "staff"] },
    });

    // 5. Count total categories
    const totalCategories = await Category.countDocuments();

    // 6. Calculate total revenue from all orders
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }, 
        },  
      },
    ]); 
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // 7. Fetch the 5 most recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("userName userEmail total paymentMethod status createdAt items");

    // Send the data back to the admin frontend
    return res.status(200).json({
      success: true,
      stats: {  totalProducts, totalOrders, totalCustomers, totalStaff, totalCategories, totalRevenue,},
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = { getDashboardStats, };