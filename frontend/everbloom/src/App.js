// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
// Import your pages/components here
// import Home from './pages/Home';
// import Plants from './pages/Plants';
// import About from './pages/About';
// import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Navbar />
      {/* Replace below with your own page routes/components */}
      <div className="content" style={{ padding: "2rem" }}>
        <Routes>
          {/* Example routes: Uncomment and link to your actual page components */}
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/plants" element={<Plants />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome to EverBloom!</h1>
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
