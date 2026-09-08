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
    phone: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true  
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