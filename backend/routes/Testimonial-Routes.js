const express = require("express");
const router = express.Router();
const {
  getAllTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controller/Testimonial-Controller");

router.get("/get-testimonials", getAllTestimonials);
router.post("/add-testimonial", addTestimonial);
router.put("/update-testimonial/:id", updateTestimonial);
router.delete("/delete-testimonial/:id", deleteTestimonial);

module.exports = router;
