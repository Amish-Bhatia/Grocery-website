require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Users = require("./Models/userModel");

const run = async () => {
  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/grocery-website");
  const exists = await Users.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    return;
  }

  const hashed = await bcrypt.hash(plainPassword, 10);
  await Users.create({ name, email, password: hashed, role: "admin" });
  console.log("Admin created:", email);
};

run()
  .catch((error) => {
    console.error("Admin seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
