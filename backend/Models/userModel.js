const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/grocery-website")
  .then(() => {
    console.log("DB connected")
  }).catch((err) => {
    console.log("Db not connected", err.message)
  })

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  permissions: {
    products: {
      read: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    categories: {
      read: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    orders: {
      read: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    customers: {
      read: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    }
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  role: {
    type: String,
    enum: ["admin", "staff", "customer"],
    default: "customer"
  },
  otp: {
    type: String
  }
})

const userModule = mongoose.model("users", userSchema);
module.exports = userModule;