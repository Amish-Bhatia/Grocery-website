const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    saleName: {
      type: String,
      required: [true, "Sale Name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, "Discount Value is required"],
      min: [0, "Discount Value cannot be negative"],
    },
    applyOn: {
      type: String,
      enum: ["all", "category", "products"],
      default: "all",
      required: true,
    },
    targetCategories: {
      type: [String],
      default: [],
    },
    targetProducts: {
      type: [String],
      default: [],
    },
    startDate: {
      type: Date,
      required: [true, "Start Date & Time is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End Date & Time is required"],
    },
    bannerImage: {
      type: String,
      default: "",
    },
    initialStatus: {
      type: String,
      enum: ["draft", "active", "scheduled"],
      default: "active",
    },
    isLive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual status computed dynamically based on dates and isLive
saleSchema.virtual("status").get(function () {
  if (!this.isLive || this.initialStatus === "draft") return "inactive";
  const now = new Date();
  if (this.startDate && new Date(this.startDate) > now) return "scheduled";
  if (this.endDate && new Date(this.endDate) < now) return "expired";
  return "active";
});

saleSchema.set("toJSON", { virtuals: true });
saleSchema.set("toObject", { virtuals: true });

const Sale = mongoose.models.sales || mongoose.model("sales", saleSchema);
module.exports = Sale;
