const Sale = require("../Models/Sale-Model");

// Get all sales
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: sales.length, sales });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single sale by ID
const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ success: false, message: "Sale campaign not found" });
    }
    return res.status(200).json({ success: true, sale });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create new sale
const createSale = async (req, res) => {
  try {
    const {
      saleName,
      description,
      discountType,
      discountValue,
      applyOn,
      targetCategories,
      targetProducts,
      startDate,
      endDate,
      bannerImage,
      initialStatus,
      isLive,
    } = req.body;

    if (!saleName || !saleName.trim()) {
      return res.status(400).json({ success: false, message: "Sale Name is required" });
    }

    if (discountValue === undefined || discountValue === null || Number(discountValue) < 0) {
      return res.status(400).json({ success: false, message: "Valid Discount Value is required" });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Start Date and End Date are required" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ success: false, message: "End Date must be after Start Date" });
    }

    const newSale = new Sale({
      saleName: saleName.trim(),
      description: description ? description.trim() : "",
      discountType: discountType || "percentage",
      discountValue: Number(discountValue),
      applyOn: applyOn || "all",
      targetCategories: Array.isArray(targetCategories) ? targetCategories : [],
      targetProducts: Array.isArray(targetProducts) ? targetProducts : [],
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      bannerImage: bannerImage || "",
      initialStatus: initialStatus || "active",
      isLive: isLive !== undefined ? Boolean(isLive) : true,
    });

    const savedSale = await newSale.save();
    return res.status(201).json({
      success: true,
      message: "Sale campaign created successfully",
      sale: savedSale,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update sale
const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      saleName,
      description,
      discountType,
      discountValue,
      applyOn,
      targetCategories,
      targetProducts,
      startDate,
      endDate,
      bannerImage,
      initialStatus,
      isLive,
    } = req.body;

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ success: false, message: "End Date must be after Start Date" });
    }

    const updateFields = {};
    if (saleName !== undefined) updateFields.saleName = saleName.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (discountType !== undefined) updateFields.discountType = discountType;
    if (discountValue !== undefined) updateFields.discountValue = Number(discountValue);
    if (applyOn !== undefined) updateFields.applyOn = applyOn;
    if (targetCategories !== undefined) updateFields.targetCategories = targetCategories;
    if (targetProducts !== undefined) updateFields.targetProducts = targetProducts;
    if (startDate !== undefined) updateFields.startDate = new Date(startDate);
    if (endDate !== undefined) updateFields.endDate = new Date(endDate);
    if (bannerImage !== undefined) updateFields.bannerImage = bannerImage;
    if (initialStatus !== undefined) updateFields.initialStatus = initialStatus;
    if (isLive !== undefined) updateFields.isLive = Boolean(isLive);

    const updatedSale = await Sale.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedSale) {
      return res.status(404).json({ success: false, message: "Sale campaign not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Sale campaign updated successfully",
      sale: updatedSale,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Sale Live status
const toggleSaleLive = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ success: false, message: "Sale campaign not found" });
    }

    sale.isLive = !sale.isLive;
    await sale.save();

    return res.status(200).json({
      success: true,
      message: `Sale "${sale.saleName}" is now ${sale.isLive ? "Live" : "Disabled"}`,
      isLive: sale.isLive,
      sale,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete sale
const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSale = await Sale.findByIdAndDelete(id);
    if (!deletedSale) {
      return res.status(404).json({ success: false, message: "Sale campaign not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Sale campaign deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Seed sample sales with real storefront banner images if database collection is empty
const seedSalesIfEmpty = async () => {
  try {
    const count = await Sale.countDocuments();
    if (count === 0) {
      const now = new Date();
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      await Sale.insertMany([
        {
          saleName: "Fresh & Healthy Organic Food (Hero Sale)",
          description: "Sale up to 30% off on all organic food with free shipping.",
          discountType: "percentage",
          discountValue: 30,
          applyOn: "all",
          startDate: now,
          endDate: nextMonth,
          bannerImage: "/banner.jpg",
          initialStatus: "active",
          isLive: true,
        },
        {
          saleName: "Summer Sale 75% OFF",
          description: "Only Fruit & Vegetable promotional discount.",
          discountType: "percentage",
          discountValue: 75,
          applyOn: "category",
          targetCategories: ["Vegetables", "Fresh Fruits"],
          startDate: now,
          endDate: nextWeek,
          bannerImage: "/topRight.png",
          initialStatus: "active",
          isLive: true,
        },
        {
          saleName: "Special Products Deal of the Month",
          description: "Special deal of the month across top rated grocery items.",
          discountType: "fixed",
          discountValue: 100,
          applyOn: "all",
          startDate: now,
          endDate: nextMonth,
          bannerImage: "/bottomRight.jpg",
          initialStatus: "active",
          isLive: true,
        },
        {
          saleName: "Sale of the Month - Best Deals",
          description: "Live countdown timer sale on monthly essential pantry groceries.",
          discountType: "percentage",
          discountValue: 40,
          applyOn: "all",
          startDate: now,
          endDate: nextWeek,
          bannerImage: "/SaleOfTheMonth.png",
          initialStatus: "active",
          isLive: true,
        },
        {
          saleName: "Low-Fat Meat (85% Fat Free)",
          description: "Fresh protein cuts started at affordable prices.",
          discountType: "fixed",
          discountValue: 80,
          applyOn: "category",
          targetCategories: ["Meat & Fish"],
          startDate: now,
          endDate: nextMonth,
          bannerImage: "/Low-FatMeat.png",
          initialStatus: "active",
          isLive: true,
        },
        {
          saleName: "100% Fresh Fruit Summer Sale",
          description: "Up to 64% OFF on farm-fresh seasonal fruits.",
          discountType: "percentage",
          discountValue: 64,
          applyOn: "category",
          targetCategories: ["Fresh Fruits"],
          startDate: now,
          endDate: nextMonth,
          bannerImage: "/100%FreshFruit.png",
          initialStatus: "active",
          isLive: true,
        },
        {
          saleName: "Wide Summer Sale 37% OFF",
          description: "Free on all orders with 30 days money-back guarantee.",
          discountType: "percentage",
          discountValue: 37,
          applyOn: "all",
          startDate: now,
          endDate: nextMonth,
          bannerImage: "/summersale37%off.jpg",
          initialStatus: "active",
          isLive: true,
        },
      ]);
      console.log("Real storefront sale campaigns seeded successfully");
    }
  } catch (error) {
    console.error("Failed to seed sample sales:", error.message);
  }
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  toggleSaleLive,
  deleteSale,
  seedSalesIfEmpty,
};
