const staffRoutes=  require('../controller/Admin-Staff-Controller');
const express = require('express');
const { middleware, authorize } = require("../middleware/auth");
const router = express.Router();

router.use(middleware);
router.use(authorize("staff", "manage"));

router.post("/add-staff", staffRoutes.addStaff);
router.get("/get-staff", staffRoutes.getAllStaff);
router.get("/get-staff/:id", staffRoutes.getSingleStaff);
router.put("/update-staff/:id", staffRoutes.updateStaff);
router.delete("/delete-staff/:id", staffRoutes.deleteStaff);

module.exports = router;    
 