const express = require("express");
const router = express.Router();
const {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  toggleSaleLive,
  deleteSale,
} = require("../controller/Sale-Controller");

router.get("/getSales", getAllSales);
router.get("/sales", getAllSales);
router.get("/getSale/:id", getSaleById);
router.get("/sales/:id", getSaleById);
router.post("/addSale", createSale);
router.post("/sales", createSale);
router.put("/updateSale/:id", updateSale);
router.put("/sales/:id", updateSale);
router.put("/toggleSaleLive/:id", toggleSaleLive);
router.patch("/toggleSaleLive/:id", toggleSaleLive);
router.patch("/sales/:id/live", toggleSaleLive);
router.delete("/deleteSale/:id", deleteSale);
router.delete("/sales/:id", deleteSale);

module.exports = router;
