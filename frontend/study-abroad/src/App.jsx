import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import StudyAbroadForm from "./components/studyABroadForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/study-abroad" element={<StudyAbroadForm />} />
      </Routes>
    </Router>
  );
}

export default App;
