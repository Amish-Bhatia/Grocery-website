const staffRoutes=  require('../controller/Admin-Staff-Controller');
const express = require('express');
const router = express.Router();

router.post("/add-staff", staffRoutes.addStaff);
router.get("/get-staff", staffRoutes.getAllStaff);
router.get("/get-staff/:id", staffRoutes.getSingleStaff);
router.put("/update-staff/:id", staffRoutes.updateStaff);
router.delete("/delete-staff/:id", staffRoutes.deleteStaff);

module.exports = router;    
 