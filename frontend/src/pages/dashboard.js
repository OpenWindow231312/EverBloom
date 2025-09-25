// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5001/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Error fetching protected data"));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message || "Loading..."}</p>
    </div>
  );
}

export default Dashboard;
