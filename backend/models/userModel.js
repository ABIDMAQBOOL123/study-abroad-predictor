const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  cgpa: { type: Number, required: true },
  workExperience: { type: Number, required: true },
  englishScore: { type: Number, required: true },
  countryPreference: { type: String, required: true },
  eligible: { type: Boolean, required: true },
  recommendedUniversities: { type: [String], required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;