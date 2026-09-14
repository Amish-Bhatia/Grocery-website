const { middleware } = require("../middleware/auth");
const express = require("express");

const router = express.Router();

router.get("/dashboard", middleware, (req, res) => {
    res.status(200).json({
        message: "Welcome to dashboard"
    });
});

module.exports = router;