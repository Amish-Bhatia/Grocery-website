const express = require("express");
const { middleware, authorize } = require("../middleware/auth");
const contentController = require("../controller/Content-Controller");

const router = express.Router();

router.get("/content", middleware, contentController.getContent);
router.put("/content", middleware, authorize("content", "edit"), contentController.updateContent);

module.exports = router;