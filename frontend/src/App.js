import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Rewards from "./pages/Rewards"; // Updated import for Rewards
import Login from "./pages/Login"; // Import Login page
import Signup from "./pages/Signup"; // Import Signup page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rewards" element={<Rewards />} />{" "}
      {/* Added Rewards route */}
      <Route path="/login" element={<Login />} /> {/* Added Login route */}
      <Route path="/signup" element={<Signup />} /> {/* Added Signup route */}
    </Routes>
  );
}

export default App;
