const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    heading: {
        type: String,
        default: "Content",
        immutable: true
    },
    termsAndConditions: {
        heading: {
            type: String,
            default: "Terms & Conditions",
            immutable: true
        },
        body: {
            type: String,
            default: "By using our grocery website, you agree to provide accurate information and to use the service lawfully. Product availability, prices, and delivery details may change without notice. You are responsible for keeping your account credentials secure and for all activity performed through your account."
        }
    },
    privacyPolicy: {
        heading: {
            type: String,
            default: "Privacy Policy",
            immutable: true
        },
        body: {
            type: String,
            default: "We collect only the information needed to provide and improve our grocery services, process orders, communicate with you, and protect our website. We do not sell your personal information. We retain information only for as long as necessary for these purposes and protect it using appropriate security measures."
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("Content", contentSchema, "contents");