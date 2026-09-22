const express = require("express");    
const router = express.Router();         
const { getDashboardStats } = require("../controller/Dashboard-Controller");  

// Route for getting all dashboard statistics and recent orders  
router.get("/dashboard-stats", getDashboardStats);  
router.get("/admin/dashboard-stats", getDashboardStats);    

module.exports = router;