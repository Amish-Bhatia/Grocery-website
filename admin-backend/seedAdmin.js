require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Users = require("./Models/userModule");

const run = async () => {
  const name = "Amish Bhatia";
  const email = "amishbhatia30@gmail.com";
  const plainPassword = "Amish@1123"; 

  const hashed = await bcrypt.hash(plainPassword, 10);

  const exists = await Users.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  await Users.create({ name, email, password: hashed, role: "admin" });
  console.log("Admin created:", email);
  process.exit(0);
};

setTimeout(run, 1000);