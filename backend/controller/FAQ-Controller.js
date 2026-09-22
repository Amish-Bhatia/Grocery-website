const FAQ = require("../Models/FAQ-Model");

const initialFaqs = [
  {
    question: "How do I place an order?",
    answer: "Browse our organic grocery catalog, add your desired items to your shopping cart, and proceed to checkout with secure payment options.",
    status: "Published",
    order: 1,
  },
  {
    question: "How can I track my delivery?",
    answer: "Once your order is confirmed, you can track its progress directly from your account order history, or via email notifications.",
    status: "Published",
    order: 2,
  },
  {
    question: "What are your delivery hours and charges?",
    answer: "We deliver 7 days a week from 8:00 AM to 9:00 PM. We offer free shipping on eligible orders, with express delivery options available at checkout.",
    status: "Published",
    order: 3,
  },
  {
    question: "What is your return or refund policy?",
    answer: "We offer a 100% freshness guarantee and 30-day money-back policy. If any product does not meet your expectations, contact us for an instant refund or replacement.",
    status: "Published",
    order: 4,
  },
  {
    question: "Are all products 100% organic and fresh?",
    answer: "Yes, all our fruits, vegetables, and groceries are certified organic and sourced directly from verified local sustainable farms daily.",
    status: "Published",
    order: 5,
  },
];

const seedFaqsIfEmpty = async () => {
  try {
    const count = await FAQ.countDocuments();
    if (count === 0) {
      await FAQ.insertMany(initialFaqs);
      console.log("Seeded default FAQs");
    }
  } catch (err) {
    console.error("Failed to seed FAQs:", err.message);
  }
};

const getAllFaqs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== "all") {
      filter.status = new RegExp(`^${req.query.status}$`, "i");
    }

    let faqs = await FAQ.find(filter).sort({ order: 1, createdAt: -1 });
    if ((!faqs || faqs.length === 0) && Object.keys(filter).length === 0) {
      await seedFaqsIfEmpty();
      faqs = await FAQ.find({}).sort({ order: 1, createdAt: -1 });
    }

    return res.status(200).json({ faqs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addFaq = async (req, res) => {
  try {
    const { question, answer, status, order } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const newFaq = new FAQ({
      question: question.trim(),
      answer: answer.trim(),
      status: status === "Published" ? "Published" : "Draft",
      order: order !== undefined && !isNaN(order) ? Number(order) : 1,
    });

    await newFaq.save();
    return res.status(201).json({ message: "FAQ created successfully", faq: newFaq });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateFaq = async (req, res) => {
  try {
    const { question, answer, status, order } = req.body;
    const updateData = {};
    if (question !== undefined) updateData.question = question.trim();
    if (answer !== undefined) updateData.answer = answer.trim();
    if (status !== undefined) updateData.status = status;
    if (order !== undefined && !isNaN(order)) updateData.order = Number(order);

    const updated = await FAQ.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    return res.status(200).json({ message: "FAQ updated successfully", faq: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const deleted = await FAQ.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    return res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFaqById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    return res.status(200).json({ faq });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  seedFaqsIfEmpty,
  getAllFaqs,
  getFaqById,
  addFaq,
  updateFaq,
  deleteFaq,
};
