require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

const categoryRoutes = require("./routes/Admin-Category-Routes");
const staffRoutes = require("./routes/Admin-Staff-Route");
const contentRoutes = require("./routes/Content-Routes");
const productRoutes = require("./routes/Product-Routes");
const protectedRoutes = require("./routes/protectedRoute");
const router = require("./routes/userRoutes");
const orderRoutes = require("./routes/Order-Routes");
const testimonialRoutes = require("./routes/Testimonial-Routes");
const { seedTestimonialsIfEmpty } = require("./controller/Testimonial-Controller");
const faqRoutes = require("./routes/FAQ-Routes");
const { seedFaqsIfEmpty } = require("./controller/FAQ-Controller");
const dashboardRoutes = require("./routes/Dashboard-Routes");
const paymentRoutes = require("./routes/paymentRoutes");
const couponRoutes = require("./routes/couponRoute");

// Seed default testimonials if collection is empty
seedTestimonialsIfEmpty();

// Seed default FAQs if collection is empty
seedFaqsIfEmpty();

// CORS configuration supporting both Admin (5173) and User Storefront (5174)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman) or matching allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // In local dev, allow any localhost
      if (origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/", router);
app.use("/", categoryRoutes);
app.use("/", staffRoutes);
app.use("/", contentRoutes);
app.use("/", productRoutes);
app.use("/", orderRoutes);
app.use("/", testimonialRoutes);
app.use("/", faqRoutes);
app.use("/", dashboardRoutes);
app.use("/", paymentRoutes);
app.use("/", couponRoutes);
app.use("/protected", protectedRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server connected on ${PORT}`);
});