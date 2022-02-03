const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    max: 255,
    min: 6,
  },
  place: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  stars: {
    type: Number,
    required: true,
  },
  imagesPath: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Hotel", hotelSchema);
