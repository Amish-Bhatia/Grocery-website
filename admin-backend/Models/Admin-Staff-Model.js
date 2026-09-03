const mongoose = require("mongoose");

const staffSchema = mongoose.Schema({
    name: {
        type: String,
        required: true      
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true  
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    role:{
        type: String,
        enum: ["staff"],
        default: "staff"    
    }
});
module.exports = mongoose.model("staffs", staffSchema); 