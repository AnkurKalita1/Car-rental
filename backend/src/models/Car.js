const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    category: { type: String },
    transmission: { type: String },
    fuelType: { type: String },
    seats: { type: Number },
    location: { type: String, required: true },
    description: { type: String },
    features: [{ type: String }],
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
