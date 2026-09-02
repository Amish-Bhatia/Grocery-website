const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/grocery-website")
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
  role: {
    type: String,
    enum: ["admin"],
    default: "admin"
  },
  otp: {
    type: String
  }
})

const userModule = mongoose.model("users", userSchema);
module.exports = userModule;