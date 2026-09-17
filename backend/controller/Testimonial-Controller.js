const Testimonial = require("../Models/Testimonial-Model");

const defaultTestimonials = [
  {
    name: "Robert Fox",
    role: "Customer",
    feedback:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
    rating: 5,
    image: "/Robert.png",
    order: 1,
  },
  {
    name: "Dianne Russell",
    role: "Customer",
    feedback:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
    rating: 5,
    image: "/Dennie.png",
    order: 2,
  },
  {
    name: "Eleanor Pena",
    role: "Customer",
    feedback:
      "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
    rating: 5,
    image: "/eleanor.png",
    order: 3,
  },
];

const seedTestimonialsIfEmpty = async () => {
  try {
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      await Testimonial.insertMany(defaultTestimonials);
      console.log("Seeded 3 default client testimonials");
    }
  } catch (err) {
    console.error("Failed to seed testimonials:", err.message);
  }
};

const getAllTestimonials = async (req, res) => {
  try {
    let testimonials = await Testimonial.find({}).sort({ order: 1 });
    if (!testimonials || testimonials.length === 0) {
      await seedTestimonialsIfEmpty();
      testimonials = await Testimonial.find({}).sort({ order: 1 });
    }
    return res.status(200).json({ testimonials });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addTestimonial = async (req, res) => {
  try {
    const { name, role, feedback, rating, image, order } = req.body;
    const newTestimonial = new Testimonial({
      name,
      role: role || "Customer",
      feedback,
      rating: Number(rating) || 5,
      image: image || "",
      order: Number(order) || 1,
    });
    await newTestimonial.save();
    return res.status(201).json({ message: "Testimonial created", testimonial: newTestimonial });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    return res.status(200).json({ message: "Testimonial updated", testimonial: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    return res.status(200).json({ message: "Testimonial deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  seedTestimonialsIfEmpty,
  getAllTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
