const staffRoutes=  require('../controller/Admin-Staff-Controller');
const express = require('express');
const { middleware, authorize } = require("../middleware/auth");
const router = express.Router();

router.post("/add-staff", middleware, authorize("staff", "manage"), staffRoutes.addStaff);
router.get("/get-staff", middleware, authorize("staff", "manage"), staffRoutes.getAllStaff);
router.get("/get-staff/:id", middleware, authorize("staff", "manage"), staffRoutes.getSingleStaff);
router.put("/update-staff/:id", middleware, authorize("staff", "manage"), staffRoutes.updateStaff);
router.delete("/delete-staff/:id", middleware, authorize("staff", "manage"), staffRoutes.deleteStaff);

module.exports = router;    
 