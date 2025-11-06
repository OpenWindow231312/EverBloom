import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // 🪷 SEO meta management
import App from "./App";
import "./index.css";

// Create the React root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render App with SEO and Router support
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
