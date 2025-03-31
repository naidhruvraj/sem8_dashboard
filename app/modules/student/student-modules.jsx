"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentModules = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await axios.get("/api/modules/getModules");
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Modules</h2>
      
      {modules.length > 0 ? (
        modules.map((mod) => (
          <div key={mod._id} className="p-4 border rounded mb-2">
            <h3 className="text-lg font-semibold">{mod.name}</h3>
            <p>{mod.description}</p>
            <a href={mod.videoUrl} target="_blank" className="text-blue-500">Watch Video</a>
          </div>
        ))
      ) : (
        <p>No modules available yet.</p>
      )}
    </div>
  );
};

export default StudentModules;
