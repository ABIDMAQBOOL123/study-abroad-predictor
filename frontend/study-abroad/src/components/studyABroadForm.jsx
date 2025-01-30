import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

const StudyAbroadForm = () => {
  const [cgpa, setCgpa] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [englishScore, setEnglishScore] = useState("");
  const [countryPreference, setCountryPreference] = useState("");
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    navigate("/login");
    return null;
  }

  // Handle Eligibility Check
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/check-eligibility",
        {
          cgpa,
          workExperience,
          englishScore,
          countryPreference,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error(
        "Error checking eligibility:",
        error.response?.data?.error || error.message
      );
    }
  };

  // Download Results as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.text("Study Abroad Eligibility Results", 10, 10);

    // Add User Details
    doc.text(`CGPA: ${cgpa}`, 10, 20);
    doc.text(`Work Experience: ${workExperience} years`, 10, 30);
    doc.text(`English Score: ${englishScore}`, 10, 40);
    doc.text(`Country Preference: ${countryPreference}`, 10, 50);

    // Eligibility Result
    doc.text(`Eligible: ${result.eligible ? "Yes" : "No"}`, 10, 60);

    if (result.eligible) {
      doc.text("Recommended Universities:", 10, 70);
      result.recommendedUniversities.forEach((uni, index) => {
        doc.text(`${index + 1}. ${uni}`, 10, 80 + index * 10);
      });
    }

    doc.save("eligibility_results.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Eligibility Form */}
      {token && (
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6">
            Study Abroad Eligibility Predictor
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">CGPA</label>
              <input
                type="number"
                step="0.1"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Work Experience (Years)
              </label>
              <input
                type="number"
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                English Score (IELTS/TOEFL)
              </label>
              <input
                type="number"
                step="0.5"
                value={englishScore}
                onChange={(e) => setEnglishScore(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Country Preference
              </label>
              <select
                value={countryPreference}
                onChange={(e) => setCountryPreference(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Check Eligibility
            </button>
          </form>
          {result && (
            <div className="mt-6">
              <h2 className="text-xl font-bold">
                {result.eligible ? "✅ Eligible" : "❌ Not Eligible"}
              </h2>
              {result.eligible && (
                <div>
                  <h3 className="text-lg font-semibold mt-4">
                    Recommended Universities:
                  </h3>
                  <ul className="list-disc pl-6">
                    {result.recommendedUniversities.map((uni, index) => (
                      <li key={index}>{uni}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={downloadPDF}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-4"
              >
                Download Results as PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyAbroadForm;
