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

// CORS configuration supporting both Admin (5173) and User Storefront (5174)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or matching allowed origins
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
      return callback(null, true);
    }
    // In local dev, allow any localhost
    if (origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", router); 
app.use("/", categoryRoutes);
app.use("/", staffRoutes);
app.use("/", contentRoutes);
app.use("/", productRoutes);
app.use("/protected", protectedRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server connected on ${PORT}`);
});