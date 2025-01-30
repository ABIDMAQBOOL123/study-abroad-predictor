const User = require("../models/userModel");

const checkEligibility = async (req, res) => {
  const { cgpa, workExperience, englishScore, countryPreference } = req.body;
  let eligible = false;
  let recommendedUniversities = [];

  // Eligibility logic
  if (countryPreference === "USA") {
    eligible = cgpa >= 3.0 && englishScore >= 6.5 && workExperience >= 1;
    if (eligible) {
      recommendedUniversities = ["Harvard", "Stanford", "MIT"];
    }
  } else if (countryPreference === "Canada") {
    eligible = cgpa >= 2.8 && englishScore >= 6.0;
    if (eligible) {
      recommendedUniversities = ["University of Toronto", "UBC", "McGill"];
    }
  }


  const user = new User({
    cgpa,
    workExperience,
    englishScore,
    countryPreference,
    eligible,
    recommendedUniversities,
  });
  await user.save();

  res.json({ eligible, recommendedUniversities });
};

module.exports = { checkEligibility };