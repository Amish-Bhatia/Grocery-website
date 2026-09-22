const express = require("express");
const router = express.Router();
const {
  getAllFaqs,
  getFaqById,
  addFaq,
  updateFaq,
  deleteFaq,
} = require("../controller/FAQ-Controller");

router.get("/get-faqs", getAllFaqs);
router.get("/get-faq/:id", getFaqById);
router.post("/add-faq", addFaq);
router.put("/update-faq/:id", updateFaq);
router.delete("/delete-faq/:id", deleteFaq);

module.exports = router;
