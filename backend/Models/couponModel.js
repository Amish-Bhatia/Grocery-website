const mongoose = require('mongoose'); 

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed']
    },
    discountValue: {
        type: Number,
        required: true
    },
    minimumOrderAmount: {
        type: Number,
        default: 0
    },
    maximumDiscountAmount: {
        type: Number,
        default: Infinity
    },
    usageLimit: {
        type: Number,
        default: Infinity
    },
    usageCount: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Coupon', couponSchema);